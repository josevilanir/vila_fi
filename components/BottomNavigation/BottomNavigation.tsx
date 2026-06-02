'use client'

import { motion } from 'framer-motion'

export type MobileTab = 'radio' | 'timer'

interface Props {
  active: MobileTab
  onSelect: (tab: MobileTab) => void
}

const TABS: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'radio',
    label: 'Rádio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    id: 'timer',
    label: 'Pomodoro',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export function BottomNavigation({ active, onSelect }: Props) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 flex justify-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="w-full max-w-sm mx-4 mb-4 flex items-center justify-around rounded-2xl border border-white/10 bg-black/65 backdrop-blur-xl px-2 py-1.5 shadow-xl shadow-black/50">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`relative flex flex-col items-center gap-1 rounded-xl transition-colors min-w-[72px] min-h-[52px] justify-center ${
                isActive ? 'text-white' : 'text-white/35'
              }`}
              aria-pressed={isActive}
              aria-label={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-highlight"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10 text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
