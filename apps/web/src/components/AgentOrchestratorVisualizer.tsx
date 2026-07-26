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
  { id: 'MONITOR', name: '1. Monitor Agent', icon: Eye, badgeColor: 'bg-[#006FCF]' },
  { id: 'RISK_SCORING', name: '2. Risk Scoring Agent', icon: Activity, badgeColor: 'bg-[#C5A059]' },
  { id: 'PLANNER', name: '3. Planner Agent (LLM)', icon: Cpu, badgeColor: 'bg-[#7c3aed]' },
  { id: 'POLICY_GUARD', name: '4. Policy Guard', icon: ShieldCheck, badgeColor: 'bg-[#00E676]' },
  { id: 'EXECUTION', name: '5. Execution Agent', icon: CheckSquare, badgeColor: 'bg-[#006FCF]' },
  { id: 'HOTEL', name: '6. Hotel Agent', icon: Building, badgeColor: 'bg-[#e11d48]' },
  { id: 'GROUND_TRANSPORT', name: '7. Cab Agent', icon: Car, badgeColor: 'bg-[#d97706]' },
  { id: 'BUDGET', name: '8. Budget Agent', icon: DollarSign, badgeColor: 'bg-[#059669]' },
  { id: 'NOTIFICATION', name: '9. Notification Agent', icon: Send, badgeColor: 'bg-[#0284c7]' },
  { id: 'EXPLAINABILITY', name: '10. Explainability Agent', icon: FileText, badgeColor: 'bg-[#9333ea]' },
];

export function AgentOrchestratorVisualizer({ activeTrace = [] }: { activeTrace?: AgentTrace[] }) {
  const getAgentStatus = (id: string) => {
    const found = activeTrace.find((t) => t.agent === id);
    if (!found) return 'IDLE';
    return found.status;
  };

  return (
    <div className="p-6 brutalist-card-amex space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase flex items-center gap-2 tracking-wide">
            <Cpu className="w-5 h-5 text-[#006FCF]" />
            LANGGRAPH 10-AGENT AUTONOMOUS PIPELINE
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            State graph executing live disruption classification, risk scoring, Gemini planning, and zero-touch auto-execution
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold uppercase">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 bg-slate-700 border border-black" /> IDLE
          </div>
          <div className="flex items-center gap-1.5 text-[#C5A059]">
            <span className="w-2.5 h-2.5 bg-[#C5A059] border border-black animate-ping" /> RUNNING
          </div>
          <div className="flex items-center gap-1.5 text-[#00E676]">
            <span className="w-2.5 h-2.5 bg-[#00E676] border border-black" /> EXECUTED
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
              transition={{ delay: index * 0.04 }}
              className={`p-3.5 border-2 flex flex-col justify-between transition-all relative ${
                isCompleted
                  ? 'bg-[#061912] border-[#00E676] text-white shadow-[3px_3px_0px_0px_#000]'
                  : isStarted
                  ? 'bg-[#141009] border-[#C5A059] text-[#C5A059] shadow-[3px_3px_0px_0px_#000] animate-pulse'
                  : 'bg-[#0d1322] border-slate-800 text-slate-400 shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 ${agent.badgeColor} border border-black flex items-center justify-center text-white font-bold shadow-[1px_1px_0px_0px_#000]`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-400 font-mono">
                  #{index + 1}
                </span>
              </div>

              <div>
                <div className="font-black text-xs text-white uppercase leading-snug">
                  {agent.name}
                </div>
                <div className="text-[10px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {traceItem?.reasoning || `Agent ${agent.id.toLowerCase()} ready`}
                </div>
              </div>

              {traceItem?.durationMs !== undefined && (
                <div className="mt-2 text-[9px] font-mono text-[#00E676] font-black border-t border-slate-800 pt-1">
                  LATENCY: {traceItem.durationMs}ms
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
