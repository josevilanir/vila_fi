'use client'

import { useEffect, useRef } from 'react'
import { SOUNDS } from '@/data/sounds'
import { useAmbientStore } from '@/store/ambientStore'
import { useAudioEngine } from './useAudioEngine'

const freesoundIdMap = Object.fromEntries(SOUNDS.map((s) => [s.id, s.freesoundId]))

export function useAmbientMixer() {
  const { volumes, toggle, setVolume, isActive, activeIds } = useAmbientStore()
  const engine = useAudioEngine()
  const prevVolumesRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const prev = prevVolumesRef.current

    // Stop sounds that were removed from the map (e.g. via loadPreset)
    for (const id of Object.keys(prev)) {
      if (!(id in volumes)) engine.stop(id)
    }

    // Play or update volume for all currently active sounds
    for (const [id, volume] of Object.entries(volumes)) {
      engine.play(id, freesoundIdMap[id], volume)
    }

    prevVolumesRef.current = volumes
  }, [volumes]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleToggle(id: string) {
    if (isActive(id)) engine.stop(id)
    toggle(id)
  }

  function handleVolume(id: string, volume: number) {
    setVolume(id, volume)
    engine.setVolume(id, volume)
  }

  return { volumes, isActive, activeIds, toggle: handleToggle, setVolume: handleVolume, audioStatus: engine.status }
}
