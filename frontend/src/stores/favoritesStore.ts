// ============================================================
// StyleAdvisor AI - Favorites Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Outfit, Product } from '../types';
import { mockOutfits, mockProducts } from '../services/api/mockData';

interface FavoritesState {
  outfits: Outfit[];
  products: Product[];
  isLoading: boolean;
}

interface FavoritesActions {
  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (id: string) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  isOutfitFavorite: (id: string) => boolean;
  isProductFavorite: (id: string) => boolean;
  setOutfits: (outfits: Outfit[]) => void;
  setProducts: (products: Product[]) => void;
  setLoading: (value: boolean) => void;
  reset: () => void;
}

// Get favorite items from mock data
const mockFavoriteOutfits = mockOutfits.filter(o => o.isFavorite);
const mockFavoriteProducts = mockProducts.filter(p => p.isFavorite);

const initialState: FavoritesState = {
  outfits: mockFavoriteOutfits,
  products: mockFavoriteProducts,
  isLoading: false,
};

export const useFavoritesStore = create<FavoritesState & FavoritesActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addOutfit: (outfit) => 
        set((state) => ({
          outfits: [...state.outfits, { ...outfit, isFavorite: true }],
        })),

      removeOutfit: (id) => 
        set((state) => ({
          outfits: state.outfits.filter((o) => o.id !== id),
        })),

      addProduct: (product) => 
        set((state) => ({
          products: [...state.products, { ...product, isFavorite: true }],
        })),

      removeProduct: (id) => 
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      isOutfitFavorite: (id) => 
        get().outfits.some((o) => o.id === id),

      isProductFavorite: (id) => 
        get().products.some((p) => p.id === id),

      setOutfits: (outfits) => 
        set({ outfits }),

      setProducts: (products) => 
        set({ products }),

      setLoading: (value) => 
        set({ isLoading: value }),

      reset: () => 
        set(initialState),
    }),
    {
      name: 'styleadvisor-favorites',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        outfits: state.outfits,
        products: state.products,
      }),
    }
  )
);
