'use client'

import { AnimatePresence } from 'framer-motion'
import { useVideoReactor } from '@/hooks/useVideoReactor'
import { VideoLayer } from './VideoLayer'

export function VideoBackground() {
  const currentVideo = useVideoReactor()

  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      <AnimatePresence mode="sync">
        <VideoLayer key={currentVideo} src={currentVideo} />
      </AnimatePresence>
    </div>
  )
}
