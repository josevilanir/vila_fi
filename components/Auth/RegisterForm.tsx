'use client'

import { useState } from 'react'
import { z } from 'zod'
import { RegisterSchema } from '@/lib/schemas/auth'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

const ClientRegisterSchema = RegisterSchema.extend({
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
})

interface Props {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: Props) {
  const { register, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const result = ClientRegisterSchema.safeParse({ name: name || undefined, email, password, confirmPassword })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Dados inválidos')
      return
    }
    try {
      await register(email, password, name || undefined)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    }
  }

  const inputClass = 'w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/15 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">Nome (opcional)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/50">Confirmar senha</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full justify-center py-2">
        {isLoading ? 'Criando conta…' : 'Criar conta'}
      </Button>
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-xs text-white/40 hover:text-white/70 transition-colors text-center"
      >
        Já tem conta? <span className="text-white/60">Entrar</span>
      </button>
    </form>
  )
}
