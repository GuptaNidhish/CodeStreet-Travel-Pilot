'use client';

import { useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { useAuthStore } from '../../stores/authStore';
import { fetchApi } from '../../lib/api';
import { Sliders, ShieldCheck, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [seat, setSeat] = useState(user?.preferences?.seatPreference || 'WINDOW');
  const [diet, setDiet] = useState(user?.preferences?.dietaryPreference || 'Vegetarian');
  const [budget, setBudget] = useState(user?.preferences?.maxBudgetUSD || 5000);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/auth/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          seatPreference: seat,
          dietaryPreference: diet,
          maxBudgetUSD: Number(budget),
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-3xl mx-auto w-full">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[#006FCF]" /> TRAVEL PREFERENCES & AI MEMORY CONFIG
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
              Personalized Cardmember preferences stored in AI memory for zero-touch rebooking decisions
            </p>
          </div>

          <form onSubmit={handleSave} className="p-6 brutalist-card space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-white uppercase block mb-1.5">SEATING PREFERENCE</label>
                <select
                  value={seat}
                  onChange={(e) => setSeat(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[#080c14] border-2 border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#006FCF]"
                >
                  <option value="WINDOW">WINDOW SEAT</option>
                  <option value="AISLE">AISLE SEAT</option>
                  <option value="MIDDLE">MIDDLE SEAT</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-white uppercase block mb-1.5">DIETARY REQUIREMENT</label>
                <input
                  type="text"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#080c14] border-2 border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#006FCF]"
                  placeholder="e.g. Vegetarian, Kosher, Vegan"
                />
              </div>

              <div>
                <label className="text-xs font-black text-white uppercase block mb-1.5">MAX REBOOKING FARE CAP ($USD)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#080c14] border-2 border-slate-800 text-sm text-white font-mono font-bold focus:outline-none focus:border-[#006FCF]"
                />
              </div>
            </div>

            {saved && (
              <div className="p-3 bg-[#061912] border-2 border-[#00E676] text-[#00E676] text-xs font-black uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E676]" /> PREFERENCES SAVED AND SYNCED WITH AI PLANNER MEMORY!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 brutalist-btn-amex text-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> SAVE PREFERENCES & SYNC MEMORY
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
