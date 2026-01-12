'use client';

import { create } from 'zustand';
import { User } from '@/entities/user/model/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  initialize: () => Promise<void>;
}

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  initialized: false,
  
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },
  
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user });
  },
  
  initialize: async () => {
    if (get().initialized) return;
    
    if (typeof window === 'undefined') {
      set({ initialized: true });
      return;
    }
    
    const token = getStoredToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      try {
        const { userApi } = await import('@/entities/user/api/userApi');
        const currentUser = await userApi.getCurrentUser();
        set({ user: currentUser, token, isAuthenticated: true, initialized: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        get().clearAuth();
        set({ initialized: true });
      }
    } else {
      set({ initialized: true });
    }
  },
}));

