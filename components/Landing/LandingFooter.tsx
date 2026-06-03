import type { ViewId } from './ViFiLanding'

interface LandingFooterProps {
  navigateTo: (viewId: ViewId) => void
}

export function LandingFooter({ navigateTo }: LandingFooterProps) {
  return (
    <footer className="lp-footer">
      <div className="lp-foot-top">
        <div className="lp-foot-brand">VILA FI</div>
        <div className="lp-foot-cols">
          <div className="lp-foot-col">
            <h5>Produto</h5>
            <a href="#view-recursos" onClick={(e) => { e.preventDefault(); navigateTo('view-recursos') }}>Recursos</a>
            <a href="#view-sons" onClick={(e) => { e.preventDefault(); navigateTo('view-sons') }}>Sons ambientes</a>
            <a href="#view-planos" onClick={(e) => { e.preventDefault(); navigateTo('view-planos') }}>Planos</a>
            <a href="#">Roadmap</a>
          </div>
          <div className="lp-foot-col">
            <h5>Stack</h5>
            <a href="#">Next.js 16 · React 19</a>
            <a href="#">Howler.js · Zustand</a>
            <a href="#">Prisma · PostgreSQL</a>
            <a href="#">Stripe · Vercel</a>
          </div>
          <div className="lp-foot-col">
            <h5>Comunidade</h5>
            <a href="#">GitHub</a>
            <a href="#">Discord</a>
            <a href="#">Twitter / X</a>
          </div>
        </div>
      </div>
      <div className="lp-foot-bot">
        <span>© 2026 Vila Fi · Seu ambiente de foco ideal.</span>
        <span>Sem anúncios · Sem distrações</span>
      </div>
    </footer>
  )
}
