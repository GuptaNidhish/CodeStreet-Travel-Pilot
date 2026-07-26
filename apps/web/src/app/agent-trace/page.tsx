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
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-400" /> Multi-Agent Execution Pipeline
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Live graph visualization of the 10 LangGraph state agents processing flight disruptions
            </p>
          </div>

          <AgentOrchestratorVisualizer activeTrace={trace} />
        </main>
      </div>
    </div>
  );
}
