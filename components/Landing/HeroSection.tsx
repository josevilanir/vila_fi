'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const titleWords = ['Seu', 'ambiente', 'de', 'foco', 'ideal.']

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-20 overflow-hidden">
      {/* Atmospheric warm glow — bottom left, not centered */}
      <div className="absolute bottom-0 left-0 w-[560px] h-[560px] rounded-full bg-[#c9a96e]/6 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[320px] h-[320px] rounded-full bg-[#c9a96e]/4 blur-[100px] pointer-events-none" />

      {/* Thin horizontal rule — editorial detail */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f0eadd]/8 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">

        {/* Left — headline + CTA */}
        <div className="max-w-2xl">
          <motion.p
            className="text-xs font-medium tracking-[0.2em] uppercase text-[#c9a96e] mb-8"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Web Environment Hub
          </motion.p>

          <h1 className="font-display text-[clamp(2.5rem,9vw,7rem)] font-bold leading-[0.95] tracking-tight text-[#f0eadd] mb-8">
            {titleWords.map((word, wi) => (
              <motion.span
                key={wi}
                className="inline-block mr-[0.2em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + wi * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {word === 'ideal.' ? <span className="text-[#c9a96e]">{word}</span> : word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-base text-[#f0eadd]/40 leading-relaxed max-w-lg mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            Combine rádio lo-fi, sons ambientes e vídeos reativos para criar
            o ambiente perfeito de estudo e trabalho. Completamente gratuito.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.78 }}
          >
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#c9a96e] hover:bg-[#d4b47a] text-[#0d0c0b] font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-[#c9a96e]/15"
            >
              Começar Grátis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a
              href="#features"
              className="text-sm text-[#f0eadd]/40 hover:text-[#f0eadd]/70 transition-colors duration-200 flex items-center gap-1.5"
            >
              Ver funcionalidades
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Right — floating preview card, slightly rotated */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative w-72">
            {/* Outer card */}
            <div className="rounded-2xl border border-[#f0eadd]/8 bg-[#f0eadd]/[0.03] backdrop-blur-sm p-5 shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-sm font-bold text-[#f0eadd]/70">Vila Fi</span>
                <span className="text-[10px] text-[#c9a96e] bg-[#c9a96e]/10 border border-[#c9a96e]/20 rounded-full px-2.5 py-1">● ao vivo</span>
              </div>

              {/* Simulated sound bars */}
              <div className="space-y-2.5 mb-4">
                {[
                  { label: 'Chuva', val: 72 },
                  { label: 'Café', val: 45 },
                  { label: 'Lareira', val: 30 },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-[#f0eadd]/30 w-14 shrink-0">{label}</span>
                    <div className="flex-1 h-1 rounded-full bg-[#f0eadd]/5">
                      <motion.div
                        className="h-full rounded-full bg-[#c9a96e]/60"
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 1, delay: 0.8 + Math.random() * 0.3, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs text-[#f0eadd]/20 w-6 text-right">{val}%</span>
                  </div>
                ))}
              </div>

              {/* Station pill */}
              <div className="flex items-center gap-2 bg-[#f0eadd]/[0.04] border border-[#f0eadd]/[0.07] rounded-lg px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
                <span className="text-xs text-[#f0eadd]/50">Lofi Hip Hop Radio</span>
              </div>
            </div>

            {/* Pomodoro badge — offset, overlapping */}
            <motion.div
              className="absolute -bottom-4 -left-5 bg-[#1a1714] border border-[#f0eadd]/10 rounded-xl px-3.5 py-2.5 shadow-lg"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-[#c9a96e]/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a96e]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#f0eadd]/30 leading-none">Pomodoro</p>
                  <p className="text-xs font-medium text-[#f0eadd]/70 font-display">24:13</p>
                </div>
              </div>
            </motion.div>

            {/* Ambient glow below card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-[#c9a96e]/10 blur-2xl" />
          </div>
        </motion.div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f0eadd]/5 to-transparent" />
    </section>
  )
}
