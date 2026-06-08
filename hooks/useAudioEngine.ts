'use client'

import { Howl } from 'howler'
import { getSoundStreamUrl } from '@/lib/freesound'
import { SOUNDS } from '@/data/sounds'

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
  function getGainMultiplier(id: string) {
    const sound = SOUNDS.find(s => s.id === id)
    return sound?.baseGain ?? 1
  }

  function play(id: string, freesoundId: number, volume: number) {
    const howl = getOrCreate(id, freesoundId)
    const gain = getGainMultiplier(id)
    // Aplica curva exponencial (x²) e o multiplicador de ganho base
    howl.volume(Math.pow(volume, 2) * gain)
    if (!howl.playing()) howl.play()
  }

  function stop(id: string) {
    const howl = howlMap[id]
    if (!howl) return
    howl.unload()
    delete howlMap[id]
  }

  function setVolume(id: string, volume: number) {
    const gain = getGainMultiplier(id)
    // Aplica curva exponencial (x²) e o multiplicador de ganho base
    howlMap[id]?.volume(Math.pow(volume, 2) * gain)
  }

  return { status: 'ready' as const, play, stop, setVolume }
}
