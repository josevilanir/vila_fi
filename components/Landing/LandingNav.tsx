'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0d0c0b]/90 backdrop-blur-md border-b border-[#f0eadd]/5'
          : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-[#f0eadd] tracking-tight">
          Vila Fi
        </Link>

        <div className="hidden sm:flex items-center gap-8 text-sm text-[#f0eadd]/40">
          <a href="#features" className="hover:text-[#f0eadd]/80 transition-colors duration-200">Funcionalidades</a>
          <a href="#planos" className="hover:text-[#f0eadd]/80 transition-colors duration-200">Planos</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden sm:block text-sm text-[#f0eadd]/40 hover:text-[#f0eadd]/70 transition-colors duration-200"
          >
            Entrar
          </Link>
          <Link
            href="/app"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-[#c9a96e] hover:bg-[#d4b47a] text-[#0d0c0b] transition-colors duration-200"
          >
            Abrir App
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
