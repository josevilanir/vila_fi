import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { ok, err } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  try {
    await prisma.user.update({
      where: { id: payload.userId },
      data: { customBackgroundUrl: null },
    })
    return ok({ customBackgroundUrl: null })
  } catch (e) {
    console.error('[DELETE /upload/background]', e)
    return err('INTERNAL_ERROR', 'Erro ao remover background', 500)
  }
}
