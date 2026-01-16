// ============================================================
// StyleAdvisor AI - Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  hasAcceptedTerms: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setOnboarded: (value: boolean) => void;
  setAcceptedTerms: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: true,
  hasAcceptedTerms: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      login: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        }),

      logout: () => 
        set({ 
          ...initialState, 
          isLoading: false 
        }),

      setUser: (user) => 
        set({ user }),

      setOnboarded: (value) => 
        set({ isOnboarded: value }),

      setAcceptedTerms: (value) => 
        set({ hasAcceptedTerms: value }),

      setLoading: (value) => 
        set({ isLoading: value }),

      reset: () => 
        set({ ...initialState, isLoading: false }),
    }),
    {
      name: 'styleadvisor-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        hasAcceptedTerms: state.hasAcceptedTerms,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
