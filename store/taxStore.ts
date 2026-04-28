import { create } from 'zustand'

interface TaxStore {
  userId: string | null
  accessToken: string | null

  pendingSubmitIds: string[]
  addPendingSubmit: (id: string) => void
  removePendingSubmit: (id: string) => void
  clearPendingSubmit: () => void

  onboardingComplete: boolean
  setOnboardingComplete: (v: boolean) => void

  reconnectedItemIds: string[]
  markReconnected: (itemId: string) => void

  setAuth: (userId: string, token: string) => void
  clearAuth: () => void
}

export const useTaxStore = create<TaxStore>((set) => ({
  userId: null,
  accessToken: null,

  pendingSubmitIds: [],
  addPendingSubmit: (id) =>
    set((state) => ({
      pendingSubmitIds: state.pendingSubmitIds.includes(id)
        ? state.pendingSubmitIds
        : [...state.pendingSubmitIds, id],
    })),
  removePendingSubmit: (id) =>
    set((state) => ({
      pendingSubmitIds: state.pendingSubmitIds.filter((i) => i !== id),
    })),
  clearPendingSubmit: () => set({ pendingSubmitIds: [] }),

  onboardingComplete: false,
  setOnboardingComplete: (v) => set({ onboardingComplete: v }),

  reconnectedItemIds: [],
  markReconnected: (itemId) =>
    set((state) => ({
      reconnectedItemIds: state.reconnectedItemIds.includes(itemId)
        ? state.reconnectedItemIds
        : [...state.reconnectedItemIds, itemId],
    })),

  setAuth: (userId, token) => set({ userId, accessToken: token }),
  clearAuth: () => set({ userId: null, accessToken: null }),
}))
