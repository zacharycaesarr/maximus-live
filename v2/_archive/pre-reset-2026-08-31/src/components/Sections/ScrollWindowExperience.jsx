import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AmbientBlobs from '../Background/AmbientBlobs'
import ParticleField from '../Background/ParticleField'
import HeroScene from '../Hero/HeroScene'
import HeroSection from '../Hero/HeroSection'
import { useDesignTuner } from '../../context/DesignTunerContext'
import { siteContent } from '../../content/siteContent'
import '../../styles/scroll-window.css'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollWindowExperience({ navRef }) {
  const { settings, scrollProgress } = useDesignTuner()
  const stageRef = useRef(null)
  const pinRef = useRef(null)
  const windowRef = useRef(null)
  const headlineRef = useRef(null)
  const dockRef = useRef(null)
  const panelRef = useRef(null)
  const sublineRef = useRef(null)
  const titlebarRef = useRef(null)
  const [activeTab, setActiveTab] = useState(siteContent.deviceZoom.tabs[0].id)
  const panel = siteContent.deviceZoom.panels[activeTab]
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  useEffect(() => {
    const stage = stageRef.current
    const pin = pinRef.current
    const win = windowRef.current
    const headline = headlineRef.current
    const dock = dockRef.current
    const panelEl = panelRef.current
    const subline = sublineRef.current
    const titlebar = titlebarRef.current
    const nav = navRef?.current
    if (!stage || !pin || !win) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set([headline, dock, panelEl, subline, titlebar], { opacity: 1, clearProps: 'transform' })
      return undefined
    }

    const heroScroll = win.querySelector('.hero-scroll')
    const heroInner = win.querySelector('.hero-inner')

    gsap.set(win, { xPercent: -50 })

    const onMove = (e) => {
      const progress = scrollProgress.current
      const tiltMax = progress > 0.2
        ? settings.scrollWindow.mouseTiltWhenScaled
        : settings.scrollWindow.mouseTilt
      if (tiltMax <= 0) {
        gsap.to(win, { rotateY: 0, rotateX: 0, duration: 0.6, overwrite: 'auto' })
        return
      }

      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(win, {
        rotateY: nx * tiltMax,
        rotateX: -ny * (tiltMax * 0.65),
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const ctx = gsap.context(() => {
      const mobile = window.matchMedia('(max-width: 768px)').matches
      const targetScale = mobile
        ? settings.scrollWindow.targetScaleMobile
        : settings.scrollWindow.targetScale

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
          pin: pin,
          onUpdate: (self) => {
            scrollProgress.current = self.progress
            if (nav) {
              nav.classList.toggle('is-docked-right', self.progress > settings.nav.dockStart)
            }
          },
        },
      })

      tl.fromTo(
        win,
        {
          scale: 1,
          xPercent: -50,
          top: 0,
          borderRadius: 0,
          boxShadow: '0 0 0 rgba(0,0,0,0)',
        },
        {
          scale: targetScale,
          xPercent: -50,
          top: settings.scrollWindow.windowTop,
          borderRadius: settings.scrollWindow.borderRadius,
          boxShadow: '0 0 0 10px #1a1714, 0 48px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
          ease: 'none',
        },
        0,
      )

      if (titlebar) {
        tl.fromTo(titlebar, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.22)
      }

      if (heroScroll) {
        tl.to(heroScroll, { opacity: 0, ease: 'none' }, 0.08)
      }

      if (nav) {
        tl.fromTo(
          nav,
          { top: 'clamp(14px, 2.5vh, 22px)', right: 'auto', left: '50%', xPercent: -50, scale: 1 },
          {
            top: settings.nav.dockTop,
            right: 16,
            left: 'auto',
            xPercent: 0,
            scale: settings.nav.dockScale,
            ease: 'none',
          },
          settings.nav.dockStart,
        )
      }

      tl.fromTo(
        headline,
        { opacity: 0, y: 20, xPercent: -50 },
        { opacity: 1, y: 0, xPercent: -50, ease: 'none' },
        settings.headline.fadeStart,
      )

      tl.fromTo(
        dock,
        { opacity: 0, y: 16, xPercent: -50 },
        { opacity: 1, y: 0, xPercent: -50, ease: 'none' },
        settings.headline.fadeStart + 0.12,
      )

      tl.fromTo(
        panelEl,
        { opacity: 0, y: 12, xPercent: -50 },
        { opacity: 1, y: 0, xPercent: -50, ease: 'none' },
        settings.headline.fadeStart + 0.2,
      )

      tl.fromTo(
        subline,
        { opacity: 0, xPercent: -50 },
        { opacity: 1, xPercent: -50, ease: 'none' },
        settings.headline.fadeStart + 0.28,
      )

      if (heroInner) {
        gsap.set(heroInner, { opacity: settings.heroInWindow.opacity })
      }
    }, stage)

    return () => {
      window.removeEventListener('mousemove', onMove)
      ctx.revert()
      if (nav) nav.classList.remove('is-docked-right')
    }
  }, [navRef, settings, scrollProgress])

  const headlineTop = isMobile ? settings.headline.topMobile : settings.headline.top

  return (
    <section
      className="scroll-zoom-stage"
      ref={stageRef}
      aria-label="Website preview"
      style={{ height: `${settings.scrollWindow.stageHeight}vh` }}
    >
      <div className="scroll-zoom-pin" ref={pinRef}>
        <div
          className="scroll-zoom-headline"
          ref={headlineRef}
          style={{ top: headlineTop, fontSize: settings.headline.fontSize }}
        >
          <h2 style={{ fontSize: 'inherit' }}>{siteContent.deviceZoom.headline}</h2>
        </div>

        <div className="scroll-window" id="scroll-window" ref={windowRef}>
          <div className="scroll-window-titlebar" ref={titlebarRef} aria-hidden="true">
            <div className="scroll-window-chrome">
              <span /><span /><span />
            </div>
            <span className="scroll-window-title">maximusreach.com</span>
          </div>
          <AmbientBlobs />
          <ParticleField />
          <HeroScene />
          <HeroSection navRef={navRef} compact tuning={settings.heroInWindow} />
        </div>

        <div
          className="scroll-zoom-dock"
          ref={dockRef}
          style={{ bottom: isMobile ? settings.dock.bottomMobile : settings.dock.bottom }}
        >
          {siteContent.deviceZoom.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`scroll-zoom-tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="scroll-zoom-tab-dot" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="scroll-zoom-panel"
          ref={panelRef}
          key={activeTab}
          style={{ bottom: settings.panel.bottom }}
        >
          <div
            className="scroll-zoom-panel-stat"
            style={{ fontSize: settings.panel.statSize }}
          >
            {panel.stat}
          </div>
          <div className="scroll-zoom-panel-copy">
            <span className="scroll-zoom-panel-label">{panel.label}</span>
            <p>{panel.detail}</p>
          </div>
        </div>

        <p className="scroll-zoom-subline" ref={sublineRef}>
          {siteContent.deviceZoom.subline}
        </p>
      </div>
    </section>
  )
}
