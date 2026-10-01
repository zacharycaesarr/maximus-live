import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  normalizeCurve,
  type StretchFont,
  type StretchCurve,
} from '@/components/ui/StretchText'

export type WebDevTuner = {
  heroEyebrow: string
  heroTitle: string
  heroBlurb: string
  stretchEnabled: boolean
  stretchTarget: string
  stretchFont: StretchFont
  stretchCurve: StretchCurve
  baseWidth: number
  peakWidth: number
  customWidths: string
  weight: number
  letterSpacing: number
  opticalSize: number
  stretchStagger: number
  hoverBoost: number
  stickyEyebrow: string
  stickyTitle: string
  step1Label: string
  step1Heading: string
  step1Body: string
  step2Label: string
  step2Heading: string
  step2Body: string
  step3Label: string
  step3Heading: string
  step3Body: string
  step4Label: string
  step4Heading: string
  step4Body: string
  proofEyebrow: string
  proofTitle: string
  proofHint: string
  testimonialEyebrow: string
  testimonialTitle: string
  submitLabel: string
  boxRadius: number
  grainAmount: number
  grainSize: number
  grainContrast: number
  grainBrightness: number
  meshMotion: boolean
  meshMotionAmount: number
  meshMotionSpeed: number
  ctaHeadline: string
  ctaBlurb: string
  ctaLabel: string
}

/** bump clears stale localStorage that blocked live stretch edits */
export const WEB_DEV_STORAGE_KEY = 'mr-v3-web-dev-v9'

export const defaultWebDevTuner: WebDevTuner = {
  heroEyebrow: 'Capabilities · Web',
  heroTitle: 'Web Development',
  heroBlurb:
    'Websites built to look polished, load fast, and turn visits into real inquiries.',
  stretchEnabled: true,
  stretchTarget: 'Development',
  stretchFont: 'roboto-flex',
  stretchCurve: 'ramp',
  baseWidth: 45,
  peakWidth: 151,
  customWidths: '45,70,95,120,145,151,140,125,110,95,80',
  weight: 720,
  letterSpacing: -0.025,
  opticalSize: 120,
  stretchStagger: 0.05,
  hoverBoost: 22,
  stickyEyebrow: 'How we build',
  stickyTitle: 'From brief to something people trust.',
  step1Label: 'Direction',
  step1Heading: 'We start with the real goal.',
  step1Body:
    'Not a template quiz. A short discovery so the site has a job: calls, bookings, trust.',
  step2Label: 'Structure',
  step2Heading: 'Then we build the skeleton.',
  step2Body:
    'Wireframes and hierarchy before polish. Mobile first, so nothing important lives below a thumb.',
  step3Label: 'Trust',
  step3Heading: 'Then we prove it belongs.',
  step3Body:
    'Testimonials, clarity, and spacing so the page feels real, not just blocked out.',
  step4Label: 'Finish',
  step4Heading: 'Then we make it feel finished.',
  step4Body:
    'Type, motion, and copy that match the brand. You get something you are proud to send people to.',
  proofEyebrow: 'Selected builds',
  proofTitle: 'Before and after.',
  proofHint: 'Hover a card. Click to expand into the full case stage.',
  testimonialEyebrow: 'From clients',
  testimonialTitle: 'Words from people we built with.',
  submitLabel: 'Have we worked together?',
  boxRadius: 11,
  grainAmount: 100,
  grainSize: 120,
  grainContrast: 1.55,
  grainBrightness: 1.1,
  meshMotion: false,
  meshMotionAmount: 0.65,
  meshMotionSpeed: 1,
  ctaHeadline: 'Ready when you are.',
  ctaBlurb: 'Tell me what you need. I map the build from there.',
  ctaLabel: 'Start a project',
}

export function loadWebDevTuner(): WebDevTuner {
  try {
    const raw = localStorage.getItem(WEB_DEV_STORAGE_KEY)
    if (!raw) return { ...defaultWebDevTuner }
    return { ...defaultWebDevTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultWebDevTuner }
  }
}

function num(v: unknown, fallback: number) {
  const n = typeof v === 'number' ? v : Array.isArray(v) ? Number(v[0]) : Number(v)
  return Number.isFinite(n) ? n : fallback
}

function pick(raw: Record<string, unknown>, key: string): unknown {
  if (key in raw) return raw[key]
  for (const val of Object.values(raw)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const hit = pick(val as Record<string, unknown>, key)
      if (hit !== undefined) return hit
    }
  }
  return undefined
}

function buildTuner(raw: Record<string, unknown>, base: WebDevTuner): WebDevTuner {
  const g = <K extends keyof WebDevTuner>(key: K, fallback: WebDevTuner[K]): WebDevTuner[K] => {
    const v = pick(raw, key as string)
    return (v === undefined ? fallback : v) as WebDevTuner[K]
  }

  return {
    ...base,
    heroEyebrow: String(g('heroEyebrow', base.heroEyebrow)),
    heroTitle: String(g('heroTitle', base.heroTitle)),
    heroBlurb: String(g('heroBlurb', base.heroBlurb)),
    stretchEnabled: Boolean(g('stretchEnabled', base.stretchEnabled)),
    stretchTarget: String(g('stretchTarget', base.stretchTarget)),
    stretchFont: (g('stretchFont', base.stretchFont) as StretchFont) || 'roboto-flex',
    stretchCurve: normalizeCurve(g('stretchCurve', base.stretchCurve)),
    baseWidth: num(g('baseWidth', base.baseWidth), base.baseWidth),
    peakWidth: num(g('peakWidth', base.peakWidth), base.peakWidth),
    customWidths: String(g('customWidths', base.customWidths)),
    weight: num(g('weight', base.weight), base.weight),
    letterSpacing: num(g('letterSpacing', base.letterSpacing), base.letterSpacing),
    opticalSize: num(g('opticalSize', base.opticalSize), base.opticalSize),
    stretchStagger: num(g('stretchStagger', base.stretchStagger), base.stretchStagger),
    hoverBoost: num(g('hoverBoost', base.hoverBoost), base.hoverBoost),
    stickyEyebrow: String(g('stickyEyebrow', base.stickyEyebrow)),
    stickyTitle: String(g('stickyTitle', base.stickyTitle)),
    step1Label: String(g('step1Label', base.step1Label)),
    step1Heading: String(g('step1Heading', base.step1Heading)),
    step1Body: String(g('step1Body', base.step1Body)),
    step2Label: String(g('step2Label', base.step2Label)),
    step2Heading: String(g('step2Heading', base.step2Heading)),
    step2Body: String(g('step2Body', base.step2Body)),
    step3Label: String(g('step3Label', base.step3Label)),
    step3Heading: String(g('step3Heading', base.step3Heading)),
    step3Body: String(g('step3Body', base.step3Body)),
    step4Label: String(g('step4Label', base.step4Label)),
    step4Heading: String(g('step4Heading', base.step4Heading)),
    step4Body: String(g('step4Body', base.step4Body)),
    proofEyebrow: String(g('proofEyebrow', base.proofEyebrow)),
    proofTitle: String(g('proofTitle', base.proofTitle)),
    proofHint: String(g('proofHint', base.proofHint)),
    testimonialEyebrow: String(g('testimonialEyebrow', base.testimonialEyebrow)),
    testimonialTitle: String(g('testimonialTitle', base.testimonialTitle)),
    submitLabel: String(g('submitLabel', base.submitLabel)),
    boxRadius: num(g('boxRadius', base.boxRadius), base.boxRadius),
    grainAmount: (() => {
      const amt = num(g('grainAmount', base.grainAmount), NaN)
      if (Number.isFinite(amt)) return amt
      // migrate old grainOpacity (0–0.35) → amount 0–100
      const legacy = num(pick(raw, 'grainOpacity'), NaN)
      if (Number.isFinite(legacy)) return Math.min(100, Math.round((legacy / 0.1) * 100))
      return base.grainAmount
    })(),
    grainSize: num(g('grainSize', base.grainSize), base.grainSize),
    grainContrast: num(g('grainContrast', base.grainContrast), base.grainContrast),
    grainBrightness: num(g('grainBrightness', base.grainBrightness), base.grainBrightness),
    meshMotion: Boolean(g('meshMotion', base.meshMotion)),
    meshMotionAmount: num(g('meshMotionAmount', base.meshMotionAmount), base.meshMotionAmount),
    meshMotionSpeed: num(g('meshMotionSpeed', base.meshMotionSpeed), base.meshMotionSpeed),
    ctaHeadline: String(g('ctaHeadline', base.ctaHeadline)),
    ctaBlurb: String(g('ctaBlurb', base.ctaBlurb)),
    ctaLabel: String(g('ctaLabel', base.ctaLabel)),
  }
}

const Ctx = createContext<WebDevTuner>(defaultWebDevTuner)

export function WebDevTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadWebDevTuner(), [])

  // Stretch controls are FLAT (no nested folder return shape). This is what
  // made Leva edits fail before when folders swallowed the values.
  const stretch = useControls(
    'Headline stretch',
    {
      stretchEnabled: { value: initial.stretchEnabled, label: 'enabled' },
      stretchTarget: { value: initial.stretchTarget, label: 'stretch word' },
      stretchFont: {
        value: initial.stretchFont,
        options: {
          'Roboto Flex (wide stretch)': 'roboto-flex',
          'Mona Sans (smoother, max 125)': 'mona-sans',
        },
        label: 'stretch font',
      },
      stretchCurve: {
        value: initial.stretchCurve,
        options: ['ramp', 'tail', 'peak', 'valley', 'flat', 'custom'],
        label: 'curve',
      },
      baseWidth: {
        value: initial.baseWidth,
        min: 25,
        max: 151,
        step: 1,
        label: 'base width',
      },
      peakWidth: {
        value: initial.peakWidth,
        min: 25,
        max: 151,
        step: 1,
        label: 'peak width',
      },
      customWidths: {
        value: initial.customWidths,
        label: 'custom per letter',
      },
      stretchStagger: {
        value: initial.stretchStagger,
        min: 0,
        max: 0.2,
        step: 0.005,
        label: 'intro stagger',
      },
      weight: { value: initial.weight, min: 300, max: 900, step: 1 },
      letterSpacing: {
        value: initial.letterSpacing,
        min: -0.08,
        max: 0.2,
        step: 0.001,
        label: 'letter spacing',
      },
      opticalSize: {
        value: initial.opticalSize,
        min: 8,
        max: 144,
        step: 1,
        label: 'optical size',
      },
      hoverBoost: {
        value: initial.hoverBoost,
        min: 0,
        max: 50,
        step: 1,
        label: 'hover stretch boost',
      },
    },
    { store },
  )

  const page = useControls(
    'Web Dev page',
    {
      Hero: folder(
        {
          heroEyebrow: { value: initial.heroEyebrow, label: 'eyebrow' },
          heroTitle: { value: initial.heroTitle, label: 'title' },
          heroBlurb: { value: initial.heroBlurb, label: 'blurb' },
        },
        { collapsed: true },
      ),
      Sticky: folder(
        {
          stickyEyebrow: { value: initial.stickyEyebrow, label: 'eyebrow' },
          stickyTitle: { value: initial.stickyTitle, label: 'title' },
          step1Label: { value: initial.step1Label, label: 's1 label' },
          step1Heading: { value: initial.step1Heading, label: 's1 heading' },
          step1Body: { value: initial.step1Body, label: 's1 body' },
          step2Label: { value: initial.step2Label, label: 's2 label' },
          step2Heading: { value: initial.step2Heading, label: 's2 heading' },
          step2Body: { value: initial.step2Body, label: 's2 body' },
          step3Label: { value: initial.step3Label, label: 's3 label' },
          step3Heading: { value: initial.step3Heading, label: 's3 heading' },
          step3Body: { value: initial.step3Body, label: 's3 body' },
          step4Label: { value: initial.step4Label, label: 's4 label' },
          step4Heading: { value: initial.step4Heading, label: 's4 heading' },
          step4Body: { value: initial.step4Body, label: 's4 body' },
        },
        { collapsed: true },
      ),
      Proof: folder(
        {
          proofEyebrow: { value: initial.proofEyebrow, label: 'eyebrow' },
          proofTitle: { value: initial.proofTitle, label: 'title' },
          proofHint: { value: initial.proofHint, label: 'hint' },
        },
        { collapsed: true },
      ),
      Testimonials: folder(
        {
          testimonialEyebrow: { value: initial.testimonialEyebrow, label: 'eyebrow' },
          testimonialTitle: { value: initial.testimonialTitle, label: 'title' },
          submitLabel: { value: initial.submitLabel, label: 'submit btn' },
          boxRadius: {
            value: initial.boxRadius,
            min: 0,
            max: 24,
            step: 1,
            label: 'box roundness',
          },
        },
        { collapsed: true },
      ),
      Texture: folder(
        {
          grainAmount: {
            value: initial.grainAmount,
            min: 0,
            max: 100,
            step: 1,
            label: 'grain amount',
          },
          grainSize: {
            value: initial.grainSize,
            min: 60,
            max: 320,
            step: 5,
            label: 'grain size (chunkier ↑)',
          },
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
        },
        { collapsed: false },
      ),
      'Hero mesh': folder(
        {
          meshMotion: { value: initial.meshMotion, label: 'animate wash on/off' },
          meshMotionAmount: {
            value: initial.meshMotionAmount,
            min: 0,
            max: 1,
            step: 0.05,
            label: 'how far it drifts',
          },
          meshMotionSpeed: {
            value: initial.meshMotionSpeed,
            min: 0.15,
            max: 3,
            step: 0.05,
            label: 'how fast it moves',
          },
        },
        { collapsed: false },
      ),
      CTA: folder(
        {
          ctaHeadline: { value: initial.ctaHeadline, label: 'headline' },
          ctaBlurb: { value: initial.ctaBlurb, label: 'blurb' },
          ctaLabel: { value: initial.ctaLabel, label: 'button' },
        },
        { collapsed: true },
      ),
      Persist: folder(
        {
          'Remember web-dev': button(() => {
            try {
              localStorage.setItem(
                `${WEB_DEV_STORAGE_KEY}:remember`,
                localStorage.getItem(WEB_DEV_STORAGE_KEY) ?? '',
              )
            } catch {
              /* ignore */
            }
          }),
          'Revert web-dev': button(() => {
            try {
              const raw = localStorage.getItem(`${WEB_DEV_STORAGE_KEY}:remember`)
              if (!raw) return
              localStorage.setItem(WEB_DEV_STORAGE_KEY, raw)
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
        },
        { collapsed: true },
      ),
    },
    { store },
  )

  const flat = useMemo(
    () =>
      buildTuner(
        { ...(stretch as Record<string, unknown>), ...(page as Record<string, unknown>) },
        initial,
      ),
    [stretch, page, initial],
  )

  const json = JSON.stringify(flat)
  const stable = useMemo(() => flat, [json])

  const saved = useRef('')
  useEffect(() => {
    if (saved.current === json) return
    saved.current = json
    try {
      localStorage.setItem(WEB_DEV_STORAGE_KEY, json)
    } catch {
      /* ignore */
    }
  }, [json])

  return <Ctx.Provider value={stable}>{children}</Ctx.Provider>
}

export function useWebDevTuner() {
  return useContext(Ctx)
}
