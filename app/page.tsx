'use client'

import dynamic from 'next/dynamic'

// ssr: false evita hydration mismatch — todo o hub é browser-only
// (Howler.js, YouTube IFrame API, Framer Motion, Web Audio)
const Hub = dynamic(() => import('@/components/Hub'), { ssr: false })

export default function Home() {
  return <Hub />
}
