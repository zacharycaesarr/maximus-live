import { useEffect, useRef, useState } from 'react'
import type { PageScrollBgTuner } from '@/lib/pageScrollBgDefaults'

function rgb(hex: string) {
  const parts = hex.match(/[0-9a-f]{2}/gi)
  return parts && parts.length === 3 ? parts.map((part) => parseInt(part, 16)).join(',') : '248,245,238'
}

/** CTA-only light and moving texture. No canvas or full-page animation. */
export default function CtaAtmosphere({ settings }: { settings: PageScrollBgTuner }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let intersecting = false
    const sync = () => setActive(intersecting && !document.hidden && !reducedMotion.matches)
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      sync()
    }, { rootMargin: '120px 0px' })
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)
    reducedMotion.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reducedMotion.removeEventListener('change', sync)
    }
  }, [])

  const burstRgb = rgb(settings.ctaBurstColor)

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse ${Math.round(45 * settings.ctaBurstSize)}% ${Math.round(70 * settings.ctaBurstSize)}% at 50% 49%, rgba(255,255,255,${settings.ctaBurstOpacity / 100 + 0.4}) 0%, rgba(${burstRgb},${settings.ctaBurstOpacity / 260}) 48%, transparent 78%), linear-gradient(145deg, rgba(235,230,218,.65), transparent 32%, rgba(246,242,231,.35) 65%, rgba(226,225,208,.5))`,
        }}
      />
      <div
        className="mr-cta-noise absolute -inset-[14%]"
        style={{
          backgroundImage: `radial-gradient(ellipse 42% 75% at 48% 52%, rgba(${burstRgb},0.35), transparent 78%), url('/textures/cream-grain-64.png')`,
          backgroundSize: `auto, ${Math.round(64 * settings.ctaNoiseScale)}px`,
          opacity: settings.ctaNoiseOpacity / 100,
          mixBlendMode: 'multiply',
          animationDuration: `${Math.max(8, 28 / Math.max(0.1, settings.ctaNoiseSpeed))}s`,
          animationPlayState: active && settings.ctaNoiseSpeed > 0 ? 'running' : 'paused',
        }}
      />
      <div className="mr-cta-orbit mr-cta-orbit-one" style={{ animationPlayState: active ? 'running' : 'paused' }} />
      <div className="mr-cta-orbit mr-cta-orbit-two" style={{ animationPlayState: active ? 'running' : 'paused' }} />
    </div>
  )
}
