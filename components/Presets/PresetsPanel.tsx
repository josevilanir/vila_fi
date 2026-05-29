'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePresets } from '@/hooks/usePresets'
import { PresetList } from './PresetList'
import { SavePresetModal } from './SavePresetModal'
import { FrontendPreset } from '@/lib/types'

interface Props {
  onClose: () => void
}

export function PresetsPanel({ onClose }: Props) {
  const { presets, isLoading, fetchPresets, loadPreset, deletePreset } = usePresets()
  const [showSave, setShowSave] = useState(false)

  useEffect(() => {
    fetchPresets()
  }, [fetchPresets])

  function handleLoad(preset: FrontendPreset) {
    loadPreset(preset)
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-start justify-end bg-black/30 backdrop-blur-[2px]"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="relative h-full w-full max-w-xs bg-black/80 border-l border-white/10 backdrop-blur-xl flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
            <div>
              <h2 className="text-sm font-semibold text-white/80">Meus Presets</h2>
              <p className="text-xs text-white/30">{presets.length}/2 presets</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <PresetList
              presets={presets}
              isLoading={isLoading}
              onLoad={handleLoad}
              onDelete={deletePreset}
            />
          </div>

          <div className="px-5 py-4 border-t border-white/8">
            <button
              onClick={() => setShowSave(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 hover:bg-indigo-500/30 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
              </svg>
              Salvar ambiente atual
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showSave && (
          <SavePresetModal onClose={() => setShowSave(false)} presetCount={presets.length} />
        )}
      </AnimatePresence>
    </>
  )
}
