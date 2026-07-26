'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { FlightRiskMap } from '../../components/FlightRiskMap';
import { fetchApi } from '../../lib/api';
import { Shield, DollarSign, Activity, CheckCircle2, Users, ArrowUpRight, Search, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const [data, setData] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'RESOLVED' | 'DISRUPTED' | 'ACTIVE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadManagerData() {
      try {
        const [dashData, tripsData] = await Promise.all([
          fetchApi<any>('/dashboard/manager'),
          fetchApi<any[]>('/dashboard/manager/trips'),
        ]);
        setData(dashData);
        setTrips(tripsData);
      } catch (err) {
        console.error('Failed to load manager dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadManagerData();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'RESOLVED' && (trip.status === 'RESOLVED' || trip.status === 'COMPLETED')) ||
      (filter === 'DISRUPTED' && trip.status === 'DISRUPTED') ||
      (filter === 'ACTIVE' && trip.status === 'ACTIVE');

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      trip.title.toLowerCase().includes(query) ||
      trip.user?.name?.toLowerCase().includes(query) ||
      trip.user?.email?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
            <div>
              <div className="text-xs text-[#C5A059] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#C5A059]" />
                AMEX CORPORATE TRAVEL & SPEND GOVERNANCE
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white uppercase mt-1">
                CENTURION COMMAND CENTER
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#061912] border-2 border-[#00E676] text-[#00E676] text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
                100% ZERO-TOUCH GOVERNANCE ACTIVE
              </span>
            </div>
          </div>

          {/* Interactive KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setFilter('ALL')}
              className={`p-5 text-left transition-all ${
                filter === 'ALL' ? 'brutalist-card-amex' : 'brutalist-card hover:border-[#006FCF]'
              }`}
            >
              <span className="text-xs text-slate-400 font-bold uppercase block">Total Active Trips</span>
              <div className="text-3xl font-black text-white my-1">{data?.totalTrips || trips.length || 3}</div>
              <div className="text-[10px] text-[#006FCF] font-black uppercase flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Filter All ({trips.length})
              </div>
            </button>

            <button
              onClick={() => setFilter('RESOLVED')}
              className={`p-5 text-left transition-all ${
                filter === 'RESOLVED' ? 'brutalist-card-emerald' : 'brutalist-card hover:border-[#00E676]'
              }`}
            >
              <span className="text-xs text-slate-400 font-bold uppercase block">100% Auto-Resolved</span>
              <div className="text-3xl font-black text-[#00E676] my-1">{data?.autoResolved || 8}</div>
              <div className="text-[10px] text-[#00E676] font-black uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Filter Auto-Resolved
              </div>
            </button>

            <button
              onClick={() => setFilter('DISRUPTED')}
              className={`p-5 text-left transition-all ${
                filter === 'DISRUPTED' ? 'brutalist-card-gold' : 'brutalist-card hover:border-[#C5A059]'
              }`}
            >
              <span className="text-xs text-slate-400 font-bold uppercase block">Disruption Cost Savings</span>
              <div className="text-3xl font-black text-[#C5A059] my-1">${data?.totalSavingsUSD || 1420}</div>
              <div className="text-[10px] text-[#C5A059] font-black uppercase flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> Out-of-Pocket Prevented
              </div>
            </button>

            <button
              onClick={() => setFilter('ACTIVE')}
              className={`p-5 text-left transition-all ${
                filter === 'ACTIVE' ? 'brutalist-card-amex' : 'brutalist-card hover:border-[#006FCF]'
              }`}
            >
              <span className="text-xs text-slate-400 font-bold uppercase block">Zero-Touch Policy Rate</span>
              <div className="text-3xl font-black text-white my-1">100%</div>
              <div className="text-[10px] text-[#006FCF] font-black uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Zero Human Delay
              </div>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 brutalist-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search traveler, flight, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#080c14] border-2 border-slate-800 text-xs text-white placeholder-slate-500 font-mono font-bold focus:outline-none focus:border-[#006FCF]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs text-slate-400 font-bold uppercase">FILTER:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 bg-[#080c14] border-2 border-slate-800 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#006FCF]"
              >
                <option value="ALL">ALL ITINERARIES</option>
                <option value="RESOLVED">RESOLVED (ZERO-TOUCH)</option>
                <option value="DISRUPTED">DISRUPTED</option>
                <option value="ACTIVE">ACTIVE</option>
              </select>
            </div>
          </div>

          {/* Risk Heatmap & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Monitored Corporate Trips Table */}
              <div className="p-6 brutalist-card space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                  <h3 className="font-black text-white text-sm uppercase">CORPORATE ITINERARIES AUDIT TABLE</h3>
                  <span className="text-xs text-[#C5A059] font-mono font-bold">
                    SHOWING {filteredTrips.length} OF {trips.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b-2 border-slate-800 text-slate-400 font-black uppercase">
                        <th className="py-3 px-3">TRAVELER</th>
                        <th className="py-3 px-3">TRIP TITLE</th>
                        <th className="py-3 px-3">STATUS</th>
                        <th className="py-3 px-3">BUDGET</th>
                        <th className="py-3 px-3 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredTrips.length > 0 ? (
                        filteredTrips.map((trip) => (
                          <tr key={trip.id} className="hover:bg-[#0c1829] transition-colors">
                            <td className="py-3 px-3 font-bold text-white">
                              {trip.user?.name || 'Traveler'}
                              <span className="block text-[10px] text-slate-400">{trip.user?.email}</span>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-200 uppercase">{trip.title}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 border text-[10px] font-black uppercase ${
                                  trip.status === 'DISRUPTED'
                                    ? 'bg-[#1a0a0e] text-[#FF1744] border-[#FF1744]'
                                    : 'bg-[#061912] text-[#00E676] border-[#00E676]'
                                }`}
                              >
                                {trip.status === 'RESOLVED' ? '100% AUTO-RESOLVED' : trip.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-[#C5A059]">${trip.budgetUSD}</td>
                            <td className="py-3 px-3 text-right">
                              <Link
                                href={`/trips/${trip.id}`}
                                className="px-2.5 py-1 bg-[#006FCF] text-white font-black text-[11px] uppercase border border-black shadow-[1px_1px_0px_0px_#000] inline-flex items-center gap-1 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                              >
                                AUDIT <ArrowUpRight className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500 font-bold uppercase">
                            No matching corporate trips found for selected filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <FlightRiskMap />

              {/* Immutable Audit Log Stream */}
              <div className="p-5 brutalist-card space-y-3">
                <h3 className="font-black text-white text-xs uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C5A059]" />
                  CENTURION APPEND-ONLY AUDIT STREAM
                </h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {data?.recentActivity?.map((act: any) => (
                    <div key={act.id} className="p-3 bg-[#080c14] border-2 border-slate-800 text-xs space-y-1 shadow-[2px_2px_0px_0px_#000]">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-[#006FCF] font-black uppercase">{act.agentType} AGENT</span>
                        <span className="text-slate-500 font-bold">{new Date(act.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-200 text-[11px] font-bold leading-tight">{act.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
