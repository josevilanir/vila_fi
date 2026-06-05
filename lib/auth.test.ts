import { describe, it, expect, beforeAll } from 'vitest'
import { signToken, verifyToken } from './auth'

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-for-vitest-at-least-32-chars'
  process.env.JWT_EXPIRES_IN = '1h'
})

describe('signToken / verifyToken', () => {
  const payload = { userId: 'user-123', email: 'a@b.com' }

  it('signToken returns a non-empty string', () => {
    const token = signToken(payload)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('verifyToken recovers the original payload', () => {
    const token = signToken(payload)
    const decoded = verifyToken(token)
    expect(decoded.userId).toBe(payload.userId)
    expect(decoded.email).toBe(payload.email)
  })

  it('verifyToken throws for a tampered token', () => {
    const token = signToken(payload)
    const tampered = token.slice(0, -4) + 'XXXX'
    expect(() => verifyToken(tampered)).toThrow()
  })

  it('verifyToken throws for a completely invalid token', () => {
    expect(() => verifyToken('not.a.token')).toThrow()
  })
})
