'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PhoneImage = {
  src: string
  alt: string
}

type PhoneMockupsProps = {
  images: PhoneImage[]
  className?: string
  /** auto-advance interval ms */
  intervalMs?: number
  /** when true, hide prev/next chrome (for scroll-driven mobile stage) */
  bare?: boolean
  /** force a specific slide index (controlled) */
  index?: number
  onIndexChange?: (i: number) => void
}

/**
 * iPhone frame carousel — inspired by 21st solaceui/phone-mockups-1.
 * Real screenshots go in `images`. Auto-rotates, pausable.
 */
export default function PhoneMockups({
  images,
  className,
  intervalMs = 3800,
  bare = false,
  index: controlledIndex,
  onIndexChange,
}: PhoneMockupsProps) {
  const [internal, setInternal] = useState(0)
  const [paused, setPaused] = useState(false)
  const i = controlledIndex ?? internal
  const setI = useCallback(
    (n: number | ((p: number) => number)) => {
      const next = typeof n === 'function' ? n(controlledIndex ?? internal) : n
      const wrapped = ((next % images.length) + images.length) % images.length
      if (controlledIndex == null) setInternal(wrapped)
      onIndexChange?.(wrapped)
    },
    [controlledIndex, internal, images.length, onIndexChange],
  )

  useEffect(() => {
    if (paused || bare || images.length < 2) return
    const id = window.setInterval(() => setI((p) => p + 1), intervalMs)
    return () => window.clearInterval(id)
  }, [paused, bare, images.length, intervalMs, setI])

  const slide = images[i]
  if (!slide) return null

  return (
    <div className={cn('relative flex flex-col items-center gap-4', className)}>
      {/* phone shell */}
      <div
        className="relative w-[220px] shrink-0 md:w-[260px]"
        style={{ aspectRatio: '9 / 19.5' }}
      >
        <div className="absolute inset-0 rounded-[2.4rem] bg-[#1a1612] p-[10px] shadow-[0_24px_60px_rgba(26,22,18,0.35)] ring-1 ring-black/40">
          {/* bezel */}
          <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-black">
            {/* dynamic island */}
            <div className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-black" />

            <AnimatePresence mode="wait">
              <motion.img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* side buttons (cosmetic) */}
        <div className="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-l bg-[#2a2420]" />
        <div className="absolute -left-[3px] top-[28%] h-12 w-[3px] rounded-l bg-[#2a2420]" />
        <div className="absolute -right-[3px] top-[24%] h-14 w-[3px] rounded-r bg-[#2a2420]" />
      </div>

      {!bare && images.length > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-magnetic
            aria-label="Previous screen"
            onClick={() => setI((p) => p - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/15 bg-white/70 text-espresso/70 transition hover:bg-white"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            data-magnetic
            aria-label={paused ? 'Play' : 'Pause'}
            onClick={() => setPaused((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/15 bg-white/70 text-espresso/70 transition hover:bg-white"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button
            type="button"
            data-magnetic
            aria-label="Next screen"
            onClick={() => setI((p) => p + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/15 bg-white/70 text-espresso/70 transition hover:bg-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
