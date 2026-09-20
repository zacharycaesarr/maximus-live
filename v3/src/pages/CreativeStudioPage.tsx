import { useEffect, useMemo, useRef, useState } from 'react'
import { LevaPanel, useControls, useCreateStore, folder } from 'leva'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import ReelStrip, { type Frame } from '@/components/sections/creative/ReelStrip'
import WebDevCtaSlab from '@/components/sections/WebDevCtaSlab'
import { StretchText, type StretchTextProps } from '@/components/ui/StretchText'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import type { LevaStore } from '@/lib/levaStore'
import { cn } from '@/lib/utils'

const KEY = 'mr-v3-creative-v1'
const FLEX = '"Roboto Flex", "Neue Haas Grotesk Display", sans-serif'

const FRAMES: Frame[] = [
  { src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&q=70&auto=format', label: 'Ridge · brand film', kind: 'edit' },
  { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=70&auto=format', label: 'Northline · identity', kind: 'brand' },
  { src: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=900&q=70&auto=format', label: 'Launch · motion', kind: 'motion' },
  { src: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=900&q=70&auto=format', label: 'Reels · social', kind: 'social' },
  { src: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=900&q=70&auto=format', label: 'Summer · ad set', kind: 'ads' },
  { src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=70&auto=format', label: 'Type study', kind: 'brand' },
]

const CUTS = [
  { k: 'Brand identity', d: 'Logo, type, color, and the rules so it stays sharp.', img: FRAMES[1].src },
  { k: 'Motion', d: 'Logo stings, product reveals, UI motion. Calm, not busy.', img: FRAMES[2].src },
  { k: 'Social content', d: 'Reels and posts that look like the brand, not a template.', img: FRAMES[3].src },
  { k: 'Ad creative', d: 'Hooks, cutdowns, variants. Made to be tested.', img: FRAMES[4].src },
  { k: 'Edits', d: 'Color, pace, sound. The part people feel and cannot name.', img: FRAMES[0].src },
]

const DEFAULTS = {
  eyebrow: 'Capabilities · Creative',
  titleA: 'CREATIVE',
  titleB: 'Studio',
  blurb: 'Brand, motion, social, and edits with one eye on taste and the other on the goal.',
  reelEyebrow: 'The reel',
  reelTitle: 'Scroll to scrub.',
  cutsEyebrow: 'What we cut',
  cutsTitle: 'Five ways to make it look like you mean it.',
  boardEyebrow: 'How a piece gets made',
  boardTitle: 'Brief. Boards. Cut.',
  ctaHeadline: 'Say the word.',
  ctaBlurb: 'Send the brief, the mood, or just the vibe. I will storyboard the first pass.',
  ctaLabel: 'Start a piece',
  peakWidth: 151,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function CreativeMain({ store }: { store: LevaStore }) {
  const initial = useMemo(() => load(), [])
  const values = useControls(
    {
      'Creative page': folder(
        {
          Hero: folder({
            eyebrow: initial.eyebrow,
            titleA: { value: initial.titleA, label: 'stretched line' },
            titleB: { value: initial.titleB, label: 'serif line' },
            blurb: initial.blurb,
            peakWidth: { value: initial.peakWidth, min: 100, max: 151, step: 1, label: 'peak width' },
          }),
          Reel: folder({ reelEyebrow: { value: initial.reelEyebrow, label: 'eyebrow' }, reelTitle: { value: initial.reelTitle, label: 'title' } }, { collapsed: true }),
          Cuts: folder({ cutsEyebrow: { value: initial.cutsEyebrow, label: 'eyebrow' }, cutsTitle: { value: initial.cutsTitle, label: 'title' } }, { collapsed: true }),
          Board: folder({ boardEyebrow: { value: initial.boardEyebrow, label: 'eyebrow' }, boardTitle: { value: initial.boardTitle, label: 'title' } }, { collapsed: true }),
          CTA: folder(
            {
              ctaHeadline: { value: initial.ctaHeadline, label: 'headline' },
              ctaBlurb: { value: initial.ctaBlurb, label: 'blurb' },
              ctaLabel: { value: initial.ctaLabel, label: 'button' },
            },
            { collapsed: true },
          ),
        },
        { collapsed: false },
      ),
    },
    { store },
  )
  const t = { ...DEFAULTS, ...(values as unknown as Partial<typeof DEFAULTS>) }

  useEffect(() => {
    document.title = 'Creative Studio · Maximus Reach'
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(t))
    } catch {
      /* ignore */
    }
  }, [t])

  const stretch = { baseWidth: 100, peakWidth: t.peakWidth, curve: 'ramp' as const, weight: 760, letterSpacing: -0.015, opticalSize: 144 }

  return (
    <div className="min-h-screen bg-[#141110] text-[#FCFAF2]">
      <DirectNav overlay />
      <Hero eyebrow={t.eyebrow} a={t.titleA} b={t.titleB} blurb={t.blurb} stretch={stretch} />
      <ReelStrip frames={FRAMES} eyebrow={t.reelEyebrow} title={t.reelTitle} />
      <Cuts eyebrow={t.cutsEyebrow} title={t.cutsTitle} />
      <TypeWave />
      <Storyboard eyebrow={t.boardEyebrow} title={t.boardTitle} />
      <WebDevCtaSlab
        tone="light"
        headline={t.ctaHeadline}
        blurb={t.ctaBlurb}
        label={t.ctaLabel}
        stretch={stretch}
        eyebrow="Next step"
        ticker={['Brand', 'Motion', 'Social', 'Ad creative', 'Edits', 'Taste']}
      />
      <SiteFooter />
    </div>
  )
}

/* ---------- Hero: spotlight, timecode, stacked type ---------- */
function Hero({
  eyebrow,
  a,
  b,
  blurb,
  stretch,
}: {
  eyebrow: string
  a: string
  b: string
  blurb: string
  stretch: Omit<StretchTextProps, 'text'>
}) {
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.4)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const bg = useTransform([sx, sy], ([x, y]) => `radial-gradient(520px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(196,165,116,0.22), rgba(20,17,16,0) 60%)`)
  const [tc, setTc] = useState('00:00:00:00')
  const reduced = useReducedMotion()

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const ms = performance.now() - start
      const f = Math.floor((ms / 1000) * 24) % 24
      const s = Math.floor(ms / 1000) % 60
      const m = Math.floor(ms / 60000) % 60
      setTc(`00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`)
      raf = requestAnimationFrame(tick)
    }
    if (!reduced) raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  // idle drift for touch screens
  useEffect(() => {
    if (window.matchMedia('(hover: hover)').matches || reduced) return
    let raf = 0
    const t0 = performance.now()
    const loop = () => {
      const t = (performance.now() - t0) / 1000
      mx.set(0.5 + Math.sin(t * 0.5) * 0.3)
      my.set(0.45 + Math.cos(t * 0.35) * 0.2)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mx, my, reduced])

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      className="relative overflow-hidden px-6 pb-20 pt-28 md:pb-28 md:pt-40"
    >
      <motion.div aria-hidden style={{ backgroundImage: bg }} className="pointer-events-none absolute inset-0" />
      {/* film grain-ish lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_3px)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">{eyebrow}</p>
          <p className="font-nhg text-[11px] tabular-nums tracking-[0.2em] text-[#c4a574]">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8a3a3] align-middle" />
            REC {tc}
          </p>
        </div>

        <Reveal className="mt-10 md:mt-16">
          <h1 className="m-0 leading-[0.86]">
            <StretchText text={a} {...stretch} className="block text-[clamp(3rem,13vw,10.5rem)] text-[#FCFAF2]" />
            <span className="mt-1 block font-tiempos text-[clamp(2.4rem,9vw,7rem)] font-light italic tracking-tight text-[#c4a574] md:pl-[6vw]">
              {b}
            </span>
          </h1>
        </Reveal>

        <div className="mt-10 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.1}>
            <p className="max-w-sm font-nhg text-[15px] leading-relaxed text-[#FCFAF2]/60">{blurb}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className="flex flex-wrap gap-2 font-nhg text-[11px] uppercase tracking-[0.16em] text-[#FCFAF2]/50">
              {['Brand', 'Motion', 'Social', 'Ads', 'Edits'].map((w) => (
                <li key={w} className="rounded-full border border-white/10 px-3 py-1.5">
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Cuts: list where the type gets heavier under your pointer ---------- */
function Cuts({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [hot, setHot] = useState<number | null>(null)
  const [openMobile, setOpenMobile] = useState<number | null>(0)
  const reduced = useReducedMotion()
  const shown = hot ?? openMobile ?? 0

  return (
    <section className="border-t border-white/8 bg-[#141110] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">{eyebrow}</p>
        <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">{title}</h2>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <ul className="divide-y divide-white/8">
            {CUTS.map((c, i) => {
              const open = openMobile === i
              const on = hot === i || (hot === null && open)
              return (
                <li key={c.k}>
                  <button
                    onPointerEnter={() => setHot(i)}
                    onPointerLeave={() => setHot(null)}
                    onClick={() => setOpenMobile((o) => (o === i ? null : i))}
                    className="flex w-full items-baseline justify-between gap-6 py-5 text-left md:py-6"
                  >
                    <span
                      className="text-[clamp(1.6rem,4.6vw,3.4rem)] leading-none text-[#FCFAF2] transition-[font-variation-settings,letter-spacing,color] duration-500"
                      style={{
                        fontFamily: FLEX,
                        fontVariationSettings: on ? '"wght" 800, "wdth" 125, "opsz" 96' : '"wght" 300, "wdth" 100, "opsz" 96',
                        letterSpacing: on ? '-0.02em' : '0',
                        color: on ? '#c4a574' : undefined,
                      }}
                    >
                      {c.k}
                    </span>
                    <span className="shrink-0 font-nhg text-[11px] uppercase tracking-[0.16em] text-[#FCFAF2]/35">0{i + 1}</span>
                  </button>
                  {/* mobile: inline expand */}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden md:hidden"
                      >
                        <div className="pb-6">
                          <div className="aspect-[16/10] overflow-hidden rounded-[8px] ring-1 ring-white/10">
                            <img src={c.img} alt="" className="h-full w-full object-cover" loading="lazy" />
                          </div>
                          <p className="mt-3 font-nhg text-[14px] leading-relaxed text-[#FCFAF2]/60">{c.d}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

          {/* desktop preview pane */}
          <div className="relative hidden md:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[10px] bg-[#221d1a] ring-1 ring-white/10">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={shown}
                  src={CUTS[shown].img}
                  alt=""
                  initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)', scale: 1.08 }}
                  animate={{ clipPath: 'inset(0 0 0% 0)', scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141110] to-transparent p-5">
                <motion.p key={`d-${shown}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-nhg text-[14px] text-[#FCFAF2]/80">
                  {CUTS[shown].d}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Type wave: words breathe width and weight in a rolling wave ---------- */
const WAVE_WORDS = ['BRAND', 'MOTION', 'SOCIAL', 'ADS', 'EDITS', 'TASTE', 'STORY', 'CUT']

function TypeWave() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const words = Array.from(root.querySelectorAll<HTMLElement>('[data-w]'))
    const state = words.map(() => ({ p: 0 }))
    const tweens = words.map((el, i) =>
      gsap.to(state[i], {
        p: 1,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.22,
        onUpdate: () => {
          const p = state[i].p
          const wdth = 75 + p * 76
          const wght = 300 + p * 500
          el.style.fontVariationSettings = `"wdth" ${wdth}, "wght" ${wght}, "opsz" 144`
          el.style.fontStretch = `${wdth}%`
        },
      }),
    )
    // pause off-screen
    const io = new IntersectionObserver(([e]) => tweens.forEach((tw) => (e.isIntersecting ? tw.play() : tw.pause())))
    io.observe(root)
    return () => {
      tweens.forEach((tw) => tw.kill())
      io.disconnect()
    }
  }, [reduced])

  return (
    <section className="overflow-hidden border-t border-white/8 bg-[#141110] py-16 md:py-20">
      <div ref={ref} className="mr-wave flex w-max items-baseline gap-8 px-6 md:gap-14">
        {[...WAVE_WORDS, ...WAVE_WORDS].map((w, i) => (
          <span
            key={`${w}-${i}`}
            data-w
            className="text-[clamp(2.4rem,9vw,7rem)] leading-none text-[#FCFAF2]/90"
            style={{ fontFamily: FLEX, fontVariationSettings: '"wdth" 100, "wght" 400, "opsz" 144' }}
          >
            {w}
          </span>
        ))}
      </div>
      <style>{`
        .mr-wave { animation: mr-wave-x 60s linear infinite; }
        @keyframes mr-wave-x { to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .mr-wave { animation: none; } }
      `}</style>
    </section>
  )
}

/* ---------- Storyboard: three panels draw themselves in ---------- */
const BOARD = [
  { k: 'Brief', d: 'One page. Goal, audience, tone, where it runs.', path: 'M10 50 L40 20 L70 50 L100 20' },
  { k: 'Boards', d: 'Frames you can react to before anything is shot or animated.', path: 'M10 20 H100 M10 35 H70 M10 50 H90' },
  { k: 'Cut', d: 'Edit, color, sound, exports for every placement.', path: 'M10 35 H100 M55 15 V55 M35 25 V45 M75 25 V45' },
]

function Storyboard({ eyebrow, title }: { eyebrow: string; title: string }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })

  return (
    <section ref={ref} className="border-t border-white/8 bg-[#141110] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">{eyebrow}</p>
        <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">{title}</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {BOARD.map((b, i) => (
            <Panel key={b.k} i={i} b={b} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Panel({ i, b, progress }: { i: number; b: (typeof BOARD)[number]; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const start = i * 0.28
  const len = useTransform(progress, [start, start + 0.4], [0, 1])
  const op = useTransform(progress, [start, start + 0.2], [0.35, 1])
  return (
    <motion.article style={{ opacity: op }} className={cn('rounded-[10px] border border-white/10 bg-[#1b1715] p-6', i === 1 && 'md:translate-y-8')}>
      <div className="flex items-center justify-between font-nhg text-[11px] uppercase tracking-[0.16em] text-[#FCFAF2]/40">
        <span>Panel 0{i + 1}</span>
        <span>{b.k}</span>
      </div>
      <svg viewBox="0 0 110 70" className="mt-6 h-28 w-full">
        <rect x="1" y="1" width="108" height="68" rx="4" fill="none" stroke="rgba(252,250,242,0.12)" />
        <motion.path d={b.path} fill="none" stroke="#c4a574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: len }} />
      </svg>
      <p className="mt-5 font-tiempos text-2xl font-light">{b.k}</p>
      <p className="mt-2 font-nhg text-[14px] leading-relaxed text-[#FCFAF2]/55">{b.d}</p>
    </motion.article>
  )
}

export default function CreativeStudioPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <CreativeMain store={store} />
          </SmoothScroll>
          {isDev && (
            <div data-lenis-prevent className="mr-v3-leva-host" onWheel={(e) => e.stopPropagation()}>
              <LevaPanel
                key={mountKey}
                store={store}
                collapsed={{
                  collapsed,
                  onChange: (c) => {
                    setCollapsed(c)
                    if (!c) setMountKey((k) => k + 1)
                  },
                }}
                titleBar={{ title: 'Maximus · Creative', filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
