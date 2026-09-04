import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../content/siteContent'
import '../../styles/device-zoom.css'

gsap.registerPlugin(ScrollTrigger)

function DevicePanel({ panel }) {
  const bars = [38, 52, 68, 84, 58]

  return (
    <div className="device-zoom-panel">
      <div className="device-zoom-stat-card">
        <h3>{panel.title}</h3>
        <div>
          <div className="device-zoom-stat-num">{panel.stat}</div>
          <div className="device-zoom-stat-label">{panel.label}</div>
        </div>
        <p className="device-zoom-detail">{panel.detail}</p>
      </div>
      <div className="device-zoom-chart" aria-hidden="true">
        {bars.map((h, i) => (
          <div key={i} className="device-zoom-bar" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function DeviceZoomSection() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const tiltRef = useRef(null)
  const frameRef = useRef(null)
  const bezelRef = useRef(null)
  const shadowRef = useRef(null)
  const headlineRef = useRef(null)
  const dockRef = useRef(null)
  const [activeTab, setActiveTab] = useState(siteContent.deviceZoom.tabs[0].id)

  const activePanel = siteContent.deviceZoom.panels[activeTab]

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const tilt = tiltRef.current
    const frame = frameRef.current
    const bezel = bezelRef.current
    const shadow = shadowRef.current
    const headline = headlineRef.current
    const dock = dockRef.current
    if (!section || !pin || !frame || !bezel || !tilt) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      gsap.set([frame, bezel, headline, dock, shadow], { clearProps: 'all', opacity: 1 })
      return undefined
    }

    const onMove = (event) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2
      const ny = (event.clientY / window.innerHeight - 0.5) * 2
      gsap.to(tilt, {
        rotateY: nx * 3.5,
        rotateX: -ny * 2.5,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: pin,
        },
      })

      tl.fromTo(
        frame,
        { scale: 1 },
        { scale: 0.7, ease: 'none' },
        0,
      )

      tl.fromTo(
        bezel,
        { borderRadius: 0, padding: 0 },
        { borderRadius: 20, padding: 12, ease: 'none' },
        0,
      )

      tl.fromTo(
        shadow,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0.35,
      )

      tl.to('.device-zoom-ui-bar', { opacity: 1, duration: 0.08, ease: 'none' }, 0.25)

      tl.fromTo(
        headline,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: 'none' },
        0.45,
      )

      tl.fromTo(
        dock,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, ease: 'none' },
        0.58,
      )
    }, section)

    return () => {
      window.removeEventListener('mousemove', onMove)
      ctx.revert()
    }
  }, [])

  return (
    <section className="device-zoom" ref={sectionRef} aria-label="Growth dashboard preview">
      <div className="device-zoom-pin" ref={pinRef}>
        <div className="device-zoom-headline" ref={headlineRef}>
          <h2>{siteContent.deviceZoom.headline}</h2>
          <p>{siteContent.deviceZoom.subline}</p>
        </div>

        <div className="device-zoom-stage">
          <div className="device-zoom-tilt" ref={tiltRef}>
            <div className="device-zoom-frame-wrap" ref={frameRef}>
              <div className="device-zoom-bezel" ref={bezelRef}>
                <div className="device-zoom-screen">
                  <div className="device-zoom-screen-inner">
                    <div className="device-zoom-ui-bar">
                      <span className="device-zoom-dot" />
                      <span className="device-zoom-dot" />
                      <span className="device-zoom-dot" />
                    </div>
                    {activePanel && <DevicePanel panel={activePanel} />}
                  </div>
                </div>
              </div>
              <div className="device-zoom-shadow" ref={shadowRef} aria-hidden="true" />
            </div>
          </div>

          <div className="device-zoom-dock" ref={dockRef}>
            {siteContent.deviceZoom.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`device-zoom-tab${activeTab === tab.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="device-zoom-tab-dot" aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
