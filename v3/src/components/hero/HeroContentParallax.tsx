import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'

type Props = {
  children: ReactNode
  className?: string
}

/**
 * Hero content parallax. Window-level pointer (more reliable across browsers).
 * Soft pause when a [data-parallax-pause] band is centered in the viewport.
 */
export default function HeroContentParallax({ children, className }: Props) {
  const layout = useHeroLayoutTuner()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const pauseRef = useRef(0)

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)

  const springCfg = { stiffness: 220, damping: 26, mass: 0.4 }
  const srx = useSpring(rx, springCfg)
  const sry = useSpring(ry, springCfg)
  const stx = useSpring(tx, springCfg)
  const sty = useSpring(ty, springCfg)

  useEffect(() => {
    if (!layout.parallaxEnabled || reduceMotion) {
      rx.set(0)
      ry.set(0)
      tx.set(0)
      ty.set(0)
      return undefined
    }

    const root = ref.current?.closest('section') ?? ref.current
    if (!root) return undefined

    const readPause = () => {
      const bands = document.querySelectorAll('[data-parallax-pause]')
      const mid = window.innerHeight * 0.5
      let pause = 0
      bands.forEach((node) => {
        const r = (node as HTMLElement).getBoundingClientRect()
        const c = r.top + r.height / 2
        const dist = Math.abs(c - mid)
        const zone = Math.min(90, r.height * 0.22)
        if (dist < zone) pause = Math.max(pause, 1 - dist / zone)
      })
      pauseRef.current = pause
    }

    const apply = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect()
      if (clientY < rect.top || clientY > rect.bottom || clientX < rect.left || clientX > rect.right) {
        return
      }
      readPause()
      const mul = 1 - pauseRef.current
      const px = (clientX - rect.left) / rect.width - 0.5
      const py = (clientY - rect.top) / rect.height - 0.5
      ry.set(px * layout.parallaxMaxTilt * mul)
      rx.set(-py * layout.parallaxMaxTilt * mul)
      tx.set(px * layout.parallaxStrength * mul)
      ty.set(py * layout.parallaxStrength * mul)
    }

    let touchDown = false
    const onMove = (e: PointerEvent) => {
      // Desktop mouse: always track. Mobile: only while finger is down (tap/drag on models).
      if (e.pointerType === 'touch' && !touchDown) return
      apply(e.clientX, e.clientY)
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      const rect = root.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      touchDown = true
      apply(e.clientX, e.clientY)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      touchDown = false
      rx.set(0)
      ry.set(0)
      tx.set(0)
      ty.set(0)
    }
    const onLeaveWindow = () => {
      touchDown = false
      rx.set(0)
      ry.set(0)
      tx.set(0)
      ty.set(0)
    }

    const onOrient = (e: DeviceOrientationEvent) => {
      readPause()
      const mul = 1 - pauseRef.current
      const gamma = e.gamma ?? 0
      const beta = e.beta ?? 0
      const nx = gamma / 45
      const ny = (beta - 45) / 45
      ry.set(nx * layout.parallaxMaxTilt * mul)
      rx.set(-ny * layout.parallaxMaxTilt * 0.7 * mul)
      tx.set(nx * layout.parallaxStrength * mul)
      ty.set(ny * layout.parallaxStrength * 0.65 * mul)
    }

    // Window listeners: pointerleave on section was killing parallax mid-hover in some browsers
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    window.addEventListener('blur', onLeaveWindow)
    document.addEventListener('mouseleave', onLeaveWindow)

    const coarse = window.matchMedia('(pointer: coarse)').matches
    let orientBound = false
    const bindOrient = () => {
      if (orientBound) return
      orientBound = true
      window.addEventListener('deviceorientation', onOrient)
    }
    if (coarse) {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof DOE.requestPermission === 'function') {
        const ask = () => {
          void DOE.requestPermission?.().then((state) => {
            if (state === 'granted') bindOrient()
          })
        }
        window.addEventListener('touchend', ask, { once: true })
      } else {
        bindOrient()
      }
    }

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('blur', onLeaveWindow)
      document.removeEventListener('mouseleave', onLeaveWindow)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [
    layout.parallaxEnabled,
    layout.parallaxMaxTilt,
    layout.parallaxStrength,
    reduceMotion,
    rx,
    ry,
    tx,
    ty,
  ])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        perspective: layout.parallaxEnabled ? layout.parallaxPerspective : undefined,
      }}
    >
      <motion.div
        className="h-full w-full will-change-transform"
        style={{
          rotateX: srx,
          rotateY: sry,
          x: stx,
          y: sty,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
