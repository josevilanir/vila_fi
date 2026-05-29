import { create } from 'zustand'
import { SafeUser } from '@/lib/types'

const TOKEN_KEY = 'vilafi_token'

interface AuthState {
  user: SafeUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  restoreSession: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
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
    set({ user: null, token: null })
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
      set({ token, user: json.data })
    } catch {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
}))
