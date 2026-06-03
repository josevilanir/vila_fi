import type { ViewId } from './ViFiLanding'

interface HeroSectionProps {
  navigateTo: (viewId: ViewId) => void
  eqOn: boolean
  setEqOn: (val: boolean) => void
}

export function HeroSection({ navigateTo, eqOn, setEqOn }: HeroSectionProps) {
  return (
    <div className="lp-hero">
      <style>{`
        .lp-scene-img { position: relative; }
        .lp-img-day, .lp-img-night {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: opacity 0.45s ease;
          z-index: 0;
        }
        .lp-img-night { opacity: 0; }
        .lp-img-day { opacity: 1; }
        .landing-root.night .lp-img-day { opacity: 0; }
        .landing-root.night .lp-img-night { opacity: 1; }
      `}</style>
      <div className="lp-headline">
        <h1>AMBIENTE<br />DE FOCO <span className="y">LO-FI</span></h1>
        <div className="lp-sub">
          <p>Rádio lo-fi ao vivo, sons atmosféricos e vídeos que reagem ao seu mix. Monte o cenário perfeito de estudo e trabalho.</p>
        </div>
      </div>

      {/* Right tall scene */}
      <div className="lp-scene-r">
        <div className="lp-stripe">
          <div className="lp-stars">★<br />☆</div>
          <div className="lp-arrow">↑</div>
        </div>
        <div className="lp-scene-img lp-ph" data-label="cena reativa · cidade na chuva">
          <img src="/images/lofi-street-day.png" alt="Cidade de dia" className="lp-img-day" />
          <img src="/images/Lofi rain night.jpg" alt="Cidade na chuva" className="lp-img-night" />
        </div>
      </div>

      {/* Bottom left scene */}
      <div className="lp-scene-c">
        <div className="lp-scene-img lp-ph" data-label="cena reativa · cafeteria">
          <img src="/images/cafe-day.webp" alt="Cafeteria de dia" className="lp-img-day" />
          <img src="/images/cafe-night.png" alt="Cafeteria à noite" className="lp-img-night" />
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
