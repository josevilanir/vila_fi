'use client'

import { useState, useEffect } from 'react'
import { LandingNav } from './LandingNav'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { SoundsSection } from './SoundsSection'
import { PlansSection } from './PlansSection'
import { LandingFooter } from './LandingFooter'
import { AboutSection } from './AboutSection'

export type ViewId = 'view-inicio' | 'view-recursos' | 'view-sons' | 'view-planos' | 'view-sobre'

export const VIEWS: ViewId[] = ['view-inicio', 'view-recursos', 'view-sons', 'view-planos', 'view-sobre']

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
          <LandingNav
            currentView={currentView}
            navigateTo={navigateTo}
            isNight={isNight}
            toggleNight={toggleNight}
            counter={counter}
          />

          {/* VIEWS */}
          <main className="lp-views">

            {/* ===== INÍCIO / HERO ===== */}
            <section className={viewClass('view-inicio')} id="view-inicio">
              <HeroSection navigateTo={navigateTo} eqOn={eqOn} setEqOn={setEqOn} />
            </section>

            {/* ===== RECURSOS ===== */}
            <section className={`${viewClass('view-recursos')} lp-block`} id="view-recursos">
              <FeaturesSection />
            </section>

            {/* ===== SONS ===== */}
            <section className={`${viewClass('view-sons')} lp-block`} id="view-sons">
              <SoundsSection />
            </section>

            {/* ===== PLANOS ===== */}
            <section className={`${viewClass('view-planos')} lp-block`} id="view-planos">
              <PlansSection />
            </section>

            {/* ===== SOBRE / FOOTER ===== */}
            <section className={`${viewClass('view-sobre')} lp-block`} id="view-sobre">
              <AboutSection />
              <LandingFooter navigateTo={navigateTo} />
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
