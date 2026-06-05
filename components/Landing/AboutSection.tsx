export function AboutSection() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="lp-sec-head">
        <div>
          <div className="lp-kicker">// Por trás do projeto</div>
          <h2>Sobre</h2>
        </div>
        <p style={{ width: '100%', maxWidth: 'none', fontSize: '18px', color: 'var(--ink)', textAlign: 'center', marginTop: '16px' }}>
          Um pouco sobre a criação do Vila Fi e quem está por trás dele.
        </p>
      </div>
      <div className="lp-feat-grid">
        <div className="lp-feat lp-dark lp-span6">
          <div className="lp-num">01 — O Projeto</div>
          <h4>Vila Fi</h4>
          <p>
            Vila Fi é um hub de ambiente web projetado para ser o seu cenário perfeito de estudo e trabalho. 
            Ele combina rádio lo-fi sem anúncios, sons atmosféricos customizáveis e vídeos reativos que se adaptam 
            automaticamente ao seu mix de áudio. Tudo isso criado com foco na imersão e sem distrações.
          </p>
        </div>
        <div className="lp-feat lp-yellow lp-span6">
          <div className="lp-num">02 — O Criador</div>
          <h4>Olá, sou o José!</h4>
          <p>
            Desenvolvedor apaixonado por criar experiências na web e interfaces interativas. 
            Criei o Vila Fi com o objetivo de ajudar as pessoas a entrarem em estado de "deep work" e manterem o foco 
            no que realmente importa, unindo tecnologia, design imersivo e música ambiente em um só lugar.
          </p>
        </div>
      </div>
    </div>
  )
}
