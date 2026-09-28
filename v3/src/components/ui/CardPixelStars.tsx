'use client'

/**
 * Card-scoped pixel stars — adapted from 21st.dev @uicapsule/background-pixel-stars.
 * Sized to the card (not the window). Low density, ~12fps, pauses off-screen.
 * Keep tilt on the card shell; this is a paint layer only.
 */

import { memo, useCallback, useEffect, useRef } from 'react'

const STAR_COLORS = ['#FFFFFF', '#FFEDD5', '#FFE6B9', '#FFFFAA', '#AAFFFF'] as const

const starDensity = 0.00016
const twinkleProbability = 0.7
const minTwinkleSpeed = 2
const maxTwinkleSpeed = 4
const pixelSize = 3
const targetFps = 12
const frameInterval = 1000 / targetFps

type Star = {
  x: number
  y: number
  color: string
  baseOpacity: number
  currentOpacity: number
  twinkle: boolean
  twinkleSpeed: number
  twinkleDirection: number
  twinkleTimer: number
}

type Props = {
  className?: string
  /** Extra dim so stars sit on brand colors without blowing out */
  opacity?: number
}

function CardPixelStars({ className, opacity = 0.55 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const liveRef = useRef(true)

  const initStars = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    starsRef.current = []
    const area = canvas.width * canvas.height
    const n = Math.max(8, Math.floor(area * starDensity))
    for (let i = 0; i < n; i++) {
      const baseOpacity = Math.random() * 0.45 + 0.4
      starsRef.current.push({
        x: Math.floor(Math.random() * (canvas.width / pixelSize)) * pixelSize,
        y: Math.floor(Math.random() * (canvas.height / pixelSize)) * pixelSize,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]!,
        baseOpacity,
        currentOpacity: baseOpacity,
        twinkle: Math.random() < twinkleProbability,
        twinkleSpeed: minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed),
        twinkleDirection: -1,
        twinkleTimer: 0,
      })
    }
  }, [])

  const sizeToParent = useCallback(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const w = Math.max(1, Math.floor(wrap.clientWidth))
    const h = Math.max(1, Math.floor(wrap.clientHeight))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
      initStars()
    }
  }, [initStars])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return undefined

    sizeToParent()

    const io = new IntersectionObserver(
      ([e]) => {
        liveRef.current = e.isIntersecting
      },
      { threshold: 0.05 },
    )
    io.observe(wrap)

    const ro = new ResizeObserver(() => sizeToParent())
    ro.observe(wrap)

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick)
      if (!liveRef.current) return
      if (ts - lastRef.current < frameInterval) return
      lastRef.current = ts

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const star of starsRef.current) {
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.currentOpacity
        ctx.fillRect(star.x, star.y, pixelSize, pixelSize)

        if (!star.twinkle) continue
        star.twinkleTimer += 1 / targetFps
        if (star.twinkleTimer >= star.twinkleSpeed) {
          star.twinkleTimer = 0
          star.twinkleDirection *= -1
        }
        const progress = star.twinkleTimer / star.twinkleSpeed
        if (progress < 0.5) {
          star.currentOpacity =
            star.twinkleDirection < 0 ? star.baseOpacity : star.baseOpacity * 0.28
        } else {
          star.currentOpacity =
            star.twinkleDirection < 0 ? star.baseOpacity * 0.28 : star.baseOpacity
        }
      }
      ctx.globalAlpha = 1
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      io.disconnect()
      ro.disconnect()
    }
  }, [sizeToParent])

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  )
}

export default memo(CardPixelStars)
