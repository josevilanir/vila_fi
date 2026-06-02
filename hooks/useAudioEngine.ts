'use client'

import { Howl } from 'howler'
import { getSoundStreamUrl } from '@/lib/freesound'

// Module-level singleton — survives re-renders and StrictMode double-mount
const howlMap: Record<string, Howl> = {}

function getOrCreate(id: string, freesoundId: number): Howl {
  if (!howlMap[id]) {
    howlMap[id] = new Howl({
      src: [getSoundStreamUrl(freesoundId)],
      format: ['mp3'],
      loop: true,
      volume: 0,
      html5: true, // Use HTML5 Audio for streaming large files instantly
    })
  }
  return howlMap[id]
}

export function useAudioEngine() {
  function play(id: string, freesoundId: number, volume: number) {
    const howl = getOrCreate(id, freesoundId)
    howl.volume(volume)
    if (!howl.playing()) howl.play()
  }

  function stop(id: string) {
    const howl = howlMap[id]
    if (!howl) return
    howl.unload()
    delete howlMap[id]
  }

  function setVolume(id: string, volume: number) {
    howlMap[id]?.volume(volume)
  }

  return { status: 'ready' as const, play, stop, setVolume }
}
