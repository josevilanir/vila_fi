'use client'

import { FrontendPreset } from '@/lib/types'
import { SOUNDS } from '@/data/sounds'

interface Props {
  preset: FrontendPreset
  onLoad: (preset: FrontendPreset) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function PresetCard({ preset, onLoad, onDelete, isDeleting }: Props) {
  const activeIcons = Object.keys(preset.sounds)
    .map((id) => SOUNDS.find((s) => s.id === id)?.icon)
    .filter(Boolean)
    .slice(0, 5)

  const date = new Date(preset.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })

  return (
    <div className="group flex items-center justify-between rounded-xl bg-white/5 border border-white/8 px-4 py-3 hover:bg-white/10 transition-colors">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-white/80 truncate">{preset.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">{date}</span>
          {activeIcons.length > 0 && (
            <span className="text-xs tracking-wide">{activeIcons.join(' ')}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 ml-3 shrink-0">
        <button
          onClick={() => onLoad(preset)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 hover:bg-indigo-500/30 transition-colors"
        >
          Carregar
        </button>
        <button
          onClick={() => onDelete(preset.id)}
          disabled={isDeleting}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors disabled:opacity-40"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
