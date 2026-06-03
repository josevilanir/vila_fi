'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAmbientStore } from '@/store/ambientStore'
import { useRadioStore } from '@/store/radioStore'
import { serializeEnvironment } from '@/lib/shareUrl'

export function ShareButton() {
  const [copied, setCopied] = useState(false)
  const volumes = useAmbientStore((s) => s.volumes)
  const { stationId, isPlaying } = useRadioStore()

  async function handleShare() {
    const query = serializeEnvironment(volumes, stationId, isPlaying)
    const url = `${window.location.origin}${window.location.pathname}?${query}`

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      title="Copiar link do ambiente"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors backdrop-blur-sm"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-emerald-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key="share"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
      <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Compartilhar'}</span>
    </button>
  )
}
