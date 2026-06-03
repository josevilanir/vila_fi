export function FeaturesSection() {
  return (
    <>
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
    </>
  )
}
