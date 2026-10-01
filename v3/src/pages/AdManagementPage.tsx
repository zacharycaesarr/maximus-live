import { useEffect, useMemo, useState } from 'react'
import { LevaPanel, useControls, useCreateStore, folder } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import MoneyFlow from '@/components/sections/ads/MoneyFlow'
import AdsConversionFunnel from '@/components/sections/ads/AdsConversionFunnel'
import WebDevCtaSlab from '@/components/sections/WebDevCtaSlab'
import { StretchText } from '@/components/ui/StretchText'
import GrainOverlay from '@/components/ui/GrainOverlay'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import type { LevaStore } from '@/lib/levaStore'

const KEY = 'mr-v3-ads-v12'

const DEFAULTS = {
  eyebrow: 'Capabilities · Ads',
  titleLead: 'Spend on',
  titleStretch: 'SIGNAL',
  titleTail: 'not noise.',
  blurb:
    'Paid campaigns run like a system: clear targeting, honest testing, and reports you can read in a minute.',
  flowEyebrow: 'Where it goes',
  flowTitle: 'Every dollar has a job.',
  flowBody:
    'Budget splits across platforms by what your customers use. Each platform feeds the outcomes you care about.',
  flowChartH: 360,
  flowChartPad: 48,
  flowLineBase: 2,
  flowLineShareMul: 18,
  flowOutLineBase: 1.5,
  flowOutLineMul: 26,
  flowBudgetR: 14,
  flowOutcomeR: 6,
  flowLogoCardW: 100,
  flowLogoImg: 28,
  flowSectionPy: 112,
  reportEyebrow: 'Reporting',
  reportTitle: "Clicks don't pay the bills. Customers do.",
  reportBlurb:
    'A lead is only the start. We look at which campaigns bring real inquiries, booked work, and better decisions for your budget.',
  funnelExample: 'Example funnel',
  funnel1Label: 'Ad clicks',
  funnel1Value: 1214,
  funnel2Label: 'Inquiries',
  funnel2Value: 86,
  funnel3Label: 'Qualified leads',
  funnel3Value: 38,
  funnel4Label: 'Booked customers',
  funnel4Value: 17,
  funnelColor1: '#A67C52',
  funnelColor2: '#8B6950',
  funnelColor3: '#6B4F3A',
  funnelColor4: '#E8C547',
  funnelThickness: 0.55,
  funnelMinNorm: 0.04,
  funnelMinH: 300,
  funnelMinHMobile: 440,
  decisionLabel: 'The decision',
  decisionBody: 'Shift spend toward campaigns producing booked jobs, not just cheap clicks.',
  ctaHeadline: 'Turn it on.',
  ctaBlurb: 'Tell me your market and your goal. I map the first 30 days from there.',
  ctaLabel: 'Plan my campaign',
  peakWidth: 151,
  baseWidth: 45,
  hoverBoost: 22,
  bgA: '#FFF6E4',
  bgB: '#E8B87A',
  bgC: '#C4A574',
  bgVignette: 0.18,
  bgGrain: 45,
  grainContrast: 1.45,
  grainBrightness: 1.08,
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
  merged.bgVignette = Number(merged.bgVignette)
  if (!Number.isFinite(merged.bgVignette)) merged.bgVignette = DEFAULTS.bgVignette
  merged.bgGrain = Number(merged.bgGrain)
  if (merged.bgGrain > 0 && merged.bgGrain <= 1) merged.bgGrain = merged.bgGrain * 100
  if (!Number.isFinite(merged.bgGrain)) merged.bgGrain = DEFAULTS.bgGrain
  merged.grainContrast = Number(merged.grainContrast) || DEFAULTS.grainContrast
  merged.grainBrightness = Number(merged.grainBrightness) || DEFAULTS.grainBrightness
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
      hoverBoost: { value: initial.hoverBoost, min: 0, max: 60, step: 1, label: 'hover boost' },
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
      }),
      Background: folder({
        bgA: { value: initial.bgA, label: 'color A (light)' },
        bgB: { value: initial.bgB, label: 'color B (mid)' },
        bgC: { value: initial.bgC, label: 'color C (deep)' },
        bgVignette: { value: initial.bgVignette, min: 0, max: 0.6, step: 0.02, label: 'vignette' },
        bgGrain: { value: initial.bgGrain, min: 0, max: 100, step: 1, label: 'grain amount' },
        grainContrast: {
          value: initial.grainContrast,
          min: 1,
          max: 2.2,
          step: 0.05,
          label: 'grain contrast',
        },
        grainBrightness: {
          value: initial.grainBrightness,
          min: 0.8,
          max: 1.4,
          step: 0.02,
          label: 'grain brightness',
        },
      }),
      Flow: folder(
        {
          flowEyebrow: { value: initial.flowEyebrow, label: 'eyebrow' },
          flowTitle: { value: initial.flowTitle, label: 'title' },
          flowBody: { value: initial.flowBody, label: 'body' },
          flowSectionPy: {
            value: initial.flowSectionPy,
            min: 40,
            max: 200,
            step: 4,
            label: 'section pad Y',
          },
          flowChartH: {
            value: initial.flowChartH,
            min: 240,
            max: 520,
            step: 4,
            label: 'chart height',
          },
          flowChartPad: {
            value: initial.flowChartPad,
            min: 24,
            max: 80,
            step: 2,
            label: 'chart pad',
          },
          flowLineBase: {
            value: initial.flowLineBase,
            min: 0.5,
            max: 8,
            step: 0.25,
            label: 'in line base',
          },
          flowLineShareMul: {
            value: initial.flowLineShareMul,
            min: 4,
            max: 40,
            step: 1,
            label: 'in line thick mul',
          },
          flowOutLineBase: {
            value: initial.flowOutLineBase,
            min: 0.5,
            max: 8,
            step: 0.25,
            label: 'out line base',
          },
          flowOutLineMul: {
            value: initial.flowOutLineMul,
            min: 4,
            max: 50,
            step: 1,
            label: 'out line thick mul',
          },
          flowBudgetR: {
            value: initial.flowBudgetR,
            min: 6,
            max: 28,
            step: 1,
            label: 'budget node R',
          },
          flowOutcomeR: {
            value: initial.flowOutcomeR,
            min: 3,
            max: 16,
            step: 1,
            label: 'outcome node R',
          },
          flowLogoCardW: {
            value: initial.flowLogoCardW,
            min: 48,
            max: 140,
            step: 2,
            label: 'logo card W',
          },
          flowLogoImg: {
            value: initial.flowLogoImg,
            min: 14,
            max: 48,
            step: 1,
            label: 'logo img size',
          },
        },
        { collapsed: true },
      ),
      Report: folder(
        {
          reportEyebrow: { value: initial.reportEyebrow, label: 'eyebrow' },
          reportTitle: { value: initial.reportTitle, label: 'title' },
          reportBlurb: { value: initial.reportBlurb, label: 'blurb' },
          funnelExample: { value: initial.funnelExample, label: 'funnel badge' },
          funnel1Label: { value: initial.funnel1Label, label: 's1 label' },
          funnel1Value: { value: initial.funnel1Value, min: 0, max: 50000, step: 1, label: 's1 value' },
          funnel2Label: { value: initial.funnel2Label, label: 's2 label' },
          funnel2Value: { value: initial.funnel2Value, min: 0, max: 5000, step: 1, label: 's2 value' },
          funnel3Label: { value: initial.funnel3Label, label: 's3 label' },
          funnel3Value: { value: initial.funnel3Value, min: 0, max: 2000, step: 1, label: 's3 value' },
          funnel4Label: { value: initial.funnel4Label, label: 's4 label' },
          funnel4Value: { value: initial.funnel4Value, min: 0, max: 500, step: 1, label: 's4 value' },
          funnelColor1: { value: initial.funnelColor1, label: 's1 color' },
          funnelColor2: { value: initial.funnelColor2, label: 's2 color' },
          funnelColor3: { value: initial.funnelColor3, label: 's3 color' },
          funnelColor4: { value: initial.funnelColor4, label: 's4 gold' },
          funnelThickness: {
            value: initial.funnelThickness,
            min: 0.35,
            max: 0.7,
            step: 0.01,
            label: 'band thickness',
          },
          funnelMinNorm: {
            value: initial.funnelMinNorm,
            min: 0,
            max: 0.2,
            step: 0.01,
            label: 'min stage size',
          },
          funnelMinH: {
            value: initial.funnelMinH,
            min: 200,
            max: 480,
            step: 10,
            label: 'chart H desktop',
          },
          funnelMinHMobile: {
            value: initial.funnelMinHMobile,
            min: 280,
            max: 640,
            step: 10,
            label: 'chart H mobile',
          },
          decisionLabel: { value: initial.decisionLabel, label: 'decision label' },
          decisionBody: { value: initial.decisionBody, label: 'decision body' },
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
    hoverBoost: t.hoverBoost,
    curve: 'ramp' as const,
    weight: 720,
    letterSpacing: -0.02,
    opticalSize: 120,
  }

  return (
    <div
      className="mr-caps-page relative min-h-screen"
      style={{
        backgroundColor: t.bgA,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,${t.bgVignette}) 100%),
          linear-gradient(30deg, ${t.bgA} 0%, ${t.bgB} 47%, ${t.bgC} 100%)
        `,
        backgroundSize: 'auto, auto',
        backgroundBlendMode: 'normal, normal',
      }}
    >
      {/* Dedicated grain ABOVE gradient — contrast so it reads on light cream */}
      <GrainOverlay
        fixed={false}
        amount={t.bgGrain}
        contrast={t.grainContrast}
        brightness={t.grainBrightness}
        blend="overlay"
        className="!absolute"
      />

      <div className="relative z-[1]">
        <DirectNav />

        <section className="relative overflow-x-clip px-5 pb-16 pt-24 md:px-6 md:pb-24 md:pt-36">
          <div className="relative mx-auto max-w-6xl">
            <Reveal duration={1.55}>
              <p className="mb-3 font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
                {t.eyebrow}
              </p>
              <h1 className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[clamp(2.5rem,7vw,5rem)] font-light leading-[0.95] tracking-tight text-espresso">
                <span className="font-tiempos">{t.titleLead}</span>
                <StretchText text={t.titleStretch} {...stretch} className="text-[#8B6950]" />
                <span className="basis-full font-tiempos sm:basis-auto">{t.titleTail}</span>
              </h1>
            </Reveal>
            <Reveal duration={1.55} delay={0.22}>
              <p className="mt-6 max-w-md font-switzer text-[15px] font-medium leading-relaxed text-espresso">
                {t.blurb}
              </p>
            </Reveal>
          </div>
        </section>

        <MoneyFlow
          eyebrow={t.flowEyebrow}
          title={t.flowTitle}
          body={t.flowBody}
          chartH={Number(t.flowChartH)}
          chartPad={Number(t.flowChartPad)}
          lineBase={Number(t.flowLineBase)}
          lineShareMul={Number(t.flowLineShareMul)}
          outLineBase={Number(t.flowOutLineBase)}
          outLineMul={Number(t.flowOutLineMul)}
          budgetR={Number(t.flowBudgetR)}
          outcomeR={Number(t.flowOutcomeR)}
          logoCardW={Number(t.flowLogoCardW)}
          logoImg={Number(t.flowLogoImg)}
          sectionPy={Number(t.flowSectionPy)}
        />

        <section className="px-5 py-16 md:px-6 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal duration={1.55}>
              <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
                {t.reportEyebrow}
              </p>
              <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
                {t.reportTitle}
              </h2>
              <p className="mt-4 max-w-md font-switzer text-[15px] font-medium leading-relaxed text-espresso">
                {t.reportBlurb}
              </p>
            </Reveal>
            <Reveal duration={1.55} delay={0.18}>
              <div className="mt-10">
                <AdsConversionFunnel
                  exampleLabel={String(t.funnelExample)}
                  decisionLabel={String(t.decisionLabel)}
                  decisionBody={String(t.decisionBody)}
                  thickness={Number(t.funnelThickness)}
                  minNorm={Number(t.funnelMinNorm)}
                  chartMinH={Number(t.funnelMinH)}
                  chartMinHMobile={Number(t.funnelMinHMobile)}
                  stages={[
                    {
                      label: String(t.funnel1Label),
                      value: Number(t.funnel1Value),
                      displayValue: Number(t.funnel1Value).toLocaleString('en-US'),
                      color: String(t.funnelColor1),
                    },
                    {
                      label: String(t.funnel2Label),
                      value: Number(t.funnel2Value),
                      displayValue: String(t.funnel2Value),
                      color: String(t.funnelColor2),
                    },
                    {
                      label: String(t.funnel3Label),
                      value: Number(t.funnel3Value),
                      displayValue: String(t.funnel3Value),
                      color: String(t.funnelColor3),
                    },
                    {
                      label: String(t.funnel4Label),
                      value: Number(t.funnel4Value),
                      displayValue: String(t.funnel4Value),
                      color: String(t.funnelColor4),
                    },
                  ]}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <WebDevCtaSlab headline={t.ctaHeadline} blurb={t.ctaBlurb} label={t.ctaLabel} eyebrow="Next step" />
        <SiteFooter />
      </div>
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
