'use client'

import { SOUNDS } from '@/data/sounds'
import { useAmbientMixer } from '@/hooks/useAmbientMixer'
import { Card } from '@/components/ui/Card'
import { SoundCard } from './SoundCard'

const STATUS_LABEL: Record<string, string> = {
  loading: 'Carregando sons…',
  error:   'Erro ao carregar sons',
}

export function AmbientMixer() {
  const { volumes, isActive, toggle, setVolume, audioStatus } = useAmbientMixer()

  return (
    <Card className="w-64">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Sons Ambientes
        </h2>
        {audioStatus !== 'ready' && (
          <span className={`text-xs ${audioStatus === 'error' ? 'text-red-400' : 'text-white/40'}`}>
            {STATUS_LABEL[audioStatus] ?? ''}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {SOUNDS.map((sound) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            active={isActive(sound.id)}
            volume={volumes[sound.id] ?? 0.7}
            onToggle={toggle}
            onVolume={setVolume}
            disabled={audioStatus !== 'ready'}
          />
        ))}
      </div>
    </Card>
  )
}
