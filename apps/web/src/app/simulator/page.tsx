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
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" /> Disruption Simulator Control Center
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Inject disruptions on-command during hackathon judging to demonstrate real-time autonomous detection, policy checking, and rebooking.
            </p>
          </div>

          {activeTrip && activeSegment ? (
            <DisruptionSimulatorPanel
              tripId={activeTrip.id}
              segmentId={activeSegment.id}
              flightNumber={activeSegment.flightNumber}
            />
          ) : (
            <div className="p-8 text-center glass-panel rounded-2xl text-xs text-gray-400">Loading demo trip parameters...</div>
          )}
        </main>
      </div>
    </div>
  );
}
