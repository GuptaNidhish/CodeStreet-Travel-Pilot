'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { fetchApi } from '../../lib/api';
import { History, Shield } from 'lucide-react';

export default function TimelinePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase flex items-center gap-2">
              <History className="w-6 h-6 text-[#006FCF]" /> IMMUTABLE AGENT AUDIT TIMELINE
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
              Chronological ledger of every autonomous decision taken by the 10-agent pipeline
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-2 w-4 h-4 bg-[#006FCF] border-2 border-black shadow-[2px_2px_0px_0px_#000]" />

                  <div className="p-4 brutalist-card space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 bg-[#002663] text-[#006FCF] border border-[#006FCF] font-black uppercase">
                        {log.agentType} AGENT
                      </span>
                      <span className="text-slate-500 font-bold">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>

                    <h4 className="font-black text-white text-sm uppercase">{log.action}</h4>
                    <p className="text-xs text-slate-200 leading-relaxed bg-[#080c14] p-3 border-2 border-slate-800 font-bold">
                      "{log.reasoning}"
                    </p>

                    {log.durationMs > 0 && (
                      <div className="text-[10px] text-[#00E676] font-mono font-black uppercase">
                        LATENCY: {log.durationMs}ms
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-10 uppercase font-bold">No agent actions recorded yet. Trigger a disruption via the Simulator.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
