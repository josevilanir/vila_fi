import { NextRequest } from 'next/server'
import { RegisterSchema } from '@/lib/schemas/auth'
import { registerUser, AuthError } from '@/services/auth.service'
import { ok, err } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos'
    return err('VALIDATION_ERROR', message, 400)
  }

  try {
    const result = await registerUser(parsed.data)
    return ok(result, 201)
  } catch (e) {
    if (e instanceof AuthError) return err(e.code, e.message, e.status)
    console.error('[POST /auth/register]', e)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}
