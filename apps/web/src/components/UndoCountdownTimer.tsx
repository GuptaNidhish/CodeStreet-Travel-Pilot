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
      <div className="p-3 bg-[#141009] border-2 border-[#C5A059] text-[#C5A059] text-xs font-mono font-bold flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
        BOOKING UNDONE. ORIGINAL ITINERARY RESTORED.
      </div>
    );
  }

  if (secondsLeft <= 0) {
    return (
      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono font-bold uppercase">
        <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> UNDO WINDOW EXPIRED (FINAL TICKETING CONFIRMED)
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="p-3.5 brutalist-card-amex flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
      <div>
        <div className="text-xs font-black text-white uppercase flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-[#006FCF]" />
          100% ZERO-TOUCH AUTO-BOOKED (UNDO WINDOW ACTIVE)
        </div>
        <div className="text-[11px] text-slate-300 mt-0.5">
          Executive ticketing hold time: <span className="font-mono font-black text-[#C5A059] text-sm">{mins}:{secs < 10 ? '0' : ''}{secs}</span>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleUndo}
        className="px-4 py-1.5 bg-[#FF1744] text-white font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform disabled:opacity-50 shrink-0"
      >
        {loading ? 'UNDOING...' : 'UNDO AUTO-REBOOKING'}
      </button>
    </div>
  );
}
