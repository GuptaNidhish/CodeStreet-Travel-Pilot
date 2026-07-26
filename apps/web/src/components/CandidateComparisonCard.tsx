'use client';

import { useState } from 'react';
import { Award, CheckCircle, XCircle, ArrowRight, ShieldCheck, Leaf, HelpCircle, X } from 'lucide-react';
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
    <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">AI Flight Recommendation</h3>
        </div>
        <button
          onClick={() => setShowWhyDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          Why This & Not That?
        </button>
      </div>

      {/* Recommended Flight Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Rank #1 Winner
            </span>
            <span className="text-sm font-bold text-white font-mono">{topCandidate.flightNumber} ({topCandidate.airline})</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-white">${topCandidate.fare}</span>
            <span className="text-xs text-gray-400 block">Score: {topCandidate.score}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-300 pt-2 border-t border-gray-800">
          <div>
            <span className="text-gray-500 block text-[10px]">Route</span>
            <span className="font-semibold">{topCandidate.departureAirport} → {topCandidate.arrivalAirport}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">Departure</span>
            <span className="font-semibold">{new Date(topCandidate.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">Stops</span>
            <span className="font-semibold">{topCandidate.stops === 0 ? 'Non-stop' : `${topCandidate.stops} stop`}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px]">Carbon</span>
            <span className="font-semibold flex items-center gap-1 text-emerald-400">
              <Leaf className="w-3 h-3" /> {topCandidate.carbonKg}kg
            </span>
          </div>
        </div>

        {reasoning && (
          <p className="text-xs text-indigo-200 bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20 leading-relaxed italic">
            "{reasoning}"
          </p>
        )}
      </div>

      {/* "Why This and Not That" Slide-out Drawer */}
      {showWhyDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end transition-opacity">
          <div className="w-full max-w-md glass-panel border-l border-gray-800 h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Candidate Audit Breakdown
                </h2>
                <p className="text-xs text-gray-400">Why the agent selected rank #1 and rejected others</p>
              </div>
              <button
                onClick={() => setShowWhyDrawer(false)}
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Winner */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Selected Winner</span>
                <span>Score: {topCandidate.score}/100</span>
              </div>
              <div className="font-bold text-white text-sm">{topCandidate.flightNumber} - {topCandidate.airline} (${topCandidate.fare})</div>
              <ul className="text-xs text-emerald-300 space-y-1 pl-4 list-disc">
                {topCandidate.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Rejected Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rejected Alternatives ({rejectedCandidates.length})</h4>
              {rejectedCandidates.map((cand) => (
                <div key={cand.id} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <XCircle className="w-3.5 h-3.5" /> Rejected Option
                    </span>
                    <span className="text-gray-400 font-mono">Score: {cand.score}/100</span>
                  </div>
                  <div className="font-semibold text-white text-sm">{cand.flightNumber} - {cand.airline} (${cand.fare})</div>
                  <div className="text-xs text-rose-300 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <span className="font-bold">Rejection Reason:</span> {cand.rejectionReason || 'Lower overall composite score relative to winner.'}
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
