'use client'

import dynamic from 'next/dynamic'

const Hub = dynamic(() => import('@/components/Hub'), { ssr: false })

export default function AppPage() {
  return <Hub />
}
