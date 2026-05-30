'use client'

import { useEffect, useState } from 'react'
import { Howl } from 'howler'
import { SOUNDS } from '@/data/sounds'
import { getSoundStreamUrl } from '@/lib/freesound'

export type AudioEngineStatus = 'idle' | 'loading' | 'ready' | 'error'

// Module-level singletons — survive re-renders and StrictMode double-mount
let howlMap: Record<string, Howl> = {}
let initPromise: Promise<void> | null = null
let engineStatus: AudioEngineStatus = 'idle'
const statusListeners = new Set<(s: AudioEngineStatus) => void>()

function notifyListeners(status: AudioEngineStatus) {
  engineStatus = status
  statusListeners.forEach((fn) => fn(status))
}

async function initEngine(): Promise<void> {
  if (engineStatus !== 'idle') return
  notifyListeners('loading')

  const results = await Promise.all(
    SOUNDS.map(
      (sound) =>
        new Promise<boolean>((resolve) => {
          const howl = new Howl({
            src: [getSoundStreamUrl(sound.freesoundId)],
            format: ['mp3'],
            loop: true,
            volume: 0,
            html5: true,
            onload: () => {
              howlMap[sound.id] = howl
              resolve(true)
            },
            onloaderror: () => resolve(false),
          })
        }),
    ),
  )

  const allLoaded = results.every(Boolean)
  notifyListeners(allLoaded ? 'ready' : 'error')
}

export function useAudioEngine() {
  const [status, setStatus] = useState<AudioEngineStatus>(engineStatus)

  useEffect(() => {
    statusListeners.add(setStatus)

    if (!initPromise) {
      initPromise = initEngine()
    }

    return () => { statusListeners.delete(setStatus) }
  }, [])

  function play(id: string, volume: number) {
    const howl = howlMap[id]
    if (!howl) return
    howl.volume(volume)
    if (!howl.playing()) howl.play()
  }

  function stop(id: string) {
    howlMap[id]?.stop()
  }

  function setVolume(id: string, volume: number) {
    howlMap[id]?.volume(volume)
  }

  return { status, play, stop, setVolume }
}
