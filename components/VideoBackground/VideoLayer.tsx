'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Props {
  src: string
}

const IMAGE_EXT = /\.(jpe?g|png|webp)(\?.*)?$/i

const transition = { duration: 1.5, ease: 'easeInOut' as const }
const motionProps = {
  className: 'absolute inset-0 w-full h-full object-cover',
  initial: { opacity: 0, zIndex: 1 },
  animate: { opacity: 1, zIndex: 1 },
  exit: { opacity: 0, zIndex: 0 },
  transition,
}

export function VideoLayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isExternal = src.startsWith('http')
  const mediaSrc = isExternal ? src : `/videos/${src}`

  useEffect(() => {
    console.log('[VideoLayer] Mounted with src:', mediaSrc)
    // We intentionally do NOT call videoRef.current.play() here because programmatic play()
    // triggers Chrome's battery saver AbortError. We rely on the HTML autoPlay attribute.
  }, [mediaSrc])

  useEffect(() => {
    const wakeUpVideo = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {})
      }
    }
    // Any interaction will attempt to resume the video if battery saver paused it
    window.addEventListener('click', wakeUpVideo)
    return () => window.removeEventListener('click', wakeUpVideo)
  }, [])

  if (isExternal && IMAGE_EXT.test(src)) {
    return <motion.img key={src} {...motionProps} src={mediaSrc} alt="" />
  }

  return (
    <motion.video
      key={src}
      ref={videoRef}
      {...motionProps}
      src={mediaSrc}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}




