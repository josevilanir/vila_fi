import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { RegisterInput, LoginInput } from '@/lib/schemas/auth'
import { SafeUser } from '@/lib/types'
import { AppError } from '@/lib/errors'

export { AppError as AuthError }

function toSafeUser(user: { id: string; email: string; name: string | null; createdAt: Date; updatedAt: Date }): SafeUser {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt }
}

export async function registerUser(input: RegisterInput): Promise<{ token: string; user: SafeUser }> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new AppError('EMAIL_TAKEN', 'Este e-mail já está em uso', 409)

  const passwordHash = await bcrypt.hash(input.password, 12)
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, name: input.name ?? null },
  })

  const token = signToken({ userId: user.id, email: user.email })
  return { token, user: toSafeUser(user) }
}

export async function loginUser(input: LoginInput): Promise<{ token: string; user: SafeUser }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new AppError('INVALID_CREDENTIALS', 'E-mail ou senha inválidos', 401)

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) throw new AppError('INVALID_CREDENTIALS', 'E-mail ou senha inválidos', 401)

  const token = signToken({ userId: user.id, email: user.email })
  return { token, user: toSafeUser(user) }
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  return toSafeUser(user)
}
