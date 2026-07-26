'use client';

import { useState, useEffect } from 'react';
import { RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../lib/api';

interface UndoTimerProps {
  decisionId: string;
  deadlineIso: string;
  onUndone?: () => void;
}

export function UndoCountdownTimer({ decisionId, deadlineIso, onUndone }: UndoTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [undone, setUndone] = useState(false);

  useEffect(() => {
    const calculateLeft = () => {
      const diff = Math.max(0, Math.floor((new Date(deadlineIso).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    calculateLeft();
    const interval = setInterval(calculateLeft, 1000);
    return () => clearInterval(interval);
  }, [deadlineIso]);

  const handleUndo = async () => {
    setLoading(true);
    try {
      await fetchApi(`/rebook/undo/${decisionId}`, { method: 'POST' });
      setUndone(true);
      if (onUndone) onUndone();
    } catch (err: any) {
      alert(`Undo failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (undone) {
    return (
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-amber-400" />
        Booking successfully undone. Original itinerary restored.
      </div>
    );
  }

  if (secondsLeft <= 0) {
    return (
      <div className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
        <AlertCircle className="w-3.5 h-3.5 text-gray-600" /> Undo window expired (Ticketing finalized)
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-blue-400" />
          Tier 1 Auto-Booked (Undo Window Active)
        </div>
        <div className="text-[11px] text-gray-300 mt-0.5">
          Hold timeframe before final airline ticketing: <span className="font-mono font-bold text-amber-400">{mins}:{secs < 10 ? '0' : ''}{secs}</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleUndo}
        className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
      >
        {loading ? 'Undoing...' : 'Undo Rebooking'}
      </button>
    </div>
  );
}
