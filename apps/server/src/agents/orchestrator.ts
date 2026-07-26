// ============================================
// LangGraph Agent Orchestrator
// Multi-agent state machine: Detect → Decide → Act → Explain
// ============================================

import { prisma } from '../lib/prisma';
import { sseManager } from '../lib/sse';
import { SSEEventType, AUTONOMY_POLICY } from '@travelpilot/shared';
import { searchAlternativeFlights } from '../integrations/flightSearch';
import { getWeather, calculateWeatherRisk } from '../integrations/weather';
import { searchHotels } from '../integrations/hotel';

interface AgentState {
  disruptionId: string;
  tripId: string;
  userId: string;
  disruption?: any;
  segment?: any;
  trip?: any;
  riskScore: number;
  weatherRisk: number;
  candidates: any[];
  scores: any[];
  policyResult?: any;
  decision?: any;
  hotelUpdate?: any;
  cabUpdate?: any;
  reasoning: string;
  agentTrace: AgentTraceEntry[];
  error?: string;
}

interface AgentTraceEntry {
  agent: string;
  status: 'STARTED' | 'COMPLETED' | 'FAILED';
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning: string;
  durationMs: number;
  timestamp: string;
}

async function logAgent(
  state: AgentState,
  agentType: string,
  status: 'STARTED' | 'COMPLETED' | 'FAILED',
  input: Record<string, unknown>,
  output: Record<string, unknown>,
  reasoning: string,
  durationMs: number,
  error?: string
) {
  const entry: AgentTraceEntry = {
    agent: agentType,
    status,
    input,
    output,
    reasoning,
    durationMs,
    timestamp: new Date().toISOString(),
  };
  state.agentTrace.push(entry);

  await prisma.agentLog.create({
    data: {
      tripId: state.tripId,
      disruptionId: state.disruptionId,
      agentType,
      status,
      input,
      output,
      error,
      durationMs,
    },
  });

  const eventType = status === 'STARTED' ? SSEEventType.AGENT_STARTED : SSEEventType.AGENT_COMPLETED;
  sseManager.sendToUser(state.userId, eventType, {
    agentType,
    status,
    reasoning,
    disruptionId: state.disruptionId,
    tripId: state.tripId,
  });
}

// 1. Monitor Agent
async function monitorAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'MONITOR', 'STARTED', { disruptionId: state.disruptionId }, {}, 'Starting disruption analysis...', 0);

  const disruption = await prisma.disruptionEvent.findUnique({
    where: { id: state.disruptionId },
    include: { segment: true },
  });

  if (!disruption) {
    state.error = 'Disruption not found';
    await logAgent(state, 'MONITOR', 'FAILED', {}, {}, 'Disruption not found', Date.now() - start, state.error);
    return state;
  }

  const trip = await prisma.trip.findUnique({
    where: { id: state.tripId },
    include: { segments: { orderBy: { order: 'asc' } }, hotelBookings: true, cabBookings: true },
  });

  state.disruption = disruption;
  state.segment = disruption.segment;
  state.trip = trip;
  state.riskScore = disruption.riskScore;

  await logAgent(state, 'MONITOR', 'COMPLETED',
    { disruptionId: state.disruptionId, type: disruption.type },
    { riskScore: disruption.riskScore, flightNumber: disruption.segment.flightNumber },
    `Disruption classified: ${disruption.type} on flight ${disruption.segment.flightNumber}. Risk score: ${disruption.riskScore}/100.`,
    Date.now() - start
  );

  return state;
}

// 2. Risk Scoring Agent
async function riskScoringAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'RISK_SCORING', 'STARTED', { riskScore: state.riskScore }, {}, 'Computing comprehensive risk score...', 0);

  if (!state.segment) {
    await logAgent(state, 'RISK_SCORING', 'FAILED', {}, {}, 'No segment data available', Date.now() - start);
    return state;
  }

  const [depWeather, arrWeather] = await Promise.all([
    getWeather(state.segment.departureAirport),
    getWeather(state.segment.arrivalAirport),
  ]);

  const depRisk = calculateWeatherRisk(depWeather);
  const arrRisk = calculateWeatherRisk(arrWeather);
  state.weatherRisk = Math.max(depRisk, arrRisk);
  state.riskScore = Math.min(100, Math.max(state.riskScore, state.weatherRisk));

  if (state.trip?.segments) {
    const currentOrder = state.segment.order;
    const nextSegment = state.trip.segments.find((s: any) => s.order === currentOrder + 1);
    if (nextSegment && state.disruption?.delayMinutes > 0) {
      const arrival = new Date(state.segment.arrivalTime).getTime() + state.disruption.delayMinutes * 60000;
      const nextDeparture = new Date(nextSegment.departureTime).getTime();
      const bufferMinutes = (nextDeparture - arrival) / 60000;
      const mct = 60;

      if (bufferMinutes < mct) {
        state.riskScore = Math.min(100, state.riskScore + 30);
        await prisma.disruptionEvent.update({
          where: { id: state.disruptionId },
          data: { connectionRisk: bufferMinutes < 0 ? 'MISSED' : 'AT_RISK' },
        });
      }
    }
  }

  await prisma.disruptionEvent.update({
    where: { id: state.disruptionId },
    data: { riskScore: state.riskScore, weatherData: depRisk > arrRisk ? depWeather : arrWeather },
  });

  await logAgent(state, 'RISK_SCORING', 'COMPLETED',
    { baseRisk: state.disruption?.riskScore, weatherRisk: state.weatherRisk },
    { compositeRisk: state.riskScore, depWeather: depWeather.condition, arrWeather: arrWeather.condition },
    `Composite risk: ${state.riskScore}/100. Departure weather: ${depWeather.condition} (${depWeather.severity}). Arrival weather: ${arrWeather.condition} (${arrWeather.severity}).`,
    Date.now() - start
  );

  return state;
}

// 3. Planner Agent (Gemini 2.5 Flash reasoning)
async function plannerAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'PLANNER', 'STARTED', { riskScore: state.riskScore }, {}, 'Searching and scoring rebooking alternatives...', 0);

  if (!state.segment || state.riskScore < 30) {
    await logAgent(state, 'PLANNER', 'COMPLETED', {}, { action: 'NO_ACTION' }, 'Risk score below threshold. No action needed.', Date.now() - start);
    return state;
  }

  const alternatives = await searchAlternativeFlights(
    state.segment.departureAirport,
    state.segment.arrivalAirport,
    state.segment.departureTime.toISOString(),
    state.segment.cabin
  );

  const scoredCandidates = alternatives.map(alt => {
    const originalFare = state.segment.fare;
    const originalArrival = new Date(state.segment.arrivalTime).getTime();
    const altArrival = new Date(alt.arrivalTime).getTime();

    const delayPenalty = -Math.abs((altArrival - originalArrival) / 60000) * 0.5;
    const stopsPenalty = -alt.stops * 15;
    const cabinBonus = alt.cabin === state.segment.cabin ? 20 : -50;
    const fareDelta = alt.fare - originalFare;
    const farePenalty = fareDelta > 0 ? -fareDelta * 0.5 : Math.abs(fareDelta) * 0.3;
    const allianceBonus = 10;
    const carbonBonus = alt.carbonKg < state.segment.carbonKg ? 5 : -5;

    const score = 100 + delayPenalty + stopsPenalty + cabinBonus + farePenalty + allianceBonus + carbonBonus;

    return {
      ...alt,
      score: Math.max(0, Math.round(score * 10) / 10),
      fareDelta,
      allianceMatch: true,
      reasons: [
        `Arrives ${Math.round(Math.abs((altArrival - originalArrival) / 3600000) * 10) / 10}h ${altArrival > originalArrival ? 'later' : 'earlier'}`,
        `${alt.stops === 0 ? 'Non-stop' : alt.stops + ' stop(s)'}`,
        `$${alt.fare} (${fareDelta >= 0 ? '+' : ''}$${fareDelta} vs original)`,
        `${alt.carbonKg}kg CO₂`,
      ],
    };
  });

  scoredCandidates.sort((a, b) => b.score - a.score);
  state.candidates = scoredCandidates;

  for (const candidate of scoredCandidates) {
    await prisma.rebookingCandidate.create({
      data: {
        disruptionId: state.disruptionId,
        flightNumber: candidate.flightNumber,
        airline: candidate.airline,
        departureAirport: candidate.departureAirport,
        arrivalAirport: candidate.arrivalAirport,
        departureTime: new Date(candidate.departureTime),
        arrivalTime: new Date(candidate.arrivalTime),
        cabin: candidate.cabin,
        fare: candidate.fare,
        stops: candidate.stops,
        score: candidate.score,
        carbonKg: candidate.carbonKg,
        allianceMatch: candidate.allianceMatch,
        reasons: candidate.reasons,
        rejectionReason: candidate === scoredCandidates[0] ? null : 'Lower overall score',
      },
    });
  }

  let aiReasoning = '';
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (apiKey && apiKey !== 'your-google-ai-api-key') {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });

      const prompt = `You are an AI travel concierge. A flight ${state.segment.flightNumber} from ${state.segment.departureAirport} to ${state.segment.arrivalAirport} has been ${state.disruption.type.toLowerCase()}. 

Top rebooking options:
${scoredCandidates.slice(0, 3).map((c, i) => `${i + 1}. ${c.flightNumber} (${c.airline}) - $${c.fare}, ${c.stops} stops, Score: ${c.score}`).join('\n')}

In 2-3 concise sentences, explain why option 1 (${scoredCandidates[0].flightNumber}) is the best choice.`;

      const result = await model.generateContent(prompt);
      aiReasoning = result.response.text();
    }
  } catch (err) {
    // Fallback if API unavailable
  }

  if (!aiReasoning) {
    const best = scoredCandidates[0];
    aiReasoning = `Recommended ${best.flightNumber} (${best.airline}) as the best alternative: ${best.reasons.join(', ')}. Score: ${best.score}/100.`;
  }

  state.reasoning = aiReasoning;

  await logAgent(state, 'PLANNER', 'COMPLETED',
    { alternativesFound: alternatives.length },
    { topCandidate: scoredCandidates[0]?.flightNumber, topScore: scoredCandidates[0]?.score },
    aiReasoning,
    Date.now() - start
  );

  return state;
}

// 4. Policy Guard Agent (Deterministic)
async function policyGuardAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'POLICY_GUARD', 'STARTED', {}, {}, 'Checking policy rules and determining autonomy tier...', 0);

  if (!state.candidates || state.candidates.length === 0) {
    state.policyResult = { passed: false, tier: 'TIER_3_ESCALATE', checks: [], fareDeltaPct: 0, fareDeltaAbs: 0 };
    await logAgent(state, 'POLICY_GUARD', 'COMPLETED', {}, state.policyResult, 'No candidates available. Escalating.', Date.now() - start);
    return state;
  }

  const best = state.candidates[0];
  const originalFare = state.segment.fare;
  const fareDelta = best.fare - originalFare;
  const fareDeltaPct = originalFare > 0 ? (fareDelta / originalFare) * 100 : 0;
  const fareDeltaAbs = Math.abs(fareDelta);

  const checks = [
    { rule: 'Fare delta percentage', passed: fareDeltaPct <= AUTONOMY_POLICY.tier1.maxFareDeltaPct, details: `${Math.round(fareDeltaPct)}% (max ${AUTONOMY_POLICY.tier1.maxFareDeltaPct}%)` },
    { rule: 'Fare delta absolute', passed: fareDeltaAbs <= AUTONOMY_POLICY.tier1.maxFareDeltaAbsUSD, details: `$${Math.round(fareDeltaAbs)} (max $${AUTONOMY_POLICY.tier1.maxFareDeltaAbsUSD})` },
    { rule: 'Cabin downgrade', passed: best.cabin === state.segment.cabin, details: `Original: ${state.segment.cabin}, New: ${best.cabin}` },
    { rule: 'Maximum added stops', passed: best.stops <= AUTONOMY_POLICY.tier1.maxAddedStops, details: `${best.stops} stops` },
  ];

  const allTier1Passed = checks.every(c => c.passed);
  let tier: 'TIER_1_AUTO' | 'TIER_2_CONFIRM' | 'TIER_3_ESCALATE';

  if (allTier1Passed) {
    tier = 'TIER_1_AUTO';
  } else if (fareDeltaPct <= AUTONOMY_POLICY.tier2.maxFareDeltaPct && fareDeltaAbs <= AUTONOMY_POLICY.tier2.maxFareDeltaAbsUSD) {
    tier = 'TIER_2_CONFIRM';
  } else {
    tier = 'TIER_3_ESCALATE';
  }

  state.policyResult = { passed: allTier1Passed, tier, checks, fareDeltaPct, fareDeltaAbs: fareDelta };

  await logAgent(state, 'POLICY_GUARD', 'COMPLETED',
    { fareDelta, fareDeltaPct: Math.round(fareDeltaPct) },
    { tier, allChecksPassed: allTier1Passed },
    `Policy check complete. Selected Tier: ${tier}.`,
    Date.now() - start
  );

  return state;
}

// 5. Execution Agent
async function executionAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'EXECUTION', 'STARTED', { tier: state.policyResult?.tier }, {}, 'Executing decision...', 0);

  if (!state.policyResult || !state.candidates.length) {
    await logAgent(state, 'EXECUTION', 'FAILED', {}, {}, 'No policy result or candidates', Date.now() - start);
    return state;
  }

  const best = state.candidates[0];
  const tier = state.policyResult.tier;

  let status: string;
  let undoDeadline: Date | null = null;
  let approvalDeadline: Date | null = null;

  switch (tier) {
    case 'TIER_1_AUTO':
      status = 'AUTO_BOOKED';
      undoDeadline = new Date(Date.now() + AUTONOMY_POLICY.tier1.undoWindowMinutes * 60000);
      break;
    case 'TIER_2_CONFIRM':
      status = 'AWAITING_APPROVAL';
      approvalDeadline = new Date(Date.now() + AUTONOMY_POLICY.tier2.responseTimeoutMinutes * 60000);
      break;
    case 'TIER_3_ESCALATE':
      status = 'ESCALATED';
      break;
    default:
      status = 'PENDING';
  }

  const storedCandidate = await prisma.rebookingCandidate.findFirst({
    where: { disruptionId: state.disruptionId, flightNumber: best.flightNumber },
  });

  const decision = await prisma.rebookingDecision.create({
    data: {
      tripId: state.tripId,
      disruptionId: state.disruptionId,
      tier,
      status,
      selectedCandidateId: storedCandidate?.id,
      fareDelta: best.fare - state.segment.fare,
      reasoning: state.reasoning,
      policyCheckResult: state.policyResult,
      undoDeadline,
      approvalDeadline,
      executedAt: tier === 'TIER_1_AUTO' ? new Date() : null,
    },
    include: { selectedCandidate: true },
  });

  state.decision = decision;

  if (tier === 'TIER_1_AUTO') {
    await prisma.disruptionEvent.update({
      where: { id: state.disruptionId },
      data: { resolvedAt: new Date() },
    });

    await prisma.trip.update({
      where: { id: state.tripId },
      data: { status: 'RESOLVED', spentUSD: { increment: Math.max(0, best.fare - state.segment.fare) } },
    });
  }

  sseManager.sendToUser(state.userId, SSEEventType.DECISION_MADE, {
    decisionId: decision.id,
    tier,
    status,
    flightNumber: best.flightNumber,
    fare: best.fare,
    undoDeadline: undoDeadline?.toISOString(),
    approvalDeadline: approvalDeadline?.toISOString(),
    tripId: state.tripId,
  });

  await logAgent(state, 'EXECUTION', 'COMPLETED',
    { tier, candidateId: storedCandidate?.id },
    { decisionId: decision.id, status },
    `Execution completed with status ${status}.`,
    Date.now() - start
  );

  await prisma.auditLog.create({
    data: {
      tripId: state.tripId,
      agentType: 'EXECUTION',
      action: `DECISION_${status}`,
      input: { disruptionId: state.disruptionId, tier },
      output: { decisionId: decision.id, selectedFlight: best.flightNumber },
      reasoning: state.reasoning,
      durationMs: Date.now() - start,
    },
  });

  return state;
}

// 6. Hotel Agent
async function hotelAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'HOTEL', 'STARTED', {}, {}, 'Checking hotel adjustments...', 0);

  if (!state.trip?.hotelBookings?.length || !state.candidates?.length) {
    await logAgent(state, 'HOTEL', 'COMPLETED', {}, { action: 'NO_CHANGE' }, 'No hotel adjustments needed.', Date.now() - start);
    return state;
  }

  const best = state.candidates[0];
  const newArrival = new Date(best.arrivalTime);

  for (const hotel of state.trip.hotelBookings) {
    const checkIn = new Date(hotel.checkIn);
    if (newArrival > checkIn) {
      const newCheckIn = new Date(newArrival);
      newCheckIn.setHours(newCheckIn.getHours() + 2);

      await prisma.hotelBooking.update({
        where: { id: hotel.id },
        data: {
          checkIn: newCheckIn,
          status: 'MODIFIED',
          modifiedReason: `Check-in updated to ${newCheckIn.toISOString()} following flight change.`,
        },
      });

      state.hotelUpdate = { hotelId: hotel.id, newCheckIn };

      await logAgent(state, 'HOTEL', 'COMPLETED',
        { hotelId: hotel.id },
        { newCheckIn: newCheckIn.toISOString() },
        `Hotel check-in updated for ${hotel.hotelName}.`,
        Date.now() - start
      );
      return state;
    }
  }

  await logAgent(state, 'HOTEL', 'COMPLETED', {}, { action: 'NO_CHANGE' }, 'No hotel check-in adjustments needed.', Date.now() - start);
  return state;
}

// 7. Ground Transport Agent
async function groundTransportAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'GROUND_TRANSPORT', 'STARTED', {}, {}, 'Checking ground transport adjustments...', 0);

  if (!state.trip?.cabBookings?.length || !state.candidates?.length) {
    await logAgent(state, 'GROUND_TRANSPORT', 'COMPLETED', {}, { action: 'NO_CHANGE' }, 'No cab adjustments needed.', Date.now() - start);
    return state;
  }

  const best = state.candidates[0];
  const newArrival = new Date(best.arrivalTime);

  for (const cab of state.trip.cabBookings) {
    const newPickup = new Date(newArrival.getTime() + 30 * 60000);
    await prisma.cabBooking.update({
      where: { id: cab.id },
      data: { scheduledTime: newPickup, status: 'MODIFIED' },
    });

    state.cabUpdate = { cabId: cab.id, newPickup };

    await logAgent(state, 'GROUND_TRANSPORT', 'COMPLETED',
      { cabId: cab.id },
      { newPickup: newPickup.toISOString() },
      `Airport pickup rescheduled for ${newPickup.toLocaleTimeString()}.`,
      Date.now() - start
    );
    return state;
  }

  await logAgent(state, 'GROUND_TRANSPORT', 'COMPLETED', {}, { action: 'NO_CHANGE' }, 'No ground transport adjustments needed.', Date.now() - start);
  return state;
}

// 8. Budget Agent
async function budgetAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'BUDGET', 'STARTED', {}, {}, 'Checking budget impact...', 0);

  if (!state.decision || !state.trip) {
    await logAgent(state, 'BUDGET', 'COMPLETED', {}, {}, 'No decision to evaluate.', Date.now() - start);
    return state;
  }

  const fareDelta = state.decision.fareDelta || 0;
  const currentSpent = state.trip.spentUSD || 0;
  const budget = state.trip.budgetUSD || 10000;

  await logAgent(state, 'BUDGET', 'COMPLETED',
    { fareDelta, currentSpent, budget },
    { remaining: Math.max(0, budget - currentSpent - Math.max(0, fareDelta)) },
    `Budget status evaluated: fare delta $${fareDelta}.`,
    Date.now() - start
  );

  return state;
}

// 9. Notification Agent
async function notificationAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'NOTIFICATION', 'STARTED', {}, {}, 'Composing notifications...', 0);

  if (!state.decision || !state.disruption) {
    await logAgent(state, 'NOTIFICATION', 'COMPLETED', {}, {}, 'No notification needed.', Date.now() - start);
    return state;
  }

  const best = state.candidates?.[0];
  const tier = state.policyResult?.tier;

  let title: string;
  let message: string;
  let type: string;

  switch (tier) {
    case 'TIER_1_AUTO':
      title = '✈️ Flight Auto-Rebooked';
      message = `Flight ${state.segment.flightNumber} was ${state.disruption.type.toLowerCase()}. Rebooked on ${best?.flightNumber} (${best?.airline}). Undo available for 10 mins.`;
      type = 'AUTO_REBOOKED';
      break;
    case 'TIER_2_CONFIRM':
      title = '⚡ Approval Needed';
      message = `Flight ${state.segment.flightNumber} was ${state.disruption.type.toLowerCase()}. Top option: ${best?.flightNumber} ($${best?.fare}). Please confirm.`;
      type = 'APPROVAL_NEEDED';
      break;
    default:
      title = '🔔 Flight Disruption Review';
      message = `Flight ${state.segment.flightNumber} was ${state.disruption.type.toLowerCase()}. Escalated for human review.`;
      type = 'ESCALATED';
  }

  const notification = await prisma.notification.create({
    data: {
      userId: state.userId,
      tripId: state.tripId,
      type,
      title,
      message,
      channel: 'IN_APP',
      actionUrl: `/trips/${state.tripId}`,
    },
  });

  sseManager.sendToUser(state.userId, SSEEventType.NOTIFICATION_SENT, {
    notificationId: notification.id,
    title,
    message,
    type,
    tripId: state.tripId,
  });

  await logAgent(state, 'NOTIFICATION', 'COMPLETED',
    { tier, type },
    { notificationId: notification.id },
    `Notification composed and sent: "${title}".`,
    Date.now() - start
  );

  return state;
}

// 10. Explainability Agent
async function explainabilityAgent(state: AgentState): Promise<AgentState> {
  const start = Date.now();
  await logAgent(state, 'EXPLAINABILITY', 'STARTED', {}, {}, 'Generating explainability report...', 0);

  await prisma.auditLog.create({
    data: {
      tripId: state.tripId,
      agentType: 'EXPLAINABILITY',
      action: 'FULL_EXPLANATION',
      input: { disruptionType: state.disruption?.type, flightNumber: state.segment?.flightNumber },
      output: { selectedFlight: state.candidates?.[0]?.flightNumber, tier: state.policyResult?.tier, reasoning: state.reasoning },
      reasoning: `Complete resolution audit trail generated for ${state.segment?.flightNumber}.`,
      durationMs: Date.now() - start,
    },
  });

  sseManager.sendToUser(state.userId, SSEEventType.TIMELINE_UPDATE, {
    tripId: state.tripId,
    event: 'RESOLUTION_COMPLETE',
    agentTrace: state.agentTrace,
  });

  await logAgent(state, 'EXPLAINABILITY', 'COMPLETED',
    {},
    { agentSteps: state.agentTrace.length },
    `Explainability report finalized with ${state.agentTrace.length} agent logs.`,
    Date.now() - start
  );

  return state;
}

// Master Orchestrator Execution
export async function runDisruptionPipeline(
  disruptionId: string,
  tripId: string,
  userId: string
): Promise<void> {
  console.log(`\n🤖 Starting agent pipeline for disruption ${disruptionId}`);

  let state: AgentState = {
    disruptionId,
    tripId,
    userId,
    riskScore: 0,
    weatherRisk: 0,
    candidates: [],
    scores: [],
    reasoning: '',
    agentTrace: [],
  };

  try {
    state = await monitorAgent(state);
    if (state.error) return;

    state = await riskScoringAgent(state);
    if (state.riskScore < 30) return;

    state = await plannerAgent(state);
    if (!state.candidates.length) return;

    state = await policyGuardAgent(state);
    state = await executionAgent(state);

    await Promise.all([
      hotelAgent(state),
      groundTransportAgent(state),
      budgetAgent(state),
    ]);

    state = await notificationAgent(state);
    state = await explainabilityAgent(state);

    console.log(`✅ Pipeline finished. Tier: ${state.policyResult?.tier}. Status: ${state.decision?.status}`);
  } catch (error) {
    console.error('❌ Pipeline error:', error);
  }
}
