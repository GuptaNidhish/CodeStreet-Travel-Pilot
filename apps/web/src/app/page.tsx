'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { FlightRiskMap } from '../components/FlightRiskMap';
import { DisruptionSimulatorPanel } from '../components/DisruptionSimulatorPanel';
import { AgentOrchestratorVisualizer } from '../components/AgentOrchestratorVisualizer';
import { CandidateComparisonCard } from '../components/CandidateComparisonCard';
import { UndoCountdownTimer } from '../components/UndoCountdownTimer';
import { fetchApi } from '../lib/api';
import { Trip } from '@travelpilot/shared';
import { Plane, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, checkAuth } = useAuthStore();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [agentTrace, setAgentTrace] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await fetchApi<Trip[]>('/trips');
      setTrips(data);

      if (data.length > 0) {
        const logs = await fetchApi<any[]>(`/audit/agents/${data[0].id}`);
        setAgentTrace(logs);
      }
    } catch (err) {
      console.error('Failed to load dashboard trips:', err);
    } finally {
      setLoadingTrips(false);
    }
  };

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const activeTrip = trips.find((t) => t.status === 'ACTIVE' || t.status === 'DISRUPTED') || trips[0];
  const activeSegment = activeTrip?.segments?.[0];
  const latestDisruption: any = activeTrip?.disruptions?.[0];
  const latestDecision: any = activeTrip?.decisions?.[0];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-indigo-500/20 bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-purple-950/40">
            <div>
              <div className="text-xs text-indigo-400 font-mono uppercase tracking-wider font-semibold">
                Autonomous Travel Concierge
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                Welcome back, {user?.name || 'Traveler'} 👋
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Active Monitoring is enabled for all itineraries. Multi-agent AI resolves delays before you arrive at the gate.
              </p>
            </div>
            <Link
              href="/simulator"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              Launch Disruption Simulator
            </Link>
          </div>

          {/* Disruption Simulator Trigger Widget */}
          {activeTrip && activeSegment && (
            <DisruptionSimulatorPanel
              tripId={activeTrip.id}
              segmentId={activeSegment.id}
              flightNumber={activeSegment.flightNumber}
              onSimulated={loadData}
            />
          )}

          {/* Active Disruption Alert & Action Banner */}
          {latestDisruption && (
            <div className="p-5 rounded-2xl glass-panel border border-rose-500/40 bg-rose-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {latestDisruption.type} Detected on Flight {activeSegment?.flightNumber}
                    </h3>
                    <p className="text-xs text-rose-300">
                      Risk Score: {latestDisruption.riskScore}/100 | Reason: {latestDisruption.reason}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
                  AUTONOMOUS RESOLUTION IN PROGRESS
                </span>
              </div>

              {/* Undo Countdown Timer (If Tier 1 Auto-Booked) */}
              {latestDecision && latestDecision.tier === 'TIER_1_AUTO' && latestDecision.undoDeadline && (
                <UndoCountdownTimer
                  decisionId={latestDecision.id}
                  deadlineIso={latestDecision.undoDeadline}
                  onUndone={loadData}
                />
              )}

              {/* Rebooking Candidate Comparison Card */}
              {latestDisruption.candidates && latestDisruption.candidates.length > 0 && (
                <CandidateComparisonCard
                  candidates={latestDisruption.candidates}
                  selectedId={latestDecision?.selectedCandidateId}
                  reasoning={latestDecision?.reasoning}
                />
              )}
            </div>
          )}

          {/* LangGraph Live Multi-Agent Visualizer */}
          <AgentOrchestratorVisualizer activeTrace={agentTrace} />

          {/* Active Trip Overview & Heatmap Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Itinerary Card */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-gray-800 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white text-base">Active Itinerary</h3>
                </div>
                {activeTrip && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold">
                    {activeTrip.status}
                  </span>
                )}
              </div>

              {activeTrip ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-lg">{activeTrip.title}</h4>
                      <p className="text-xs text-gray-400">{activeTrip.description}</p>
                    </div>
                    <Link
                      href={`/trips/${activeTrip.id}`}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Flight Segments List */}
                  <div className="space-y-2.5">
                    {activeTrip.segments?.map((seg) => (
                      <div
                        key={seg.id}
                        className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs font-bold">
                            {seg.flightNumber.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">
                              {seg.flightNumber} · {seg.airline}
                            </div>
                            <div className="text-xs text-gray-400">
                              {seg.departureAirport} → {seg.arrivalAirport} ({seg.cabin})
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-white font-mono">${seg.fare}</span>
                          <span
                            className={`block text-[10px] font-semibold ${
                              seg.status === 'CANCELLED' ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {seg.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-xs">No active trips found.</div>
              )}
            </div>

            {/* Global Airport Heatmap Widget */}
            <div className="lg:col-span-1">
              <FlightRiskMap />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
