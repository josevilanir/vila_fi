'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    label: '01',
    title: 'Rádio Lo-Fi',
    description: '7 estações curadas — do clássico lo-fi a jazz suave e synthwave. Sem anúncios, sem interrupções.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" />
      </svg>
    ),
    label: '02',
    title: 'Sons Ambientes',
    description: '10 sons atmosféricos — chuva, café, floresta, fogueira. Volume individual para cada um.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    label: '03',
    title: 'Vídeos Reativos',
    description: 'O fundo muda com seus sons. Floresta com pássaros, praia ao entardecer, café com chuva.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: '04',
    title: 'Timer Pomodoro',
    description: 'Blocos de 25 min com pausas automáticas. Sino sonoro ao final de cada ciclo de foco.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
    label: '05',
    title: 'Presets Salvos',
    description: 'Salve seus ambientes com nome e carregue com um clique. Acessível de qualquer dispositivo.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    label: '06',
    title: 'Compartilhar',
    description: 'Copie o link do seu ambiente e envie para amigos. Eles entram exatamente no mesmo estado.',
  },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section header — left-aligned, editorial */}
        <motion.div
          ref={ref}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#f0eadd]/6"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] mb-3">Funcionalidades</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#f0eadd] leading-tight">
              Tudo que você precisa<br />para entrar no fluxo
            </h2>
          </div>
          <p className="text-sm text-[#f0eadd]/35 max-w-xs leading-relaxed sm:text-right">
            Sem cadastro obrigatório. Sem anúncios.<br />Apenas foco.
          </p>
        </motion.div>

        {/* Feature list — border-separated rows, not cards */}
        <div>
          {features.map((f, i) => (
            <FeatureRow key={f.label} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className="group flex items-start gap-6 py-7 border-b border-[#f0eadd]/[0.06] hover:border-[#f0eadd]/[0.12] transition-colors duration-300 cursor-default"
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      {/* Number */}
      <span className="text-xs text-[#f0eadd]/15 font-display w-6 pt-0.5 shrink-0 group-hover:text-[#c9a96e]/40 transition-colors duration-300">
        {feature.label}
      </span>

      {/* Icon */}
      <div className="w-8 h-8 rounded-lg bg-[#f0eadd]/[0.04] border border-[#f0eadd]/[0.07] flex items-center justify-center text-[#c9a96e]/60 shrink-0 group-hover:bg-[#c9a96e]/8 group-hover:text-[#c9a96e] transition-all duration-300">
        {feature.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 sm:flex sm:items-baseline sm:gap-8">
        <h3 className="text-base font-semibold text-[#f0eadd]/80 group-hover:text-[#f0eadd] transition-colors duration-200 sm:w-36 shrink-0">
          {feature.title}
        </h3>
        <p className="mt-1 sm:mt-0 text-sm text-[#f0eadd]/35 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}
