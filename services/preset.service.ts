import { prisma } from '@/lib/prisma'
import { CreatePresetInput } from '@/lib/schemas/preset'
import { canSaveMorePresets } from '@/lib/planFeatures'
import { AppError } from '@/lib/errors'

export { AppError as PresetError }

export async function listPresets(userId: string) {
  return prisma.preset.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createPreset(userId: string, input: CreatePresetInput) {
  const [count, subscription] = await Promise.all([
    prisma.preset.count({ where: { userId } }),
    prisma.subscription.findUnique({ where: { userId } }),
  ])
  if (!canSaveMorePresets(subscription, count)) {
    throw new AppError('PRESET_LIMIT_REACHED', 'Limite de presets do plano gratuito atingido', 403)
  }
  return prisma.preset.create({ data: { ...input, userId } })
}

export async function getPreset(id: string, userId: string) {
  const preset = await prisma.preset.findUnique({ where: { id } })
  if (!preset) throw new AppError('NOT_FOUND', 'Preset não encontrado', 404)
  if (preset.userId !== userId) throw new AppError('FORBIDDEN', 'Acesso negado', 403)
  return preset
}

export async function updatePreset(id: string, userId: string, input: Partial<CreatePresetInput>) {
  const preset = await prisma.preset.findUnique({ where: { id } })
  if (!preset) throw new AppError('NOT_FOUND', 'Preset não encontrado', 404)
  if (preset.userId !== userId) throw new AppError('FORBIDDEN', 'Acesso negado', 403)
  return prisma.preset.update({ where: { id }, data: input })
}

export async function deletePreset(id: string, userId: string): Promise<void> {
  const preset = await prisma.preset.findUnique({ where: { id } })
  if (!preset) throw new AppError('NOT_FOUND', 'Preset não encontrado', 404)
  if (preset.userId !== userId) throw new AppError('FORBIDDEN', 'Acesso negado', 403)
  await prisma.preset.delete({ where: { id } })
}
