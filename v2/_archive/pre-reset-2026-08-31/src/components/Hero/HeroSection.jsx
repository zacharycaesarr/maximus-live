import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { siteContent } from '../../content/siteContent'
import { bindHeroParallax, runHeroIntro } from '../../lib/motion'
import '../../styles/glass.css'
import '../../styles/hero.css'

export default function HeroSection({ navRef, compact = false, tuning }) {
  const shellRef = useRef(null)
  const innerRef = useRef(null)
  const badgeRef = useRef(null)
  const founderRef = useRef(null)
  const brandRef = useRef(null)
  const headlineRef = useRef(null)
  const subtextRef = useRef(null)
  const actionsRef = useRef(null)
  const scrollRef = useRef(null)

  const parallaxX = tuning?.parallaxX ?? 6
  const parallaxY = tuning?.parallaxY ?? 4

  useEffect(() => {
    const mouse = { x: 0, y: 0 }

    const onMove = (event) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mouse.x = (event.clientX - cx) / cx
      mouse.y = (event.clientY - cy) / cy
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const ctx = gsap.context(() => {
      runHeroIntro({
        nav: compact ? null : navRef?.current,
        badge: badgeRef.current,
        founder: founderRef.current,
        brand: brandRef.current,
        headline: headlineRef.current,
        subtext: subtextRef.current,
        actions: actionsRef.current,
        scrollHint: scrollRef.current,
      })
    })

    const cleanupParallax = bindHeroParallax(
      [
        { el: innerRef.current, depthX: parallaxX * 0.35, depthY: parallaxY * 0.35 },
        { el: badgeRef.current, depthX: -parallaxX * 0.5, depthY: -parallaxY * 0.5 },
        { el: headlineRef.current, depthX: parallaxX, depthY: parallaxY },
        { el: subtextRef.current, depthX: parallaxX * 0.8, depthY: parallaxY * 0.8 },
        { el: actionsRef.current, depthX: parallaxX * 0.9, depthY: parallaxY * 0.9 },
        { el: founderRef.current, depthX: parallaxX * 0.4, depthY: parallaxY * 0.4 },
        { el: brandRef.current, depthX: parallaxX * 0.5, depthY: parallaxY * 0.5 },
      ],
      () => mouse,
    )

    return () => {
      window.removeEventListener('mousemove', onMove)
      ctx.revert()
      cleanupParallax()
    }
  }, [navRef, compact, parallaxX, parallaxY])

  const innerStyle = tuning
    ? {
        paddingLeft: tuning.paddingLeft ? `${tuning.paddingLeft}px` : undefined,
        paddingBottom: tuning.paddingBottom ? `${tuning.paddingBottom}px` : undefined,
        opacity: tuning.opacity,
      }
    : undefined

  return (
    <section
      className={`hero-shell${compact ? ' hero-shell--in-window' : ''}`}
      ref={shellRef}
      aria-label="Hero"
    >
      <div className="hero-inner" ref={innerRef} style={innerStyle}>
        <div className="hero-badge glass-surface" ref={badgeRef}>
          <span className="hero-badge-dot" aria-hidden="true" />
          <span>{siteContent.statusBadge}</span>
        </div>

        <p className="hero-founder" ref={founderRef}>
          {siteContent.founderLine}
        </p>

        <p className="hero-brand" ref={brandRef}>
          {siteContent.brandLine}
        </p>

        <h1 className="hero-headline" ref={headlineRef}>
          {siteContent.heroLine1}
          <br />
          <em>something</em> great
        </h1>

        <p className="hero-subtext" ref={subtextRef}>
          {siteContent.heroSubtext}
        </p>

        <div className="hero-actions" ref={actionsRef}>
          <a href={siteContent.ctaPrimaryHref} className="glass-btn glass-btn-dark">
            <span className="glass-btn-icon" aria-hidden="true">+</span>
            <span>{siteContent.ctaPrimary}</span>
          </a>
          <a href={siteContent.ctaSecondaryHref} className="hero-cta-secondary">
            {siteContent.ctaSecondary}
          </a>
        </div>
      </div>

      <div className="hero-scroll" ref={scrollRef} aria-hidden="true">
        <span className="hero-scroll-label">Scroll</span>
        <span className="hero-scroll-line">
          <span className="hero-scroll-fill" />
        </span>
      </div>
    </section>
  )
}
