'use client'

import { Howl } from 'howler'
import { getSoundStreamUrl } from '@/lib/freesound'
import { SOUNDS } from '@/data/sounds'

// Module-level singleton — survives re-renders and StrictMode double-mount
const howlMap: Record<string, Howl> = {}

function getOrCreate(id: string, freesoundId: number): Howl {
  if (!howlMap[id]) {
    const sound = SOUNDS.find(s => s.id === id)
    const needsBoost = (sound?.baseGain ?? 1) > 1

    howlMap[id] = new Howl({
      src: [getSoundStreamUrl(freesoundId)],
      format: ['mp3'],
      loop: true,
      volume: 0,
      html5: !needsBoost, // Use Web Audio API if we need gain > 1.0
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
    
    // Calcula o volume final
    let finalVolume = Math.pow(volume, 2) * gain
    // Se for HTML5, precisa ser limitado a 1.0 para não causar IndexSizeError
    if ((howl as any)._html5) {
      finalVolume = Math.min(1.0, finalVolume)
    }
    
    howl.volume(finalVolume)
    if (!howl.playing()) howl.play()
  }

  function stop(id: string) {
    const howl = howlMap[id]
    if (!howl) return
    howl.unload()
    delete howlMap[id]
  }

  function setVolume(id: string, volume: number) {
    const howl = howlMap[id]
    if (!howl) return
    const gain = getGainMultiplier(id)
    
    let finalVolume = Math.pow(volume, 2) * gain
    if ((howl as any)._html5) {
      finalVolume = Math.min(1.0, finalVolume)
    }
    
    howl.volume(finalVolume)
  }

  return { status: 'ready' as const, play, stop, setVolume }
}
