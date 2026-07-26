'use client';

import { useAuthStore } from '../stores/authStore';
import { Plane, Bell, Shield, User as UserIcon, LogOut, Activity } from 'lucide-react';
import Link from 'next/link';

export function Header({ unreadCount = 0 }: { unreadCount?: number }) {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-gray-800 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg leading-none tracking-tight">
              TravelPilot <span className="gradient-text">AI</span>
            </div>
            <div className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
              Autonomous Concierge
            </div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-2 ml-4 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Agent Monitoring
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon */}
        <Link href="/notifications" className="relative p-2.5 rounded-xl hover:bg-gray-800/60 text-gray-300 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Info & Role Badge */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
            <div className="flex flex-col text-right hidden sm:block">
              <span className="text-sm font-semibold text-gray-200">{user.name}</span>
              <span className="text-xs text-indigo-400 font-mono uppercase flex items-center justify-end gap-1">
                {user.role === 'MANAGER' && <Shield className="w-3 h-3 text-purple-400" />}
                {user.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 shadow-md shadow-blue-600/20 transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
