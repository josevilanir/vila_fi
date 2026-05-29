import { create } from 'zustand'
import { SafeUser, SafeSubscription } from '@/lib/types'

const TOKEN_KEY = 'vilafi_token'

interface AuthState {
  user: SafeUser | null
  subscription: SafeSubscription | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  restoreSession: () => void
  setCustomBackground: (url: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  subscription: null,
  token: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)
      localStorage.setItem(TOKEN_KEY, json.data.token)
      set({ token: json.data.token, user: json.data.user })
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)
      localStorage.setItem(TOKEN_KEY, json.data.token)
      set({ token: json.data.token, user: json.data.user })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, subscription: null, token: null })
  },

  setCustomBackground: (url) => {
    set((s) => s.user ? { user: { ...s.user, customBackgroundUrl: url } } : {})
  },

  restoreSession: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.error) {
        localStorage.removeItem(TOKEN_KEY)
        return
      }
      const { subscription, ...user } = json.data
      set({ token, user, subscription: subscription ?? null })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
}))
