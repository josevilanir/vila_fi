import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'

// vi.hoisted ensures the mock object is created before the vi.mock factory runs
const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-for-vitest-at-least-32-chars'
})

import { registerUser, loginUser, getUserById, AuthError } from './auth.service'

const dbUser = {
  id: 'u1',
  email: 'ada@example.com',
  name: 'Ada',
  passwordHash: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('registerUser', () => {
  it('throws AuthError with EMAIL_TAKEN when the e-mail already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(dbUser)
    await expect(registerUser({ email: dbUser.email, password: 'secret123' })).rejects.toThrow(AuthError)
    await expect(registerUser({ email: dbUser.email, password: 'secret123' })).rejects.toMatchObject({
      code: 'EMAIL_TAKEN',
      status: 409,
    })
  })

  it('creates the user and returns a token + safe user on success', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({ ...dbUser, passwordHash: 'hash' })
    const result = await registerUser({ email: dbUser.email, password: 'secret123' })
    expect(typeof result.token).toBe('string')
    expect(result.user.email).toBe(dbUser.email)
    expect((result.user as Record<string, unknown>).passwordHash).toBeUndefined()
  })
})

describe('loginUser', () => {
  it('throws AuthError with INVALID_CREDENTIALS for an unknown e-mail', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    await expect(loginUser({ email: 'ghost@x.com', password: '12345678' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
      status: 401,
    })
  })

  it('throws AuthError with INVALID_CREDENTIALS for a wrong password', async () => {
    const { default: bcrypt } = await import('bcryptjs')
    const hash = await bcrypt.hash('correct-password', 1)
    prismaMock.user.findUnique.mockResolvedValue({ ...dbUser, passwordHash: hash })
    await expect(loginUser({ email: dbUser.email, password: 'wrong-password' })).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    })
  })

  it('returns a token and safe user for valid credentials', async () => {
    const { default: bcrypt } = await import('bcryptjs')
    const hash = await bcrypt.hash('correct-password', 1)
    prismaMock.user.findUnique.mockResolvedValue({ ...dbUser, passwordHash: hash })
    const result = await loginUser({ email: dbUser.email, password: 'correct-password' })
    expect(typeof result.token).toBe('string')
    expect(result.user.id).toBe(dbUser.id)
  })
})

describe('getUserById', () => {
  it('returns null when the user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    expect(await getUserById('missing-id')).toBeNull()
  })

  it('returns a safe user (no passwordHash) when found', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...dbUser, passwordHash: 'irrelevant' })
    const user = await getUserById(dbUser.id)
    expect(user?.id).toBe(dbUser.id)
    expect((user as Record<string, unknown> | null)?.passwordHash).toBeUndefined()
  })
})
