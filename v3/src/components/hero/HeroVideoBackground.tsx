import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  /** Don't start playback until the intro/preloader has finished */
  active: boolean
  /** 0-1 darkening over the left side so copy stays readable */
  overlayOpacity: number
  /** Desktop: shift video only (px). + down, − up. */
  offsetYDesktop?: number
  /** Mobile: shift video only (px). + down, − up. */
  offsetYMobile?: number
}

const MOBILE_MQ = '(max-width: 767px)'
const MOBILE_SRC = '/heromobile-4k-handbrakefinal.mp4'
const DESKTOP_WEBM = '/Hero-quicktime-handbrake.webm'
const DESKTOP_MP4 = '/Hero-MP4FALLBACK-handbrake.mp4'

/**
 * Native video loop behind the left-aligned hero copy.
 * Mobile (<768px) gets the vertical 4K file. Desktop keeps WebM + MP4.
 * Framing nudge is translateY on the <video> only (Leva) — never re-encode.
 */
export default function HeroVideoBackground({
  active,
  overlayOpacity,
  offsetYDesktop = 0,
  offsetYMobile = 0,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  )
  const offsetY = isMobile ? offsetYMobile : offsetYDesktop

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el || reduceMotion) return

    if (isMobile) {
      if (!el.currentSrc.includes('heromobile-4k-handbrakefinal')) {
        el.src = MOBILE_SRC
        el.load()
      }
    } else if (el.getAttribute('src')) {
      el.removeAttribute('src')
      el.load()
    }
  }, [isMobile, reduceMotion])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return undefined

    const tryPlay = () => {
      if (!active || reduceMotion || document.hidden) return
      el.play().catch(() => {})
    }

    if (active && !reduceMotion) tryPlay()
    else el.pause()

    const onVisibility = () => {
      if (document.hidden) el.pause()
      else tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [active, reduceMotion, isMobile])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause()
        else if (active && !reduceMotion && !document.hidden) el.play().catch(() => {})
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [active, reduceMotion])

  // Slight vertical overscan so translateY never shows empty strip at edges
  const overscan = Math.max(48, Math.abs(offsetY) + 24)

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="absolute left-0 w-full object-cover"
        poster="/video/hero-poster.jpg"
        muted
        loop
        playsInline
        preload={active ? 'auto' : 'none'}
        style={{
          top: -overscan,
          height: `calc(100% + ${overscan * 2}px)`,
          transform: offsetY ? `translate3d(0, ${offsetY}px, 0)` : undefined,
          willChange: offsetY ? 'transform' : undefined,
        }}
      >
        {!reduceMotion && !isMobile && (
          <>
            <source src={DESKTOP_WEBM} type="video/webm" />
            <source src={DESKTOP_MP4} type="video/mp4" />
          </>
        )}
      </video>
      {/* Wash stays pinned to the hero box — does not follow video Y */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(100deg, rgba(10,9,8,${overlayOpacity}) 0%, rgba(10,9,8,${overlayOpacity * 0.45}) 38%, rgba(10,9,8,0) 62%)`,
        }}
      />
    </div>
  )
}
