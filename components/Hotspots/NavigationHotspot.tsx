'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSceneStore } from '@/store/sceneStore'

interface Props {
  targetScene: 'town' | 'fireplace'
  icon: string
  label: string
  className?: string
}

export function NavigationHotspot({ targetScene, icon, label, className = '' }: Props) {
  const [hovered, setHovered] = useState(false)
  const setScene = useSceneStore((s) => s.setScene)

  return (
    <div
      className={`absolute ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => setScene(targetScene)}
        aria-label={label}
        className="group relative w-9 h-9 rounded-full flex items-center justify-center
          transition-all duration-200 backdrop-blur-sm border
          bg-white/5 border-white/10 text-white/50
          hover:bg-white/20 hover:border-white/35 hover:text-white/90"
      >
        <span className="text-base leading-none select-none">{icon}</span>

        {/* Subtle pulse to hint interactivity */}
        <motion.span
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-11 left-1/2 -translate-x-1/2 z-50
              whitespace-nowrap px-2.5 py-1 rounded-lg text-xs text-white/80
              bg-black/40 backdrop-blur-md border border-white/15 shadow-lg pointer-events-none"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
