'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { FlightRiskMap } from '../../components/FlightRiskMap';
import { fetchApi } from '../../lib/api';
import { Shield, DollarSign, Activity, AlertTriangle, CheckCircle2, Users, FileSpreadsheet, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const [data, setData] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-purple-400 font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-400" />
                Corporate Travel Risk & Cost Command Center
              </div>
              <h1 className="text-2xl font-black text-white mt-1">Manager Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                Live Spend Governance
              </span>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-purple-500/20 space-y-2">
              <span className="text-xs text-gray-400 font-semibold block">Total Active Trips</span>
              <div className="text-3xl font-black text-white">{data?.activeTrips || 3}</div>
              <div className="text-[11px] text-purple-400 flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5" /> Monitored 24/7
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 space-y-2">
              <span className="text-xs text-gray-400 font-semibold block">Auto-Resolved (Tier 1)</span>
              <div className="text-3xl font-black text-emerald-400">{data?.autoResolved || 8}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Policy Compliant
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-blue-500/20 space-y-2">
              <span className="text-xs text-gray-400 font-semibold block">Disruption Cost Savings</span>
              <div className="text-3xl font-black text-blue-400">${data?.totalSavingsUSD || 1420}</div>
              <div className="text-[11px] text-blue-400 flex items-center gap-1 font-medium">
                <DollarSign className="w-3.5 h-3.5" /> Prevented Out-of-Pocket
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-amber-500/20 space-y-2">
              <span className="text-xs text-gray-400 font-semibold block">Pending Approval (Tier 2)</span>
              <div className="text-3xl font-black text-amber-400">{data?.pendingApproval || 1}</div>
              <div className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                <Activity className="w-3.5 h-3.5" /> 5-Min Timeout Active
              </div>
            </div>
          </div>

          {/* Risk Heatmap & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* All Monitored Trips Table */}
              <div className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <h3 className="font-bold text-white text-base">Corporate Trips Overview</h3>
                  <span className="text-xs text-gray-400 font-mono">Showing {trips.length} itineraries</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 font-mono uppercase">
                        <th className="py-2.5 px-3">Traveler</th>
                        <th className="py-2.5 px-3">Trip Title</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Budget</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {trips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-gray-900/40 transition-colors">
                          <td className="py-3 px-3 font-semibold text-white">
                            {trip.user?.name || 'Traveler'}
                            <span className="block text-[10px] text-gray-500">{trip.user?.email}</span>
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-200">{trip.title}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                trip.status === 'DISRUPTED'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {trip.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-gray-300">${trip.budgetUSD}</td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href={`/trips/${trip.id}`}
                              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-end gap-0.5"
                            >
                              Audit <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <FlightRiskMap />

              {/* Immutable Audit Log Stream */}
              <div className="p-5 rounded-2xl glass-panel border border-gray-800 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Append-Only Audit Stream
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {data?.recentActivity?.map((act: any) => (
                    <div key={act.id} className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-purple-400 font-bold">{act.agentType}</span>
                        <span className="text-gray-500">{new Date(act.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-tight">{act.reasoning}</p>
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
