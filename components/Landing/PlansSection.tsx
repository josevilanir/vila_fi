export function PlansSection() {
  return (
    <>
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
    </>
  )
}
