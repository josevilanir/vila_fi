'use client'

import { motion } from 'framer-motion'

interface Props {
  src: string
}

export function VideoLayer({ src }: Props) {
  return (
    <motion.video
      key={src}
      className="absolute inset-0 w-full h-full object-cover"
      src={`/videos/${src}`}
      autoPlay
      loop
      muted
      playsInline
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
    />
  )
}
