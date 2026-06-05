import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/route-handler'
import { UpdatePresetSchema } from '@/lib/schemas/preset'
import { getPreset, updatePreset, deletePreset } from '@/services/preset.service'
import { ok, err } from '@/lib/api-response'

type IdParams = { id: string }

export const GET = withAuth<IdParams>(async (req, user, ctx) => {
  const { id } = await ctx!.params
  const preset = await getPreset(id, user.userId)
  return ok(preset)
})

export const PUT = withAuth<IdParams>(async (req: NextRequest, user, ctx) => {
  const body = await req.json().catch(() => null)
  const parsed = UpdatePresetSchema.safeParse(body)
  if (!parsed.success) {
    return err('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Dados inválidos', 400)
  }

  const { id } = await ctx!.params
  const preset = await updatePreset(id, user.userId, parsed.data)
  return ok(preset)
})

export const DELETE = withAuth<IdParams>(async (req, user, ctx) => {
  const { id } = await ctx!.params
  await deletePreset(id, user.userId)
  return ok(null)
})
