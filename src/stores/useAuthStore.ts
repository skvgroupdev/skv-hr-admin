import { create } from 'zustand'
import type { User } from '../types/auth'

const ACCESS_TOKEN_KEY = 'skv_access_token'
const REFRESH_TOKEN_KEY = 'skv_refresh_token'

const EMPLOYEE_ROLES = ['STAFF', 'SUPERVISOR', 'BRANCH_MANAGER'] as const

// Employee roles use localStorage (persistent); HR/Super use sessionStorage (tab-scoped)
const getStorage = (role?: string): Storage =>
  EMPLOYEE_ROLES.includes(role as (typeof EMPLOYEE_ROLES)[number]) ? localStorage : sessionStorage

interface AuthStore {
  accessToken: string | null
  user: User | null
  // true only during page-refresh hydration: token restored but user not yet fetched
  isHydrating: boolean
  setTokens: (accessToken: string, refreshToken: string, role?: string) => void
  setUser: (user: User) => void
  logout: () => void
  getRefreshToken: () => string | null
}

// On initial load: check localStorage first (employee), then sessionStorage (HR)
const restoredToken =
  localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY)

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: restoredToken,
  user: null,
  // If we restored a token from storage, user is unknown until /auth/me completes
  isHydrating: !!restoredToken,

  setTokens: (accessToken, refreshToken, role) => {
    const storage = getStorage(role)
    storage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    // Fresh login: user will be set immediately after — no hydration needed
    set({ accessToken, isHydrating: false })
  },

  setUser: (user) => {
    // Re-persist token to correct storage once role is known after me() fetch
    const currentToken =
      localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY)
    if (currentToken) {
      const targetStorage = getStorage(user.role)
      const otherStorage = targetStorage === localStorage ? sessionStorage : localStorage
      otherStorage.removeItem(ACCESS_TOKEN_KEY)
      targetStorage.setItem(ACCESS_TOKEN_KEY, currentToken)
    }
    set({ user, isHydrating: false })
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    set({ accessToken: null, user: null })
  },

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
}))
