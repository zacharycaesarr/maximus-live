'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  colorA?: string
  colorB?: string
  colorC?: string
  colorD?: string
  grain?: number
  /** Horizontal drift of the darker blobs (noticeable, soft). */
  animated?: boolean
  /** How far blobs travel horizontally (0–1). */
  motionAmount?: number
  /** Drift speed multiplier (1 = calm). */
  motionSpeed?: number
}

/**
 * Mesh gradient — CSS stand-in for 21st paper-design shader.
 * Optional rAF horizontal drift so the darker wash slowly moves.
 */
export default function StaticMeshGradient({
  className,
  colorA = '#141110',
  colorB = '#2C2520',
  colorC = '#8B6950',
  colorD = '#c4a574',
  grain = 0.04,
  animated = false,
  motionAmount = 0.55,
  motionSpeed = 1,
}: Props) {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = layerRef.current
    if (!el) return

    const paint = (shiftX: number) => {
      // Base positions match the static look; only X drifts.
      const cX = 18 + shiftX
      const dX = 82 + shiftX * 0.85
      const bX = 70 + shiftX * 0.4
      const aX = 28 + shiftX * 0.25
      el.style.background = `
        radial-gradient(ellipse 80% 60% at ${cX}% 22%, ${colorC}cc, transparent 55%),
        radial-gradient(ellipse 70% 55% at ${dX}% 18%, ${colorD}99, transparent 50%),
        radial-gradient(ellipse 65% 70% at ${bX}% 78%, ${colorB}ee, transparent 55%),
        radial-gradient(ellipse 55% 50% at ${aX}% 85%, ${colorA}, transparent 50%),
        linear-gradient(160deg, ${colorA}, ${colorB} 45%, ${colorA})
      `
    }

    paint(0)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const amt = Math.max(0, Math.min(1, motionAmount))
    if (!animated || reduce || amt <= 0) return undefined

    let raf = 0
    let t0: number | null = null
    const speed = Math.max(0.15, motionSpeed)

    const tick = (now: number) => {
      if (t0 == null) t0 = now
      const t = (now - t0) / 1000
      // Horizontal only — noticeable but not dizzy. Range ~±10% of viewport width.
      const shiftX = Math.sin(t * 0.28 * speed) * 10 * amt
      paint(shiftX)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [colorA, colorB, colorC, colorD, animated, motionAmount, motionSpeed])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <div ref={layerRef} className="absolute inset-0" />
      {grain > 0 && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: Math.min(0.25, grain * 3),
            mixBlendMode: 'overlay',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
          }}
        />
      )}
    </div>
  )
}

export { StaticMeshGradient as ShaderBackground }
