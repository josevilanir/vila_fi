import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/route-handler'
import { CreatePresetSchema } from '@/lib/schemas/preset'
import { listPresets, createPreset } from '@/services/preset.service'
import { ok, err } from '@/lib/api-response'

export const GET = withAuth(async (req, user) => {
  const presets = await listPresets(user.userId)
  return ok(presets)
})

export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null)
  const parsed = CreatePresetSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos'
    return err('VALIDATION_ERROR', message, 400)
  }

  const preset = await createPreset(user.userId, parsed.data)
  return ok(preset, 201)
})
