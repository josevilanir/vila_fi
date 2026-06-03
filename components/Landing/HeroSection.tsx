import type { ViewId } from './ViFiLanding'

interface HeroSectionProps {
  navigateTo: (viewId: ViewId) => void
  eqOn: boolean
  setEqOn: (val: boolean) => void
}

export function HeroSection({ navigateTo, eqOn, setEqOn }: HeroSectionProps) {
  return (
    <div className="lp-hero">
      <div className="lp-headline">
        <h1>AMBIENTE<br />DE FOCO <span className="y">LO-FI</span></h1>
        <div className="lp-sub">
          <span className="lp-tagpill">● SEM ANÚNCIOS</span>
          <p>Rádio lo-fi ao vivo, sons atmosféricos e vídeos que reagem ao seu mix. Monte o cenário perfeito de estudo e trabalho.</p>
        </div>
      </div>

      {/* Right tall scene */}
      <div className="lp-scene-r">
        <div className="lp-stripe">
          <div className="lp-stars">★<br />☆</div>
          <div className="lp-arrow">↑</div>
        </div>
        <div className="lp-scene-img lp-ph lp-g-rain" data-label="cena reativa · cidade na chuva">
          <span className="lp-react-tag">
            <span className="lp-dot" />
            VÍDEO REATIVO
          </span>
        </div>
      </div>

      {/* Bottom left scene */}
      <div className="lp-scene-c">
        <div className="lp-scene-img lp-ph lp-g-cafe" data-label="cena reativa · cafeteria">
          <span className="lp-react-tag">
            <span className="lp-dot" />
            ATIVA O CAFÉ
          </span>
        </div>
      </div>

      {/* Seal */}
      <div className="lp-seal-cell">
        <div className="lp-seal">
          <svg className="lp-ring" viewBox="0 0 200 200">
            <defs>
              <path id="lp-cpath" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text>
              <textPath href="#lp-cpath" startOffset="0%">
                VILA FI v1.0 · AMBIENTE DE FOCO LO-FI · SEM ANÚNCIOS · SEM DISTRAÇÕES ·{' '}
              </textPath>
            </text>
          </svg>
          <a
            className="lp-core"
            href="#view-planos"
            onClick={(e) => { e.preventDefault(); navigateTo('view-planos') }}
          >
            <span>COMEÇAR<br />AGORA</span>
          </a>
        </div>
      </div>

      {/* Radio card */}
      <div className="lp-radio-card">
        <div className="lp-rc-head">
          <h3>Rádio lo-fi ao vivo</h3>
          <span className="lp-dots"><i /><i /><i /></span>
        </div>
        <p>7 estações curadas via transmissão ao vivo no YouTube — Lofi Girl, Chillhop, Jazz Lofi, Synthwave e mais. Sem anúncios, sem interrupções.</p>
        <div className="lp-rc-foot">
          <div className={`lp-eq-live${eqOn ? ' on' : ''}`}>
            <i /><i /><i /><i /><i />
          </div>
          <button className="lp-play-btn" onClick={() => setEqOn(!eqOn)}>
            <span className="lp-ic">{eqOn ? '❚❚' : '▶'}</span>
            <span>{eqOn ? 'Tocando · Lofi Girl' : 'Ouvir agora'}</span>
          </button>
        </div>
      </div>

      {/* Sticker */}
      <a
        className="lp-sticker"
        href="#view-sons"
        onClick={(e) => { e.preventDefault(); navigateTo('view-sons') }}
      >
        <span>
          <span className="lp-stic-ic"><i /><i /><i /><i /></span>
          <span className="lp-stic-label">MIXAR<br />SONS</span>
        </span>
      </a>
    </div>
  )
}
