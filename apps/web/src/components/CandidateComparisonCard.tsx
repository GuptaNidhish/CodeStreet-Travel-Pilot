'use client';

import { useState } from 'react';
import { Award, CheckCircle, XCircle, ShieldCheck, Leaf, HelpCircle, X, Sparkles } from 'lucide-react';
import { RebookingCandidate } from '@travelpilot/shared';

interface ComparisonProps {
  candidates: RebookingCandidate[];
  selectedId?: string;
  reasoning?: string;
}

export function CandidateComparisonCard({ candidates, selectedId, reasoning }: ComparisonProps) {
  const [showWhyDrawer, setShowWhyDrawer] = useState(false);

  if (!candidates || candidates.length === 0) return null;

  const topCandidate = candidates.find(c => c.id === selectedId) || candidates[0];
  const rejectedCandidates = candidates.filter(c => c.id !== topCandidate.id);

  return (
    <div className="p-5 brutalist-card-amex space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C5A059]" />
          <h3 className="text-sm font-black uppercase text-white tracking-wide">
            AI Zero-Touch Flight Winner
          </h3>
        </div>
        <button
          onClick={() => setShowWhyDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#006FCF] text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-black hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          WHY THIS & NOT THAT?
        </button>
      </div>

      {/* Recommended Flight Banner */}
      <div className="p-4 bg-[#061426] border-2 border-[#006FCF] shadow-[3px_3px_0px_0px_#000] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-[#00E676] text-black font-black text-xs uppercase border border-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> RANK #1 AUTONOMOUS CHOICE
            </span>
            <span className="text-sm font-black text-white font-mono">
              {topCandidate.flightNumber} ({topCandidate.airline})
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-[#C5A059]">${topCandidate.fare}</span>
            <span className="text-[10px] text-slate-400 block font-bold">SCORE: {topCandidate.score}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-200 pt-2 border-t-2 border-slate-800 font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Route</span>
            <span className="font-bold">{topCandidate.departureAirport} → {topCandidate.arrivalAirport}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Departure</span>
            <span className="font-bold">{new Date(topCandidate.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Stops</span>
            <span className="font-bold">{topCandidate.stops === 0 ? 'Non-stop' : `${topCandidate.stops} stop`}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Carbon Impact</span>
            <span className="font-bold flex items-center gap-1 text-[#00E676]">
              <Leaf className="w-3 h-3" /> {topCandidate.carbonKg}kg CO₂
            </span>
          </div>
        </div>

        {reasoning && (
          <div className="text-xs text-[#006FCF] bg-[#0c1829] p-3 border border-[#006FCF] font-mono leading-relaxed">
            <div className="flex items-center gap-1 text-[#C5A059] font-black uppercase text-[10px] mb-1">
              <Sparkles className="w-3 h-3" /> Gemini 2.5 Multi-Agent Reasoning
            </div>
            "{reasoning}"
          </div>
        )}
      </div>

      {/* "Why This and Not That" Slide-out Drawer */}
      {showWhyDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#080c14] border-l-4 border-[#006FCF] h-full p-6 space-y-6 overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#006FCF]" />
                  Candidate Audit Breakdown
                </h2>
                <p className="text-xs text-slate-400">Why Rank #1 was auto-booked and alternatives rejected</p>
              </div>
              <button
                onClick={() => setShowWhyDrawer(false)}
                className="p-1.5 bg-[#FF1744] text-white font-bold border border-black shadow-[2px_2px_0px_0px_#000]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Winner */}
            <div className="p-4 brutalist-card-emerald space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-[#00E676] uppercase">
                <span>Selected Winner</span>
                <span>Score: {topCandidate.score}/100</span>
              </div>
              <div className="font-black text-white text-sm">{topCandidate.flightNumber} - {topCandidate.airline} (${topCandidate.fare})</div>
              <ul className="text-xs text-slate-200 space-y-1 pl-4 list-disc font-bold">
                {topCandidate.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Rejected Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Rejected Alternatives ({rejectedCandidates.length})</h4>
              {rejectedCandidates.map((cand) => (
                <div key={cand.id} className="p-4 brutalist-card space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-[#FF1744]">
                      <XCircle className="w-3.5 h-3.5" /> Rejected Option
                    </span>
                    <span className="text-slate-400 font-mono">Score: {cand.score}/100</span>
                  </div>
                  <div className="font-bold text-white text-sm">{cand.flightNumber} - {cand.airline} (${cand.fare})</div>
                  <div className="text-xs text-[#FF1744] bg-[#1a0a0e] p-2 border border-[#FF1744]">
                    <span className="font-black uppercase">Rejection Reason:</span> {cand.rejectionReason || 'Lower overall composite score relative to winner.'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
