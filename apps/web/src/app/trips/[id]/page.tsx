'use client';

import { useEffect, useState, use } from 'react';
import { Header } from '../../../components/Header';
import { Sidebar } from '../../../components/Sidebar';
import { DisruptionSimulatorPanel } from '../../../components/DisruptionSimulatorPanel';
import { CandidateComparisonCard } from '../../../components/CandidateComparisonCard';
import { UndoCountdownTimer } from '../../../components/UndoCountdownTimer';
import { fetchApi } from '../../../lib/api';
import { Plane, Building, Car, AlertTriangle, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 text-center text-xs text-slate-400 font-bold uppercase">Loading trip itinerary...</main>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 text-center text-xs text-[#FF1744] font-black uppercase">Trip not found.</main>
        </div>
      </div>
    );
  }

  const activeSegment = trip.segments?.[0];
  const latestDisruption = trip.disruptions?.[0];
  const latestDecision = trip.decisions?.[0];

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
          <Link href="/trips" className="inline-flex items-center gap-1.5 text-xs text-[#006FCF] font-black uppercase hover:underline">
            <ArrowLeft className="w-4 h-4" /> BACK TO MY ITINERARIES
          </Link>

          {/* Trip Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 brutalist-card-amex">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#002663] text-[#006FCF] border border-[#006FCF] text-xs font-black uppercase">
                  {trip.status === 'RESOLVED' ? '100% AUTO-RESOLVED' : trip.status}
                </span>
                <span className="text-xs text-slate-400 font-bold">PNR: {activeSegment?.pnr || 'N/A'}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white uppercase mt-1">{trip.title}</h1>
              <p className="text-xs text-slate-300 font-bold mt-0.5">{trip.description}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase block">Budget: ${trip.budgetUSD}</span>
              <span className="text-sm font-black text-[#C5A059]">SPENT: ${trip.spentUSD}</span>
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
            <div className="p-5 brutalist-card-rose space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-[#FF1744] animate-pulse" />
                  <div>
                    <h3 className="font-black text-white text-sm uppercase">
                      {latestDisruption.type} DETECTED ({latestDisruption.reason})
                    </h3>
                    <p className="text-xs text-slate-300 font-bold">RISK SCORE: {latestDisruption.riskScore}/100</p>
                  </div>
                </div>
              </div>

              {latestDecision && latestDecision.undoDeadline && (
                <UndoCountdownTimer decisionId={latestDecision.id} deadlineIso={latestDecision.undoDeadline} onUndone={loadTrip} />
              )}

              {latestDisruption.candidates && latestDisruption.candidates.length > 0 && (
                <CandidateComparisonCard candidates={latestDisruption.candidates} selectedId={latestDecision?.selectedCandidateId} reasoning={latestDecision?.reasoning} />
              )}
            </div>
          )}

          {/* Flight Segments List */}
          <div className="p-6 brutalist-card space-y-4">
            <h3 className="font-black text-white text-sm uppercase flex items-center gap-2">
              <Plane className="w-5 h-5 text-[#006FCF]" /> MONITORED FLIGHT SEGMENTS
            </h3>
            <div className="space-y-3">
              {trip.segments?.map((seg: any) => (
                <div key={seg.id} className="p-4 bg-[#080c14] border-2 border-slate-800 flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
                  <div className="space-y-1">
                    <div className="font-black text-white text-xs uppercase">{seg.flightNumber} · {seg.airline}</div>
                    <div className="text-[11px] text-slate-400 font-bold">{seg.departureAirport} → {seg.arrivalAirport} ({seg.cabin})</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#C5A059]">${seg.fare}</span>
                    <span className="block text-xs font-black text-[#00E676] uppercase">{seg.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synchronized Hotels & Cabs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 brutalist-card space-y-3">
              <h3 className="font-black text-white text-xs uppercase flex items-center gap-2">
                <Building className="w-4 h-4 text-[#C5A059]" /> SYNCHRONIZED HOTELS
              </h3>
              {trip.hotelBookings?.map((h: any) => (
                <div key={h.id} className="p-3 bg-[#080c14] border-2 border-slate-800 text-xs space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <div className="font-black text-white uppercase">{h.hotelName} ({h.location})</div>
                  <div className="text-slate-400 text-[11px] font-bold">Check-in: {new Date(h.checkIn).toLocaleString()}</div>
                  <div className="text-[#00E676] font-black uppercase">STATUS: {h.status}</div>
                </div>
              ))}
            </div>

            <div className="p-6 brutalist-card space-y-3">
              <h3 className="font-black text-white text-xs uppercase flex items-center gap-2">
                <Car className="w-4 h-4 text-[#006FCF]" /> GROUND TRANSPORT
              </h3>
              {trip.cabBookings?.map((c: any) => (
                <div key={c.id} className="p-3 bg-[#080c14] border-2 border-slate-800 text-xs space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <div className="font-black text-white uppercase">{c.provider} PICKUP</div>
                  <div className="text-slate-400 text-[11px] font-bold">Scheduled: {new Date(c.scheduledTime).toLocaleString()}</div>
                  <div className="text-[#006FCF] font-black uppercase">STATUS: {c.status}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
