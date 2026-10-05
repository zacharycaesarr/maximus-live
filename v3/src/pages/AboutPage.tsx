import { lazy, Suspense, useLayoutEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion'
import SignalIntro from '@/components/about/SignalIntro'
import AboutContinuation from '@/components/about/AboutContinuation'
import SmoothScroll from '@/components/SmoothScroll'
import { defaultSignalSettings } from '@/components/about/signalSettings'
import { aboutBrand } from '@/components/about/aboutBrand'
import '@/components/about/signal-intro.css'

const SignalTuner = import.meta.env.DEV ? lazy(() => import('@/components/about/SignalTuner')) : null

export default function AboutPage() {
  const [settings, setSettings] = useState(defaultSignalSettings)
  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'Our story · Maximus Reach'
    document.documentElement.dataset.aboutSignal = '1'
    return () => { document.title = previousTitle; delete document.documentElement.dataset.aboutSignal }
  }, [])
  return (
    <SmoothScroll><MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div id="about-signal-page" style={{ '--signal-type-scale': settings.typeScale, '--ab-black': aboutBrand.bgDark, '--ab-cream': aboutBrand.bgLight, '--ab-surface': aboutBrand.surfaceDark, '--ab-green': aboutBrand.green, '--ab-acid': aboutBrand.acid, '--ab-line': aboutBrand.line, '--ab-muted': aboutBrand.muted } as CSSProperties}>
          <a className="ab-skip" href="#about-signal">Skip to our story</a>
          <header className="ab-nav">
            <Link className="ab-brand" to="/" aria-label="Maximus Reach home">MAXIMUS <span>REACH</span></Link>
            <nav aria-label="About navigation">
              <Link className="ab-nav-story" to="/about" aria-current="page" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Our story</Link>
              <Link to="/capabilities/web-development">Work</Link>
              <Link className="ab-contact" to="/start">Let’s talk <span aria-hidden="true">↗</span></Link>
            </nav>
          </header>
          <main><SignalIntro settings={settings} /><AboutContinuation /></main>
          {SignalTuner && new URLSearchParams(window.location.search).has('about-tune') && <Suspense fallback={null}><SignalTuner onChange={setSettings} /></Suspense>}
        </div>
      </LazyMotion>
    </MotionConfig></SmoothScroll>
  )
}
