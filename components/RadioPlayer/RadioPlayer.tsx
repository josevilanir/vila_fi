'use client'

import { useState } from 'react'
import { useRadioPlayer } from '@/hooks/useRadioPlayer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { YoutubePlayer } from './YoutubePlayer'
import { StationSelector } from './StationSelector'
import { RADIO_STATIONS } from '@/data/radios'

export function RadioPlayer() {
  const { stationId, isPlaying, setStation, togglePlay, nextStation, prevStation, iframeContainerId } =
    useRadioPlayer()

  const [isExpanded, setIsExpanded] = useState(false)

  const current = RADIO_STATIONS.find((r) => r.id === stationId)

  return (
    <>
      <YoutubePlayer containerId={iframeContainerId} />
      <Card className="w-full sm:w-72 transition-all duration-300">
        <div 
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Rádio Lo-Fi
            </h2>
            <span className="text-white/40 text-xs">
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col max-w-[120px]">
              <span className="text-sm font-medium text-white truncate">{current?.label}</span>
              <span className="text-xs text-white/40">
                {isPlaying ? 'Tocando' : 'Pausado'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="icon"
                onClick={(e) => { e.stopPropagation(); prevStation(); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-xs"
              >
                ⏮
              </Button>
              <Button
                variant="icon"
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                aria-label={isPlaying ? 'Pausar rádio' : 'Tocar rádio'}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-base"
              >
                {isPlaying ? '⏸' : '▶️'}
              </Button>
              <Button
                variant="icon"
                onClick={(e) => { e.stopPropagation(); nextStation(); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-xs"
              >
                ⏭
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <StationSelector currentId={stationId} onSelect={setStation} />
          </div>
        )}
      </Card>
    </>
  )
}
