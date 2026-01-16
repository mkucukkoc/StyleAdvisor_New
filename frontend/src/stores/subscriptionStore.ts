// ============================================================
// StyleAdvisor AI - Subscription Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionStatus, PremiumFeature } from '../types';

interface SubscriptionState {
  status: SubscriptionStatus;
  isLoading: boolean;
}

interface SubscriptionActions {
  setStatus: (status: SubscriptionStatus) => void;
  setPremium: (isPremium: boolean) => void;
  decrementAnalysis: () => void;
  resetDailyAnalysis: () => void;
  setLoading: (value: boolean) => void;
  checkAndHandlePremiumLock: (featureKey: string) => { allowed: boolean; action: 'allow' | 'paywall' | 'limit-modal' };
  reset: () => void;
}

const defaultFeatures: PremiumFeature[] = [
  { id: 'unlimited-analyses', name: 'Unlimited Analyses', description: 'No daily limits', isAvailable: false },
  { id: 'all-suggestions', name: 'All Outfit Suggestions', description: 'See all AI recommendations', isAvailable: false },
  { id: 'advanced-insights', name: 'Advanced Insights', description: 'Detailed style analysis', isAvailable: false },
  { id: 'priority-support', name: 'Priority Support', description: 'Get help faster', isAvailable: false },
  { id: 'exclusive-content', name: 'Exclusive Content', description: 'Fashion trends & tips', isAvailable: false },
  { id: 'no-ads', name: 'Ad-Free', description: 'No advertisements', isAvailable: false },
];

const initialStatus: SubscriptionStatus = {
  isPremium: false,
  plan: 'free',
  analysisRemaining: 1,
  analysisLimit: 1,
  features: defaultFeatures,
};

const initialState: SubscriptionState = {
  status: initialStatus,
  isLoading: false,
};

export const useSubscriptionStore = create<SubscriptionState & SubscriptionActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStatus: (status) => 
        set({ status }),

      setPremium: (isPremium) => {
        const current = get().status;
        set({
          status: {
            ...current,
            isPremium,
            plan: isPremium ? 'monthly' : 'free',
            analysisRemaining: isPremium ? 999 : 1,
            analysisLimit: isPremium ? 999 : 1,
            features: current.features.map((f) => ({ ...f, isAvailable: isPremium })),
          },
        });
      },

      decrementAnalysis: () => {
        const current = get().status;
        if (!current.isPremium && current.analysisRemaining > 0) {
          set({
            status: {
              ...current,
              analysisRemaining: current.analysisRemaining - 1,
            },
          });
        }
      },

      resetDailyAnalysis: () => {
        const current = get().status;
        if (!current.isPremium) {
          set({
            status: {
              ...current,
              analysisRemaining: current.analysisLimit,
            },
          });
        }
      },

      setLoading: (value) => 
        set({ isLoading: value }),

      checkAndHandlePremiumLock: (featureKey) => {
        const { status } = get();

        // Premium users have access to everything
        if (status.isPremium) {
          return { allowed: true, action: 'allow' };
        }

        // Check specific features
        switch (featureKey) {
          case 'analysis':
            if (status.analysisRemaining <= 0) {
              return { allowed: false, action: 'limit-modal' };
            }
            return { allowed: true, action: 'allow' };

          case 'outfit-suggestion-3':
          case 'outfit-suggestion-4':
          case 'outfit-suggestion-5':
            return { allowed: false, action: 'paywall' };

          case 'product-11':
          case 'product-beyond-10':
            return { allowed: false, action: 'paywall' };

          case 'advanced-insights':
          case 'fit-details':
          case 'color-details':
            return { allowed: false, action: 'paywall' };

          default:
            return { allowed: true, action: 'allow' };
        }
      },

      reset: () => 
        set(initialState),
    }),
    {
      name: 'styleadvisor-subscription',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        status: state.status,
      }),
    }
  )
);
