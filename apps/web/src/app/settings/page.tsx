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
  const [diet, setDiet] = useState(user?.preferences?.dietaryPreference || 'vegetarian');
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
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-3xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-indigo-400" /> Travel Preferences & Autonomy Config
            </h1>
            <p className="text-xs text-gray-400 mt-1">Personalized AI memory used during autonomous rebooking decisions</p>
          </div>

          <form onSubmit={handleSave} className="p-6 rounded-2xl glass-panel border border-gray-800 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Seating Preference</label>
                <select
                  value={seat}
                  onChange={(e) => setSeat(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none"
                >
                  <option value="WINDOW">Window Seat</option>
                  <option value="AISLE">Aisle Seat</option>
                  <option value="MIDDLE">Middle Seat</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Dietary Requirement</label>
                <input
                  type="text"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none"
                  placeholder="e.g. Vegetarian, Kosher, Vegan"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">Max Rebooking Fare Cap ($USD)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {saved && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Preferences saved and synced with AI Planner memory!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
