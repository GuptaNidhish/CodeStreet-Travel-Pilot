'use client';

import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { fetchApi } from '../../lib/api';
import { Bell, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any>('/notifications')
      .then((res) => setNotifications(res.notifications))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 flex flex-col font-mono">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div className="border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white uppercase flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#006FCF]" /> REAL-TIME NOTIFICATIONS FEED
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">
              Multi-channel plain language alerts explaining: what changed / what was done / how to undo
            </p>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 brutalist-card flex items-start gap-4">
                <div className="w-10 h-10 bg-[#006FCF] border-2 border-black flex items-center justify-center text-white font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-white text-sm uppercase">{n.title}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-bold leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
