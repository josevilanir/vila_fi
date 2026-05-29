'use client'

import { useTimer } from '@/hooks/useTimer'
import { useTimerStore } from '@/store/timerStore'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import { TimerModeSelector } from './TimerModeSelector'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

const MODE_TOTAL: Record<string, (s: ReturnType<typeof useTimerStore.getState>) => number> = {
  focus:       (s) => s.focusDuration * 60,
  short_break: (s) => s.shortBreakDuration * 60,
  long_break:  (s) => s.longBreakDuration * 60,
}

export function PomodoroTimer({ className }: Props) {
  const { isRunning, secondsLeft, mode, cyclesCompleted, start, pause, reset, skip, setMode } = useTimer()
  const storeState = useTimerStore.getState()
  const totalSeconds = MODE_TOTAL[mode](storeState)

  const modeLabel: Record<string, string> = {
    focus:       'Foco',
    short_break: 'Pausa Curta',
    long_break:  'Pausa Longa',
  }

  return (
    <div className={cn('backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-4 w-56', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Pomodoro</span>
        <span className="text-xs text-white/40">{modeLabel[mode]}</span>
      </div>

      <TimerModeSelector mode={mode} onSelect={setMode} />

      <div className="flex justify-center my-4">
        <TimerDisplay secondsLeft={secondsLeft} totalSeconds={totalSeconds} mode={mode} />
      </div>

      <TimerControls
        isRunning={isRunning}
        cyclesCompleted={cyclesCompleted}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />
    </div>
  )
}
