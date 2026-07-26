'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { fetchApi } from '../../lib/api';
import { Trip } from '@travelpilot/shared';
import { Compass, Plane, Calendar, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white uppercase flex items-center gap-2">
                <Compass className="w-6 h-6 text-[#006FCF]" /> MONITORED TRAVEL ITINERARIES
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">All monitored flights, synchronized hotel reservations, and ground transport legs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="p-6 brutalist-card flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#002663] text-[#006FCF] border border-[#006FCF] text-xs font-black uppercase">
                      {trip.status === 'RESOLVED' ? '100% AUTO-RESOLVED' : trip.status}
                    </span>
                    <span className="text-xs font-black text-[#C5A059]">${trip.budgetUSD} BUDGET</span>
                  </div>

                  <h3 className="font-black text-white text-base uppercase">{trip.title}</h3>
                  <p className="text-xs text-slate-400 font-bold line-clamp-2">{trip.description}</p>

                  <div className="space-y-2 pt-2 border-t-2 border-slate-800 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold">
                      <Plane className="w-3.5 h-3.5 text-[#006FCF]" />
                      <span>{trip.segments?.length || 0} FLIGHT LEG(S) MONITORED</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/trips/${trip.id}`}
                  className="w-full py-2.5 bg-[#006FCF] text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform flex items-center justify-center gap-2 mt-4"
                >
                  VIEW LIVE ITINERARY <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
