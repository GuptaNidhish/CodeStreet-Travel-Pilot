'use client';

import { useEffect, useState, use } from 'react';
import { Header } from '../../../components/Header';
import { Sidebar } from '../../../components/Sidebar';
import { DisruptionSimulatorPanel } from '../../../components/DisruptionSimulatorPanel';
import { AgentOrchestratorVisualizer } from '../../../components/AgentOrchestratorVisualizer';
import { CandidateComparisonCard } from '../../../components/CandidateComparisonCard';
import { UndoCountdownTimer } from '../../../components/UndoCountdownTimer';
import { fetchApi } from '../../../lib/api';
import { Trip } from '@travelpilot/shared';
import { Plane, Calendar, Building, Car, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadTrip = async () => {
    try {
      const data = await fetchApi<any>(`/trips/${id}`);
      setTrip(data);
    } catch (err) {
      console.error('Failed to load trip detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 text-center text-xs text-gray-400">Loading trip itinerary...</main>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 text-center text-xs text-rose-400">Trip not found.</main>
        </div>
      </div>
    );
  }

  const activeSegment = trip.segments?.[0];
  const latestDisruption = trip.disruptions?.[0];
  const latestDecision = trip.decisions?.[0];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
          <Link href="/trips" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to My Trips
          </Link>

          {/* Trip Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                  {trip.status}
                </span>
                <span className="text-xs text-gray-400 font-mono">PNR: {activeSegment?.pnr || 'N/A'}</span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">{trip.title}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{trip.description}</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-sm text-gray-400">Budget: ${trip.budgetUSD}</span>
              <span className="block text-xs text-emerald-400 font-bold">Spent: ${trip.spentUSD}</span>
            </div>
          </div>

          {/* Disruption Simulator Widget */}
          {activeSegment && (
            <DisruptionSimulatorPanel
              tripId={trip.id}
              segmentId={activeSegment.id}
              flightNumber={activeSegment.flightNumber}
              onSimulated={loadTrip}
            />
          )}

          {/* Active Disruption & Decision Banner */}
          {latestDisruption && (
            <div className="p-5 rounded-2xl glass-panel border border-rose-500/40 bg-rose-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {latestDisruption.type} Detected ({latestDisruption.reason})
                    </h3>
                    <p className="text-xs text-rose-300">Disruption Risk Score: {latestDisruption.riskScore}/100</p>
                  </div>
                </div>
              </div>

              {latestDecision && latestDecision.tier === 'TIER_1_AUTO' && latestDecision.undoDeadline && (
                <UndoCountdownTimer decisionId={latestDecision.id} deadlineIso={latestDecision.undoDeadline} onUndone={loadTrip} />
              )}

              {latestDisruption.candidates && latestDisruption.candidates.length > 0 && (
                <CandidateComparisonCard candidates={latestDisruption.candidates} selectedId={latestDecision?.selectedCandidateId} reasoning={latestDecision?.reasoning} />
              )}
            </div>
          )}

          {/* Flight Segments List */}
          <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Plane className="w-5 h-5 text-blue-400" /> Monitored Flight Segments
            </h3>
            <div className="space-y-3">
              {trip.segments?.map((seg: any) => (
                <div key={seg.id} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{seg.flightNumber} · {seg.airline}</div>
                    <div className="text-xs text-gray-400">{seg.departureAirport} → {seg.arrivalAirport} ({seg.cabin})</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white">${seg.fare}</span>
                    <span className="block text-xs text-emerald-400">{seg.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synchronized Hotels & Cabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-400" /> Synchronized Hotels
              </h3>
              {trip.hotelBookings?.map((h: any) => (
                <div key={h.id} className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-xs space-y-1">
                  <div className="font-bold text-white">{h.hotelName} ({h.location})</div>
                  <div className="text-gray-400">Check-in: {new Date(h.checkIn).toLocaleString()}</div>
                  <div className="text-indigo-400 font-mono font-semibold">Status: {h.status}</div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" /> Ground Transport
              </h3>
              {trip.cabBookings?.map((c: any) => (
                <div key={c.id} className="p-3 rounded-xl bg-gray-900/50 border border-gray-800 text-xs space-y-1">
                  <div className="font-bold text-white">{c.provider} Pickup</div>
                  <div className="text-gray-400">Scheduled: {new Date(c.scheduledTime).toLocaleString()}</div>
                  <div className="text-amber-400 font-mono font-semibold">Status: {c.status}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
