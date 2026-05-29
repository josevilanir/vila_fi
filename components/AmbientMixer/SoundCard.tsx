'use client'

import { motion } from 'framer-motion'
import { SoundDef } from '@/data/sounds'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'

interface Props {
  sound: SoundDef
  active: boolean
  volume: number
  disabled?: boolean
  onToggle: (id: string) => void
  onVolume: (id: string, v: number) => void
}

export function SoundCard({ sound, active, volume, disabled, onToggle, onVolume }: Props) {
  return (
    <motion.div
      className={`flex flex-col gap-3 rounded-xl p-3 transition-colors border ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/5'
          : active
            ? 'bg-white/15 border-white/30 cursor-pointer'
            : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 px-0 py-0 text-base"
        onClick={() => !disabled && onToggle(sound.id)}
        aria-pressed={active}
        aria-label={`${active ? 'Desativar' : 'Ativar'} ${sound.label}`}
      >
        <span className="text-xl">{sound.icon}</span>
        <span className={active ? 'text-white' : 'text-white/60'}>{sound.label}</span>
      </Button>

      {active && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Slider
            value={volume}
            onChange={(e) => onVolume(sound.id, parseFloat(e.target.value))}
            aria-label={`Volume de ${sound.label}`}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
