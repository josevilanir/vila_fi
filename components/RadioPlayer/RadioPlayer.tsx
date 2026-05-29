'use client'

import { useRadioPlayer } from '@/hooks/useRadioPlayer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { YoutubePlayer } from './YoutubePlayer'
import { StationSelector } from './StationSelector'
import { RADIO_STATIONS } from '@/data/radios'

export function RadioPlayer() {
  const { stationId, isPlaying, setStation, togglePlay, iframeContainerId } =
    useRadioPlayer()

  const current = RADIO_STATIONS.find((r) => r.id === stationId)

  return (
    <>
      <YoutubePlayer containerId={iframeContainerId} />
      <Card className="w-64">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
          Rádio Lo-Fi
        </h2>

        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar rádio' : 'Tocar rádio'}
            className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-lg"
          >
            {isPlaying ? '⏸' : '▶️'}
          </Button>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{current?.label}</span>
            <span className="text-xs text-white/40">
              {isPlaying ? 'Tocando agora' : 'Pausado'}
            </span>
          </div>
        </div>

        <StationSelector currentId={stationId} onSelect={setStation} />
      </Card>
    </>
  )
}
