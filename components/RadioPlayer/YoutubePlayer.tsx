'use client'

interface Props {
  containerId: string
}

export function YoutubePlayer({ containerId }: Props) {
  return (
    <div
      id={containerId}
      className="absolute w-0 h-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  )
}
