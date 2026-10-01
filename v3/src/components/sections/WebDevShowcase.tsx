'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import WebDevCaseStudies from './WebDevCaseStudies'
import { WEB_MOCKS, type WorkMockMeta } from '@/work-mockups/mockMeta'
import {
  BuildCaseStage,
  type BuildCaseId,
} from '@/work-mockups/build-case-stages'
import { cn } from '@/lib/utils'

type Mode = 'browsing' | 'focused'

const CARD_W = 360
const CARD_H = 280
const GAP = 20
const SPEED = 0.45

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
export default function WebDevShowcase() {
  const [mode, setMode] = useState<Mode>('browsing')
  const [activeId, setActiveId] = useState<string | null>(null)

  const reduced = useReducedMotion()

  // browsing scroll
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const offscreenRef = useRef(false)
  const trackW = (CARD_W + GAP) * WEB_MOCKS.length

  useEffect(() => {
    if (mode !== 'browsing' || reduced) return
    const el = rootRef.current
    let alive = true

    const tick = () => {
      if (!alive) return
      if (!pausedRef.current && !offscreenRef.current && innerRef.current) {
        offsetRef.current -= SPEED
        if (Math.abs(offsetRef.current) >= trackW) offsetRef.current += trackW
        innerRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    const io = el
      ? new IntersectionObserver(
          ([e]) => {
            offscreenRef.current = !e.isIntersecting
            if (!e.isIntersecting) {
              pausedRef.current = true
              cancelAnimationFrame(rafRef.current)
            } else {
              pausedRef.current = document.hidden
              start()
            }
          },
          { rootMargin: '80px' },
        )
      : null
    if (el && io) io.observe(el)

    const onVis = () => {
      pausedRef.current = document.hidden || offscreenRef.current
      if (!pausedRef.current) start()
      else cancelAnimationFrame(rafRef.current)
    }
    document.addEventListener('visibilitychange', onVis)
    start()

    return () => {
      alive = false
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      cancelAnimationFrame(rafRef.current)
    }
  }, [mode, reduced, trackW])

  const openFocused = (id: string) => {
    cancelAnimationFrame(rafRef.current)
    setActiveId(id)
    setMode('focused')
  }

  const closeOverlay = useCallback(() => {
    setMode('browsing')
    setActiveId(null)
  }, [])

  return (
    <div ref={rootRef} className="relative">

      {/* ──────────────── BROWSING ──────────────── */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 2.25, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => {
            if (!offscreenRef.current) pausedRef.current = true
          }}
          onMouseLeave={() => {
            if (!offscreenRef.current) pausedRef.current = false
          }}
          onTouchStart={() => {
            pausedRef.current = true
          }}
          onTouchEnd={() => {
            if (!offscreenRef.current) pausedRef.current = false
          }}
        >
          {/* soft edge fades */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20"
            style={{ background: 'linear-gradient(to right, #f7f7f5, transparent)' }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20"
            style={{ background: 'linear-gradient(to left, #f7f7f5, transparent)' }}
          />

          <div
            ref={innerRef}
            className="flex py-4"
            style={{ gap: GAP, width: 'max-content' }}
          >
            {/* real cards — layoutId lets Framer track them into focused state */}
            {WEB_MOCKS.map(m => (
              <motion.div
                key={m.slug}
                layoutId={m.slug}
                className="relative overflow-hidden rounded-[18px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso/50"
                style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}
                onClick={() => openFocused(m.slug)}
                tabIndex={0}
                role="button"
                aria-label={`${m.title} — click to expand`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openFocused(m.slug)
                  }
                }}
                whileHover={reduced ? undefined : { scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              >
                <MockThumb id={m.slug as BuildCaseId} />
                <BrowseOverlay mock={m} />
              </motion.div>
            ))}

            {WEB_MOCKS.map(m => (
              <div
                key={`c-${m.slug}`}
                className="relative overflow-hidden rounded-[18px] cursor-pointer"
                style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}
                onClick={() => openFocused(m.slug)}
                aria-hidden
                tabIndex={-1}
              >
                <MockThumb id={m.slug as BuildCaseId} />
                <BrowseOverlay mock={m} />
              </div>
            ))}
          </div>

          {/* hint label */}
          <p className="mt-2 px-1 font-nhg text-[11px] text-espresso/30">
            Hover any card — click to explore
          </p>
        </motion.div>


      <AnimatePresence>
        {activeId && <WebDevCaseStudies key="case-studies" initialProjectId={activeId} onClose={closeOverlay} />}
      </AnimatePresence>
    </div>
  )
}

// ──────────────────────────────────────────────
// MockThumb — after resting, before on hover (one DOM version at a time)
// ──────────────────────────────────────────────
function MockThumb({ id }: { id: BuildCaseId }) {
  const [showBefore, setShowBefore] = useState(false)
  return (
    <div
      className="relative h-full w-full bg-neutral-950"
      onMouseEnter={() => setShowBefore(true)}
      onMouseLeave={() => setShowBefore(false)}
    >
      <div className="absolute inset-0 origin-top scale-[0.92] overflow-hidden">
        <BuildCaseStage
          id={id}
          version={showBefore ? 'before' : 'after'}
          className="h-full min-h-full rounded-none border-0"
        />
      </div>
      <p
        className={cn(
          'pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 font-nhg text-[9px] uppercase tracking-[0.12em] text-white/70 transition-opacity',
          showBefore ? 'opacity-0' : 'opacity-100',
        )}
      >
        Hover to see before
      </p>
    </div>
  )
}


// ──────────────────────────────────────────────
// BrowseOverlay — hover content on browsing card
// ──────────────────────────────────────────────
function BrowseOverlay({ mock }: { mock: WorkMockMeta }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-end p-5"
      style={{
        background:
          'linear-gradient(to top, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.28) 55%, transparent 100%)',
      }}
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <p className="font-nhg text-[10px] uppercase tracking-[0.14em] text-white/45">
        {mock.clientLabel}
      </p>
      <p className="mt-1 font-nhg text-[15px] font-semibold text-white">{mock.title}</p>
      <p className="mt-1 font-nhg text-[12px] leading-snug text-white/50">{mock.blurb}</p>

      <div className="mt-3">
        <span className="relative inline-flex items-center gap-1.5 rounded-full border border-[#c4a574]/35 bg-[#c4a574]/12 px-3 py-1.5 font-nhg text-[11px] text-[#c4a574]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#c4a574]/12" />
          Want something like this?
        </span>
      </div>
    </motion.div>
  )
}


