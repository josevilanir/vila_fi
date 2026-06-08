'use client'

import { Howl } from 'howler'
import { getSoundStreamUrl } from '@/lib/freesound'
import { SOUNDS } from '@/data/sounds'

// Module-level singletons — survive re-renders and StrictMode double-mount
const howlMap: Record<string, Howl> = {}

// Sounds with baseGain > 1.0 can't use Howler's html5 mode (HTMLMediaElement.volume
// is capped at 1.0). Instead, we stream via HTMLAudioElement and route through a
// Web Audio GainNode — gets both streaming start AND gain above 1.0.
interface BoostNode {
  audio: HTMLAudioElement
  gainNode: GainNode
}
const boostMap: Record<string, BoostNode> = {}
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function getOrCreateBoost(id: string, src: string): BoostNode {
  if (!boostMap[id]) {
    const ctx = getCtx()
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    const source = ctx.createMediaElementSource(audio)
    const gainNode = ctx.createGain()
    source.connect(gainNode)
    gainNode.connect(ctx.destination)
    boostMap[id] = { audio, gainNode }
  }
  return boostMap[id]
}

function getOrCreate(id: string, freesoundId: number): Howl {
  if (!howlMap[id]) {
    howlMap[id] = new Howl({
      src: [getSoundStreamUrl(freesoundId)],
      format: ['mp3'],
      loop: true,
      volume: 0,
      html5: true,
    })
  }
  return howlMap[id]
}

export function useAudioEngine() {
  function getSoundDef(id: string) {
    return SOUNDS.find(s => s.id === id)
  }

  function play(id: string, freesoundId: number, volume: number) {
    const gain = getSoundDef(id)?.baseGain ?? 1

    if (gain > 1) {
      const { audio, gainNode } = getOrCreateBoost(id, getSoundStreamUrl(freesoundId))
      const ctx = getCtx()
      gainNode.gain.value = gain * Math.pow(volume, 2)
      if (ctx.state === 'suspended') ctx.resume()
      if (audio.paused) audio.play().catch(() => {})
    } else {
      const howl = getOrCreate(id, freesoundId)
      howl.volume(Math.pow(volume, 2))
      if (!howl.playing()) howl.play()
    }
  }

  function stop(id: string) {
    if (boostMap[id]) {
      // Pause but keep the element loaded — next play() resumes instantly
      boostMap[id].audio.pause()
      return
    }
    const howl = howlMap[id]
    if (!howl) return
    howl.unload()
    delete howlMap[id]
  }

  function setVolume(id: string, volume: number) {
    const gain = getSoundDef(id)?.baseGain ?? 1

    if (boostMap[id]) {
      boostMap[id].gainNode.gain.value = gain * Math.pow(volume, 2)
      return
    }

    const howl = howlMap[id]
    if (!howl) return
    howl.volume(Math.pow(volume, 2))
  }

  return { status: 'ready' as const, play, stop, setVolume }
}
