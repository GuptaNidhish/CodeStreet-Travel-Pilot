'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { AgentOrchestratorVisualizer } from '../../components/AgentOrchestratorVisualizer';
import { fetchApi } from '../../lib/api';
import { Cpu } from 'lucide-react';

export default function AgentTracePage() {
  const [trace, setTrace] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/trips')
      .then((trips) => {
        if (trips.length > 0) {
          return fetchApi<any[]>(`/audit/agents/${trips[0].id}`);
        }
        return [];
      })
      .then(setTrace)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#006FCF]" /> MULTI-AGENT EXECUTION PIPELINE
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
              Live graph visualizer of the 10 LangGraph state agents processing flight disruptions in zero-touch mode
            </p>
          </div>

          <AgentOrchestratorVisualizer activeTrace={trace} />
        </main>
      </div>
    </div>
  );
}
