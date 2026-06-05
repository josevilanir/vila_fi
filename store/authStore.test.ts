import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './authStore'

const RESET = { user: null, subscription: null, token: null, isLoading: false }

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
    it('stores token and user on success', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: { token: 'tok', user: mockUser }, error: null }))
      await useAuthStore.getState().login('a@b.com', 'password')
      const s = useAuthStore.getState()
      expect(s.token).toBe('tok')
      // Dates are serialised to ISO strings when the mock Response is JSON-parsed
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

    it('persists the token in localStorage on success', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: { token: 'tok', user: mockUser }, error: null }))
      await useAuthStore.getState().login('a@b.com', 'password')
      expect(localStorage.getItem('vilafi_token')).toBe('tok')
    })
  })

  describe('register', () => {
    it('stores token and user on success', async () => {
      vi.stubGlobal('fetch', mockFetch({ data: { token: 'tok2', user: mockUser }, error: null }, 201))
      await useAuthStore.getState().register('a@b.com', 'password', 'Ada')
      expect(useAuthStore.getState().token).toBe('tok2')
    })
  })

  describe('logout', () => {
    it('clears user, token, subscription and localStorage entry', () => {
      useAuthStore.setState({ user: mockUser, token: 'tok', subscription: null })
      localStorage.setItem('vilafi_token', 'tok')
      useAuthStore.getState().logout()
      const s = useAuthStore.getState()
      expect(s.user).toBeNull()
      expect(s.token).toBeNull()
      expect(localStorage.getItem('vilafi_token')).toBeNull()
    })
  })

  describe('restoreSession', () => {
    it('is a no-op when no token is stored', async () => {
      const fetchSpy = vi.fn()
      vi.stubGlobal('fetch', fetchSpy)
      await useAuthStore.getState().restoreSession()
      expect(fetchSpy).not.toHaveBeenCalled()
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('restores user and subscription when the token is valid', async () => {
      localStorage.setItem('vilafi_token', 'valid-tok')
      vi.stubGlobal(
        'fetch',
        mockFetch({ data: { ...mockUser, subscription: null }, error: null }),
      )
      await useAuthStore.getState().restoreSession()
      expect(useAuthStore.getState().user).not.toBeNull()
      expect(useAuthStore.getState().token).toBe('valid-tok')
    })

    it('removes the token from localStorage when the server returns an error', async () => {
      localStorage.setItem('vilafi_token', 'bad-tok')
      vi.stubGlobal('fetch', mockFetch({ data: null, error: { code: 'UNAUTHORIZED', message: 'Não autorizado' } }))
      await useAuthStore.getState().restoreSession()
      expect(localStorage.getItem('vilafi_token')).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
    })
  })
})
