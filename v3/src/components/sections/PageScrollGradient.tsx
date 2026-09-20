import { useEffect, useRef } from 'react'
import { pageScrollGrainDataUrl, type PageScrollBgTuner } from '@/lib/pageScrollBgDefaults'

type Props = {
  settings: PageScrollBgTuner
}

/**
 * 21st Axis Blend under homepage sections.
 * Exact grain SVG + overlay blend from the Custom gradient prompt.
 * Sticky unlock. Hero video untouched.
 */
export default function PageScrollGradient({ settings }: Props) {
  const elRef = useRef<HTMLDivElement>(null)
  const unlockedRef = useRef(false)
  const t0Ref = useRef<number | null>(null)
  const darkenRef = useRef(0)
  const lastAngleRef = useRef(settings.angle)

  useEffect(() => {
    if (!settings.enabled) return undefined

    const onScroll = () => {
      const hero = document.querySelector('[data-hero-root]') as HTMLElement | null
      const heroH = hero?.offsetHeight ?? window.innerHeight
      const y = window.scrollY || document.documentElement.scrollTop
      if (y >= heroH * settings.unlockAfterHero) unlockedRef.current = true

      const sections = document.getElementById('page-sections')
      if (!sections) {
        darkenRef.current = 0
        return
      }
      const rect = sections.getBoundingClientRect()
      const total = Math.max(1, sections.offsetHeight - window.innerHeight)
      const traveled = Math.min(total, Math.max(0, -rect.top))
      darkenRef.current = (traveled / total) * settings.scrollDarkenMax
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [settings.enabled, settings.unlockAfterHero, settings.scrollDarkenMax])

  useEffect(() => {
    const el = elRef.current
    if (!el || !settings.enabled) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dir = settings.motionReverse ? -1 : 1
    const amt = Math.max(0, Math.min(1, settings.motionAmount / 100))
    const speedScale = (settings.speed || 55) / 55
    let raf = 0

    const paint = (angleDeg: number, darken: number) => {
      lastAngleRef.current = angleDeg
      const vig = Math.max(0, Math.min(1, settings.vignette / 100))
      // 21st CSS approximation layers: grain + vignette + linear
      const grain = pageScrollGrainDataUrl(settings.grain)
      const vignette = `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${52 - vig * 18}%, rgba(0,0,0,${0.18 + vig * 0.4}) 100%)`
      const scrollWash = `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,${darken}) 100%)`
      const linear = `linear-gradient(${angleDeg}deg, ${settings.color0} 0%, ${settings.color1} 100%)`
      el.style.backgroundColor = settings.backdrop || settings.color0
      el.style.backgroundImage = `${grain}, ${vignette}, ${scrollWash}, ${linear}`
      el.style.backgroundSize = '120px 120px, auto, auto, auto'
      el.style.backgroundBlendMode = 'overlay, normal, normal, normal'
    }

    paint(settings.angle, 0)

    if (reduce) return undefined

    const tick = (now: number) => {
      if (!unlockedRef.current) {
        paint(lastAngleRef.current, darkenRef.current)
        raf = window.requestAnimationFrame(tick)
        return
      }
      if (t0Ref.current == null) t0Ref.current = now
      const t = (now - t0Ref.current) / 1000
      const ph = t * 0.55 * speedScale
      const spin = ph * dir
      const angle = settings.angle + spin * 40 * amt
      paint(angle, darkenRef.current)
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [settings])

  if (!settings.enabled) return null

  return (
    <div
      ref={elRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
      data-page-scroll-gradient
      style={{ backgroundColor: settings.backdrop || settings.color0 }}
    />
  )
}
