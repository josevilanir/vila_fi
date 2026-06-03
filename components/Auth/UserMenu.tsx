'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { isPremium } from '@/lib/planFeatures'

interface Props {
  onPresetsClick: () => void
}

export function UserMenu({ onPresetsClick }: Props) {
  const { user, subscription, token, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const premium = isPremium(subscription)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleCheckout() {
    if (!token) return
    setCheckoutLoading(true)
    setOpen(false)
    try {
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? ''
      const res = await fetch('/api/v1/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priceId }),
      })
      const json = await res.json()
      if (json.data?.checkoutUrl) window.location.href = json.data.checkoutUrl
    } finally {
      setCheckoutLoading(false)
    }
  }

  async function handlePortal() {
    if (!token) return
    setPortalLoading(true)
    try {
      const res = await fetch('/api/v1/stripe/portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (json.data?.portalUrl) window.location.href = json.data.portalUrl
    } finally {
      setPortalLoading(false)
      setOpen(false)
    }
  }

  if (!user) return null

  const initial = (user.name ?? user.email)[0].toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
      >
        <span className="w-5 h-5 rounded-full bg-indigo-500/60 flex items-center justify-center text-[10px] font-bold text-white">
          {initial}
        </span>
        <span className="hidden sm:inline text-xs text-white/70 max-w-[80px] truncate">{user.name ?? user.email}</span>
        {premium && (
          <span className="text-[9px] font-semibold bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded-full border border-violet-400/30">
            PRO
          </span>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-52 rounded-xl bg-black/80 border border-white/10 backdrop-blur-xl py-1 shadow-xl"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <button
              onClick={() => { onPresetsClick(); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Meus Presets
            </button>

            {premium ? (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="w-full text-left px-4 py-2.5 text-sm text-violet-300/80 hover:text-violet-200 hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                {portalLoading ? 'Abrindo…' : 'Gerenciar assinatura'}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full text-left px-4 py-2.5 text-sm text-violet-300/80 hover:text-violet-200 hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {checkoutLoading ? 'Redirecionando…' : '✨ Assinar Premium'}
              </button>
            )}

            <div className="border-t border-white/5 my-1" />
            <button
              onClick={() => { logout(); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
