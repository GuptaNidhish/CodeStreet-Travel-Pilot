'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { DisruptionSimulatorPanel } from '../../components/DisruptionSimulatorPanel';
import { fetchApi } from '../../lib/api';
import { Trip } from '@travelpilot/shared';
import { Zap } from 'lucide-react';

export default function SimulatorPage() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    fetchApi<Trip[]>('/trips').then(setTrips).catch(console.error);
  }, []);

  const activeTrip = trips[0];
  const activeSegment = activeTrip?.segments?.[0];

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#C5A059] fill-[#C5A059]" /> DISRUPTION SIMULATOR CONTROL CENTER
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
              Inject real-time disruptions on-demand during hackathon judging to demonstrate 100% zero-touch autonomous multi-agent resolution.
            </p>
          </div>

          {activeTrip && activeSegment ? (
            <DisruptionSimulatorPanel
              tripId={activeTrip.id}
              segmentId={activeSegment.id}
              flightNumber={activeSegment.flightNumber}
            />
          ) : (
            <div className="p-8 text-center brutalist-card text-xs text-slate-400 uppercase font-bold">
              Loading demo trip parameters...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
