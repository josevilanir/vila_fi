'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const freeFeatures = [
  'Todos os sons e rádios',
  'Vídeos reativos',
  'Timer Pomodoro',
  'Compartilhar via URL',
  'Até 2 presets salvos',
]

const premiumFeatures = [
  'Tudo do plano Grátis',
  'Presets ilimitados',
  'Cenas exclusivas',
  'Prioridade em novidades',
]

function Check({ gold }: { gold?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={gold ? '#c9a96e' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function PlansSection() {
  const [annual, setAnnual] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="planos" className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a96e]/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">Planos</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0eadd] leading-tight">
              Simples e<br />transparente
            </h2>

            {/* Toggle */}
            <div className="flex items-center gap-1 bg-[#f0eadd]/[0.04] border border-[#f0eadd]/[0.08] rounded-lg p-1 self-start sm:self-auto">
              <button
                onClick={() => setAnnual(false)}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                  !annual
                    ? 'bg-[#f0eadd]/10 text-[#f0eadd]/80'
                    : 'text-[#f0eadd]/30 hover:text-[#f0eadd]/50'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  annual
                    ? 'bg-[#f0eadd]/10 text-[#f0eadd]/80'
                    : 'text-[#f0eadd]/30 hover:text-[#f0eadd]/50'
                }`}
              >
                Anual
                <span className="text-[10px] font-semibold text-[#c9a96e] bg-[#c9a96e]/10 rounded px-1.5 py-0.5">−35%</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free */}
          <motion.div
            className="p-8 rounded-2xl border border-[#f0eadd]/[0.07] bg-[#f0eadd]/[0.02]"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs tracking-[0.15em] uppercase text-[#f0eadd]/30 mb-4">Grátis</p>
            <div className="flex items-end gap-2 mb-8">
              <span className="font-display text-5xl font-bold text-[#f0eadd]/80">R$0</span>
              <span className="text-[#f0eadd]/20 text-sm mb-1.5">/ sempre</span>
            </div>

            <Link
              href="/app"
              className="block w-full text-center py-3 rounded-lg border border-[#f0eadd]/10 text-[#f0eadd]/50 hover:text-[#f0eadd]/80 hover:border-[#f0eadd]/20 text-sm font-medium transition-all duration-200 mb-8"
            >
              Começar Grátis
            </Link>

            <ul className="space-y-3.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#f0eadd]/40">
                  <span className="text-[#f0eadd]/20 shrink-0"><Check /></span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium */}
          <motion.div
            className="relative p-8 rounded-2xl border border-[#c9a96e]/25 bg-[#c9a96e]/[0.04] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Corner label */}
            <div className="absolute top-5 right-5 text-[10px] tracking-widest uppercase text-[#c9a96e] font-medium">
              Popular
            </div>

            <div className="absolute top-0 right-0 w-56 h-56 bg-[#c9a96e]/[0.06] rounded-full blur-3xl pointer-events-none" />

            <p className="text-xs tracking-[0.15em] uppercase text-[#c9a96e]/80 mb-4 relative z-10">Premium</p>
            <div className="flex items-end gap-2 mb-1 relative z-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={annual ? 'a' : 'm'}
                  className="font-display text-5xl font-bold text-[#f0eadd]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {annual ? 'R$12' : 'R$19'}
                </motion.span>
              </AnimatePresence>
              <span className="text-[#f0eadd]/30 text-sm mb-1.5">/ mês</span>
            </div>
            {annual && (
              <p className="text-xs text-[#c9a96e]/70 mb-8 relative z-10">Cobrado R$149/ano — 2 meses grátis</p>
            )}
            {!annual && <div className="mb-8" />}

            <Link
              href="/app"
              className="relative z-10 block w-full text-center py-3 rounded-lg bg-[#c9a96e] hover:bg-[#d4b47a] text-[#0d0c0b] text-sm font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-[#c9a96e]/15 mb-8"
            >
              Assinar Premium
            </Link>

            <ul className="space-y-3.5 relative z-10">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#f0eadd]/60">
                  <span className="shrink-0"><Check gold /></span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
