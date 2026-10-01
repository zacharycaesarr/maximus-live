'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionTemplate } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import {
  PhoneMockAfter,
  PhoneMockBefore,
  type PhoneMockId,
} from '@/components/ui/phone-mocks'
import { cn } from '@/lib/utils'

export type PhoneBeforeAfterSlide = {
  id: PhoneMockId
  label: string
}

type Props = {
  slides: PhoneBeforeAfterSlide[]
  className?: string
  intervalMs?: number
  startId?: PhoneMockId
}

/**
 * Phone proof. Swipe keeps both screens mounted during the slide so no black flash.
 */
export default function PhoneBeforeAfterCarousel({
  slides,
  className,
  intervalMs = 5200,
  startId = 'northline',
}: Props) {
  const found = slides.findIndex((s) => s.id === startId)
  const [i, setI] = useState(found < 0 ? 0 : found)
  const [paused, setPaused] = useState(true)
  const [inView, setInView] = useState(false)
  const [busy, setBusy] = useState(false)
  /** Incoming slide during swipe; null = resting */
  const [incoming, setIncoming] = useState<{ id: PhoneMockId; dir: 1 | -1 } | null>(
    null,
  )
  const [phase, setPhase] = useState<'idle' | 'go'>('idle')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        const on = e.isIntersecting && e.intersectionRatio >= 0.55
        setInView(on)
        setPaused(!on)
      },
      { threshold: [0, 0.55, 1] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView || slides.length < 2 || busy) return
    const id = window.setInterval(() => go(i + 1, 1), intervalMs)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, inView, slides.length, intervalMs, i, busy])

  const go = (next: number, forcedDir?: 1 | -1) => {
    if (busy || slides.length < 2) return
    const wrapped = ((next % slides.length) + slides.length) % slides.length
    if (wrapped === i) return
    const d: 1 | -1 =
      forcedDir ??
      (wrapped > i || (i === slides.length - 1 && wrapped === 0) ? 1 : -1)
    const nextSlide = slides[wrapped]
    if (!nextSlide) return

    setBusy(true)
    setIncoming({ id: nextSlide.id, dir: d })
    setPhase('idle')
    // next frame: animate both
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('go'))
    })
    window.setTimeout(() => {
      setI(wrapped)
      setIncoming(null)
      setPhase('idle')
      setBusy(false)
    }, 320)
  }

  const slide = slides[i]
  if (!slide) return null

  const dir = incoming?.dir ?? 1

  return (
    <div
      ref={rootRef}
      className={cn('relative flex w-full flex-col items-center gap-3', className)}
    >
      <p className="w-full text-center font-switzer text-[11px] font-medium uppercase tracking-[0.14em] text-espresso/50">
        <span className="hidden md:inline">Hover the screen to peek at before</span>
        <span className="md:hidden">Hold and drag to peek at before</span>
      </p>

      <div
        className="relative w-[220px] shrink-0 md:w-[260px]"
        style={{ aspectRatio: '9 / 19.5' }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => {
          if (inView) setPaused(false)
        }}
      >
        <div className="absolute inset-0 rounded-[2.4rem] bg-[#1a1612] p-[10px] shadow-[0_24px_60px_rgba(26,22,18,0.35)] ring-1 ring-black/40">
          <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-black">
            <div className="pointer-events-none absolute left-1/2 top-2.5 z-20 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-black" />

            {/* Current */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform:
                  phase === 'go' && incoming
                    ? `translate3d(${dir * -105}%,0,0)`
                    : 'translate3d(0,0,0)',
                transition:
                  phase === 'go'
                    ? 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'none',
                pointerEvents: incoming ? 'none' : 'auto',
              }}
            >
              <MockSliceReveal id={slide.id} />
            </div>

            {/* Incoming — already painted, slides in (no black gap) */}
            {incoming ? (
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  transform:
                    phase === 'go'
                      ? 'translate3d(0,0,0)'
                      : `translate3d(${incoming.dir * 105}%,0,0)`,
                  transition:
                    phase === 'go'
                      ? 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
                      : 'none',
                  pointerEvents: 'none',
                }}
              >
                <MockSliceReveal id={incoming.id} />
              </div>
            ) : null}
          </div>
        </div>
        <div className="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-l bg-[#2a2420]" />
        <div className="absolute -left-[3px] top-[28%] h-12 w-[3px] rounded-l bg-[#2a2420]" />
        <div className="absolute -right-[3px] top-[24%] h-14 w-[3px] rounded-r bg-[#2a2420]" />
      </div>

      <p className="w-[220px] text-center font-switzer text-[12px] font-medium text-espresso md:w-[260px]">
        {incoming ? slides.find((s) => s.id === incoming.id)?.label ?? slide.label : slide.label}
      </p>

      {slides.length > 1 && (
        <div className="flex w-[220px] items-center justify-center gap-2 md:w-[260px]">
          <button
            type="button"
            data-magnetic
            aria-label="Previous"
            disabled={busy}
            onClick={() => go(i - 1, -1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-espresso/15 bg-white/70 text-espresso/70 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            data-magnetic
            aria-label={paused ? 'Play' : 'Pause'}
            onClick={() => setPaused((p) => !p)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-espresso/15 bg-white/70 text-espresso/70"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            type="button"
            data-magnetic
            aria-label="Next"
            disabled={busy}
            onClick={() => go(i + 1, 1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-espresso/15 bg-white/70 text-espresso/70 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

function MockSliceReveal({ id }: { id: PhoneMockId }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [mountBefore, setMountBefore] = useState(false)
  const axisRef = useRef<'x' | 'y'>('y')
  const spring = { stiffness: 400, damping: 30 }
  const insetTop = useSpring(2000, spring)
  const insetRight = useSpring(0, spring)
  const insetBottom = useSpring(0, spring)
  const insetLeft = useSpring(0, spring)
  const clipPath = useMotionTemplate`inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px)`
  const thickness = 100

  useEffect(() => {
    setMountBefore(false)
    setActive(false)
    const el = ref.current
    if (!el) return
    const close = () => {
      const h = el.getBoundingClientRect().height
      if (h <= 0) return
      insetTop.jump(h)
      insetBottom.jump(0)
      insetLeft.jump(0)
      insetRight.jump(0)
    }
    close()
    const ro = new ResizeObserver(close)
    ro.observe(el)
    return () => ro.disconnect()
  }, [id, insetTop, insetBottom, insetLeft, insetRight])

  const start = (clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    if (!mountBefore) setMountBefore(true)
    setActive(true)
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const fromLeft = x < rect.width / 2
    const fromTop = y < rect.height / 2
    axisRef.current =
      Math.abs(x - rect.width / 2) > Math.abs(y - rect.height / 2) ? 'x' : 'y'
    if (axisRef.current === 'x') {
      insetTop.jump(0)
      insetBottom.jump(0)
      if (fromLeft) {
        insetLeft.jump(0)
        insetRight.jump(rect.width)
      } else {
        insetLeft.jump(rect.width)
        insetRight.jump(0)
      }
      insetLeft.set(x - thickness / 2)
      insetRight.set(rect.width - (x + thickness / 2))
    } else {
      insetLeft.jump(0)
      insetRight.jump(0)
      if (fromTop) {
        insetTop.jump(0)
        insetBottom.jump(rect.height)
      } else {
        insetTop.jump(rect.height)
        insetBottom.jump(0)
      }
      insetTop.set(y - thickness / 2)
      insetBottom.set(rect.height - (y + thickness / 2))
    }
  }

  const move = (clientX: number, clientY: number) => {
    if (!active || !ref.current) return
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

  const end = () => {
    if (!ref.current) return
    setActive(false)
    const rect = ref.current.getBoundingClientRect()
    insetTop.set(rect.height)
    insetBottom.set(0)
    insetLeft.set(0)
    insetRight.set(0)
  }

  return (
    <div
      ref={ref}
      className="relative h-full w-full touch-none select-none"
      onMouseEnter={(e) => start(e.clientX, e.clientY)}
      onMouseMove={(e) => move(e.clientX, e.clientY)}
      onMouseLeave={() => end()}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        start(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => move(e.clientX, e.clientY)}
      onPointerUp={() => end()}
    >
      <div className="absolute inset-0">
        <PhoneMockAfter id={id} />
      </div>
      {mountBefore ? (
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <PhoneMockBefore id={id} />
        </motion.div>
      ) : null}
    </div>
  )
}
