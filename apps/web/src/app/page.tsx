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
import { Plane, AlertTriangle, ArrowRight, Zap, CheckCircle2, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="p-6 brutalist-card-amex flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#C5A059] font-black uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-4 h-4 text-[#C5A059]" /> AMEX CENTURION AUTONOMOUS PROTECTION
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white uppercase mt-1">
                WELCOME BACK, {user?.name || 'VALUED CARDMEMBER'} 💳
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl font-bold">
                100% Zero-Touch Autonomous Monitoring is active across all itineraries. Multi-agent AI predicts, scores, and rebooks disruptions before you land.
              </p>
            </div>
            <Link
              href="/simulator"
              className="px-4 py-2.5 brutalist-btn-gold text-xs flex items-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4 fill-black" />
              LAUNCH SIMULATOR
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
            <div className="p-5 brutalist-card-rose space-y-4 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF1744] border-2 border-black flex items-center justify-center text-white font-black shadow-[2px_2px_0px_0px_#000]">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm uppercase">
                      {latestDisruption.type} DETECTED ON FLIGHT {activeSegment?.flightNumber}
                    </h3>
                    <p className="text-xs text-slate-300 font-bold">
                      RISK SCORE: {latestDisruption.riskScore}/100 | REASON: {latestDisruption.reason}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#00E676] text-black border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] shrink-0">
                  ✓ 100% ZERO-TOUCH AUTO-RESOLVED
                </span>
              </div>

              {/* Undo Countdown Timer */}
              {latestDecision && latestDecision.undoDeadline && (
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
            <div className="lg:col-span-2 p-6 brutalist-card space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Plane className="w-5 h-5 text-[#006FCF]" />
                  <h3 className="font-black text-white text-sm uppercase">ACTIVE MONITORED ITINERARY</h3>
                </div>
                {activeTrip && (
                  <span className="px-2 py-0.5 bg-[#002663] text-[#006FCF] border border-[#006FCF] text-xs font-black uppercase">
                    {activeTrip.status}
                  </span>
                )}
              </div>

              {activeTrip ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-base uppercase">{activeTrip.title}</h4>
                      <p className="text-xs text-slate-400 font-bold">{activeTrip.description}</p>
                    </div>
                    <Link
                      href={`/trips/${activeTrip.id}`}
                      className="px-3 py-1 bg-[#006FCF] text-white text-xs font-black uppercase border border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform flex items-center gap-1"
                    >
                      AUDIT DETAILS <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Flight Segments List */}
                  <div className="space-y-2.5">
                    {activeTrip.segments?.map((seg) => (
                      <div
                        key={seg.id}
                        className="p-3.5 bg-[#080c14] border-2 border-slate-800 flex items-center justify-between shadow-[2px_2px_0px_0px_#000]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 bg-[#006FCF] border-2 border-black flex items-center justify-center text-white font-mono text-xs font-black shadow-[1px_1px_0px_0px_#000]">
                            {seg.flightNumber.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-black text-white text-xs uppercase">
                              {seg.flightNumber} · {seg.airline}
                            </div>
                            <div className="text-[11px] text-slate-400 font-bold">
                              {seg.departureAirport} → {seg.arrivalAirport} ({seg.cabin})
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-[#C5A059] font-mono">${seg.fare}</span>
                          <span
                            className={`block text-[10px] font-black uppercase ${
                              seg.status === 'CANCELLED' ? 'text-[#FF1744]' : 'text-[#00E676]'
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
                <div className="text-center py-10 text-slate-500 text-xs uppercase font-bold">No active trips found.</div>
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
