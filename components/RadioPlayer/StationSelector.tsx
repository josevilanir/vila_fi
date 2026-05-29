'use client'

import { RADIO_STATIONS } from '@/data/radios'
import { Button } from '@/components/ui/Button'

interface Props {
  currentId: string
  onSelect: (id: string) => void
}

export function StationSelector({ currentId, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {RADIO_STATIONS.map((station) => (
        <Button
          key={station.id}
          variant="ghost"
          className={`justify-start text-sm ${
            station.id === currentId ? 'text-white' : 'text-white/50'
          }`}
          onClick={() => onSelect(station.id)}
          aria-current={station.id === currentId ? 'true' : undefined}
        >
          {station.id === currentId && <span className="mr-1.5 text-green-400">▶</span>}
          {station.label}
        </Button>
      ))}
    </div>
  )
}
