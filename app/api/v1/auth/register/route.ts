import { NextRequest } from 'next/server'
import { RegisterSchema } from '@/lib/schemas/auth'
import { registerUser, AuthError } from '@/services/auth.service'
import { ok, err } from '@/lib/api-response'
import { SESSION_COOKIE } from '@/lib/getAuthUser'

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos'
    return err('VALIDATION_ERROR', message, 400)
  }

  try {
    const { token, user } = await registerUser(parsed.data)
    const response = ok({ user }, 201)
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
    console.error('[POST /auth/register]', e)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}
