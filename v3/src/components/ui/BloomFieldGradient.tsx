'use client'

import { useEffect, useRef } from 'react'
import { twentyFirstGrainDataUrl } from '@/components/ui/GrainOverlay'
import { cn } from '@/lib/utils'

export type BloomColor = { hex: string; x: number; y: number; phase: number; phase2: number }

type Props = {
  className?: string
  backdrop?: string
  colors?: BloomColor[]
  grain?: number
  vignette?: number
  speed?: number
  motionAmount?: number
  reverse?: boolean
  animated?: boolean
}

const LIGHT_CREAM: BloomColor[] = [
  { hex: '#F7F1E6', x: 67, y: 46, phase: 1.1, phase2: 2.4 },
  { hex: '#E8D4BC', x: 35, y: 66, phase: 2.7, phase2: 0.8 },
  { hex: '#D9C3B0', x: 48, y: 20, phase: 0.4, phase2: 3.1 },
  { hex: '#C4A574', x: 81, y: 88, phase: 3.6, phase2: 1.5 },
]

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function blob(hex: string, x: number, y: number) {
  return `radial-gradient(circle at ${x}% ${y}%, ${hexToRgba(hex, 1)} 0%, ${hexToRgba(hex, 0.844)} 19%, ${hexToRgba(hex, 0.5)} 38%, ${hexToRgba(hex, 0.156)} 57%, ${hexToRgba(hex, 0)} 76%)`
}

/**
 * 21st Bloom Field mesh — layered radials + grain + optional rAF motion.
 * Modulation is 0 at ph=0 so it never snaps when animation starts.
 */
export default function BloomFieldGradient({
  className = '',
  backdrop = '#F7F1E6',
  colors = LIGHT_CREAM,
  grain = 100,
  vignette = 0.22,
  speed = 48,
  motionAmount = 1,
  reverse = false,
  animated = true,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dir = reverse ? -1 : 1
    const amt = Math.max(0, Math.min(1, motionAmount))
    const speedScale = (speed || 48) / 48
    let raf = 0
    let t0: number | null = null

    const paint = (ph: number) => {
      const spin = ph * dir
      const layers = colors.map((c) => {
        const x = c.x + (Math.sin(spin * 0.55 + c.phase) - Math.sin(c.phase)) * 14 * amt
        const y = c.y + (Math.sin(spin * 0.43 + c.phase2) - Math.sin(c.phase2)) * 14 * amt
        return blob(c.hex, x, y)
      })
      const vig = `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,${vignette}) 100%)`
      const grainLayer = twentyFirstGrainDataUrl(grain)
      el.style.backgroundColor = backdrop
      el.style.backgroundImage = [grainLayer, vig, ...layers].join(', ')
      el.style.backgroundSize = ['120px 120px', ...Array(1 + layers.length).fill('auto')].join(', ')
      el.style.backgroundBlendMode = ['overlay', ...Array(1 + layers.length).fill('normal')].join(
        ', ',
      )
    }

    paint(0)

    if (!animated || reduce || amt <= 0) return undefined

    const tick = (now: number) => {
      if (t0 == null) t0 = now
      const t = (now - t0) / 1000
      const ph = t * 0.48 * speedScale
      paint(ph)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [backdrop, colors, grain, vignette, speed, motionAmount, reverse, animated])

  return (
    <div
      ref={elRef}
      aria-hidden
      className={cn('pointer-events-none inset-0', className)}
      style={{ backgroundColor: backdrop }}
    />
  )
}

export { LIGHT_CREAM }
