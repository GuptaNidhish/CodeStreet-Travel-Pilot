'use client';

import { useState } from 'react';
import { Zap, AlertTriangle, CloudSnow, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../lib/api';

interface SimulatorProps {
  tripId: string;
  segmentId: string;
  flightNumber: string;
  onSimulated?: () => void;
}

export function DisruptionSimulatorPanel({ tripId, segmentId, flightNumber, onSimulated }: SimulatorProps) {
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const simulate = async (type: 'CANCELLATION' | 'DELAY' | 'WEATHER' | 'MISSED_CONNECTION', delayMinutes = 120) => {
    setLoading(true);
    setLastResult(null);

    try {
      const res = await fetchApi<any>('/disruptions/simulate', {
        method: 'POST',
        body: JSON.stringify({
          tripId,
          segmentId,
          type,
          delayMinutes,
          reason: `Triggered via Disruption Simulator for flight ${flightNumber}`,
        }),
      });

      setLastResult(`Disruption (${type}) triggered on ${flightNumber}! Multi-agent pipeline is executing.`);
      if (onSimulated) onSimulated();
    } catch (err: any) {
      setLastResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-amber-950/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
          <Zap className="w-5 h-5 fill-amber-400" />
          Disruption Simulator Panel (Demo Trigger)
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
          Judge Interactive Tool
        </span>
      </div>

      <p className="text-xs text-gray-300">
        Inject real-time disruptions into flight <span className="font-mono font-bold text-white">{flightNumber}</span> to observe the 10-agent orchestration pipeline execute live (Detect → Decide → Act → Explain).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          disabled={loading}
          onClick={() => simulate('CANCELLATION', 0)}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 transition-all group disabled:opacity-50"
        >
          <AlertTriangle className="w-5 h-5 mb-1 text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Flight Cancelled</span>
          <span className="text-[10px] text-rose-400/70">Risk Score: 100</span>
        </button>

        <button
          disabled={loading}
          onClick={() => simulate('DELAY', 180)}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 transition-all group disabled:opacity-50"
        >
          <Clock className="w-5 h-5 mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">3-Hour Delay</span>
          <span className="text-[10px] text-amber-400/70">Risk Score: 75</span>
        </button>

        <button
          disabled={loading}
          onClick={() => simulate('WEATHER', 240)}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 text-sky-300 transition-all group disabled:opacity-50"
        >
          <CloudSnow className="w-5 h-5 mb-1 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Blizzard Storm</span>
          <span className="text-[10px] text-sky-400/70">Risk Score: 90</span>
        </button>

        <button
          disabled={loading}
          onClick={() => simulate('MISSED_CONNECTION', 90)}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 transition-all group disabled:opacity-50"
        >
          <RefreshCw className="w-5 h-5 mb-1 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold">Missed Connection</span>
          <span className="text-[10px] text-purple-400/70">Risk Score: 85</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-amber-300 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Injecting disruption and invoking LangGraph agents...
        </div>
      )}

      {lastResult && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{lastResult}</span>
        </div>
      )}
    </div>
  );
}
