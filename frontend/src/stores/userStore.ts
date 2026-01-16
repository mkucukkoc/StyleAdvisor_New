// ============================================================
// StyleAdvisor AI - User Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, StylePreference, BudgetRange } from '../types';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
}

interface UserActions {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setStylePreferences: (preferences: StylePreference[]) => void;
  setBudgetRange: (budget: BudgetRange) => void;
  setPreferredRetailers: (retailers: string[]) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProfile: (profile) => 
        set({ profile }),

      updateProfile: (updates) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, ...updates } });
        }
      },

      setStylePreferences: (preferences) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, stylePreferences: preferences } });
        }
      },

      setBudgetRange: (budget) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, budgetRange: budget } });
        }
      },

      setPreferredRetailers: (retailers) => {
        const current = get().profile;
        if (current) {
          set({ profile: { ...current, preferredRetailers: retailers } });
        }
      },

      setLoading: (value) => 
        set({ isLoading: value }),

      reset: () => 
        set(initialState),
    }),
    {
      name: 'styleadvisor-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
