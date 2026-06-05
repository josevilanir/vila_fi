import { create } from 'zustand'
import { SafeUser, SafeSubscription } from '@/lib/types'

interface AuthState {
  user: SafeUser | null
  subscription: SafeSubscription | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  subscription: null,
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
      set({ user: json.data.user })
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
      set({ user: json.data.user })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' })
    set({ user: null, subscription: null })
  },

  restoreSession: async () => {
    try {
      const res = await fetch('/api/v1/auth/me')
      const json = await res.json()
      if (json.error) return
      const { subscription, ...user } = json.data
      set({ user, subscription: subscription ?? null })
    } catch {
      // Cookie invalid or expired — stay logged out
    }
  },
}))
