import { useEffect, useMemo, useState } from 'react'
import { LevaPanel, useControls, useCreateStore, folder } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import WebDevCtaSlab from '@/components/sections/WebDevCtaSlab'
import { StretchText } from '@/components/ui/StretchText'
import GrainOverlay from '@/components/ui/GrainOverlay'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import type { LevaStore } from '@/lib/levaStore'

const KEY = 'mr-v3-creative-v3'

const CUTS = [
  { k: 'Brand', d: 'Logo, type, color, and the rules so it stays sharp.' },
  { k: 'Motion', d: 'Logo stings, product reveals, UI motion. Calm, not busy.' },
  { k: 'Social', d: 'Reels and posts that look like the brand, not a template.' },
  { k: 'Ads', d: 'Hooks, cutdowns, variants. Made to be tested.' },
  { k: 'Edits', d: 'Color, pace, sound. The part people feel and cannot name.' },
]

const DEFAULTS = {
  eyebrow: 'Capabilities · Creative',
  titleA: 'CREATIVE',
  titleB: 'Studio',
  blurb: 'Brand, motion, social, and edits with one eye on taste and the other on the goal.',
  cutsEyebrow: 'What we cut',
  cutsTitle: 'Five ways to make it look like you mean it.',
  boardEyebrow: 'Process',
  boardTitle: 'Brief. Boards. Cut.',
  ctaHeadline: 'Say the word.',
  ctaBlurb: 'Send the brief, the mood, or just the vibe. I will storyboard the first pass.',
  ctaLabel: 'Start a piece',
  peakWidth: 151,
  baseWidth: 78,
  grainOpacity: 0.07,
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
  merged.grainOpacity = Number(merged.grainOpacity)
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
        grainOpacity: { value: initial.grainOpacity, min: 0, max: 0.15, step: 0.005, label: 'grain' },
      }),
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
    curve: 'ramp' as const,
    weight: 760,
    letterSpacing: -0.02,
    opticalSize: 144,
  }

  return (
    <div className="mr-caps-page min-h-screen bg-[#141110] text-[#FCFAF2]">
      <GrainOverlay opacity={Math.max(0.05, t.grainOpacity)} blend="overlay" />
      <DirectNav overlay />

      <section className="overflow-x-clip px-5 pb-16 pt-24 md:px-6 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
              {t.eyebrow}
            </p>
            <h1 className="mt-8 m-0 leading-[0.88]">
              <StretchText
                text={t.titleA}
                {...stretch}
                className="block text-[clamp(3rem,14vw,10rem)] text-[#FCFAF2]"
              />
              <span className="mt-2 block font-tiempos text-[clamp(2.2rem,8vw,6rem)] font-light italic tracking-tight text-[#c4a574] md:pl-[5vw]">
                {t.titleB}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-sm font-serotiva text-[15px] font-medium leading-relaxed text-[#FCFAF2]/60">
              {t.blurb}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/8 px-5 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
              {t.cutsEyebrow}
            </p>
            <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">
              {t.cutsTitle}
            </h2>
          </Reveal>
          <ul className="mt-12 divide-y divide-white/10">
            {CUTS.map((c, i) => (
              <li
                key={c.k}
                className={`flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-10 ${i === 1 || i === 3 ? 'md:pl-10' : ''}`}
              >
                <span className="font-tiempos text-[clamp(1.6rem,4vw,2.8rem)] font-light text-[#FCFAF2]">
                  {c.k}
                </span>
                <p className="max-w-sm font-serotiva text-[14px] font-medium leading-relaxed text-[#FCFAF2]/55 md:text-right">
                  {c.d}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/8 px-5 py-16 md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
              {t.boardEyebrow}
            </p>
            <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">
              {t.boardTitle}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: '01', t: 'Brief', d: 'One page. Goal, audience, tone, where it runs.' },
              { n: '02', t: 'Boards', d: 'Frames you can react to before anything is shot.' },
              { n: '03', t: 'Cut', d: 'Edit, color, sound, exports for every placement.' },
            ].map((b, i) => (
              <article
                key={b.t}
                className={`rounded-[11px] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-[6px] ${i === 1 ? 'md:translate-y-8' : ''}`}
              >
                <p className="font-serotiva text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">{b.n}</p>
                <h3 className="mt-4 font-tiempos text-2xl font-light">{b.t}</h3>
                <p className="mt-2 font-serotiva text-[14px] font-medium leading-relaxed text-[#FCFAF2]/55">{b.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
