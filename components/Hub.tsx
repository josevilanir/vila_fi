'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VideoBackground } from '@/components/VideoBackground/VideoBackground'
import { RadioPlayer } from '@/components/RadioPlayer/RadioPlayer'
import { AmbientMixer } from '@/components/AmbientMixer/AmbientMixer'
import { PomodoroTimer } from '@/components/PomodoroTimer/PomodoroTimer'
import { ShareButton } from '@/components/ShareButton/ShareButton'
import { AuthModal } from '@/components/Auth/AuthModal'
import { UserMenu } from '@/components/Auth/UserMenu'
import { PresetsPanel } from '@/components/Presets/PresetsPanel'
import { BackgroundUploader } from '@/components/CustomBackground/BackgroundUploader'
import { useEnvironmentSync } from '@/hooks/useEnvironmentSync'
import { useAuth } from '@/hooks/useAuth'

export default function Hub() {
  const [timerVisible, setTimerVisible] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [bgOpen, setBgOpen] = useState(false)
  const { user, restoreSession } = useAuth()

  useEnvironmentSync()

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <main className="relative w-full h-screen flex flex-col">
      <VideoBackground />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <motion.header
        className="relative z-10 px-8 pt-6 flex items-start justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Vila Fi</h1>
          <p className="text-sm text-white/40">Seu ambiente de foco</p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <ShareButton />

          {user ? (
            <>
              <button
                onClick={() => setPresetsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors backdrop-blur-sm bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                <span>Presets</span>
              </button>
              <button
                onClick={() => setBgOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors backdrop-blur-sm bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Background</span>
              </button>
              <UserMenu onPresetsClick={() => setPresetsOpen(true)} />
            </>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors backdrop-blur-sm bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span>Entrar</span>
            </button>
          )}

          <button
            onClick={() => setTimerVisible((v) => !v)}
            title={timerVisible ? 'Ocultar timer' : 'Mostrar timer Pomodoro'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors backdrop-blur-sm ${
              timerVisible
                ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/40'
                : 'bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Pomodoro</span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {timerVisible && (
          <motion.div
            className="absolute top-20 right-8 z-20 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <PomodoroTimer />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex items-end justify-between px-8 pb-8 gap-6 pointer-events-none">
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5 }}
        >
          <RadioPlayer />
        </motion.div>

        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <AmbientMixer />
        </motion.div>
      </div>

      <AnimatePresence>
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {presetsOpen && <PresetsPanel onClose={() => setPresetsOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {bgOpen && <BackgroundUploader onClose={() => setBgOpen(false)} />}
      </AnimatePresence>
    </main>
  )
}
