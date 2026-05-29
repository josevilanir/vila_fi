import { create } from 'zustand'

export type TimerMode = 'focus' | 'short_break' | 'long_break'

interface TimerState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  cyclesCompleted: number
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  setMode: (mode: TimerMode) => void
  setDurations: (focus: number, short: number, long: number) => void
  tick: () => void
}

function durationFor(mode: TimerMode, state: Pick<TimerState, 'focusDuration' | 'shortBreakDuration' | 'longBreakDuration'>): number {
  if (mode === 'focus') return state.focusDuration * 60
  if (mode === 'short_break') return state.shortBreakDuration * 60
  return state.longBreakDuration * 60
}

function nextMode(current: TimerMode, cycles: number): TimerMode {
  if (current !== 'focus') return 'focus'
  return (cycles + 1) % 4 === 0 ? 'long_break' : 'short_break'
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  secondsLeft: 25 * 60,
  isRunning: false,
  cyclesCompleted: 0,
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),

  reset: () => {
    const s = get()
    set({ isRunning: false, secondsLeft: durationFor(s.mode, s) })
  },

  skip: () => {
    const s = get()
    const cycles = s.mode === 'focus' ? s.cyclesCompleted + 1 : s.cyclesCompleted
    const mode = nextMode(s.mode, s.cyclesCompleted)
    set({
      mode,
      isRunning: false,
      cyclesCompleted: cycles,
      secondsLeft: durationFor(mode, s),
    })
  },

  setMode: (mode) => {
    const s = get()
    set({ mode, isRunning: false, secondsLeft: durationFor(mode, s) })
  },

  setDurations: (focus, short, long) => {
    const s = get()
    set({
      focusDuration: focus,
      shortBreakDuration: short,
      longBreakDuration: long,
      secondsLeft: durationFor(s.mode, { focusDuration: focus, shortBreakDuration: short, longBreakDuration: long }),
    })
  },

  tick: () => {
    const s = get()
    if (s.secondsLeft <= 1) {
      const cycles = s.mode === 'focus' ? s.cyclesCompleted + 1 : s.cyclesCompleted
      const mode = nextMode(s.mode, s.cyclesCompleted)
      set({
        isRunning: false,
        cyclesCompleted: cycles,
        mode,
        secondsLeft: durationFor(mode, s),
      })
      return
    }
    set({ secondsLeft: s.secondsLeft - 1 })
  },
}))
