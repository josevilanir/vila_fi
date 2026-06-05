import { describe, it, expect, beforeEach } from 'vitest'
import { useTimerStore } from './timerStore'

const INITIAL = {
  mode: 'focus' as const,
  secondsLeft: 25 * 60,
  isRunning: false,
  cyclesCompleted: 0,
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
}

beforeEach(() => {
  useTimerStore.setState(INITIAL)
})

describe('timerStore', () => {
  describe('start / pause', () => {
    it('start sets isRunning to true', () => {
      useTimerStore.getState().start()
      expect(useTimerStore.getState().isRunning).toBe(true)
    })

    it('pause sets isRunning to false', () => {
      useTimerStore.setState({ isRunning: true })
      useTimerStore.getState().pause()
      expect(useTimerStore.getState().isRunning).toBe(false)
    })
  })

  describe('reset', () => {
    it('restores secondsLeft to the current mode duration', () => {
      useTimerStore.setState({ secondsLeft: 100, isRunning: true })
      useTimerStore.getState().reset()
      const s = useTimerStore.getState()
      expect(s.isRunning).toBe(false)
      expect(s.secondsLeft).toBe(25 * 60)
    })

    it('uses the correct duration when in short_break mode', () => {
      useTimerStore.setState({ mode: 'short_break', secondsLeft: 1 })
      useTimerStore.getState().reset()
      expect(useTimerStore.getState().secondsLeft).toBe(5 * 60)
    })
  })

  describe('skip', () => {
    it('transitions from focus to short_break after 1 cycle', () => {
      useTimerStore.getState().skip()
      const s = useTimerStore.getState()
      expect(s.mode).toBe('short_break')
      expect(s.cyclesCompleted).toBe(1)
      expect(s.isRunning).toBe(false)
    })

    it('transitions from short_break back to focus without incrementing cycles', () => {
      useTimerStore.setState({ mode: 'short_break', cyclesCompleted: 1 })
      useTimerStore.getState().skip()
      const s = useTimerStore.getState()
      expect(s.mode).toBe('focus')
      expect(s.cyclesCompleted).toBe(1)
    })

    it('transitions to long_break after every 4 completed focus cycles', () => {
      useTimerStore.setState({ cyclesCompleted: 3 })
      useTimerStore.getState().skip()
      expect(useTimerStore.getState().mode).toBe('long_break')
    })
  })

  describe('tick', () => {
    it('decrements secondsLeft by 1', () => {
      useTimerStore.getState().tick()
      expect(useTimerStore.getState().secondsLeft).toBe(25 * 60 - 1)
    })

    it('auto-advances mode when the clock reaches zero', () => {
      useTimerStore.setState({ secondsLeft: 1, isRunning: true })
      useTimerStore.getState().tick()
      const s = useTimerStore.getState()
      expect(s.isRunning).toBe(false)
      expect(s.mode).toBe('short_break')
      expect(s.cyclesCompleted).toBe(1)
    })
  })

  describe('setMode', () => {
    it('updates mode and resets secondsLeft accordingly', () => {
      useTimerStore.getState().setMode('long_break')
      const s = useTimerStore.getState()
      expect(s.mode).toBe('long_break')
      expect(s.secondsLeft).toBe(15 * 60)
      expect(s.isRunning).toBe(false)
    })
  })

  describe('setDurations', () => {
    it('updates durations and recalculates secondsLeft for current mode', () => {
      useTimerStore.getState().setDurations(30, 10, 20)
      const s = useTimerStore.getState()
      expect(s.focusDuration).toBe(30)
      expect(s.shortBreakDuration).toBe(10)
      expect(s.longBreakDuration).toBe(20)
      expect(s.secondsLeft).toBe(30 * 60)
    })
  })
})
