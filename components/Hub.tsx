'use client'

import { motion } from 'framer-motion'
import { VideoBackground } from '@/components/VideoBackground/VideoBackground'
import { RadioPlayer } from '@/components/RadioPlayer/RadioPlayer'
import { AmbientMixer } from '@/components/AmbientMixer/AmbientMixer'

export default function Hub() {
  return (
    <main className="relative w-full h-screen flex flex-col">
      <VideoBackground />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <motion.header
        className="relative z-10 px-8 pt-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Vila Fi</h1>
        <p className="text-sm text-white/40">Seu ambiente de foco</p>
      </motion.header>

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
    </main>
  )
}
