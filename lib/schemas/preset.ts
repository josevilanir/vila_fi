import { z } from 'zod'

export const CreatePresetSchema = z.object({
  name: z.string().min(1).max(50),
  sounds: z.record(z.string(), z.number().min(0).max(1)),
  radioId: z.string().min(1),
})

export const UpdatePresetSchema = CreatePresetSchema.partial()

export type CreatePresetInput = z.infer<typeof CreatePresetSchema>
