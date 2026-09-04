import gsap from 'gsap'

export function runHeroIntro(refs) {
  const {
    nav,
    badge,
    founder,
    brand,
    headline,
    subtext,
    actions,
    scrollHint,
  } = refs

  const targets = [nav, badge, founder, brand, headline, subtext, actions, scrollHint].filter(Boolean)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reducedMotion) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' })
    return null
  }

  gsap.set(targets, { opacity: 0 })
  if (nav) gsap.set(nav, { y: -18 })
  if (badge) gsap.set(badge, { y: 16 })
  if (founder) gsap.set(founder, { y: 18 })
  if (brand) gsap.set(brand, { y: 16, opacity: 0 })
  if (subtext) gsap.set(subtext, { y: 16 })
  if (actions) gsap.set(actions, { y: 14 })
  if (headline) gsap.set(headline, { y: 24 })

  const tl = gsap.timeline({ delay: 0.2 })

  if (nav) {
    tl.to(nav, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0)
  }

  if (badge) {
    tl.to(badge, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.35)
  }

  if (founder) {
    tl.to(founder, { opacity: 0.48, y: 0, duration: 0.7, ease: 'power2.out' }, 0.45)
  }

  if (brand) {
    tl.to(brand, { opacity: 0.88, y: 0, duration: 0.7, ease: 'power2.out' }, 0.52)
  }

  if (headline) {
    tl.to(headline, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0.58)
  }

  if (subtext) {
    tl.to(subtext, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.95)
  }

  if (actions) {
    tl.to(actions, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 1.1)
  }

  if (scrollHint) {
    tl.to(scrollHint, { opacity: 1, duration: 0.6 }, 1.3)
  }

  return tl
}

export function bindHeroParallax(targets, getMouse) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion || !targets.length) return () => {}

  let frame = 0
  const onMove = () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const { x, y } = getMouse()
      targets.forEach(({ el, depthX = 10, depthY = 6 }) => {
        if (!el) return
        gsap.to(el, {
          x: x * depthX,
          y: y * depthY,
          duration: 1.4,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      })
    })
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  return () => {
    window.removeEventListener('mousemove', onMove)
    cancelAnimationFrame(frame)
  }
}
