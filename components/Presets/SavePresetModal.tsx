'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePresets } from '@/hooks/usePresets'
import { useAmbientStore } from '@/store/ambientStore'
import { useRadioStore } from '@/store/radioStore'
import { SOUNDS } from '@/data/sounds'
import { RADIO_STATIONS } from '@/data/radios'
import { Button } from '@/components/ui/Button'

const FREE_LIMIT = 2

interface Props {
  onClose: () => void
  presetCount: number
}

export function SavePresetModal({ onClose, presetCount }: Props) {
  const { savePreset } = usePresets()
  const volumes = useAmbientStore((s) => s.volumes)
  const stationId = useRadioStore((s) => s.stationId)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeSounds = Object.keys(volumes)
  const station = RADIO_STATIONS.find((r) => r.id === stationId)
  const atLimit = presetCount >= FREE_LIMIT

  async function handleSave() {
    if (!name.trim()) { setError('Dê um nome ao preset'); return }
    setSaving(true)
    setError(null)
    try {
      await savePreset(name.trim())
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-black/70 border border-white/10 p-6 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-base font-semibold text-white/90 mb-1">Salvar ambiente</h2>
        <p className="text-xs text-white/40 mb-5">Capture o ambiente atual como preset</p>

        <div className="rounded-xl bg-white/5 border border-white/8 p-3 mb-4">
          <p className="text-xs text-white/40 mb-2">Ambiente atual</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {activeSounds.length === 0 ? (
              <span className="text-xs text-white/20">Nenhum som ativo</span>
            ) : (
              activeSounds.map((id) => {
                const sound = SOUNDS.find((s) => s.id === id)
                return sound ? (
                  <span key={id} className="text-xs bg-white/10 rounded-md px-2 py-0.5 text-white/60">
                    {sound.icon} {sound.label}
                  </span>
                ) : null
              })
            )}
          </div>
          {station && <p className="text-xs text-white/40">📻 {station.label}</p>}
        </div>

        {atLimit && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 p-3 mb-4">
            <p className="text-xs text-amber-300/80">
              Você atingiu o limite de {FREE_LIMIT} presets do plano gratuito. Em breve: plano Premium com presets ilimitados!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs text-white/50">Nome do preset</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Foco noturno"
            maxLength={50}
            disabled={atLimit}
            className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 focus:bg-white/15 transition-colors disabled:opacity-40"
          />
        </div>
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <Button
          onClick={handleSave}
          disabled={saving || atLimit}
          className="w-full justify-center py-2"
        >
          {saving ? 'Salvando…' : 'Salvar preset'}
        </Button>
      </motion.div>
    </div>
  )
}
