'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { TimerMode } from '@/store/timerStore'

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const RING_COLOR: Record<TimerMode, string> = {
  focus: '#818cf8',
  short_break: '#34d399',
  long_break: '#60a5fa',
}

interface Props {
  secondsLeft: number
  totalSeconds: number
  mode: TimerMode
}

export function TimerDisplay({ secondsLeft, totalSeconds, mode }: Props) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1
  const offset = CIRCUMFERENCE * (1 - progress)

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="absolute inset-0" width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle
          cx="64" cy="64" r={RADIUS}
          fill="none"
          stroke={RING_COLOR[mode]}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }}
        />
      </svg>
      <AnimatePresence mode="wait">
        <motion.span
          key={mode}
          className="relative z-10 text-2xl font-mono font-bold text-white tabular-nums"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.25 }}
        >
          {mm}:{ss}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
