const SOUNDS = [
  'Chuva', 'Ruído branco', 'Teclado', 'Cafeteria',
  'Lareira', 'Floresta', 'Ondas do mar', 'Trem', 'Pássaros', 'Trovão',
]

export function SoundsSection() {
  return (
    <>
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
    </>
  )
}
