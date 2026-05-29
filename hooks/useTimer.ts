'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { useTimerStore } from '@/store/timerStore'

let bellHowl: Howl | null = null

function getBell(): Howl {
  if (!bellHowl) {
    bellHowl = new Howl({ src: ['/audio/sfx/bell.mp3'], volume: 0.7 })
  }
  return bellHowl
}

export function useTimer() {
  const { isRunning, tick, cyclesCompleted, mode, ...rest } = useTimerStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevCycles = useRef(cyclesCompleted)

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearTick()
    }
    return clearTick
  }, [isRunning, tick, clearTick])

  useEffect(() => {
    if (cyclesCompleted > prevCycles.current) {
      getBell().play()
    }
    prevCycles.current = cyclesCompleted
  }, [cyclesCompleted])

  useEffect(() => {
    return () => { clearTick() }
  }, [clearTick])

  return { isRunning, cyclesCompleted, mode, ...rest }
}
