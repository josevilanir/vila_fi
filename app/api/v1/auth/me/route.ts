import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { getUserById } from '@/services/auth.service'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const user = await getUserById(payload.userId)
  if (!user) return err('UNAUTHORIZED', 'Usuário não encontrado', 401)

  return ok(user)
}
