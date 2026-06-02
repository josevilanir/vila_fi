'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAmbientMixer } from '@/hooks/useAmbientMixer'
import { SOUNDS } from '@/data/sounds'

interface Props {
  soundId: string
  className?: string
}

export function SoundHotspot({ soundId, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const { isActive, toggle, setVolume, volumes } = useAmbientMixer()
  const containerRef = useRef<HTMLDivElement>(null)

  const sound = SOUNDS.find((s) => s.id === soundId)
  const active = isActive(soundId)
  const volume = volumes[soundId] ?? 0.7

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <div ref={containerRef} className={`absolute ${className}`}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`${sound?.label ?? soundId} — controle de som`}
        aria-expanded={open}
        className={`group relative w-9 h-9 rounded-full flex items-center justify-center
          transition-all duration-200 backdrop-blur-sm border
          ${
            active
              ? 'bg-white/20 border-white/40 text-white shadow-lg shadow-black/30'
              : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/15 hover:border-white/25 hover:text-white/70'
          }`}
      >
        <span className="text-base leading-none select-none">{sound?.icon}</span>

        {/* Active pulse indicator */}
        {active && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-11 left-1/2 -translate-x-1/2 z-50 w-56
              bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl shadow-black/50"
          >
            {/* Arrow */}
            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5
              bg-black/30 backdrop-blur-md border-t border-l border-white/20 rotate-45" />

            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white/80 tracking-wide">
                {sound?.label ?? soundId}
              </span>

              {/* Toggle button */}
              <button
                onClick={() => toggle(soundId)}
                aria-label={active ? 'Desativar som' : 'Ativar som'}
                className={`w-4 h-4 rounded-full transition-all duration-200 flex-shrink-0 border-2
                  ${active ? 'bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-transparent border-white/40 hover:border-white/70'}`}
              />
            </div>

            {/* Volume slider — only when active */}
            <AnimatePresence>
              {active && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 py-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    </svg>
                    <input
                      type="range"
                      min={0.05}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(soundId, parseFloat(e.target.value))}
                      className="w-full h-1 rounded-full accent-white cursor-pointer"
                      aria-label="Volume"
                    />
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 flex-shrink-0">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 010 7.07" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
