'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  bars?: number
  /** 0..1 how much noise vs clean signal */
  noise?: number
  color?: string
  accent?: string
}

/**
 * Hero backdrop. A row of bars riding a slow wave. Where the pointer
 * (or thumb) is, the noise calms into one clean signal.
 * Canvas, rAF, pauses off-screen.
 */
export default function SignalField({
  className,
  bars = 72,
  noise = 0.55,
  color = '#2C2520',
  accent = '#c4a574',
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: -1, t: 0 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = true
    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.current.x = (e.clientX - r.left) / r.width
      pointer.current.t = 1
    }
    const onLeave = () => {
      pointer.current.x = -1
    }
    canvas.parentElement?.addEventListener('pointermove', onMove, { passive: true })
    canvas.parentElement?.addEventListener('pointerleave', onLeave)

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running && !raf) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)

    // stable pseudo noise per bar
    const seeds = Array.from({ length: bars }, (_, i) => Math.sin(i * 12.9898) * 43758.5453 % 1)

    let t0 = performance.now()
    let calm = 0
    function draw(now: number) {
      raf = 0
      if (!running) return
      const t = (now - t0) / 1000
      ctx!.clearRect(0, 0, w, h)
      const gap = w / bars
      const bw = Math.max(2, gap * 0.42)
      const px = pointer.current.x
      // calm follows pointer presence; on touch devices drift on its own
      const auto = px < 0 ? (Math.sin(t * 0.35) + 1) / 2 : px
      calm += ((px < 0 ? 0.6 : 1) - calm) * 0.04

      for (let i = 0; i < bars; i++) {
        const u = i / (bars - 1)
        const dist = Math.abs(u - auto)
        const focus = Math.max(0, 1 - dist / 0.22) // 1 near pointer
        const wave = Math.sin(u * 6.2 + t * 1.2) * 0.5 + 0.5
        const jitter = (Math.sin(t * 9 + seeds[i] * 60) * 0.5 + 0.5) * noise * (1 - focus * calm)
        const amp = 0.18 + wave * 0.42 + jitter * 0.4
        const bh = amp * h * 0.9
        const x = i * gap + gap / 2 - bw / 2
        const y = (h - bh) / 2
        const a = 0.12 + focus * 0.7
        ctx!.fillStyle = focus > 0.55 ? accent : color
        ctx!.globalAlpha = a
        ctx!.beginPath()
        ctx!.roundRect(x, y, bw, bh, bw / 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
      if (!reduced) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    if (reduced) {
      // one still frame
      t0 = performance.now() - 1000
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.parentElement?.removeEventListener('pointermove', onMove)
      canvas.parentElement?.removeEventListener('pointerleave', onLeave)
    }
  }, [bars, noise, color, accent])

  return <canvas ref={ref} className={cn('block h-full w-full', className)} aria-hidden />
}
