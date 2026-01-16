// ============================================================
// StyleAdvisor AI - UI Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { Toast, Modal } from '../types';

interface UIState {
  isOnline: boolean;
  activeToasts: Toast[];
  activeModal: Modal | null;
  isBottomSheetOpen: boolean;
  bottomSheetContent: string | null;
}

interface UIActions {
  setOnline: (value: boolean) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  showModal: (modal: Omit<Modal, 'id'>) => void;
  hideModal: () => void;
  openBottomSheet: (content: string) => void;
  closeBottomSheet: () => void;
}

const initialState: UIState = {
  isOnline: true,
  activeToasts: [],
  activeModal: null,
  isBottomSheetOpen: false,
  bottomSheetContent: null,
};

export const useUIStore = create<UIState & UIActions>()((set, get) => ({
  ...initialState,

  setOnline: (value) => 
    set({ isOnline: value }),

  showToast: (toast) => {
    const id = Date.now().toString();
    const newToast: Toast = { ...toast, id };
    set((state) => ({ 
      activeToasts: [...state.activeToasts, newToast] 
    }));

    // Auto-dismiss after duration (default 3 seconds)
    setTimeout(() => {
      get().hideToast(id);
    }, toast.duration || 3000);
  },

  hideToast: (id) => 
    set((state) => ({
      activeToasts: state.activeToasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => 
    set({ activeToasts: [] }),

  showModal: (modal) => {
    const id = Date.now().toString();
    set({ activeModal: { ...modal, id } });
  },

  hideModal: () => 
    set({ activeModal: null }),

  openBottomSheet: (content) => 
    set({ isBottomSheetOpen: true, bottomSheetContent: content }),

  closeBottomSheet: () => 
    set({ isBottomSheetOpen: false, bottomSheetContent: null }),
}));
