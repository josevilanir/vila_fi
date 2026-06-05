import { describe, it, expect, beforeEach, vi } from 'vitest'

const loginUserMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/auth.service', () => ({
  loginUser: loginUserMock,
  AuthError: class AuthError extends Error {
    constructor(
      public code: string,
      message: string,
      public status: number,
    ) { super(message) }
  },
}))

import { POST } from './route'

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockUser = { id: 'u1', email: 'a@b.com', name: 'Ada', createdAt: new Date(), updatedAt: new Date() }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/v1/auth/login', () => {
  it('returns 400 for a missing body', async () => {
    const req = new Request('http://localhost/api/v1/auth/login', { method: 'POST' })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid e-mail format', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email', password: 'pw' }) as never)
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 when password is empty', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', password: '' }) as never)
    expect(res.status).toBe(400)
  })

  it('returns 200 with token and user on valid credentials', async () => {
    loginUserMock.mockResolvedValue({ token: 'tok', user: mockUser })
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'secret123' }) as never)
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data.token).toBe('tok')
    expect(json.data.user.email).toBe('a@b.com')
  })

  it('returns the service error code and status when loginUser throws AuthError', async () => {
    const { AuthError } = await import('@/services/auth.service')
    loginUserMock.mockRejectedValue(new AuthError('INVALID_CREDENTIALS', 'E-mail ou senha inválidos', 401))
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'wrong' }) as never)
    const json = await res.json()
    expect(res.status).toBe(401)
    expect(json.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('returns 500 for unexpected service errors', async () => {
    loginUserMock.mockRejectedValue(new Error('Database exploded'))
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'secret123' }) as never)
    expect(res.status).toBe(500)
  })
})
