import { create } from "zustand";

// Types
type LandingState = {
  // States
  loading: boolean;

  // Actions
  setLoadingFalse: () => void;
  setLoading: (value: boolean) => void;
};

export const useLandingStore = create<LandingState>((set) => ({
  // States
  loading: true,

  // Actions
  setLoadingFalse: () => set({ loading: false }),
  setLoading: (value) => set({ loading: value }),
}));
