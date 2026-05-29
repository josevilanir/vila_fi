'use client'

import { useEffect } from 'react'
import { useAmbientStore } from '@/store/ambientStore'
import { useRadioStore } from '@/store/radioStore'
import { deserializeEnvironment } from '@/lib/shareUrl'

export function useEnvironmentSync() {
  const setVolume = useAmbientStore((s) => s.setVolume)
  const setStation = useRadioStore((s) => s.setStation)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('sounds') && !params.has('radio')) return

    const { volumes, stationId } = deserializeEnvironment(params)

    for (const [id, volume] of Object.entries(volumes)) {
      setVolume(id, volume)
    }

    if (stationId) {
      setStation(stationId)
    }
    // Deliberately not auto-playing to respect browser autoplay policy
  }, [setVolume, setStation])
}
