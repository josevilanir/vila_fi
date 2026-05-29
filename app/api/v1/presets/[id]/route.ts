import { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/getAuthUser'
import { UpdatePresetSchema } from '@/lib/schemas/preset'
import { getPreset, updatePreset, deletePreset, PresetError } from '@/services/preset.service'
import { ok, err } from '@/lib/api-response'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const { id } = await params
  try {
    const preset = await getPreset(id, payload.userId)
    return ok(preset)
  } catch (e) {
    if (e instanceof PresetError) return err(e.code, e.message, e.status)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const body = await req.json().catch(() => null)
  const parsed = UpdatePresetSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Dados inválidos', 400)
  }

  const { id } = await params
  try {
    const preset = await updatePreset(id, payload.userId, parsed.data)
    return ok(preset)
  } catch (e) {
    if (e instanceof PresetError) return err(e.code, e.message, e.status)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = getAuthUser(req)
  if (!payload) return err('UNAUTHORIZED', 'Não autorizado', 401)

  const { id } = await params
  try {
    await deletePreset(id, payload.userId)
    return ok(null)
  } catch (e) {
    if (e instanceof PresetError) return err(e.code, e.message, e.status)
    return err('INTERNAL_ERROR', 'Erro interno', 500)
  }
}
