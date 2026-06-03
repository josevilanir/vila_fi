import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, Anton, Archivo, Space_Mono } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vila Fi — Seu Ambiente de Foco Perfeito',
  description:
    'Combine rádio lo-fi, sons ambientes e vídeos reativos para criar seu ambiente ideal de estudo e produtividade. Gratuito para sempre.',
  keywords: ['lo-fi', 'foco', 'estudo', 'produtividade', 'sons ambientes', 'pomodoro', 'ambiente de trabalho'],
  openGraph: {
    title: 'Vila Fi — Web Environment Hub',
    description: 'Seu ambiente de foco com lo-fi, sons ambientes e vídeos reativos.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'pt_BR',
    url: 'https://vilafi.com',
    siteName: 'Vila Fi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vila Fi — Seu Ambiente de Foco Perfeito',
    description: 'Combine rádio lo-fi, sons ambientes e vídeos reativos. Grátis.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://vilafi.com'),
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable} ${anton.variable} ${archivo.variable} ${spaceMono.variable} font-sans min-h-full`}>
        {children}
      </body>
    </html>
  )
}
