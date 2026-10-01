'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimation,
  useSpring,
  useMotionTemplate,
} from 'framer-motion'
import { cn } from '@/lib/utils'

export type ImageHoverRevealProps = {
  className?: string
  src?: string
  overlaySrc?: string
  alt?: string
  /** directional = desktop hover wipe; slice = mouse/finger track band */
  variant?: 'directional' | 'slice'
  /** when false, base image stays full color (before/after phone use) */
  grayscaleBase?: boolean
  /**
   * Phone proof mode: show overlaySrc as the always-visible "after",
   * and reveal src ("before") inside the track slot.
   */
  preferOverlayAsBase?: boolean
}

const DEFAULT_IMAGE =
  'https://cdn.21st.dev/assets/mirror/a4/a43bf56ff6e4fd6a14da2e76b70d3126fe3a3ad70500d1d8cba05ff0276991d5.jpg'

/**
 * 21st Great UI Image Hover Reveal (saurabh-2607).
 * Slice variant uses pointer events so mobile tap-hold-drag works.
 */
export default function ImageHoverReveal({
  className = '',
  src = DEFAULT_IMAGE,
  overlaySrc,
  alt = 'Before after reveal',
  variant = 'directional',
  grayscaleBase = true,
  preferOverlayAsBase = false,
}: ImageHoverRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)
  const axisRef = useRef<'x' | 'y'>('x')
  const springConfig = { stiffness: 400, damping: 30 }
  const insetTop = useSpring(112, springConfig)
  const insetRight = useSpring(112, springConfig)
  const insetBottom = useSpring(112, springConfig)
  const insetLeft = useSpring(112, springConfig)
  const clipPath = useMotionTemplate`inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px)`
  const thickness = 120

  const baseSrc = preferOverlayAsBase ? overlaySrc || src : src
  const slotSrc = preferOverlayAsBase ? src : overlaySrc || src

  useEffect(() => {
    if (variant === 'slice' && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      if (preferOverlayAsBase) {
        // hide the "before" slot until hover/drag
        insetTop.jump(rect.height)
        insetBottom.jump(0)
        insetLeft.jump(0)
        insetRight.jump(0)
      } else {
        insetTop.jump(rect.height / 2)
        insetBottom.jump(rect.height / 2)
        insetLeft.jump(rect.width / 2)
        insetRight.jump(rect.width / 2)
      }
    }
  }, [variant, preferOverlayAsBase, insetTop, insetBottom, insetLeft, insetRight])

  const getDirection = (clientX: number, clientY: number) => {
    if (!ref.current) return 'top'
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = clientX - left - width / 2
    const y = clientY - top - height / 2
    const angle = Math.atan2(y, x) * (180 / Math.PI)
    if (angle > -45 && angle <= 45) return 'right'
    if (angle > 45 && angle <= 135) return 'bottom'
    if (angle > -135 && angle <= -45) return 'top'
    return 'left'
  }

  const getHiddenClipPath = (dir: string) => {
    switch (dir) {
      case 'top':
        return 'inset(0% 0% 100% 0%)'
      case 'bottom':
        return 'inset(100% 0% 0% 0%)'
      case 'left':
        return 'inset(0% 100% 0% 0%)'
      case 'right':
        return 'inset(0% 0% 0% 100%)'
      default:
        return 'inset(0% 0% 100% 0%)'
    }
  }

  const startSlice = (clientX: number, clientY: number) => {
    if (!ref.current) return
    setIsHovered(true)
    const rect = ref.current.getBoundingClientRect()
    const dir = getDirection(clientX, clientY)
    const x = clientX - rect.left
    const y = clientY - rect.top

    if (dir === 'left' || dir === 'right') {
      axisRef.current = 'x'
      insetTop.jump(0)
      insetBottom.jump(0)
      if (dir === 'left') {
        insetLeft.jump(0)
        insetRight.jump(rect.width)
      } else {
        insetLeft.jump(rect.width)
        insetRight.jump(0)
      }
    } else {
      axisRef.current = 'y'
      insetLeft.jump(0)
      insetRight.jump(0)
      if (dir === 'top') {
        insetTop.jump(0)
        insetBottom.jump(rect.height)
      } else {
        insetTop.jump(rect.height)
        insetBottom.jump(0)
      }
    }

    if (axisRef.current === 'x') {
      insetLeft.set(x - thickness / 2)
      insetRight.set(rect.width - (x + thickness / 2))
    } else {
      insetTop.set(y - thickness / 2)
      insetBottom.set(rect.height - (y + thickness / 2))
    }
  }

  const moveSlice = (clientX: number, clientY: number) => {
    if (variant !== 'slice' || !ref.current || !isHovered) return
    const rect = ref.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    if (axisRef.current === 'x') {
      insetLeft.set(x - thickness / 2)
      insetRight.set(rect.width - (x + thickness / 2))
    } else {
      insetTop.set(y - thickness / 2)
      insetBottom.set(rect.height - (y + thickness / 2))
    }
  }

  const endSlice = (clientX: number, clientY: number) => {
    if (!ref.current) return
    setIsHovered(false)
    const rect = ref.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    if (axisRef.current === 'x') {
      if (x < rect.width / 2) {
        insetLeft.set(0)
        insetRight.set(rect.width)
      } else {
        insetLeft.set(rect.width)
        insetRight.set(0)
      }
    } else if (y < rect.height / 2) {
      insetTop.set(0)
      insetBottom.set(rect.height)
    } else {
      insetTop.set(rect.height)
      insetBottom.set(0)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative touch-none select-none overflow-hidden',
        variant === 'slice' ? 'cursor-crosshair' : '',
        className,
      )}
      onMouseEnter={(e) => {
        if (variant === 'directional') {
          const dir = getDirection(e.clientX, e.clientY)
          controls.set({ clipPath: getHiddenClipPath(dir) })
          controls.start({
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: { duration: 0.4, ease: 'easeInOut' },
          })
        } else {
          startSlice(e.clientX, e.clientY)
        }
      }}
      onMouseMove={(e) => moveSlice(e.clientX, e.clientY)}
      onMouseLeave={(e) => {
        if (variant === 'directional') {
          const dir = getDirection(e.clientX, e.clientY)
          controls.start({
            clipPath: getHiddenClipPath(dir),
            transition: { duration: 0.4, ease: 'easeInOut' },
          })
        } else {
          endSlice(e.clientX, e.clientY)
        }
      }}
      onPointerDown={(e) => {
        if (variant !== 'slice') return
        e.currentTarget.setPointerCapture(e.pointerId)
        startSlice(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (variant !== 'slice') return
        moveSlice(e.clientX, e.clientY)
      }}
      onPointerUp={(e) => {
        if (variant !== 'slice') return
        endSlice(e.clientX, e.clientY)
      }}
    >
      <img
        src={baseSrc}
        alt={`${alt} base`}
        className={cn('h-full w-full object-cover', grayscaleBase && !preferOverlayAsBase && 'grayscale')}
      />
      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={variant === 'slice' ? { clipPath } : { clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={variant === 'directional' ? controls : undefined}
        initial={variant === 'directional' ? { clipPath: 'inset(0% 0% 100% 0%)' } : undefined}
      >
        <img src={slotSrc} alt={`${alt} reveal`} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  )
}
