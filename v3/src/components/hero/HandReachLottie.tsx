import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Lottie, type LottieHandle } from 'lottie-react'
import { useGetStartedHover } from '@/context/GetStartedHoverContext'
import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'
import handAnimationSource from '../../../public/lottie/hand-sketch-reach.json?raw'

// Keep the exact artwork in this already-lazy module. Returning to the hero
// reuses its parsed source instead of issuing another XHR on every player mount.
const handAnimation = JSON.parse(handAnimationSource)

type Dock = { top: number; left: number; width: number; ready: boolean }

/**
 * Fixed + body portal. Tracks the button during interaction; caches it at rest.
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
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches)

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

    const btn = document.querySelector('[data-get-started-btn]') as HTMLElement | null
    if (!btn) return undefined
    let raf = 0
    let visible = true
    let settleUntil = 0
    const hide = () => setDock((dock) => dock.ready ? { ...dock, ready: false } : dock)
    const schedule = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(place)
    }
    const continueTracking = () => {
      if (active || posedIn || performance.now() < settleUntil) schedule()
    }
    // Keep following the original spring/hover motion until it settles, but
    // don't force a geometry read every frame when the invisible hand is idle.
    const geometryChanged = () => { settleUntil = performance.now() + 1000; schedule() }
    const place = () => {
      raf = 0
      if (btn.getAttribute('data-cta-armed') !== '1') {
        hide()
        continueTracking()
        return
      }

      const br = btn.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const mobile = vw < 640

      const onScreen = br.bottom > 24 && br.top < vh - 24 && br.width > 8
      if (!onScreen) {
        hide()
        continueTracking()
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

      setDock((dock) => dock.ready && dock.top === top && dock.left === left && dock.width === width
        ? dock
        : { top, left, width, ready: true })
      continueTracking()
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else {
        cancelAnimationFrame(raf)
        raf = 0
        hide()
      }
    }, { rootMargin: '-24px 0px -24px 0px' })
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else geometryChanged()
    }
    observer.observe(btn)
    const sizeObserver = new ResizeObserver(geometryChanged)
    sizeObserver.observe(btn)
    const armedObserver = new MutationObserver(geometryChanged)
    armedObserver.observe(btn, { attributes: true, attributeFilter: ['data-cta-armed'] })
    window.addEventListener('resize', geometryChanged)
    window.addEventListener('scroll', geometryChanged, { passive: true })
    window.addEventListener('pointermove', geometryChanged, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    schedule()
    return () => {
      observer.disconnect()
      sizeObserver.disconnect()
      armedObserver.disconnect()
      window.removeEventListener('resize', geometryChanged)
      window.removeEventListener('scroll', geometryChanged)
      window.removeEventListener('pointermove', geometryChanged)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
    }
  }, [layout.handEnabled, layout.handOffsetX, layout.handOffsetY, layout.handSide, onRight, isMobile, active, posedIn])

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
          src={handAnimation}
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
