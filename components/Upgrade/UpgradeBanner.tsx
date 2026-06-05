'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

interface Props {
  onClose?: () => void
}

export function UpgradeBanner({ onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? ''

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/v1/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error.message)
      window.location.href = json.data.checkoutUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao iniciar checkout')
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/15 border border-violet-400/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white/90 mb-1">✨ Vila Fi Premium</p>
          <p className="text-xs text-white/50 mb-3 leading-relaxed">
            Presets ilimitados, cenas exclusivas, upload de background personalizado e widgets extras.
          </p>
          <ul className="flex flex-col gap-1 mb-4">
            {['Presets ilimitados', 'Cenas exclusivas', 'Background personalizado', 'Widgets extras'].map((f) => (
              <li key={f} className="text-xs text-white/60 flex items-center gap-1.5">
                <span className="text-violet-400">✓</span> {f}
              </li>
            ))}
          </ul>
          {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
          <button
            onClick={handleUpgrade}
            disabled={loading || !user}
            className="w-full rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 transition-colors"
          >
            {loading ? 'Redirecionando…' : 'Assinar Premium — R$19/mês'}
          </button>
          {!user && (
            <p className="text-xs text-white/40 mt-2 text-center">Faça login para assinar</p>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
