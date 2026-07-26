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
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isManager = user?.role === 'MANAGER';

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/trips', label: 'My Trips', icon: Compass },
    { href: '/timeline', label: 'Disruption Timeline', icon: History },
    { href: '/agent-trace', label: 'Agent Pipeline', icon: Cpu },
    ...(isManager
      ? [{ href: '/manager', label: 'Manager Command Center', icon: ShieldAlert }]
      : []),
    { href: '/simulator', label: 'Disruption Simulator', icon: Zap, badge: 'Demo' },
    { href: '/settings', label: 'Preferences', icon: Sliders },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-gray-800 hidden md:flex flex-col justify-between py-6 px-4 shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-inner'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 3-Tier Autonomy Badge Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            3-Tier Autonomy Active
          </div>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Minor disruptions (Tier 1) are auto-booked with a 10-min undo window.
          </p>
        </div>
      </div>

      <div className="px-3 text-[11px] text-gray-500 flex items-center justify-between border-t border-gray-800/80 pt-4">
        <span>CodeStreet 2026</span>
        <span className="text-indigo-400 font-mono">v1.0</span>
      </div>
    </aside>
  );
}
