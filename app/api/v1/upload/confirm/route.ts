import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { ok, err } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { ConfirmSchema } from '@/lib/schemas/upload'

export async function POST(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const body = await req.json().catch(() => null)
  const parsed = ConfirmSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Dados inválidos', 400)
  }

  const { publicUrl } = parsed.data
  const r2Base = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')
  if (!r2Base || !publicUrl.startsWith(r2Base + '/')) {
    return err('VALIDATION_ERROR', 'URL inválida', 400)
  }

  try {
    await prisma.user.update({
      where: { id: payload.userId },
      data: { customBackgroundUrl: publicUrl },
    })
    return ok({ customBackgroundUrl: publicUrl })
  } catch (e) {
    console.error('[POST /upload/confirm]', e)
    return err('INTERNAL_ERROR', 'Erro ao salvar background', 500)
  }
}
