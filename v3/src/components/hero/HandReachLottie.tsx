import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Lottie, type LottieHandle } from 'lottie-react'
import { useGetStartedHover } from '@/context/GetStartedHoverContext'
import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'

type Dock = { top: number; left: number; width: number; ready: boolean }

/**
 * Fixed + body portal. Tracks Get Started via getBoundingClientRect every frame.
 * handLayer below = sits under the CTA; above = on top for tuning.
 */
export default function HandReachLottie() {
  const layout = useHeroLayoutTuner()
  const { active: hoverActive } = useGetStartedHover()
  const reduceMotion = useReducedMotion()
  const lottieRef = useRef<LottieHandle>(null)
  const leaveTimer = useRef<number | null>(null)
  const reverseDoneTimer = useRef<number | null>(null)
  const [posedIn, setPosedIn] = useState(false)
  const [dock, setDock] = useState<Dock>({ top: 0, left: 0, width: 200, ready: false })
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const active = hoverActive || layout.handPreview
  const onRight = layout.handSide === 'right'
  const slidePx = Math.max(40, layout.handSlidePx ?? 140)
  const handZ = layout.handLayer === 'below' ? 3 : 35

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const clearTimers = () => {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    if (reverseDoneTimer.current) {
      window.clearTimeout(reverseDoneTimer.current)
      reverseDoneTimer.current = null
    }
  }

  useEffect(() => {
    if (!layout.handEnabled || isMobile) return undefined

    let raf = 0
    const place = () => {
      const btn = document.querySelector('[data-get-started-btn]') as HTMLElement | null
      if (!btn || btn.getAttribute('data-cta-armed') !== '1') {
        setDock((d) => ({ ...d, ready: false }))
        raf = requestAnimationFrame(place)
        return
      }

      const br = btn.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const mobile = vw < 640

      const onScreen = br.bottom > 24 && br.top < vh - 24 && br.width > 8
      if (!onScreen) {
        setDock((d) => ({ ...d, ready: false }))
        raf = requestAnimationFrame(place)
        return
      }

      const maxW = mobile
        ? Math.min(130, Math.max(88, vw * 0.34))
        : Math.min(220, Math.max(110, vw * 0.16))
      const width = maxW

      // Emerge from behind the button — anchored to button center, tucked under it
      let left: number
      if (onRight) {
        left = br.right - width * 0.22 + (layout.handOffsetX || 0)
      } else {
        left = br.left - width * 0.78 + (layout.handOffsetX || 0)
      }

      left = Math.min(vw - width - 4, Math.max(4, left))

      const top = Math.min(
        vh - width * 0.72,
        Math.max(4, br.top + br.height * 0.42 - width * 0.35 + (layout.handOffsetY || 0)),
      )

      setDock({ top, left, width, ready: true })
      raf = requestAnimationFrame(place)
    }

    raf = requestAnimationFrame(place)
    return () => cancelAnimationFrame(raf)
  }, [layout.handEnabled, layout.handOffsetX, layout.handOffsetY, layout.handSide, onRight, isMobile])

  useEffect(() => {
    if (isMobile) return undefined
    clearTimers()
    const api = lottieRef.current

    if (reduceMotion) {
      setPosedIn(active)
      if (api) {
        try {
          if (active) api.seek({ percent: 1 })
          else api.seek({ percent: 0 })
        } catch {
          /* ignore */
        }
      }
      return clearTimers
    }

    if (active) {
      setPosedIn(true)
      if (!api) return clearTimers
      try {
        api.setSpeed(layout.handSpeed)
        if (layout.handPreview && !hoverActive) {
          api.setDirection('forward')
          api.seek({ percent: 1 })
          api.pause()
        } else {
          api.setDirection('forward')
          api.seek({ frame: 0 })
          api.play()
        }
      } catch {
        /* ignore */
      }
    } else {
      const handle = lottieRef.current
      if (handle) {
        try {
          handle.setSpeed(layout.handSpeed)
          handle.setDirection('reverse')
          handle.play()
        } catch {
          /* ignore */
        }
      }
      const hold = Math.max(0, layout.handRetractHoldMs ?? 110)
      leaveTimer.current = window.setTimeout(() => setPosedIn(false), hold)
      const fullMs = Math.max(120, Math.round((120 / 60 / layout.handSpeed) * 1000))
      const early = Math.min(0.9, Math.max(0, layout.handFadeEarly))
      reverseDoneTimer.current = window.setTimeout(() => {
        try {
          lottieRef.current?.seek({ frame: 0 })
        } catch {
          /* ignore */
        }
      }, hold + Math.round(fullMs * (1 - early)))
    }

    return clearTimers
  }, [
    active,
    hoverActive,
    reduceMotion,
    layout.handSpeed,
    layout.handPreview,
    layout.handFadeEarly,
    layout.handRetractHoldMs,
    isMobile,
  ])

  if (!mounted || isMobile || !layout.handEnabled || !dock.ready) return null

  const show = posedIn
  const fadeOutSec = (layout.handFadeOutMs || 120) / 1000
  const revealSec = (layout.handRevealMs || 280) / 1000
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const mobile = vw < 640
  const scale = mobile ? Math.min(layout.handScale, 0.62) : Math.min(layout.handScale, 0.82)

  return createPortal(
    <motion.div
      className="pointer-events-none fixed"
      style={{
        zIndex: handZ,
        top: dock.top,
        left: dock.left,
        width: dock.width,
      }}
      initial={false}
      animate={show ? { opacity: 0.92, x: 0 } : { opacity: 0, x: onRight ? slidePx : -slidePx }}
      transition={{
        duration: show ? revealSec : fadeOutSec,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden
      data-hand-active={show ? '1' : '0'}
    >
      <div
        style={{
          transform: onRight ? `scaleX(-1) scale(${scale})` : `scale(${scale})`,
          transformOrigin: onRight ? 'left center' : 'right center',
          // Sketch Lottie is black ink — invert for dark video hero
          filter: 'invert(1)',
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          src="/lottie/hand-sketch-reach.json"
          loop={false}
          autoplay={false}
          className="h-auto w-full"
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      </div>
    </motion.div>,
    document.body,
  )
}
