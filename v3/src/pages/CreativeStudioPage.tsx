import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react'
import { LevaPanel, useControls, useCreateStore, folder } from 'leva'
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import ReelStrip, { type Frame } from '@/components/sections/creative/ReelStrip'
import WebDevCtaSlab from '@/components/sections/WebDevCtaSlab'
import { StretchText } from '@/components/ui/StretchText'
import GrainOverlay from '@/components/ui/GrainOverlay'
import StaticMeshGradient from '@/components/ui/static-mesh-gradient'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import type { LevaStore } from '@/lib/levaStore'
import { cn } from '@/lib/utils'

const KEY = 'mr-v3-creative-v4'

const FRAMES: Frame[] = [
  { src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&q=70&auto=format', label: 'Ridge · brand film', kind: 'edit' },
  { src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=70&auto=format', label: 'Northline · identity', kind: 'brand' },
  { src: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=900&q=70&auto=format', label: 'Launch · motion', kind: 'motion' },
  { src: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=900&q=70&auto=format', label: 'Reels · social', kind: 'social' },
  { src: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=900&q=70&auto=format', label: 'Summer · ad set', kind: 'ads' },
  { src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=70&auto=format', label: 'Type study', kind: 'brand' },
]

const CUTS = [
  { k: 'Brand', d: 'Logo, type, color, and the rules so it stays consistent.', img: FRAMES[1].src },
  { k: 'Motion', d: 'Logo stings, product reveals, UI motion. Calm, not busy.', img: FRAMES[2].src },
  { k: 'Social', d: 'Reels and posts that look like the brand, not a template.', img: FRAMES[3].src },
  { k: 'Ads', d: 'Hooks, cutdowns, variants. Made to be tested.', img: FRAMES[4].src },
  { k: 'Edits', d: 'Color, pace, sound. The part people feel and cannot name.', img: FRAMES[0].src },
]

const BOARD = [
  { k: 'Brief', d: 'One page. Goal, audience, tone, where it runs.', path: 'M10 50 L40 20 L70 50 L100 20' },
  { k: 'Boards', d: 'Frames you can react to before anything is shot.', path: 'M10 20 H100 M10 35 H70 M10 50 H90' },
  { k: 'Cut', d: 'Edit, color, sound, exports for every placement.', path: 'M10 35 H100 M55 15 V55 M35 25 V45 M75 25 V45' },
]

const DEFAULTS = {
  eyebrow: 'Capabilities · Creative',
  titleA: 'CREATIVE',
  titleB: 'Studio',
  blurb:
    'Creative support beyond the site and ads, from video edits and social content to the visual pieces that keep your brand looking consistent online.',
  reelEyebrow: 'The reel',
  reelTitle: 'Scroll to scrub.',
  cutsEyebrow: 'What we cut',
  cutsTitle: 'Five ways to make it look like you mean it.',
  boardEyebrow: 'Process',
  boardTitle: 'Brief. Boards. Cut.',
  ctaHeadline: 'Say the word.',
  ctaBlurb: 'Send the brief, the mood, or just the vibe. I will storyboard the first pass.',
  ctaLabel: 'Start a piece',
  peakWidth: 151,
  baseWidth: 78,
  hoverBoost: 18,
  grainOpacity: 0.07,
  grainSize: 180,
  meshA: '#141110',
  meshB: '#2C2520',
  meshC: '#8B6950',
  meshD: '#c4a574',
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function flatten(raw: unknown) {
  const bag: Record<string, unknown> = {}
  const keys = new Set(Object.keys(DEFAULTS))
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return
    for (const [k, val] of Object.entries(node as Record<string, unknown>)) {
      if (keys.has(k) && (typeof val !== 'object' || val === null || Array.isArray(val))) bag[k] = val
      else walk(val)
    }
  }
  walk(raw)
  const merged = { ...DEFAULTS, ...bag }
  merged.baseWidth = Number(merged.baseWidth) || DEFAULTS.baseWidth
  merged.peakWidth = Number(merged.peakWidth) || DEFAULTS.peakWidth
  merged.hoverBoost = Number(merged.hoverBoost) || DEFAULTS.hoverBoost
  merged.grainOpacity = Number(merged.grainOpacity)
  merged.grainSize = Number(merged.grainSize) || DEFAULTS.grainSize
  if (!Number.isFinite(merged.grainOpacity)) merged.grainOpacity = DEFAULTS.grainOpacity
  return merged
}

function CreativeMain({ store }: { store: LevaStore }) {
  const initial = useMemo(() => load(), [])
  const stretchVals = useControls(
    'Headline stretch',
    {
      titleA: { value: initial.titleA, label: 'stretch word' },
      baseWidth: { value: initial.baseWidth, min: 25, max: 151, step: 1, label: 'base width' },
      peakWidth: { value: initial.peakWidth, min: 25, max: 151, step: 1, label: 'peak width' },
      hoverBoost: { value: initial.hoverBoost, min: 0, max: 60, step: 1, label: 'hover boost' },
    },
    { store },
  )
  const pageVals = useControls(
    'Creative page',
    {
      Hero: folder({
        eyebrow: initial.eyebrow,
        titleB: { value: initial.titleB, label: 'serif line' },
        blurb: initial.blurb,
        grainOpacity: { value: initial.grainOpacity, min: 0, max: 0.15, step: 0.005, label: 'grain opacity' },
        grainSize: { value: initial.grainSize, min: 60, max: 420, step: 10, label: 'grain size' },
      }),
      Mesh: folder({
        meshA: { value: initial.meshA, label: 'color A' },
        meshB: { value: initial.meshB, label: 'color B' },
        meshC: { value: initial.meshC, label: 'color C' },
        meshD: { value: initial.meshD, label: 'color D' },
      }),
      Reel: folder(
        {
          reelEyebrow: { value: initial.reelEyebrow, label: 'eyebrow' },
          reelTitle: { value: initial.reelTitle, label: 'title' },
        },
        { collapsed: true },
      ),
      Cuts: folder(
        {
          cutsEyebrow: { value: initial.cutsEyebrow, label: 'eyebrow' },
          cutsTitle: { value: initial.cutsTitle, label: 'title' },
        },
        { collapsed: true },
      ),
      Board: folder(
        {
          boardEyebrow: { value: initial.boardEyebrow, label: 'eyebrow' },
          boardTitle: { value: initial.boardTitle, label: 'title' },
        },
        { collapsed: true },
      ),
      CTA: folder(
        {
          ctaHeadline: { value: initial.ctaHeadline, label: 'headline' },
          ctaBlurb: { value: initial.ctaBlurb, label: 'blurb' },
          ctaLabel: { value: initial.ctaLabel, label: 'button' },
        },
        { collapsed: true },
      ),
    },
    { store },
  )

  const t = flatten({ ...stretchVals, ...pageVals })

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

  const stretch = {
    baseWidth: t.baseWidth,
    peakWidth: t.peakWidth,
    hoverBoost: t.hoverBoost,
    curve: 'ramp' as const,
    weight: 760,
    letterSpacing: -0.02,
    opticalSize: 144,
  }

  return (
    <div className="mr-caps-page min-h-screen bg-[#141110] text-[#FCFAF2]">
      <GrainOverlay
        amount={Math.min(100, Math.round(((t.grainOpacity ?? 0.07) / 0.07) * 100))}
        blend="overlay"
      />
      <DirectNav overlay />

      <Hero
        eyebrow={t.eyebrow}
        a={t.titleA}
        b={t.titleB}
        blurb={t.blurb}
        stretch={stretch}
        meshA={t.meshA}
        meshB={t.meshB}
        meshC={t.meshC}
        meshD={t.meshD}
      />

      <ReelStrip frames={FRAMES} eyebrow={t.reelEyebrow} title={t.reelTitle} />

      <CutsSection eyebrow={t.cutsEyebrow} title={t.cutsTitle} />

      <Storyboard eyebrow={t.boardEyebrow} title={t.boardTitle} />

      <WebDevCtaSlab
        tone="light"
        headline={t.ctaHeadline}
        blurb={t.ctaBlurb}
        label={t.ctaLabel}
        eyebrow="Next step"
      />
      <SiteFooter />
    </div>
  )
}

function Hero({
  eyebrow,
  a,
  b,
  blurb,
  stretch,
  meshA,
  meshB,
  meshC,
  meshD,
}: {
  eyebrow: string
  a: string
  b: string
  blurb: string
  stretch: Omit<ComponentProps<typeof StretchText>, 'text'>
  meshA: string
  meshB: string
  meshC: string
  meshD: string
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-28 pt-24 md:px-6 md:pb-40 md:pt-40">
      <StaticMeshGradient colorA={meshA} colorB={meshB} colorC={meshC} colorD={meshD} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_3px)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal duration={1.55}>
          <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
            {eyebrow}
          </p>
          <h1 className="mt-8 m-0 leading-[0.88]">
            <StretchText text={a} {...stretch} className="block text-[clamp(3rem,14vw,10rem)] text-[#FCFAF2]" />
            <span className="mt-2 block font-tiempos text-[clamp(2.2rem,8vw,6rem)] font-light italic tracking-tight text-[#c4a574] md:pl-[5vw]">
              {b}
            </span>
          </h1>
        </Reveal>
        <Reveal duration={1.55} delay={0.22}>
          <p className="mt-10 max-w-md font-switzer text-[15px] font-medium leading-relaxed text-[#FCFAF2]/60">
            {blurb}
          </p>
        </Reveal>
        <Reveal duration={1.55} delay={0.28}>
          <ul className="mt-8 flex flex-wrap gap-2 font-switzer text-[11px] uppercase tracking-[0.16em] text-[#FCFAF2]/50">
            {['Brand', 'Motion', 'Social', 'Ads', 'Edits'].map((w) => (
              <li key={w} className="rounded-full border border-white/10 px-3 py-1.5">
                {w}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function CutsSection({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [hot, setHot] = useState<number | null>(null)
  const [openMobile, setOpenMobile] = useState<number | null>(0)
  const reduced = useReducedMotion()
  const shown = hot ?? openMobile ?? 0

  return (
    <section className="border-t border-white/8 px-5 py-16 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal duration={1.55}>
          <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">
            {title}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <ul className="divide-y divide-white/10">
            {CUTS.map((c, i) => {
              const open = openMobile === i
              const on = hot === i || (hot === null && open)
              return (
                <li key={c.k}>
                  <button
                    type="button"
                    onPointerEnter={() => setHot(i)}
                    onPointerLeave={() => setHot(null)}
                    onClick={() => setOpenMobile((o) => (o === i ? null : i))}
                    className="flex w-full items-baseline justify-between gap-6 py-5 text-left md:py-6"
                  >
                    <span
                      className={cn(
                        'font-tiempos text-[clamp(1.6rem,4.6vw,3.2rem)] font-light leading-none transition-colors duration-300',
                        on ? 'text-[#c4a574]' : 'text-[#FCFAF2]',
                      )}
                    >
                      {c.k}
                    </span>
                    <span className="shrink-0 font-switzer text-[11px] uppercase tracking-[0.16em] text-[#FCFAF2]/35">
                      0{i + 1}
                    </span>
                  </button>
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
                          <p className="mt-3 font-switzer text-[14px] font-medium leading-relaxed text-[#FCFAF2]/60">
                            {c.d}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>

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
                <motion.p
                  key={`d-${shown}`}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-switzer text-[14px] font-medium text-[#FCFAF2]/80"
                >
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

function Storyboard({ eyebrow, title }: { eyebrow: string; title: string }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })

  return (
    <section ref={ref} className="border-t border-white/8 px-5 py-16 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal duration={1.55}>
          <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">
            {title}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {BOARD.map((b, i) => (
            <BoardPanel key={b.k} i={i} b={b} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BoardPanel({
  i,
  b,
  progress,
}: {
  i: number
  b: (typeof BOARD)[number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const start = i * 0.28
  const len = useTransform(progress, [start, start + 0.4], [0, 1])
  const op = useTransform(progress, [start, start + 0.2], [0.35, 1])

  return (
    <motion.article
      style={{ opacity: op }}
      className={cn('rounded-[11px] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-[6px]', i === 1 && 'md:translate-y-8')}
    >
      <p className="font-switzer text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">0{i + 1}</p>
      <svg viewBox="0 0 110 70" className="mt-6 h-28 w-full">
        <rect x="1" y="1" width="108" height="68" rx="4" fill="none" stroke="rgba(252,250,242,0.12)" />
        <motion.path
          d={b.path}
          fill="none"
          stroke="#c4a574"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: len }}
        />
      </svg>
      <h3 className="mt-5 font-tiempos text-2xl font-light">{b.k}</h3>
      <p className="mt-2 font-switzer text-[14px] font-medium leading-relaxed text-[#FCFAF2]/55">{b.d}</p>
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
