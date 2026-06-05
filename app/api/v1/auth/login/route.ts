import { NextRequest } from 'next/server'
import { LoginSchema } from '@/lib/schemas/auth'
import { loginUser, AuthError } from '@/services/auth.service'
import { ok, err } from '@/lib/api-response'
import { SESSION_COOKIE } from '@/lib/getAuthUser'

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', 'Dados inválidos', 400)
  }

  try {
    const { token, user } = await loginUser(parsed.data)
    const response = ok({ user })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    })
    return response
  } catch (e) {
    if (e instanceof AuthError) return err(e.code, e.message, e.status)
    console.error('[POST /auth/login]', e)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}
