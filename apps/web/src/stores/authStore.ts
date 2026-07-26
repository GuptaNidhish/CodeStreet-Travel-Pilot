// ============================================
// Zustand Auth Store — with Zero-Friction Demo Auto-Login
// ============================================

import { create } from 'zustand';
import { User } from '@travelpilot/shared';
import { fetchApi } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') localStorage.setItem('token', token);
    set({ user, token, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ user: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Auto demo login if no token is stored yet (for zero-friction demo experience)
    if (!token) {
      try {
        const res = await fetchApi<any>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'alex@travelpilot.demo', password: 'demo123' }),
        });
        token = res.token;
        if (typeof window !== 'undefined') localStorage.setItem('token', token!);
        set({ user: res.user, token: res.token, isLoading: false });
        return;
      } catch (err) {
        set({ user: null, token: null, isLoading: false });
        return;
      }
    }

    try {
      const user = await fetchApi<User>('/auth/me');
      set({ user, token, isLoading: false });
    } catch (err) {
      if (typeof window !== 'undefined') localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
