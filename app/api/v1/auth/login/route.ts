import { NextRequest } from 'next/server'
import { LoginSchema } from '@/lib/schemas/auth'
import { loginUser, AuthError } from '@/services/auth.service'
import { ok, err } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', 'Dados inválidos', 400)
  }

  try {
    const result = await loginUser(parsed.data)
    return ok(result)
  } catch (e) {
    if (e instanceof AuthError) return err(e.code, e.message, e.status)
    console.error('[POST /auth/login]', e)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}
