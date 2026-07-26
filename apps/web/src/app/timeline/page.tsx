'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { fetchApi } from '../../lib/api';
import { History, CheckCircle2, AlertTriangle, Cpu, Clock, Shield } from 'lucide-react';

export default function TimelinePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch audit log from active trip
    fetchApi<any[]>('/trips')
      .then((trips) => {
        if (trips.length > 0) {
          return fetchApi<any[]>(`/audit/${trips[0].id}`);
        }
        return [];
      })
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <History className="w-6 h-6 text-indigo-400" /> Live Disruption & Agent Timeline
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Chronological immutable record of every autonomous action taken by the 10-agent pipeline
            </p>
          </div>

          <div className="relative pl-6 border-l border-gray-800 space-y-6">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-[#0b0f19] shadow-md group-hover:scale-125 transition-transform" />

                  <div className="p-4 rounded-2xl glass-panel border border-gray-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                        {log.agentType} AGENT
                      </span>
                      <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{log.action}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/50 p-2.5 rounded-xl border border-gray-800">
                      "{log.reasoning}"
                    </p>

                    {log.durationMs > 0 && (
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                        Execution Latency: {log.durationMs}ms
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 py-10">No agent actions recorded yet. Trigger a disruption via the Simulator.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
