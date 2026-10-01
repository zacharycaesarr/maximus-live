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
/** Desk loop — 4K60 HandBrake, byte-copied, never re-encode */
const DESKTOP_SRC = '/Hero-zachsitting-handbrake.mp4'
const DESKTOP_POSTER = '/video/Hero-zachsitting-poster.jpg'
/** Mobile portrait loop — 4K60 HandBrake, byte-copied from Zach export */
const MOBILE_SRC = '/video/Hero-mobile-handbrake.mp4'
const MOBILE_POSTER = '/video/Hero-mobile-poster.jpg'

/**
 * Ambient looping hero bg. Poster paints frame 1 instantly (no black flash).
 * Desktop + mobile use separate HandBrake files. Pause off-screen / tab hide.
 */
export default function HeroVideoBackground({
  active,
  overlayOpacity,
  offsetYDesktop = 0,
  offsetYMobile = 0,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MQ).matches : false,
  )
  const [heroVisible, setHeroVisible] = useState(true)
  const offsetY = isMobile ? offsetYMobile : offsetYDesktop
  const src = isMobile ? MOBILE_SRC : DESKTOP_SRC
  const poster = isMobile ? MOBILE_POSTER : DESKTOP_POSTER

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return undefined

    const tryPlay = () => {
      if (!active || reduceMotion || document.hidden || !heroVisible) return
      el.play().catch(() => {})
    }

    if (active && !reduceMotion && heroVisible && !document.hidden) tryPlay()
    else el.pause()

    const onVisibility = () => {
      if (document.hidden) el.pause()
      else tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [active, reduceMotion, isMobile, heroVisible, src])

  useEffect(() => {
    const root = rootRef.current
    const el = videoRef.current
    if (!root || !el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        const on = entry.isIntersecting && entry.intersectionRatio >= 0.15
        setHeroVisible(on)
        if (!on) el.pause()
        else if (active && !reduceMotion && !document.hidden) el.play().catch(() => {})
      },
      { threshold: [0, 0.15, 0.5, 1] },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [active, reduceMotion, src])

  const overscan = Math.max(48, Math.abs(offsetY) + 24)

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
      aria-hidden
    >
      <video
        ref={videoRef}
        src={reduceMotion ? undefined : src}
        className="absolute left-0 w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload={active ? 'auto' : 'metadata'}
        controls={false}
        disablePictureInPicture
        style={{
          top: -overscan,
          height: `calc(100% + ${overscan * 2}px)`,
          transform: offsetY ? `translate3d(0, ${offsetY}px, 0)` : undefined,
          willChange: offsetY ? 'transform' : undefined,
          // Mobile: lock to top so black sky stays under copy; devices sit lower
          objectPosition: isMobile ? 'center top' : 'center center',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: isMobile
            ? `linear-gradient(180deg, rgba(10,9,8,${overlayOpacity * 0.55}) 0%, rgba(10,9,8,${overlayOpacity * 0.2}) 42%, rgba(10,9,8,0) 68%)`
            : `linear-gradient(100deg, rgba(10,9,8,${overlayOpacity}) 0%, rgba(10,9,8,${overlayOpacity * 0.45}) 38%, rgba(10,9,8,0) 62%)`,
        }}
      />
    </div>
  )
}
