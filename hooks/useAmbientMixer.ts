'use client'

import { useEffect } from 'react'
import { SOUNDS } from '@/data/sounds'
import { useAmbientStore } from '@/store/ambientStore'
import { useAudioEngine } from './useAudioEngine'

const freesoundIdMap = Object.fromEntries(SOUNDS.map((s) => [s.id, s.freesoundId]))

export function useAmbientMixer() {
  const { volumes, toggle, setVolume, isActive, activeIds } = useAmbientStore()
  const engine = useAudioEngine()

  // Sync Howler state whenever volumes map changes
  useEffect(() => {
    const active = new Set(Object.keys(volumes))

    active.forEach((id) => engine.play(id, freesoundIdMap[id], volumes[id]))

    // Stop any sound that was removed from the map
    // We rely on the fact that if id is not in volumes it should be silent
    // This runs on every volumes change so removed ids are caught immediately
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
