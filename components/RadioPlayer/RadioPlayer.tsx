'use client'

import { useState } from 'react'
import { useRadioPlayer } from '@/hooks/useRadioPlayer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { YoutubePlayer } from './YoutubePlayer'
import { StationSelector } from './StationSelector'
import { RADIO_STATIONS } from '@/data/radios'

export function RadioPlayer() {
  const { stationId, isPlaying, volume, setStation, togglePlay, nextStation, prevStation, setVolume, iframeContainerId } =
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
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="w-full h-1 rounded-full accent-white cursor-pointer"
                aria-label="Volume da rádio"
              />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 flex-shrink-0">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            </div>
            <StationSelector currentId={stationId} onSelect={setStation} />
          </div>
        )}
      </Card>
    </>
  )
}
