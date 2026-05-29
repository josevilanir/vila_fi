import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vila Fi — Web Environment Hub',
  description: 'Monte seu ambiente ideal de foco com lo-fi, sons ambientes e vídeos reativos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body suppressHydrationWarning className={`${inter.className} min-h-full overflow-hidden bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
