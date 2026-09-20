import { useEffect, useMemo, useRef, useState } from 'react'
import { LevaPanel, useControls, useCreateStore, folder } from 'leva'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import SignalField from '@/components/sections/ads/SignalField'
import BudgetDial from '@/components/sections/ads/BudgetDial'
import MoneyFlow from '@/components/sections/ads/MoneyFlow'
import WebDevCtaSlab from '@/components/sections/WebDevCtaSlab'
import { StretchText } from '@/components/ui/StretchText'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import type { LevaStore } from '@/lib/levaStore'
import { cn } from '@/lib/utils'

const KEY = 'mr-v3-ads-v1'

const DEFAULTS = {
  eyebrow: 'Capabilities · Ads',
  titleLead: 'Spend on',
  titleStretch: 'SIGNAL',
  titleTail: 'not noise.',
  blurb:
    'Paid campaigns run like a system: clear targeting, honest testing, and reports you can read in a minute.',
  dialEyebrow: 'Turn the dial',
  dialTitle: 'See what a budget actually buys.',
  dialNote: 'Rough numbers to show the shape of it. Real plans get real math.',
  flowEyebrow: 'Where it goes',
  flowTitle: 'Every dollar has a job.',
  flowBody: 'Budget splits across platforms by what your customers use. Each platform feeds the outcomes you care about.',
  loopEyebrow: 'How we run it',
  loopTitle: 'Test. Learn. Scale. Repeat.',
  reportEyebrow: 'Reporting',
  reportTitle: 'A note you can read, not a dashboard you dread.',
  ctaHeadline: 'Turn it on.',
  ctaBlurb: 'Tell me your market and your goal. I map the first 30 days from there.',
  ctaLabel: 'Plan my campaign',
  peakWidth: 151,
  cpm: 14,
  ctr: 0.018,
  leadRate: 0.07,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function AdMain({ store }: { store: LevaStore }) {
  const initial = useMemo(() => load(), [])
  const values = useControls(
    {
      'Ads page': folder(
        {
          Hero: folder({
            eyebrow: initial.eyebrow,
            titleLead: { value: initial.titleLead, label: 'title lead' },
            titleStretch: { value: initial.titleStretch, label: 'stretch word' },
            titleTail: { value: initial.titleTail, label: 'title tail' },
            blurb: initial.blurb,
            peakWidth: { value: initial.peakWidth, min: 100, max: 151, step: 1, label: 'peak width' },
          }),
          Dial: folder(
            {
              dialEyebrow: { value: initial.dialEyebrow, label: 'eyebrow' },
              dialTitle: { value: initial.dialTitle, label: 'title' },
              dialNote: { value: initial.dialNote, label: 'note' },
              cpm: { value: initial.cpm, min: 4, max: 40, step: 0.5, label: 'CPM $' },
              ctr: { value: initial.ctr, min: 0.003, max: 0.06, step: 0.001, label: 'click rate' },
              leadRate: { value: initial.leadRate, min: 0.01, max: 0.3, step: 0.005, label: 'lead rate' },
            },
            { collapsed: true },
          ),
          Flow: folder(
            {
              flowEyebrow: { value: initial.flowEyebrow, label: 'eyebrow' },
              flowTitle: { value: initial.flowTitle, label: 'title' },
              flowBody: { value: initial.flowBody, label: 'body' },
            },
            { collapsed: true },
          ),
          Loop: folder(
            {
              loopEyebrow: { value: initial.loopEyebrow, label: 'eyebrow' },
              loopTitle: { value: initial.loopTitle, label: 'title' },
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
        { collapsed: false },
      ),
    },
    { store },
  )
  const t = { ...DEFAULTS, ...(values as unknown as Partial<typeof DEFAULTS>) }

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
    baseWidth: 100,
    peakWidth: t.peakWidth,
    curve: 'ramp' as const,
    weight: 720,
    letterSpacing: -0.01,
    opticalSize: 120,
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <DirectNav />

      {/* HERO — signal field */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] md:top-[30%]">
          <SignalField />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f7f5] to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">{t.eyebrow}</p>
            <h1 className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-tiempos text-[clamp(2.6rem,7vw,5.25rem)] font-light leading-[0.95] tracking-tight text-espresso">
              <span>{t.titleLead}</span>
              <StretchText text={t.titleStretch} {...stretch} className="text-[#8B6950]" />
              <span className="basis-full sm:basis-auto">{t.titleTail}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md font-nhg text-[15px] leading-relaxed text-espresso/55">{t.blurb}</p>
            <p className="mt-10 font-nhg text-[11px] uppercase tracking-[0.16em] text-espresso/35">
              Move your cursor or thumb through the noise
            </p>
          </Reveal>
        </div>
        <div className="h-[34vh] md:h-[38vh]" aria-hidden />
      </section>

      <BudgetDial
        eyebrow={t.dialEyebrow}
        title={t.dialTitle}
        note={t.dialNote}
        cpm={t.cpm}
        ctr={t.ctr}
        leadRate={t.leadRate}
      />

      <MoneyFlow eyebrow={t.flowEyebrow} title={t.flowTitle} body={t.flowBody} />

      <LoopRing eyebrow={t.loopEyebrow} title={t.loopTitle} />

      <ReportNote eyebrow={t.reportEyebrow} title={t.reportTitle} />

      <WebDevCtaSlab
        headline={t.ctaHeadline}
        blurb={t.ctaBlurb}
        label={t.ctaLabel}
        stretch={stretch}
        eyebrow="Next step"
        ticker={['Targeting', 'Retargeting', 'Creative', 'Testing', 'Lead quality', 'Reporting']}
      />

      <SiteFooter />
    </div>
  )
}

/* ---------- Test / Learn / Scale ring, rotates with scroll ---------- */
const LOOP = [
  { k: 'Test', d: 'Small budgets, several angles. Let the market vote.' },
  { k: 'Learn', d: 'Read the after-click, not just the click. Cut what lies.' },
  { k: 'Scale', d: 'Push budget into what proves itself. Keep testing on the side.' },
]

function LoopRing({ eyebrow, title }: { eyebrow: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rot = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 240])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % LOOP.length), 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section ref={ref} className="border-t border-espresso/8 bg-[#2C2520] px-6 py-20 text-[#FCFAF2] md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div>
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">{eyebrow}</p>
          <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">{title}</h2>
          <ul className="mt-8 space-y-3">
            {LOOP.map((s, i) => (
              <li key={s.k}>
                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex w-full items-baseline gap-4 rounded-2xl border px-4 py-3 text-left transition',
                    active === i ? 'border-[#c4a574]/60 bg-white/5' : 'border-white/8 hover:border-white/20',
                  )}
                >
                  <span className="font-nhg text-[11px] uppercase tracking-[0.16em] text-[#c4a574]">0{i + 1}</span>
                  <span>
                    <span className="block font-tiempos text-xl font-light">{s.k}</span>
                    <span className={cn('block font-nhg text-sm text-[#FCFAF2]/55 transition-opacity', active === i ? 'opacity-100' : 'opacity-60')}>
                      {s.d}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[380px]">
          <motion.svg viewBox="0 0 200 200" className="h-full w-full" style={{ rotate: rot }}>
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(252,250,242,0.12)" strokeWidth="1" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(252,250,242,0.08)" strokeWidth="1" strokeDasharray="2 6" />
            {LOOP.map((_, i) => {
              const a = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2
              const x = 100 + Math.cos(a) * 86
              const y = 100 + Math.sin(a) * 86
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={active === i ? 7 : 4}
                  animate={{ r: active === i ? 7 : 4, fill: active === i ? '#c4a574' : '#FCFAF2' }}
                />
              )
            })}
            {/* arc that sweeps */}
            <motion.circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="#c4a574"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.33 1"
              animate={{ strokeDashoffset: -active * 0.333 }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              style={{ rotate: -90, transformOrigin: '50% 50%' }}
            />
          </motion.svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <motion.p key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-tiempos text-[clamp(2rem,6vw,3.4rem)] font-light">
              {LOOP[active].k}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Report as a plain-English note with a small line ---------- */
function ReportNote({ eyebrow, title }: { eyebrow: string; title: string }) {
  const pts = [12, 18, 14, 22, 27, 25, 34, 38, 36, 44, 47, 52]
  const max = Math.max(...pts)
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * 280} ${60 - (p / max) * 56}`).join(' ')

  return (
    <section className="border-t border-espresso/8 bg-[#f3f1ec] px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
        <div>
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">{eyebrow}</p>
          <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">{title}</h2>
          <p className="mt-4 max-w-md font-nhg text-[15px] leading-relaxed text-espresso/55">
            Every week you get a short note: what we spent, what came in, what we changed, what is next. Numbers attached for the curious.
          </p>
        </div>
        <Reveal>
          <article className="rounded-[24px] border border-espresso/10 bg-white p-6 shadow-[0_30px_80px_-50px_rgba(44,37,32,0.5)] md:p-8">
            <div className="flex items-center justify-between">
              <p className="font-nhg text-[11px] uppercase tracking-[0.16em] text-espresso/40">Week 6 · Ridge Plumbing</p>
              <span className="rounded-full bg-[#2C2520] px-2.5 py-1 font-nhg text-[10px] uppercase tracking-[0.12em] text-[#FCFAF2]">On track</span>
            </div>
            <p className="mt-5 font-tiempos text-[1.35rem] font-light leading-snug text-espresso">
              Spent $1,940. 38 calls, 11 booked. We paused the broad Meta set (cheap clicks, no calls) and moved that budget to branded search. Next week: test a “same-day” headline.
            </p>
            <svg viewBox="0 0 280 64" className="mt-6 h-16 w-full overflow-visible">
              <motion.path
                d={d}
                fill="none"
                stroke="#8B6950"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: '-20%' }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
              />
              <motion.circle
                cx="280"
                cy={60 - (pts[pts.length - 1] / max) * 56}
                r="4"
                fill="#c4a574"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5, type: 'spring' }}
              />
            </svg>
            <div className="mt-3 flex justify-between font-nhg text-[11px] text-espresso/40">
              <span>Booked jobs, 12 weeks</span>
              <span>+330%</span>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
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
