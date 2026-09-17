import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useHeroLayoutTuner } from '@/context/HeroLayoutTunerContext'

type Props = {
  children: ReactNode
  className?: string
}

/** Background parallax. Oversized so tilt never shows page white. */
export default function HeroBgParallax({ children, className }: Props) {
  const layout = useHeroLayoutTuner()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const pauseRef = useRef(0)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 100, damping: 22, mass: 0.45 })
  const sy = useSpring(y, { stiffness: 100, damping: 22, mass: 0.45 })

  useEffect(() => {
    if (!layout.parallaxEnabled || reduceMotion) {
      x.set(0)
      y.set(0)
      return undefined
    }
    const el = ref.current?.closest('section')
    if (!el) return undefined

    const strength = layout.parallaxStrength * 1.4

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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const rect = el.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      readPause()
      const mul = 1 - pauseRef.current
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      x.set(px * strength * mul)
      y.set(py * strength * mul)
    }

    const onOrient = (e: DeviceOrientationEvent) => {
      readPause()
      const mul = 1 - pauseRef.current
      const gamma = e.gamma ?? 0
      const beta = e.beta ?? 0
      x.set((gamma / 45) * strength * mul)
      y.set(((beta - 45) / 45) * strength * 0.65 * mul)
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof DOE.requestPermission === 'function') {
        const ask = () => {
          void DOE.requestPermission?.().then((state) => {
            if (state === 'granted') window.addEventListener('deviceorientation', onOrient)
          })
        }
        window.addEventListener('touchend', ask, { once: true })
      } else {
        window.addEventListener('deviceorientation', onOrient)
      }
    }

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onOrient)
    }
  }, [layout.parallaxEnabled, layout.parallaxStrength, reduceMotion, x, y])

  return (
    <motion.div ref={ref} className={className} style={{ x: sx, y: sy, scale: 1.08 }}>
      {children}
    </motion.div>
  )
}
