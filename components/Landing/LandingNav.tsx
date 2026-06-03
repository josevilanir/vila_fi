import type { ViewId } from './ViFiLanding'
import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch'

interface LandingNavProps {
  currentView: ViewId
  navigateTo: (viewId: ViewId) => void
  isNight: boolean
  toggleNight: () => void
  counter: string
}

export function LandingNav({ currentView, navigateTo, isNight, toggleNight, counter }: LandingNavProps) {
  return (
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
        <div style={{ transform: 'scale(0.65)', transformOrigin: 'center' }}>
          <ThemeSwitch isDarkMode={isNight} toggleTheme={toggleNight} />
        </div>
        <a className="lp-join" href="/app">
          Entrar no hub
        </a>
      </div>
    </header>
  )
}
