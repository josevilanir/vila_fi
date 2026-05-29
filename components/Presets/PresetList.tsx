'use client'

import { useState } from 'react'
import { FrontendPreset } from '@/lib/types'
import { PresetCard } from './PresetCard'

interface Props {
  presets: FrontendPreset[]
  isLoading: boolean
  onLoad: (preset: FrontendPreset) => void
  onDelete: (id: string) => Promise<void>
}

export function PresetList({ presets, isLoading, onLoad, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-[60px] rounded-xl bg-white/5 border border-white/8 animate-pulse" />
        ))}
      </div>
    )
  }

  if (presets.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-white/30">Nenhum preset salvo ainda.</p>
        <p className="text-xs text-white/20 mt-1">Monte seu ambiente e salve!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          onLoad={onLoad}
          onDelete={handleDelete}
          isDeleting={deletingId === preset.id}
        />
      ))}
    </div>
  )
}
