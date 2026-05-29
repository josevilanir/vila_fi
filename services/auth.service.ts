import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { RegisterInput, LoginInput } from '@/lib/schemas/auth'
import { SafeUser } from '@/lib/types'

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

function toSafeUser(user: { id: string; email: string; name: string | null; customBackgroundUrl?: string | null; createdAt: Date; updatedAt: Date }): SafeUser {
  return { id: user.id, email: user.email, name: user.name, customBackgroundUrl: user.customBackgroundUrl ?? null, createdAt: user.createdAt, updatedAt: user.updatedAt }
}

export async function registerUser(input: RegisterInput): Promise<{ token: string; user: SafeUser }> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new AuthError('EMAIL_TAKEN', 'Este e-mail já está em uso', 409)

  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, name: input.name ?? null },
  })

  const token = signToken({ userId: user.id, email: user.email })
  return { token, user: toSafeUser(user) }
}

export async function loginUser(input: LoginInput): Promise<{ token: string; user: SafeUser }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new AuthError('INVALID_CREDENTIALS', 'E-mail ou senha inválidos', 401)

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) throw new AuthError('INVALID_CREDENTIALS', 'E-mail ou senha inválidos', 401)

  const token = signToken({ userId: user.id, email: user.email })
  return { token, user: toSafeUser(user) }
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  return toSafeUser(user)
}
