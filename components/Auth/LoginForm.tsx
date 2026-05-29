'use client'

import { useState } from 'react'
import { z } from 'zod'
import { LoginSchema } from '@/lib/schemas/auth'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

interface Props {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister }: Props) {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const result = LoginSchema.safeParse({ email, password })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }
    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/15 transition-colors"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/15 transition-colors"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full justify-center py-2">
        {isLoading ? 'Entrando…' : 'Entrar'}
      </Button>
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-xs text-white/40 hover:text-white/70 transition-colors text-center"
      >
        Não tem conta? <span className="text-white/60">Criar conta</span>
      </button>
    </form>
  )
}
