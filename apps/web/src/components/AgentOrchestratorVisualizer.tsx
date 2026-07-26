'use client';

import { motion } from 'framer-motion';
import {
  Eye,
  Activity,
  Cpu,
  ShieldCheck,
  CheckSquare,
  Building,
  Car,
  DollarSign,
  Send,
  FileText,
} from 'lucide-react';

interface AgentTrace {
  agent: string;
  status: 'STARTED' | 'COMPLETED' | 'FAILED';
  reasoning?: string;
  durationMs?: number;
}

const AGENTS_LIST = [
  { id: 'MONITOR', name: 'Monitor Agent', icon: Eye, color: 'from-blue-500 to-cyan-500' },
  { id: 'RISK_SCORING', name: 'Risk Scoring Agent', icon: Activity, color: 'from-amber-500 to-orange-500' },
  { id: 'PLANNER', name: 'Planner Agent (LLM)', icon: Cpu, color: 'from-purple-500 to-indigo-500' },
  { id: 'POLICY_GUARD', name: 'Policy Guard (Determ.)', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500' },
  { id: 'EXECUTION', name: 'Execution Agent', icon: CheckSquare, color: 'from-blue-600 to-indigo-600' },
  { id: 'HOTEL', name: 'Hotel Agent', icon: Building, color: 'from-pink-500 to-rose-500' },
  { id: 'GROUND_TRANSPORT', name: 'Ground Transport Agent', icon: Car, color: 'from-amber-600 to-yellow-500' },
  { id: 'BUDGET', name: 'Budget Agent', icon: DollarSign, color: 'from-emerald-600 to-green-500' },
  { id: 'NOTIFICATION', name: 'Notification Agent', icon: Send, color: 'from-cyan-500 to-blue-500' },
  { id: 'EXPLAINABILITY', name: 'Explainability Agent', icon: FileText, color: 'from-purple-600 to-pink-600' },
];

export function AgentOrchestratorVisualizer({ activeTrace = [] }: { activeTrace?: AgentTrace[] }) {
  const getAgentStatus = (id: string) => {
    const found = activeTrace.find((t) => t.agent === id);
    if (!found) return 'IDLE';
    return found.status;
  };

  return (
    <div className="p-6 rounded-2xl glass-panel border border-indigo-500/20 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            LangGraph Multi-Agent Orchestrator
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time visual state graph executing the 10-agent autonomous workflow
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" /> Idle
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" /> Running
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Completed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {AGENTS_LIST.map((agent, index) => {
          const Icon = agent.icon;
          const status = getAgentStatus(agent.id);
          const traceItem = activeTrace.find((t) => t.agent === agent.id);

          const isCompleted = status === 'COMPLETED';
          const isStarted = status === 'STARTED';

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all relative overflow-hidden ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/5'
                  : isStarted
                  ? 'bg-amber-950/30 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-500/10 animate-pulse'
                  : 'bg-gray-900/40 border-gray-800/80 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${agent.color} flex items-center justify-center text-white shadow-md`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-semibold text-gray-500">
                  #{index + 1}
                </span>
              </div>

              <div>
                <div className="font-semibold text-xs text-gray-200 leading-snug">
                  {agent.name}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                  {traceItem?.reasoning || `Agent ${agent.id.toLowerCase()} node`}
                </div>
              </div>

              {traceItem?.durationMs !== undefined && (
                <div className="mt-2 text-[9px] font-mono text-emerald-400 font-semibold border-t border-emerald-500/20 pt-1">
                  {traceItem.durationMs}ms
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
