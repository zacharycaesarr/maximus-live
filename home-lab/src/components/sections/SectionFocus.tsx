'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

type Align = 'left' | 'right' | 'center'

type Props = {
  children: ReactNode
  align?: Align
  className?: string
  idleScale?: number
  focusScale?: number
  idleOffsetX?: number
  springStiffness?: number
  springDamping?: number
  /** Soften Z motion on narrow screens */
  mobileSimplify?: boolean
}

/**
 * Z-pattern scroll focus:
 * Starts small on left/right → grows + centers when in view → returns to idle when leaving.
 * Exit window is earlier so tall sections (Proof) visibly shrink back.
 */
export default function SectionFocus({
  children,
  align = 'left',
  className,
  idleScale = 0.78,
  focusScale = 1.05,
  idleOffsetX = 96,
  springStiffness = 120,
  springDamping = 26,
  mobileSimplify = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    // Enter → hold focus → exit earlier so return-to-idle is visible on tall blocks
    offset: ['start 88%', 'center center', 'end 35%'],
  })

  const scaleIdle = isMobile && mobileSimplify ? Math.min(0.92, idleScale + 0.1) : idleScale
  const xIdle =
    align === 'center'
      ? 0
      : align === 'left'
        ? -(isMobile && mobileSimplify ? idleOffsetX * 0.35 : idleOffsetX)
        : isMobile && mobileSimplify
          ? idleOffsetX * 0.35
          : idleOffsetX

  const origin =
    align === 'left' ? 'left center' : align === 'right' ? 'right center' : 'center center'

  // Longer idle tails + sharp focus band so Proof clearly returns right/small (desktop).
  // Mobile: enter + hold focus, no exit shrink/slide-back.
  const scaleKeyframes =
    isMobile && mobileSimplify
      ? [scaleIdle, scaleIdle, focusScale, focusScale, focusScale, focusScale]
      : [scaleIdle, scaleIdle, focusScale, focusScale, scaleIdle, scaleIdle]
  const xKeyframes =
    isMobile && mobileSimplify
      ? [xIdle, xIdle, 0, 0, 0, 0]
      : [xIdle, xIdle, 0, 0, xIdle, xIdle]
  const yKeyframes = isMobile && mobileSimplify ? [28, 0, 0, 0] : [28, 0, 0, 28]

  const rawScale = useTransform(scrollYProgress, [0, 0.18, 0.38, 0.55, 0.78, 1], scaleKeyframes)
  const rawX = useTransform(scrollYProgress, [0, 0.18, 0.38, 0.55, 0.78, 1], xKeyframes)
  const rawY = useTransform(scrollYProgress, [0, 0.38, 0.55, 1], yKeyframes)

  const scale = useSpring(rawScale, {
    stiffness: springStiffness,
    damping: springDamping,
    mass: 0.4,
  })
  const x = useSpring(rawX, { stiffness: springStiffness, damping: springDamping, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: springStiffness, damping: springDamping, mass: 0.4 })

  // Only promote a GPU layer while the block is near the viewport.
  // Same motion, less permanent compositor cost across five homepage sections.
  const [nearView, setNearView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNearView(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => setNearView(Boolean(entry?.isIntersecting)),
      { rootMargin: '20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('relative w-full max-w-[100vw] overflow-x-clip py-10 md:py-16', className)}
      data-parallax-pause
    >
      <motion.div
        style={{
          scale,
          x,
          y,
          transformOrigin: origin,
          willChange: nearView ? 'transform' : 'auto',
        }}
      >
        {children}
      </motion.div>
      <div className="pointer-events-none h-8 md:h-16" aria-hidden />
    </div>
  )
}

export function SectionParallax({
  children,
  strength = 10,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useSpring(0, { stiffness: 120, damping: 20 })
  const my = useSpring(0, { stiffness: 120, damping: 20 })

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia('(pointer: coarse)').matches) return
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        mx.set(px * strength)
        my.set(py * strength)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div style={{ x: mx as MotionValue<number>, y: my as MotionValue<number> }}>
        {children}
      </motion.div>
    </div>
  )
}
