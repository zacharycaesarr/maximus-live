'use client'

import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

const SPRING = { stiffness: 180, damping: 22 }
const TAP_TILT = { x: 0.25, y: 0.35 }
const TAP_RESET_MS = 450

export function useTiltMotion() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, SPRING)
  const sy = useSpring(my, SPRING)
  const rotateX = useTransform(sy, [0, 1], [8, -8])
  const rotateY = useTransform(sx, [0, 1], [-10, 10])
  const spot = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(196,165,116,0.18), transparent 55%)`,
  )
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTilt = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  const playTapTilt = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current)
    mx.set(TAP_TILT.x)
    my.set(TAP_TILT.y)
    tapTimer.current = setTimeout(resetTilt, TAP_RESET_MS)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  const onPointerLeave = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current)
    resetTilt()
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return
    playTapTilt()
  }

  const onClick = () => {
    if (window.matchMedia('(pointer: coarse)').matches) playTapTilt()
  }

  return {
    ref,
    rotateX,
    rotateY,
    spot,
    handlers: { onPointerMove, onPointerLeave, onPointerDown, onClick },
  }
}

type BaseProps = {
  children: ReactNode
  className?: string
  showSpotlight?: boolean
}

type DivProps = BaseProps & { as?: 'div' }
type ArticleProps = BaseProps & { as: 'article' }
type AnchorProps = BaseProps & { as: 'a' } & Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'>

export type TiltSurfaceProps = DivProps | ArticleProps | AnchorProps

export default function TiltSurface(props: TiltSurfaceProps) {
  const { children, className, showSpotlight = true, as = 'div' } = props
  const { ref, rotateX, rotateY, spot, handlers } = useTiltMotion()

  const shell = (
    <>
      {showSpotlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity group-hover:opacity-100"
          style={{ backgroundImage: spot }}
        />
      )}
      {children}
    </>
  )

  if (as === 'a') {
    const { as: _as, showSpotlight: _spot, ...anchorRest } = props as AnchorProps
    return (
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        {...handlers}
        className="group relative"
      >
        <a {...anchorRest} className={cn('relative block no-underline', className)}>
          {shell}
        </a>
      </motion.div>
    )
  }

  if (as === 'article') {
    return (
      <motion.article
        ref={ref}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        {...handlers}
        className={cn('group relative', className)}
      >
        {shell}
      </motion.article>
    )
  }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      {...handlers}
      className={cn('group relative', className)}
    >
      {shell}
    </motion.div>
  )
}
