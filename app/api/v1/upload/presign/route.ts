import { NextRequest } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { getAuthUser } from '@/lib/getAuthUser'
import { ok, err } from '@/lib/api-response'
import { getR2 } from '@/lib/r2'
import { getUserSubscription } from '@/services/subscription.service'
import { isPremium } from '@/lib/planFeatures'
import { PresignSchema } from '@/lib/schemas/upload'

export async function POST(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const subscription = await getUserSubscription(payload.userId)
  if (!isPremium(subscription)) {
    return err('FORBIDDEN', 'Upload de background é exclusivo para Premium', 403)
  }

  const body = await req.json().catch(() => null)
  const parsed = PresignSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Dados inválidos', 400)
  }

  const { fileName, contentType } = parsed.data
  const ext = fileName.split('.').pop()?.toLowerCase() ?? 'bin'
  const key = `backgrounds/${payload.userId}/${randomUUID()}.${ext}`

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    })
    const uploadUrl = await getSignedUrl(getR2(), command, { expiresIn: 300 })
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
    return ok({ uploadUrl, publicUrl })
  } catch (e) {
    console.error('[POST /upload/presign]', e)
    return err('INTERNAL_ERROR', 'Erro ao gerar URL de upload', 500)
  }
}
