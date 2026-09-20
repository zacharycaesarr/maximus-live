import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LevaPanel, useControls, useCreateStore, folder } from 'leva'
import { ArrowUpRight } from 'lucide-react'
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

const KEY = 'mr-v3-ads-v3'

const DEFAULTS = {
  eyebrow: 'Capabilities · Ads',
  titleLead: 'Spend on',
  titleStretch: 'SIGNAL',
  titleTail: 'not noise.',
  blurb:
    'Paid campaigns run like a system: clear targeting, honest testing, and reports you can read in a minute.',
  pillarEyebrow: 'How we work',
  pillarTitle: 'Three moves. No dashboard fog.',
  reportEyebrow: 'Reporting',
  reportTitle: 'A note you can read.',
  ctaHeadline: 'Turn it on.',
  ctaBlurb: 'Tell me your market and your goal. I map the first 30 days from there.',
  ctaLabel: 'Plan my campaign',
  peakWidth: 151,
  baseWidth: 82,
  grainOpacity: 0.06,
}

const PILLARS = [
  {
    n: '01',
    t: 'Target',
    d: 'We find the people who already need what you sell. Not everyone with a pulse.',
  },
  {
    n: '02',
    t: 'Test',
    d: 'Small budgets, several angles. The market votes. We cut what lies.',
  },
  {
    n: '03',
    t: 'Scale',
    d: 'Push spend into what proves itself. Keep a side budget for the next idea.',
  },
]

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

function AdMain({ store }: { store: LevaStore }) {
  const initial = useMemo(() => load(), [])
  const stretchVals = useControls(
    'Headline stretch',
    {
      titleStretch: { value: initial.titleStretch, label: 'stretch word' },
      baseWidth: { value: initial.baseWidth, min: 25, max: 151, step: 1, label: 'base width' },
      peakWidth: { value: initial.peakWidth, min: 25, max: 151, step: 1, label: 'peak width' },
    },
    { store },
  )
  const pageVals = useControls(
    'Ads page',
    {
      Hero: folder({
        eyebrow: initial.eyebrow,
        titleLead: { value: initial.titleLead, label: 'title lead' },
        titleTail: { value: initial.titleTail, label: 'title tail' },
        blurb: initial.blurb,
        grainOpacity: { value: initial.grainOpacity, min: 0, max: 0.15, step: 0.005, label: 'grain' },
      }),
      Pillars: folder(
        {
          pillarEyebrow: { value: initial.pillarEyebrow, label: 'eyebrow' },
          pillarTitle: { value: initial.pillarTitle, label: 'title' },
        },
        { collapsed: true },
      ),
      Report: folder(
        {
          reportEyebrow: { value: initial.reportEyebrow, label: 'eyebrow' },
          reportTitle: { value: initial.reportTitle, label: 'title' },
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
    document.title = 'Ad Management · Maximus Reach'
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
    weight: 720,
    letterSpacing: -0.02,
    opticalSize: 120,
  }

  return (
    <div className="mr-caps-page min-h-screen bg-[#f3efe8]">
      <GrainOverlay opacity={Math.max(0.05, t.grainOpacity)} />
      <DirectNav />

      <section className="overflow-x-clip px-5 pb-16 pt-24 md:px-6 md:pb-28 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
              {t.eyebrow}
            </p>
            <h1 className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-espresso">
              <span className="font-tiempos">{t.titleLead}</span>
              <StretchText text={t.titleStretch} {...stretch} className="text-[#8B6950]" />
              <span className="basis-full font-tiempos sm:basis-auto">{t.titleTail}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md font-serotiva text-[15px] font-medium leading-relaxed text-espresso/55">
              {t.blurb}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-espresso/8 bg-[#2C2520] px-5 py-16 text-[#FCFAF2] md:px-6 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
              {t.pillarEyebrow}
            </p>
            <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">
              {t.pillarTitle}
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {PILLARS.map((p, i) => (
              <li
                key={p.t}
                className={`border-t border-white/12 pt-6 ${i === 1 ? 'md:translate-y-10' : ''}`}
              >
                <p className="font-serotiva text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">{p.n}</p>
                <h3 className="mt-3 font-tiempos text-[clamp(1.6rem,3vw,2.2rem)] font-light">{p.t}</h3>
                <p className="mt-3 max-w-xs font-serotiva text-[15px] font-medium leading-relaxed text-[#FCFAF2]/55">
                  {p.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-espresso/8 px-5 py-16 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-16">
          <Reveal>
            <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
              {t.reportEyebrow}
            </p>
            <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
              {t.reportTitle}
            </h2>
            <p className="mt-4 max-w-sm font-serotiva text-[15px] font-medium leading-relaxed text-espresso/55">
              Every week: what we spent, what came in, what we changed, what is next. Numbers attached for the curious.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <article className="rounded-[11px] border border-white/55 bg-[rgba(255,255,255,0.28)] p-6 shadow-[0_12px_32px_-12px_rgba(44,37,32,0.35)] backdrop-blur-[8px] md:p-8">
              <div className="flex items-center justify-between gap-3">
                <p className="font-serotiva text-[11px] uppercase tracking-[0.16em] text-espresso/40">
                  Week 6 · Ridge Plumbing
                </p>
                <span className="rounded-[8px] bg-espresso px-2.5 py-1 font-serotiva text-[10px] uppercase tracking-[0.12em] text-[#FCFAF2]">
                  On track
                </span>
              </div>
              <p className="mt-5 font-tiempos text-[1.3rem] font-light leading-snug text-espresso">
                Spent $1,940. 38 calls, 11 booked. We paused the broad Meta set and moved that budget to branded search.
              </p>
              <Link
                to="/start"
                className="mt-6 inline-flex items-center gap-1.5 font-serotiva text-[13px] font-medium text-[#8B6950] no-underline"
              >
                See a sample week
                <ArrowUpRight size={14} />
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      <WebDevCtaSlab headline={t.ctaHeadline} blurb={t.ctaBlurb} label={t.ctaLabel} eyebrow="Next step" />
      <SiteFooter />
    </div>
  )
}

export default function AdManagementPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <AdMain store={store} />
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
                titleBar={{ title: 'Maximus · Ads', filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
