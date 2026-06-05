import { describe, it, expect, beforeEach, vi } from 'vitest'

const prismaMock = vi.hoisted(() => ({
  preset: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  subscription: {
    findUnique: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))

import { listPresets, createPreset, getPreset, updatePreset, deletePreset } from './preset.service'

const PRESET_INPUT = { name: 'Focus', sounds: { rain: 0.5 }, radioId: 'jazz' }

const dbPreset = {
  id: 'p1',
  userId: 'u1',
  name: 'Focus',
  sounds: { rain: 0.5 },
  radioId: 'jazz',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const premiumSub = {
  plan: 'premium',
  status: 'active',
  stripeCurrentPeriodEnd: new Date(Date.now() + 86_400_000),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('listPresets', () => {
  it('returns presets for the given user ordered by date', async () => {
    prismaMock.preset.findMany.mockResolvedValue([dbPreset])
    const result = await listPresets('u1')
    expect(result).toHaveLength(1)
    expect(prismaMock.preset.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'u1' } }),
    )
  })
})

describe('createPreset', () => {
  it('throws PresetError PRESET_LIMIT_REACHED for free users at the limit', async () => {
    prismaMock.preset.count.mockResolvedValue(2)
    prismaMock.subscription.findUnique.mockResolvedValue(null)
    await expect(createPreset('u1', PRESET_INPUT)).rejects.toMatchObject({
      code: 'PRESET_LIMIT_REACHED',
      status: 403,
    })
  })

  it('allows premium users to exceed the free limit', async () => {
    prismaMock.preset.count.mockResolvedValue(10)
    prismaMock.subscription.findUnique.mockResolvedValue(premiumSub)
    prismaMock.preset.create.mockResolvedValue(dbPreset)
    const result = await createPreset('u1', PRESET_INPUT)
    expect(result).toEqual(dbPreset)
  })

  it('allows free users below the limit to create a preset', async () => {
    prismaMock.preset.count.mockResolvedValue(1)
    prismaMock.subscription.findUnique.mockResolvedValue(null)
    prismaMock.preset.create.mockResolvedValue(dbPreset)
    await expect(createPreset('u1', PRESET_INPUT)).resolves.toEqual(dbPreset)
  })
})

describe('getPreset', () => {
  it('throws NOT_FOUND when the preset does not exist', async () => {
    prismaMock.preset.findUnique.mockResolvedValue(null)
    await expect(getPreset('missing', 'u1')).rejects.toMatchObject({ code: 'NOT_FOUND', status: 404 })
  })

  it('throws FORBIDDEN when the preset belongs to a different user', async () => {
    prismaMock.preset.findUnique.mockResolvedValue({ ...dbPreset, userId: 'other' })
    await expect(getPreset('p1', 'u1')).rejects.toMatchObject({ code: 'FORBIDDEN', status: 403 })
  })

  it('returns the preset when the user is the owner', async () => {
    prismaMock.preset.findUnique.mockResolvedValue(dbPreset)
    const result = await getPreset('p1', 'u1')
    expect(result).toEqual(dbPreset)
  })
})

describe('updatePreset', () => {
  it('updates and returns the preset for the owner', async () => {
    const updated = { ...dbPreset, name: 'Evening' }
    prismaMock.preset.findUnique.mockResolvedValue(dbPreset)
    prismaMock.preset.update.mockResolvedValue(updated)
    const result = await updatePreset('p1', 'u1', { name: 'Evening' })
    expect(result.name).toBe('Evening')
  })

  it('throws FORBIDDEN for a non-owner', async () => {
    prismaMock.preset.findUnique.mockResolvedValue({ ...dbPreset, userId: 'other' })
    await expect(updatePreset('p1', 'u1', { name: 'x' })).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})

describe('deletePreset', () => {
  it('deletes the preset for the owner', async () => {
    prismaMock.preset.findUnique.mockResolvedValue(dbPreset)
    prismaMock.preset.delete.mockResolvedValue(dbPreset)
    await expect(deletePreset('p1', 'u1')).resolves.toBeUndefined()
    expect(prismaMock.preset.delete).toHaveBeenCalledWith({ where: { id: 'p1' } })
  })

  it('throws NOT_FOUND when the preset does not exist', async () => {
    prismaMock.preset.findUnique.mockResolvedValue(null)
    await expect(deletePreset('missing', 'u1')).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
