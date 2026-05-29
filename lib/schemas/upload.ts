import { z } from 'zod'

const IMAGE_MAX = 10 * 1024 * 1024
const VIDEO_MAX = 50 * 1024 * 1024

export const PresignSchema = z
  .object({
    fileName: z.string().min(1).max(200),
    contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'video/mp4']),
    fileSize: z.number().int().positive(),
  })
  .refine(
    (d) => (d.contentType === 'video/mp4' ? d.fileSize <= VIDEO_MAX : d.fileSize <= IMAGE_MAX),
    { message: 'Arquivo excede o tamanho máximo permitido' },
  )

export const ConfirmSchema = z.object({
  publicUrl: z.string().url(),
})

export type PresignInput = z.infer<typeof PresignSchema>
