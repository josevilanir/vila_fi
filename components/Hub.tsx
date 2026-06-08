'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VideoBackground } from '@/components/VideoBackground/VideoBackground'
import { RadioPlayer } from '@/components/RadioPlayer/RadioPlayer'
import { PomodoroTimer } from '@/components/PomodoroTimer/PomodoroTimer'
import { SoundHotspot } from '@/components/Hotspots/SoundHotspot'
import { NavigationHotspot } from '@/components/Hotspots/NavigationHotspot'
import { ShareButton } from '@/components/ShareButton/ShareButton'
import { AuthModal } from '@/components/Auth/AuthModal'
import { UserMenu } from '@/components/Auth/UserMenu'
import { PresetsPanel } from '@/components/Presets/PresetsPanel'
import { BottomNavigation, type MobileTab } from '@/components/BottomNavigation/BottomNavigation'
import { ThemeSwitch } from '@/components/ThemeSwitch/ThemeSwitch'
import { useEnvironmentSync } from '@/hooks/useEnvironmentSync'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSceneStore } from '@/store/sceneStore'

export default function Hub() {
  const [timerVisible, setTimerVisible] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<MobileTab>('radio')
  const { user, restoreSession } = useAuth()
  const isMobile = useIsMobile()
  const { currentScene, setScene } = useSceneStore()

  useEnvironmentSync()

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <main className="relative w-full h-screen flex flex-col">
      <VideoBackground />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Header */}
      <motion.header
        className="relative z-10 px-4 sm:px-8 pt-4 sm:pt-6 flex items-start justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90">Vila Fi</h1>
            <p className="hidden sm:block text-sm text-white/40">Seu ambiente de foco</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="scale-75 sm:scale-100 origin-center">
              <ThemeSwitch />
            </div>
          <ShareButton />

          {user ? (
            <>
              <button
                onClick={() => setPresetsOpen(true)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors backdrop-blur-sm bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white min-h-[36px]"
                aria-label="Meus presets"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                <span className="hidden sm:inline">Presets</span>
              </button>
              <UserMenu onPresetsClick={() => setPresetsOpen(true)} />
            </>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors backdrop-blur-sm bg-white/10 border-white/10 text-white/70 hover:bg-white/20 hover:text-white min-h-[36px]"
              aria-label="Entrar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}

          {/* Pomodoro button — desktop only (mobile uses bottom nav) */}
          {!isMobile && (
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
          )}
        </div>
      </motion.header>

      {/* Desktop: Timer floating top-right */}
      {!isMobile && (
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
      )}

      {/* Hotspots overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {currentScene === 'town' && (
          <>
            <SoundHotspot soundId="rain" className="top-[15%] left-[62%] pointer-events-auto" />
            <NavigationHotspot
              targetScene="fireplace"
              icon="🏠"
              label="Entrar na lareira"
              className="bottom-[52%] left-[35%] pointer-events-auto"
            />
          </>
        )}
        {currentScene === 'fireplace' && (
          <>
            {/* Botão de voltar posicionado na "janela" ou porta da cena (ajuste o top/left/right conforme o vídeo) */}
            <NavigationHotspot
              targetScene="town"
              icon="🚪"
              label="Sair para a rua"
              className="top-[35%] right-[20%] pointer-events-auto"
            />
            <SoundHotspot soundId="fireplace" className="bottom-[30%] left-1/2 -translate-x-1/2 pointer-events-auto" />
          </>
        )}
      </div>

      {/* Desktop: Panels at bottom corners */}
      {!isMobile && (
        <div className="relative z-10 flex-1 flex items-end justify-between px-8 pb-8 gap-6 pointer-events-none">
          <motion.div
            className="pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
          >
            <RadioPlayer />
          </motion.div>
        </div>
      )}

      {/* Mobile: Tab panels above bottom nav */}
      {isMobile && (
        <>
          {/*
            All three panels are always mounted so the YouTube radio iframe
            stays alive when switching tabs. Only the active tab is visible.
          */}
          <div className="relative z-10 flex-1 flex items-end justify-center px-4 pointer-events-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }}>
            <motion.div
              className="pointer-events-auto w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={activeTab === 'radio' ? '' : 'hidden'}>
                <RadioPlayer />
              </div>
              <div className={activeTab === 'timer' ? '' : 'hidden'}>
                <PomodoroTimer className="w-full" />
              </div>
            </motion.div>
          </div>

          <BottomNavigation active={activeTab} onSelect={setActiveTab} />
        </>
      )}

      <AnimatePresence>
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {presetsOpen && <PresetsPanel onClose={() => setPresetsOpen(false)} />}
      </AnimatePresence>
    </main>
  )
}
