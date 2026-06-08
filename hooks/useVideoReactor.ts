'use client'

import { useAmbientStore } from '@/store/ambientStore'
import { VIDEO_RULES } from '@/data/videoMappings'
import { useThemeStore } from '@/store/themeStore'
import { useSceneStore } from '@/store/sceneStore'

export function useVideoReactor(): string {
  const volumes = useAmbientStore((s) => s.volumes)
  const isDarkMode = useThemeStore((s) => s.isDarkMode)
  const currentScene = useSceneStore((s) => s.currentScene)

  if (currentScene === 'fireplace') {
    return isDarkMode ? 'firePlace-night.mp4' : 'firePlace-day.mp4'
  }

  const active = new Set(Object.keys(volumes))
  const match = VIDEO_RULES
    .filter((rule) => rule.requires.every((id) => active.has(id)))
    .sort((a, b) => b.priority - a.priority)[0]

  if (!match || match.requires.length === 0) {
    return isDarkMode ? 'town-night.mp4' : 'town-default.mp4'
  }

  if (match.video === 'town-rain.mp4' && isDarkMode) {
    return 'town-rain-night.mp4'
  }

  return match.video
}
