'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ArrowLeft } from 'lucide-react'
import ImageHoverReveal from '@/components/ui/great-ui-image-hover-reveal'
import { WEB_MOCKS, type WorkMockMeta } from '@/work-mockups/mockMeta'
import { cn } from '@/lib/utils'

// ──────────────────────────────────────────────
// preview images — swap for real screenshots later
// ──────────────────────────────────────────────
const IMGS: Record<string, { before: string; after: string }> = {
  'ridge-plumbing': {
    before: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=70',
    after: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&q=70',
  },
  'northline-dental': {
    before: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=70',
    after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=70',
  },
}

// project detail copy — move to mockMeta later
const DETAIL: Record<string, { problem: string; change: string }> = {
  'ridge-plumbing': {
    problem: 'Generic plumber template. No clear CTA, buried phone number, zero mobile optimization.',
    change: 'Clean industrial layout. Click-to-call front and center. Mobile-first — loads fast on anything.',
  },
  'northline-dental': {
    problem: 'Crowded clinic template that overwhelmed visitors and buried the booking button.',
    change: 'Calm trust-first layout. One primary booking button above the fold, simplified nav throughout.',
  },
}

type Mode = 'browsing' | 'focused' | 'expanded'

const CARD_W = 340
const CARD_H = 240
const GAP = 20
const SPEED = 0.5  // px per frame

function useCoarse() {
  const [c, setC] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const apply = () => setC(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return c
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────
export default function WebDevShowcase() {
  const [mode, setMode] = useState<Mode>('browsing')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [expandView, setExpandView] = useState<'before' | 'after'>('before')
  const [focusReveal, setFocusReveal] = useState<Record<string, 'before' | 'after' | null>>({})

  const coarse = useCoarse()
  const reduced = useReducedMotion()

  // browsing scroll
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const offscreenRef = useRef(false)
  const trackW = (CARD_W + GAP) * WEB_MOCKS.length

  // pause RAF when the strip is off-screen (stops footer lag)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        offscreenRef.current = !e.isIntersecting
        if (!e.isIntersecting) pausedRef.current = true
      },
      { rootMargin: '80px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // raf loop for horizontal browse
  useEffect(() => {
    if (mode !== 'browsing' || reduced) return
    const loop = () => {
      if (!pausedRef.current && !offscreenRef.current && innerRef.current) {
        offsetRef.current -= SPEED
        if (Math.abs(offsetRef.current) >= trackW) offsetRef.current += trackW
        innerRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [mode, reduced, trackW])

  // pause when tab hidden
  useEffect(() => {
    const h = () => { pausedRef.current = document.hidden }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [])

  const openFocused = (id: string) => {
    cancelAnimationFrame(rafRef.current)
    setActiveId(id)
    setMode('focused')
  }

  const openExpanded = (id: string) => {
    setActiveId(id)
    setExpandView('before')
    setMode('expanded')
  }

  const goBack = () => {
    if (mode === 'expanded') {
      setMode('focused')
    } else {
      setMode('browsing')
      // clear after overlay exit
      setTimeout(() => setActiveId(null), 400)
    }
  }

  const activeMock = WEB_MOCKS.find(m => m.slug === activeId)
  const activeImgs = activeId ? IMGS[activeId] : null

  return (
    <div ref={rootRef} className="relative">

      {/* ──────────────── BROWSING ──────────────── */}
      {mode === 'browsing' && (
        <div
          className="relative overflow-hidden"
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
                onKeyDown={e => e.key === 'Enter' && openFocused(m.slug)}
                whileHover={reduced ? undefined : { scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              >
                <img
                  src={IMGS[m.slug].before}
                  alt={m.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <BrowseOverlay mock={m} />
              </motion.div>
            ))}

            {/* clones for seamless loop — no layoutId */}
            {WEB_MOCKS.map(m => (
              <div
                key={`c-${m.slug}`}
                className="relative overflow-hidden rounded-[18px] cursor-pointer"
                style={{ width: CARD_W, height: CARD_H, flexShrink: 0 }}
                onClick={() => openFocused(m.slug)}
                aria-hidden
                tabIndex={-1}
              >
                <img
                  src={IMGS[m.slug].before}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <BrowseOverlay mock={m} />
              </div>
            ))}
          </div>

          {/* hint label */}
          <p className="mt-2 px-1 font-nhg text-[11px] text-espresso/30">
            Hover any card — click to explore
          </p>
        </div>
      )}


      {/* ──────────────── FOCUSED / EXPANDED OVERLAY ──────────────── */}
      <AnimatePresence>
        {mode !== 'browsing' && (
          <motion.div
            key="showcase-overlay"
            className="fixed inset-0 z-[50] overflow-hidden bg-[#0d0b09]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >

            {/* close / back button */}
            <button
              type="button"
              onClick={goBack}
              className="absolute right-5 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white backdrop-blur-sm transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label={mode === 'expanded' ? 'Back to list' : 'Close'}
            >
              {mode === 'expanded' ? <ArrowLeft size={16} /> : <X size={16} />}
            </button>


            {/* ── FOCUSED layout (portfolio scroller style) ── */}
            {mode === 'focused' && (
              <div className="flex h-full">

                {/* Left panel: project title list */}
                <div className="hidden w-[38%] flex-col justify-center border-r border-white/8 px-12 py-16 md:flex">
                  <p className="mb-8 font-nhg text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Web builds
                  </p>

                  <div className="space-y-3">
                    {WEB_MOCKS.map((m, i) => (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => setActiveId(m.slug)}
                        className={cn(
                          'block w-full text-left font-nhg transition-all duration-300 focus-visible:outline-none',
                          activeId === m.slug
                            ? 'text-[2.1rem] font-semibold leading-snug text-white'
                            : 'text-xl text-white/20 hover:text-white/45',
                        )}
                      >
                        <span className="mr-3 font-nhg text-[10px] tabular-nums text-white/20">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {m.title}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeMock && (
                      <motion.div
                        key={activeId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="mt-8 space-y-2 border-t border-white/8 pt-8"
                      >
                        <p className="font-nhg text-[10px] uppercase tracking-[0.14em] text-white/30">
                          {activeMock.clientLabel}
                        </p>
                        <p className="max-w-[280px] font-nhg text-sm leading-relaxed text-white/50">
                          {activeMock.blurb}
                        </p>
                        <p className="font-nhg text-[11px] font-medium text-[#c4a574]">
                          {activeMock.metric}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="mt-auto font-nhg text-[10px] text-white/18">
                    Click any build to expand it
                  </p>
                </div>

                {/* Right: vertical scrollable card track */}
                <div className="flex-1 overflow-y-auto">
                  {/* mobile label */}
                  <div className="px-6 pb-0 pt-8 md:hidden">
                    <p className="font-nhg text-[10px] uppercase tracking-[0.2em] text-white/28">
                      Web builds
                    </p>
                  </div>

                  <div className="space-y-5 p-6 md:p-10">
                    {WEB_MOCKS.map(m => (
                      <motion.div
                        key={m.slug}
                        layoutId={m.slug}
                        className="cursor-pointer overflow-hidden rounded-[18px]"
                        onClick={() => openExpanded(m.slug)}
                        onMouseEnter={() => setActiveId(m.slug)}
                        onFocus={() => setActiveId(m.slug)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${m.title} — click to expand details`}
                        onKeyDown={e => e.key === 'Enter' && openExpanded(m.slug)}
                        whileHover={reduced ? undefined : { scale: 1.012 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      >
                        <FocusCard
                          mock={m}
                          isActive={m.slug === activeId}
                          coarse={coarse}
                          imgs={IMGS[m.slug]}
                          reveal={focusReveal[m.slug] ?? null}
                          onReveal={(v) =>
                            setFocusReveal(s => ({ ...s, [m.slug]: v }))
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* ── EXPANDED layout ── */}
            {mode === 'expanded' && activeMock && activeImgs && (
              <div className="flex h-full flex-col md:grid md:grid-cols-2">

                {/* Left: large image with before/after toggle */}
                <motion.div
                  layoutId={activeId!}
                  className="relative h-[50vh] overflow-hidden md:h-full"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={expandView}
                      src={expandView === 'before' ? activeImgs.before : activeImgs.after}
                      alt={`${activeMock.title} ${expandView}`}
                      className="h-full w-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                    />
                  </AnimatePresence>

                  {/* before / after control */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1 rounded-full border border-white/18 bg-black/65 p-1 backdrop-blur-sm">
                    {(['before', 'after'] as const).map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setExpandView(v)}
                        className={cn(
                          'rounded-full px-5 py-2 font-nhg text-[13px] font-medium capitalize transition',
                          expandView === v
                            ? v === 'before'
                              ? 'bg-white text-[#0d0b09]'
                              : 'bg-[#c4a574] text-[#0d0b09]'
                            : 'text-white/50 hover:text-white',
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Right: detail panel */}
                <motion.div
                  initial={{ opacity: 0, x: 22 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 22 }}
                  transition={{ delay: 0.16, duration: 0.36 }}
                  className="flex flex-col overflow-y-auto p-8 md:p-14"
                >
                  <p className="font-nhg text-[10px] uppercase tracking-[0.18em] text-white/28">
                    {activeMock.clientLabel}
                  </p>
                  <h2 className="mt-3 font-nhg text-[2.1rem] font-semibold leading-snug text-white">
                    {activeMock.title}
                  </h2>
                  <p className="mt-4 font-nhg text-sm leading-relaxed text-white/50">
                    {activeMock.blurb}
                  </p>

                  <div className="mt-10 space-y-7">
                    <DetailBlock label="The problem" text={DETAIL[activeMock.slug].problem} />
                    <DetailBlock label="What changed" text={DETAIL[activeMock.slug].change} />
                    <div>
                      <p className="font-nhg text-[10px] uppercase tracking-[0.16em] text-white/25">
                        Result
                      </p>
                      <p className="mt-2 font-nhg text-[1.2rem] font-semibold text-[#c4a574]">
                        {activeMock.metric}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
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

      {/* pulsing pill */}
      <div className="mt-3">
        <span className="relative inline-flex items-center gap-1.5 rounded-full border border-[#c4a574]/35 bg-[#c4a574]/12 px-3 py-1.5 font-nhg text-[11px] text-[#c4a574]">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#c4a574]/12" />
          Want something like this?
        </span>
      </div>
    </motion.div>
  )
}


// ──────────────────────────────────────────────
// FocusCard — card layout in the focused state
// ──────────────────────────────────────────────
function FocusCard({
  mock,
  isActive,
  coarse,
  imgs,
  reveal,
  onReveal,
}: {
  mock: WorkMockMeta
  isActive: boolean
  coarse: boolean
  imgs: { before: string; after: string }
  reveal: 'before' | 'after' | null
  onReveal: (v: 'before' | 'after' | null) => void
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[18px] border border-white/6 bg-[#141210] transition-shadow duration-300',
        isActive ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.12)]' : '',
      )}
    >
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/6 px-5 py-3.5">
        <div>
          <p className="font-nhg text-[10px] uppercase tracking-[0.12em] text-white/28">
            {mock.clientLabel}
          </p>
          <h3 className="mt-0.5 font-nhg text-[15px] font-semibold text-white">{mock.title}</h3>
        </div>

        {/* mobile: before/after toggle instead of hover */}
        {coarse && (
          <div className="flex gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5">
            {(['before', 'after'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  onReveal(reveal === v ? null : v)
                }}
                className={cn(
                  'rounded-full px-3 py-1 font-nhg text-[11px] capitalize transition',
                  reveal === v
                    ? v === 'before'
                      ? 'bg-white text-[#0d0b09]'
                      : 'bg-[#c4a574] text-[#0d0b09]'
                    : 'text-white/40 hover:text-white/70',
                )}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* image area */}
      <div className="relative aspect-[16/9]">
        {coarse ? (
          <img
            src={reveal === 'after' ? imgs.after : imgs.before}
            alt={mock.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="group relative h-full w-full">
            <ImageHoverReveal
              variant="directional"
              src={imgs.before}
              overlaySrc={imgs.after}
              alt={mock.title}
              className="h-full w-full"
            />
            <p className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 font-nhg text-[10px] uppercase tracking-[0.12em] text-white/65 transition-opacity duration-300 group-hover:opacity-0">
              Hover to see after
            </p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="px-5 py-3.5">
        <p className="font-nhg text-[11px] font-medium text-[#c4a574]">{mock.metric}</p>
        <p className="mt-0.5 font-nhg text-[10px] text-white/22">Click to expand full details</p>
      </div>
    </div>
  )
}


// ──────────────────────────────────────────────
// DetailBlock — used inside expanded right panel
// ──────────────────────────────────────────────
function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="font-nhg text-[10px] uppercase tracking-[0.16em] text-white/25">{label}</p>
      <p className="mt-2 font-nhg text-sm leading-relaxed text-white/55">{text}</p>
    </div>
  )
}
