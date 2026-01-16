// ============================================================
// StyleAdvisor AI - Analysis Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { AnalysisRequest, AnalysisResult } from '../types';

interface AnalysisState {
  currentRequest: AnalysisRequest | null;
  currentResult: AnalysisResult | null;
  historyCache: AnalysisResult[];
  isProcessing: boolean;
  processingStep: number;
}

interface AnalysisActions {
  setCurrentRequest: (request: AnalysisRequest | null) => void;
  updateCurrentRequest: (updates: Partial<AnalysisRequest>) => void;
  setCurrentResult: (result: AnalysisResult | null) => void;
  addToHistory: (result: AnalysisResult) => void;
  setHistoryCache: (history: AnalysisResult[]) => void;
  setProcessing: (value: boolean) => void;
  setProcessingStep: (step: number) => void;
  clearCurrentAnalysis: () => void;
  reset: () => void;
}

const initialState: AnalysisState = {
  currentRequest: null,
  currentResult: null,
  historyCache: [],
  isProcessing: false,
  processingStep: 0,
};

export const useAnalysisStore = create<AnalysisState & AnalysisActions>()((set, get) => ({
  ...initialState,

  setCurrentRequest: (request) => 
    set({ currentRequest: request }),

  updateCurrentRequest: (updates) => {
    const current = get().currentRequest;
    if (current) {
      set({ currentRequest: { ...current, ...updates } });
    } else {
      set({ currentRequest: { type: 'text', ...updates } as AnalysisRequest });
    }
  },

  setCurrentResult: (result) => 
    set({ currentResult: result }),

  addToHistory: (result) => 
    set((state) => ({
      historyCache: [result, ...state.historyCache].slice(0, 20), // Keep last 20
    })),

  setHistoryCache: (history) => 
    set({ historyCache: history }),

  setProcessing: (value) => 
    set({ isProcessing: value }),

  setProcessingStep: (step) => 
    set({ processingStep: step }),

  clearCurrentAnalysis: () => 
    set({ 
      currentRequest: null, 
      currentResult: null, 
      isProcessing: false, 
      processingStep: 0 
    }),

  reset: () => 
    set(initialState),
}));
