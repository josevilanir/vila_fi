import { describe, it, expect, beforeEach, vi } from 'vitest'

const registerUserMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/auth.service', () => ({
  registerUser: registerUserMock,
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
  return new Request('http://localhost/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockUser = { id: 'u1', email: 'new@b.com', name: 'Bob', createdAt: new Date(), updatedAt: new Date() }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/v1/auth/register', () => {
  it('returns 400 when body is missing', async () => {
    const req = new Request('http://localhost/api/v1/auth/register', { method: 'POST' })
    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('returns 400 with a readable message for invalid e-mail', async () => {
    const res = await POST(makeRequest({ email: 'bad', password: 'secret123' }) as never)
    const json = await res.json()
    expect(res.status).toBe(400)
    expect(json.error.code).toBe('VALIDATION_ERROR')
    expect(typeof json.error.message).toBe('string')
  })

  it('returns 400 when password has fewer than 8 characters', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'short' }) as never)
    expect(res.status).toBe(400)
  })

  it('returns 201 with user (token moved to httpOnly cookie)', async () => {
    registerUserMock.mockResolvedValue({ token: 'tok', user: mockUser })
    const res = await POST(makeRequest({ email: 'new@b.com', password: 'secret123', name: 'Bob' }) as never)
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.data.user.email).toBe('new@b.com')
    // token must NOT appear in the response body
    expect(json.data.token).toBeUndefined()
  })

  it('returns 409 when the e-mail is already taken', async () => {
    const { AuthError } = await import('@/services/auth.service')
    registerUserMock.mockRejectedValue(new AuthError('EMAIL_TAKEN', 'Este e-mail já está em uso', 409))
    const res = await POST(makeRequest({ email: 'taken@b.com', password: 'secret123' }) as never)
    const json = await res.json()
    expect(res.status).toBe(409)
    expect(json.error.code).toBe('EMAIL_TAKEN')
  })

  it('returns 500 for unexpected errors', async () => {
    registerUserMock.mockRejectedValue(new Error('Unexpected'))
    const res = await POST(makeRequest({ email: 'a@b.com', password: 'secret123' }) as never)
    expect(res.status).toBe(500)
  })
})
