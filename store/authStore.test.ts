import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './authStore'

const RESET = { user: null, subscription: null, isLoading: false }

const mockUser = { id: '1', email: 'a@b.com', name: 'Ada', createdAt: new Date(), updatedAt: new Date() }

function mockFetch(body: object, status = 200) {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
}

beforeEach(() => {
  useAuthStore.setState(RESET)
  vi.restoreAllMocks()
})

describe('authStore', () => {
  describe('login', () => {
    it('stores user on success', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: { user: mockUser }, error: null }))
      await useAuthStore.getState().login('a@b.com', 'password')
      const s = useAuthStore.getState()
      expect(s.user).toMatchObject({ id: mockUser.id, email: mockUser.email, name: mockUser.name })
      expect(s.isLoading).toBe(false)
    })

    it('throws and resets isLoading on API error', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch({ data: null, error: { code: 'INVALID_CREDENTIALS', message: 'E-mail ou senha inválidos' } }),
      )
      await expect(useAuthStore.getState().login('a@b.com', 'wrong')).rejects.toThrow()
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('stores user on success', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: { user: mockUser }, error: null }, 201))
      await useAuthStore.getState().register('a@b.com', 'password', 'Ada')
      expect(useAuthStore.getState().user).toMatchObject({ email: mockUser.email })
    })
  })

  describe('logout', () => {
    it('clears user and subscription', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: null, error: null }))
      useAuthStore.setState({ user: mockUser, subscription: null })
      await useAuthStore.getState().logout()
      const s = useAuthStore.getState()
      expect(s.user).toBeNull()
      expect(s.subscription).toBeNull()
    })
  })

  describe('restoreSession', () => {
    it('calls /api/v1/auth/me and stores user when cookie is valid', async () => {
      vi.stubGlobal(
        'fetch',
        mockFetch({ data: { ...mockUser, subscription: null }, error: null }),
      )
      await useAuthStore.getState().restoreSession()
      expect(useAuthStore.getState().user).not.toBeNull()
    })

    it('leaves user null when the server returns an auth error', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: null, error: { code: 'UNAUTHORIZED', message: 'Não autorizado' } }))
      await useAuthStore.getState().restoreSession()
      expect(useAuthStore.getState().user).toBeNull()
    })
  })
})
