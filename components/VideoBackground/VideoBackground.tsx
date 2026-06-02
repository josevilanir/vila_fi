'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useVideoReactor } from '@/hooks/useVideoReactor'
import { VideoLayer } from './VideoLayer'

const IMAGE_EXT = /\.(jpe?g|png|webp)(\?.*)?$/i

function Preloader({ src, onLoaded }: { src: string; onLoaded: () => void }) {
  useEffect(() => {
    const isExternal = src.startsWith('http')
    const mediaSrc = isExternal ? src : `/videos/${src}`
    
    if (isExternal && IMAGE_EXT.test(src)) {
      const img = new Image()
      img.src = mediaSrc
      img.onload = onLoaded
      img.onerror = onLoaded
    } else {
      const video = document.createElement('video')
      video.src = mediaSrc
      video.preload = 'auto'
      video.onloadeddata = onLoaded
      video.onerror = onLoaded
    }
  }, [src, onLoaded])

  return null
}

export function VideoBackground() {
  const currentVideo = useVideoReactor()
  const [activeVideo, setActiveVideo] = useState(currentVideo)

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden">
      {currentVideo !== activeVideo && (
        <Preloader src={currentVideo} onLoaded={() => setActiveVideo(currentVideo)} />
      )}
      <AnimatePresence initial={false}>
        <VideoLayer key={activeVideo} src={activeVideo} />
      </AnimatePresence>
    </div>
  )
}

