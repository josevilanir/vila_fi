'use client'

import { useState, useEffect } from 'react'

type ViewId = 'view-inicio' | 'view-recursos' | 'view-sons' | 'view-planos' | 'view-sobre'

const VIEWS: ViewId[] = ['view-inicio', 'view-recursos', 'view-sons', 'view-planos', 'view-sobre']

const SOUNDS = [
  'Chuva', 'Ruído branco', 'Teclado', 'Cafeteria',
  'Lareira', 'Floresta', 'Ondas do mar', 'Trem', 'Pássaros', 'Trovão',
]

export function ViFiLanding() {
  const [currentView, setCurrentView] = useState<ViewId>('view-inicio')
  const [incomingView, setIncomingView] = useState<ViewId | null>(null)
  const [isNight, setIsNight] = useState(false)
  const [eqOn, setEqOn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('vf-night') === '1') setIsNight(true)
    const hash = window.location.hash.replace('#', '') as ViewId
    if (VIEWS.includes(hash)) setCurrentView(hash)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const cur = VIEWS.indexOf(currentView)
      if (e.key === 'ArrowRight' && cur < VIEWS.length - 1) navigateTo(VIEWS[cur + 1])
      if (e.key === 'ArrowLeft' && cur > 0) navigateTo(VIEWS[cur - 1])
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [currentView])

  const navigateTo = (viewId: ViewId) => {
    setIncomingView(viewId)
    setCurrentView(viewId)
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.history.replaceState(null, '', '#' + viewId)
    setTimeout(() => setIncomingView(null), 650)
  }

  const toggleNight = () => {
    const next = !isNight
    setIsNight(next)
    localStorage.setItem('vf-night', next ? '1' : '0')
  }

  const idx = VIEWS.indexOf(currentView)
  const counter = `${String(idx + 1).padStart(2, '0')} / ${String(VIEWS.length).padStart(2, '0')}`

  const viewClass = (id: ViewId) =>
    `lp-view${currentView === id ? ' active' : ''}${incomingView === id ? ' anim' : ''}`

  return (
    <div className={`landing-root${isNight ? ' night' : ''}`}>
      <div className="lp-wrap">
        <div className="lp-panel">

          {/* TOPBAR */}
          <header className="lp-topbar">
            <button className="lp-brand" onClick={() => navigateTo('view-inicio')}>
              <span className="lp-eq">
                <i /><i /><i />
              </span>
              <span><b>vila</b> <span className="lp-fi">fi</span></span>
            </button>

            <nav className="lp-notch">
              {[
                { id: 'view-inicio'   as ViewId, label: 'Início' },
                { id: 'view-recursos' as ViewId, label: 'Recursos' },
                { id: 'view-sons'     as ViewId, label: 'Sons' },
                { id: 'view-planos'   as ViewId, label: 'Planos' },
                { id: 'view-sobre'    as ViewId, label: 'Sobre' },
              ].map(({ id, label }) => (
                <a
                  key={id}
                  className={currentView === id ? 'active' : ''}
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); navigateTo(id) }}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="lp-topbar-right">
              <span className="lp-nav-counter">{counter}</span>
              <button className="lp-theme-btn" onClick={toggleNight} aria-label="Alternar tema">
                {isNight ? '☀' : '☾'}
              </button>
              <a className="lp-join" href="/app">
                Entrar no hub
              </a>
            </div>
          </header>

          {/* VIEWS */}
          <main className="lp-views">

            {/* ===== INÍCIO / HERO ===== */}
            <section className={viewClass('view-inicio')} id="view-inicio">
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
            </section>

            {/* ===== RECURSOS ===== */}
            <section className={`${viewClass('view-recursos')} lp-block`} id="view-recursos">
              <div className="lp-sec-head">
                <div>
                  <div className="lp-kicker">// O que tem dentro</div>
                  <h2>Recursos</h2>
                </div>
                <p>Cada camada do ambiente é independente e reativa. Combine como quiser — o cenário se adapta sozinho.</p>
              </div>
              <div className="lp-feat-grid">
                <div className="lp-feat lp-dark lp-span8">
                  <div className="lp-num">01 — Vídeos reativos</div>
                  <h4>O fundo muda com o seu mix</h4>
                  <p>Ligue a chuva e a cidade vira noite chuvosa; adicione o café e a cena vira uma cafeteria molhada. Sistema de regras por prioridade com transições em crossfade — sem flashes pretos.</p>
                  <div className="lp-chips">
                    <span className="lp-chip">chuva + trovão</span>
                    <span className="lp-chip">chuva + café</span>
                    <span className="lp-chip">cidade de dia</span>
                    <span className="lp-chip">dark mode</span>
                  </div>
                </div>
                <div className="lp-feat lp-yellow lp-span4">
                  <div className="lp-num">02 — Pomodoro</div>
                  <h4>Timer de foco</h4>
                  <p>Foco 25′, pausa curta 5′ e pausa longa 15′. Play, pause, reset e alerta sonoro a cada ciclo.</p>
                </div>
                <div className="lp-feat lp-span4">
                  <div className="lp-num">03 — Presets</div>
                  <h4>Salve seu ambiente</h4>
                  <p>Guarde qualquer combinação de sons + rádio com um nome e restaure com um clique.</p>
                </div>
                <div className="lp-feat lp-span4">
                  <div className="lp-num">04 — Compartilhar</div>
                  <h4>Link do seu mix</h4>
                  <p>Copie um link com o estado atual. Quem abre entra exatamente na mesma configuração.</p>
                </div>
                <div className="lp-feat lp-span4">
                  <div className="lp-num">05 — Dark mode</div>
                  <h4>Dia ou madrugada</h4>
                  <p>Alterne entre a cena diurna e noturna da cidade. O estado persiste globalmente.</p>
                </div>
              </div>
            </section>

            {/* ===== SONS ===== */}
            <section className={`${viewClass('view-sons')} lp-block`} id="view-sons">
              <div className="lp-sec-head">
                <div>
                  <div className="lp-kicker">// 10 sons atmosféricos · licença CC</div>
                  <h2>Sons ambientes</h2>
                </div>
                <p>Volume individual ajustável em cada um. Servidos via proxy server-side com retry e backoff — seu IP nunca toca o Freesound.</p>
              </div>
              <div className="lp-sounds">
                {SOUNDS.map((sound) => (
                  <span key={sound} className="lp-sound">
                    <span className="lp-d" />
                    {sound}
                  </span>
                ))}
              </div>
            </section>

            {/* ===== PLANOS ===== */}
            <section className={`${viewClass('view-planos')} lp-block`} id="view-planos">
              <div className="lp-sec-head">
                <div>
                  <div className="lp-kicker">// Comece de graça</div>
                  <h2>Planos</h2>
                </div>
                <p>Todos os sons e rádios liberados no plano grátis. O Premium libera presets ilimitados e cenas exclusivas.</p>
              </div>
              <div className="lp-plans">
                <div className="lp-plan lp-basic">
                  <div className="lp-pt">
                    <span className="lp-pname">Grátis</span>
                  </div>
                  <div className="lp-price">R$0<small> / sempre</small></div>
                  <ul>
                    <li>Todas as 7 estações de rádio</li>
                    <li>Todos os 10 sons ambientes</li>
                    <li>Timer Pomodoro completo</li>
                    <li>Até 2 presets salvos</li>
                    <li>Compartilhamento por link</li>
                  </ul>
                  <a className="lp-pcta" href="/app">Criar conta grátis</a>
                </div>
                <div className="lp-plan lp-pro">
                  <div className="lp-pt">
                    <span className="lp-pname">Premium</span>
                    <span className="lp-badge">-37% no anual</span>
                  </div>
                  <div className="lp-price">R$19<small> /mês · ou R$12/mês no anual</small></div>
                  <ul>
                    <li>Tudo do plano grátis</li>
                    <li>Presets ilimitados</li>
                    <li>Cenas exclusivas premium</li>
                    <li>Sons binaurais (em breve)</li>
                    <li>Estatísticas de foco (em breve)</li>
                  </ul>
                  <a className="lp-pcta" href="/app">Assinar Premium</a>
                </div>
              </div>
            </section>

            {/* ===== SOBRE / FOOTER ===== */}
            <section className={viewClass('view-sobre')} id="view-sobre">
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
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
