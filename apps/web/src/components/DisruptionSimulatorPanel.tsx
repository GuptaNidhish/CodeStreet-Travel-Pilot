'use client';

import { useState } from 'react';
import { Zap, AlertTriangle, CloudSnow, Clock, RefreshCw, CheckCircle2, Play } from 'lucide-react';
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
      await fetchApi<any>('/disruptions/simulate', {
        method: 'POST',
        body: JSON.stringify({
          tripId,
          segmentId,
          type,
          delayMinutes,
          reason: `Disruption Simulator trigger for flight ${flightNumber}`,
        }),
      });

      setLastResult(`Disruption (${type}) injected on ${flightNumber}! 10-Agent Pipeline executing 100% Zero-Touch resolution.`);
      if (onSimulated) onSimulated();
    } catch (err: any) {
      setLastResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 brutalist-card-gold space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#C5A059] font-black text-sm uppercase">
          <Zap className="w-5 h-5 fill-[#C5A059]" />
          DISRUPTION SIMULATOR CONTROL CENTER
        </div>
        <span className="px-2 py-0.5 bg-[#C5A059] text-black font-black text-xs uppercase border border-black shadow-[1px_1px_0px_0px_#000]">
          HACKATHON DEMO CONTROL
        </span>
      </div>

      <p className="text-xs text-slate-300">
        Inject real-time disruptions into flight <span className="font-black text-[#C5A059]">{flightNumber}</span> to demonstrate live 100% zero-touch autonomous resolution (Detect → Decide → Act → Explain).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          disabled={loading}
          onClick={() => simulate('CANCELLATION', 0)}
          className="flex flex-col items-center justify-center p-3 brutalist-btn bg-[#FF1744] text-white border-2 border-black hover:border-white disabled:opacity-50"
        >
          <AlertTriangle className="w-5 h-5 mb-1" />
          <span className="text-xs font-black">FLIGHT CANCELLED</span>
          <span className="text-[9px] font-bold text-slate-200 uppercase">RISK SCORE: 100</span>
        </button>

        <button
          disabled={loading}
          onClick={() => simulate('DELAY', 180)}
          className="flex flex-col items-center justify-center p-3 brutalist-btn bg-[#C5A059] text-black border-2 border-black hover:border-white disabled:opacity-50"
        >
          <Clock className="w-5 h-5 mb-1" />
          <span className="text-xs font-black">3-HOUR DELAY</span>
          <span className="text-[9px] font-bold text-slate-900 uppercase">RISK SCORE: 75</span>
        </button>

        <button
          disabled={loading}
          onClick={() => simulate('WEATHER', 240)}
          className="flex flex-col items-center justify-center p-3 brutalist-btn bg-[#006FCF] text-white border-2 border-black hover:border-white disabled:opacity-50"
        >
          <CloudSnow className="w-5 h-5 mb-1" />
          <span className="text-xs font-black">BLIZZARD STORM</span>
          <span className="text-[9px] font-bold text-slate-200 uppercase">RISK SCORE: 90</span>
        </button>

        <button
          disabled={loading}
          onClick={() => simulate('MISSED_CONNECTION', 90)}
          className="flex flex-col items-center justify-center p-3 brutalist-btn bg-[#6b21a8] text-white border-2 border-black hover:border-white disabled:opacity-50"
        >
          <RefreshCw className="w-5 h-5 mb-1" />
          <span className="text-xs font-black">MISSED CONNECT</span>
          <span className="text-[9px] font-bold text-slate-200 uppercase">RISK SCORE: 85</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-[#C5A059] font-black uppercase animate-pulse pt-1">
          <RefreshCw className="w-4 h-4 animate-spin" />
          EXECUTING LANGGRAPH MULTI-AGENT ZERO-TOUCH PIPELINE...
        </div>
      )}

      {lastResult && (
        <div className="p-3 bg-[#061912] border-2 border-[#00E676] text-[#00E676] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00E676]" />
          <span>{lastResult}</span>
        </div>
      )}
    </div>
  );
}
