'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { fetchApi } from '../../lib/api';
import { Trip } from '@travelpilot/shared';
import { Compass, Plus, Plane, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<Trip[]>('/trips')
      .then(setTrips)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-400" /> My Travel Itineraries
              </h1>
              <p className="text-xs text-gray-400 mt-1">All monitored flights and synchronized hotels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                      {trip.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-gray-400">${trip.budgetUSD} Budget</span>
                  </div>

                  <h3 className="font-bold text-white text-lg">{trip.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{trip.description}</p>

                  <div className="space-y-2 pt-2 border-t border-gray-800/60 text-xs text-gray-300">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Plane className="w-3.5 h-3.5 text-blue-400" />
                      <span>{trip.segments?.length || 0} Flight Leg(s)</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/trips/${trip.id}`}
                  className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all mt-4"
                >
                  View Live Itinerary <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
