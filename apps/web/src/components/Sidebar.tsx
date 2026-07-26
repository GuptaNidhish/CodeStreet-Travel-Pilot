'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  History,
  Cpu,
  ShieldAlert,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { href: '/', label: 'Traveler Dashboard', icon: LayoutDashboard },
    { href: '/trips', label: 'My Itineraries', icon: Compass },
    { href: '/timeline', label: 'Disruption Timeline', icon: History },
    { href: '/agent-trace', label: 'Multi-Agent Pipeline', icon: Cpu },
    { href: '/manager', label: 'Manager Command Center', icon: ShieldAlert, badge: 'Admin' },
    { href: '/simulator', label: 'Disruption Simulator', icon: Zap, badge: 'Live Demo' },
    { href: '/settings', label: 'Preferences & Config', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#080c14] border-r-2 border-slate-800 hidden md:flex flex-col justify-between py-6 px-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest mb-3">
            AMEX CONCIERGE NAVIGATION
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0c1829] text-[#006FCF] border-2 border-[#006FCF] shadow-[3px_3px_0px_0px_#002663]'
                      : 'text-slate-300 hover:text-white hover:bg-[#0d1322] border-2 border-transparent hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#006FCF]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-[#C5A059] text-black border border-black shadow-[1px_1px_0px_0px_#000]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 100% Zero-Touch Autonomy Badge Card */}
        <div className="p-3.5 brutalist-card-gold text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#C5A059] font-black font-mono uppercase">
            <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
            Zero-Touch Autonomy
          </div>
          <p className="text-slate-300 text-[11px] font-mono leading-relaxed">
            Multi-agent AI resolves all disruptions automatically without human intervention.
          </p>
        </div>
      </div>

      <div className="px-3 text-[10px] font-mono text-slate-500 flex items-center justify-between border-t-2 border-slate-800 pt-4">
        <span>AMEX CODESTREET 2026</span>
        <span className="text-[#006FCF] font-black">v2.0-AMEX</span>
      </div>
    </aside>
  );
}
