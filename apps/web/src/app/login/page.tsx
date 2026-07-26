'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Lock, Mail, User, Shield, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { fetchApi } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('alex@travelpilot.demo');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Alex Johnson');
  const [role, setRole] = useState<'TRAVELER' | 'MANAGER'>('TRAVELER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister ? { email, password, name, role } : { email, password };

      const res = await fetchApi<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      setAuth(res.user, res.token);
      router.push(res.user.role === 'MANAGER' ? '/manager' : '/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (demoRole: 'TRAVELER' | 'MANAGER') => {
    if (demoRole === 'TRAVELER') {
      setEmail('alex@travelpilot.demo');
      setPassword('demo123');
    } else {
      setEmail('sarah@travelpilot.demo');
      setPassword('demo123');
    }
    setIsRegister(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <Plane className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            TravelPilot <span className="gradient-text">AI</span>
          </h1>
          <p className="text-xs text-gray-400">
            {isRegister ? 'Create your Autonomous Concierge account' : 'Sign in to your travel concierge'}
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="p-3 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
            Quick Hackathon Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('TRAVELER')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                email === 'alex@travelpilot.demo'
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:text-white'
              }`}
            >
              👤 Traveler (Alex)
            </button>
            <button
              type="button"
              onClick={() => quickLogin('MANAGER')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                email === 'sarah@travelpilot.demo'
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                  : 'bg-gray-800/40 border-gray-700/50 text-gray-400 hover:text-white'
              }`}
            >
              🛡️ Manager (Sarah)
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Alex Johnson"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="alex@travelpilot.demo"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TRAVELER">Traveler / Card Member</option>
                <option value="MANAGER">Corporate Travel Manager</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gray-400 hover:text-indigo-400 font-medium transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
