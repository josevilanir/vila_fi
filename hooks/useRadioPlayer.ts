'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRadioStore } from '@/store/radioStore'
import { RADIO_STATIONS } from '@/data/radios'

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
  }
}

export function useRadioPlayer() {
  const { stationId, isPlaying, setStation, togglePlay, nextStation, prevStation } = useRadioStore()
  const playerRef   = useRef<YT.Player | null>(null)
  const isPlayingRef = useRef(isPlaying) // ref evita stale closure nos callbacks do YT
  const iframeContainerId = 'yt-player-container'

  // Mantém ref sempre sincronizada com o estado
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])

  const createPlayer = useCallback((videoId: string) => {
    if (!window.YT?.Player) return
    playerRef.current?.destroy()
    playerRef.current = new window.YT.Player(iframeContainerId, {
      videoId,
      playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0 },
      events: {
        onReady: () => {
          // Usa ref para pegar o valor atual de isPlaying, não o do momento da criação
          if (isPlayingRef.current) playerRef.current?.playVideo()
        },
      },
    })
  }, [])

  useEffect(() => {
    const initPlayer = () => {
      const station = RADIO_STATIONS.find((r) => r.id === stationId)
      if (station) createPlayer(station.youtubeId)
    }

    if (window.YT?.Player) {
      // API já carregada (cache do browser) — chama direto
      initPlayer()
    } else {
      if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script')
        tag.id = 'yt-api-script'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      window.onYouTubeIframeAPIReady = initPlayer
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Troca de estação: cue se pausado, load+play se tocando
  useEffect(() => {
    if (!playerRef.current) return
    const station = RADIO_STATIONS.find((r) => r.id === stationId)
    if (!station) return
    if (isPlaying) {
      playerRef.current.loadVideoById(station.youtubeId)
    } else {
      playerRef.current.cueVideoById(station.youtubeId)
    }
  }, [stationId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play/pause chamado diretamente no handler do clique para respeitar
  // a autoplay policy do browser (precisa estar dentro do gesto do usuário)
  function handleTogglePlay() {
    const willPlay = !isPlaying
    togglePlay()
    if (willPlay) {
      playerRef.current?.playVideo()
    } else {
      playerRef.current?.pauseVideo()
    }
  }

  // Próxima e anterior mudam de rádio e já dão play automaticamente 
  // (já que o useEffect [stationId] lida com loadVideoById se isPlaying for true,
  // mas se estiver pausado vai só carregar, pode ser bom dar togglePlay se estiver pausado,
  // mas como o hook de useRadioStore não altera isPlaying ao mudar, o loadVideoById só vai 
  // funcionar se estiver tocando, que é o correto. Só vamos chamar os métodos do store.)
  function handleNextStation() {
    nextStation()
  }

  function handlePrevStation() {
    prevStation()
  }

  return { 
    stationId, 
    isPlaying, 
    setStation, 
    togglePlay: handleTogglePlay, 
    nextStation: handleNextStation, 
    prevStation: handlePrevStation, 
    iframeContainerId 
  }
}
