// ============================================================
// StyleAdvisor AI - Wardrobe Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WardrobeItem, WardrobeCategory } from '../types';
import { mockWardrobeItems } from '../services/api/mockData';

interface WardrobeState {
  items: WardrobeItem[];
  selectedCategory: WardrobeCategory | 'all';
  isLoading: boolean;
}

interface WardrobeActions {
  addItem: (item: WardrobeItem) => void;
  updateItem: (id: string, updates: Partial<WardrobeItem>) => void;
  removeItem: (id: string) => void;
  markAsWorn: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSelectedCategory: (category: WardrobeCategory | 'all') => void;
  getItemsByCategory: (category: WardrobeCategory | 'all') => WardrobeItem[];
  setItems: (items: WardrobeItem[]) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
  initializeWithMockData: () => void;
}

// Initialize with mock data for demo purposes
const initialState: WardrobeState = {
  items: mockWardrobeItems,
  selectedCategory: 'all',
  isLoading: false,
};

export const useWardrobeStore = create<WardrobeState & WardrobeActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item) => 
        set((state) => ({
          items: [...state.items, item],
        })),

      updateItem: (id, updates) => 
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      removeItem: (id) => 
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      markAsWorn: (id) => 
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  timesWorn: item.timesWorn + 1,
                  lastWorn: new Date().toISOString(),
                }
              : item
          ),
        })),

      toggleFavorite: (id) => 
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          ),
        })),

      setSelectedCategory: (category) => 
        set({ selectedCategory: category }),

      getItemsByCategory: (category) => {
        const { items } = get();
        if (category === 'all') return items;
        return items.filter((item) => item.category === category);
      },

      setItems: (items) => 
        set({ items }),

      setLoading: (value) => 
        set({ isLoading: value }),

      reset: () => 
        set(initialState),
    }),
    {
      name: 'styleadvisor-wardrobe',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
