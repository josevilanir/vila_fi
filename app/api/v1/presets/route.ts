import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { CreatePresetSchema } from '@/lib/schemas/preset'
import { listPresets, createPreset, PresetError } from '@/services/preset.service'
import { ok, err } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const presets = await listPresets(payload.userId)
  return ok(presets)
}

export async function POST(req: NextRequest) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const body = await req.json().catch(() => null)
  const parsed = CreatePresetSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos'
    return err('VALIDATION_ERROR', message, 400)
  }

  try {
    const preset = await createPreset(payload.userId, parsed.data)
    return ok(preset, 201)
  } catch (e) {
    if (e instanceof PresetError) return err(e.code, e.message, e.status)
    console.error('[POST /presets]', e)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}
