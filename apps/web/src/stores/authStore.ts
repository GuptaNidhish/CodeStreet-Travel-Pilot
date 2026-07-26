// ============================================
// Zustand Auth Store
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
    localStorage.setItem('token', token);
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, isLoading: false });
      return;
    }

    try {
      const user = await fetchApi<User>('/auth/me');
      set({ user, token, isLoading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
