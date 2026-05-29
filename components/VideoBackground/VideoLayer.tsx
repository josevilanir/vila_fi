'use client'

import { motion } from 'framer-motion'

interface Props {
  src: string
}

const IMAGE_EXT = /\.(jpe?g|png|webp)(\?.*)?$/i

const transition = { duration: 1.5, ease: 'easeInOut' as const }
const motionProps = {
  className: 'absolute inset-0 w-full h-full object-cover',
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition,
}

export function VideoLayer({ src }: Props) {
  const isExternal = src.startsWith('http')
  const mediaSrc = isExternal ? src : `/videos/${src}`

  if (isExternal && IMAGE_EXT.test(src)) {
    return <motion.img key={src} {...motionProps} src={mediaSrc} alt="" />
  }

  return (
    <motion.video
      key={src}
      {...motionProps}
      src={mediaSrc}
      autoPlay
      loop
      muted
      playsInline
    />
  )
}
