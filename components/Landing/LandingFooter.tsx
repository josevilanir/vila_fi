import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-[#f0eadd]/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Link href="/" className="font-display text-base font-bold text-[#f0eadd]/70">
            Vila Fi
          </Link>
          <p className="text-xs text-[#f0eadd]/20 mt-1 leading-relaxed">
            Web Environment Hub — foco e produtividade
          </p>
        </div>

        <nav className="flex items-center gap-7 text-xs text-[#f0eadd]/25">
          <a href="#features" className="hover:text-[#f0eadd]/50 transition-colors">Funcionalidades</a>
          <a href="#planos" className="hover:text-[#f0eadd]/50 transition-colors">Planos</a>
          <Link href="/app" className="hover:text-[#f0eadd]/50 transition-colors">Abrir App</Link>
        </nav>

        <p className="text-xs text-[#f0eadd]/15">
          © {new Date().getFullYear()} Vila Fi
        </p>
      </div>
    </footer>
  )
}
