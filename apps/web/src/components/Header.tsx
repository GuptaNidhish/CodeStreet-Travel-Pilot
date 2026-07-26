'use client';

import { useAuthStore } from '../stores/authStore';
import { Plane, Bell, Shield, LogOut, Cpu, Radio, Sparkles, CreditCard } from 'lucide-react';
import Link from 'next/link';

export function Header({ unreadCount = 0 }: { unreadCount?: number }) {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-[#060810] border-b-2 border-slate-800 shadow-[0px_4px_0px_0px_#000000]">
      {/* Live System Status Ticker Bar */}
      <div className="bg-[#002663] border-b border-[#006FCF] px-4 py-1 text-[11px] font-mono font-bold text-slate-100 flex items-center overflow-hidden">
        <div className="flex items-center gap-1.5 shrink-0 bg-[#006FCF] px-2 py-0.5 mr-3 border border-slate-900 shadow-[2px_2px_0px_0px_#000]">
          <Radio className="w-3 h-3 text-white animate-pulse" />
          <span className="uppercase tracking-wider">AMEX LIVE TICKER</span>
        </div>
        <div className="overflow-hidden w-full relative">
          <div className="animate-ticker space-x-8 text-slate-200">
            <span>⚡ JFK AIRPORT DE-ICING DELAY: MONITOR AGENT AUTO-CLASSIFIED RISK 88/100</span>
            <span className="text-[#C5A059]">★ AMEX ZERO-TOUCH AUTONOMY ACTIVE — NO HUMAN INTERVENTION REQUIRED</span>
            <span>✈️ FLIGHT DL1420 REBOOKED TO AA402 (SAVINGS: +$340 / CO2: -15kg)</span>
            <span className="text-emerald-400">✓ HOTEL HILTON MIDTOWN CHECK-IN EXTENDED (+3 HOURS)</span>
            <span>🚖 UBER BLACK PICKUP SCHEDULED FOR 21:45 EST</span>
            <span className="text-[#C5A059]">★ CENTURION PRIVILEGE PROTECTION GUARANTEE APPLIED</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#006FCF] border-2 border-slate-900 shadow-[3px_3px_0px_0px_#C5A059] flex items-center justify-center group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-lg leading-none tracking-tight flex items-center gap-1.5 text-white uppercase font-mono">
                AMEX <span className="text-[#006FCF]">TRAVELPILOT</span> <span className="text-[#C5A059]">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase mt-1">
                Zero-Touch Autonomous Concierge
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#061912] border border-[#00E676] text-[#00E676] text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#000]">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            100% ZERO-TOUCH AUTONOMOUS
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Feed Button */}
          <Link
            href="/notifications"
            className="relative p-2 bg-[#0d1322] border-2 border-slate-800 shadow-[2px_2px_0px_0px_#000] text-slate-200 hover:border-[#006FCF] hover:text-white transition-all"
            title="Notifications Feed"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF1744] text-white text-[10px] font-mono font-bold flex items-center justify-center border border-black">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Account Info */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l-2 border-slate-800">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-black text-slate-100 font-mono uppercase">{user.name}</span>
                <span className="text-[10px] text-[#C5A059] font-mono font-bold uppercase flex items-center justify-end gap-1">
                  {user.role === 'MANAGER' ? <Shield className="w-3 h-3 text-[#C5A059]" /> : <Sparkles className="w-3 h-3 text-[#006FCF]" />}
                  {user.role === 'MANAGER' ? 'CENTURION ADMIN' : 'PLATINUM CARDMEMBER'}
                </span>
              </div>
              <div className="w-9 h-9 bg-[#002663] border-2 border-[#006FCF] shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-white font-mono font-black text-sm">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 bg-[#1a0a0e] border border-[#FF1744] text-[#FF1744] hover:bg-[#FF1744] hover:text-white transition-colors shadow-[2px_2px_0px_0px_#000]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 brutalist-btn-amex text-xs"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
