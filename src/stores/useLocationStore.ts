import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const STALE_MS = 5 * 60 * 1000 // 5 minutes

interface LocationState {
  lat: number | null
  lng: number | null
  accuracy: number | null
  updatedAt: number | null // Date.now()
  error: string | null
  isTracking: boolean
  _hydrated: boolean
  setLocation: (lat: number, lng: number, accuracy: number) => void
  setError: (error: string) => void
  setTracking: (v: boolean) => void
  setHydrated: (v: boolean) => void
  isFresh: () => boolean
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      lat: null,
      lng: null,
      accuracy: null,
      updatedAt: null,
      error: null,
      isTracking: false,
      _hydrated: false,

      setLocation: (lat, lng, accuracy) =>
        set({ lat, lng, accuracy, updatedAt: Date.now(), error: null }),

      setError: (error) => set({ error, isTracking: false }),

      setTracking: (v) => set({ isTracking: v }),

      setHydrated: (v) => set({ _hydrated: v }),

      // true ถ้ามี location และยังไม่เกิน 5 นาที
      isFresh: () => {
        const { updatedAt, lat, lng } = get()
        if (lat === null || lng === null || updatedAt === null) return false
        return Date.now() - updatedAt < STALE_MS
      },
    }),
    {
      name: 'skv-location',
      storage: createJSONStorage(() => localStorage),
      // persist เฉพาะ position data ไม่ persist transient flags
      partialize: (state) => ({
        lat: state.lat,
        lng: state.lng,
        accuracy: state.accuracy,
        updatedAt: state.updatedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return

        // ถ้า location เก่าเกิน 5 นาที ให้ clear — รอ GPS ใหม่
        const isStale =
          state.updatedAt !== null && Date.now() - state.updatedAt >= STALE_MS

        if (isStale) {
          state.lat = null
          state.lng = null
          state.accuracy = null
          state.updatedAt = null
        }

        state.setHydrated(true)
      },
    },
  ),
)
