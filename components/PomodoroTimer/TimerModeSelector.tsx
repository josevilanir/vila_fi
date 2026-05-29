'use client'

import { TimerMode } from '@/store/timerStore'

const MODES: { value: TimerMode; label: string }[] = [
  { value: 'focus',       label: 'Foco' },
  { value: 'short_break', label: 'Pausa Curta' },
  { value: 'long_break',  label: 'Pausa Longa' },
]

interface Props {
  mode: TimerMode
  onSelect: (mode: TimerMode) => void
}

export function TimerModeSelector({ mode, onSelect }: Props) {
  return (
    <div className="flex rounded-lg bg-white/5 p-0.5 gap-0.5">
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`flex-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            mode === value
              ? 'bg-white/15 text-white'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
