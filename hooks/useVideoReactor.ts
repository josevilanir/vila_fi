'use client'

import { useAmbientStore } from '@/store/ambientStore'
import { useAuthStore } from '@/store/authStore'
import { VIDEO_RULES } from '@/data/videoMappings'

export function useVideoReactor(): string {
  const volumes = useAmbientStore((s) => s.volumes)
  const customBackground = useAuthStore((s) => s.user?.customBackgroundUrl ?? null)

  if (customBackground) return customBackground

  const active = new Set(Object.keys(volumes))
  const match = VIDEO_RULES
    .filter((rule) => rule.requires.every((id) => active.has(id)))
    .sort((a, b) => b.priority - a.priority)[0]

  return match?.video ?? 'town-default.mp4'
}
