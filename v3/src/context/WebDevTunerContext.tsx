import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import type { StretchFont, StretchCurve } from '@/components/ui/StretchText'

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
  grainOpacity: number
  ctaHeadline: string
  ctaBlurb: string
  ctaLabel: string
}

export const WEB_DEV_STORAGE_KEY = 'mr-v3-web-dev-v3'

export const defaultWebDevTuner: WebDevTuner = {
  heroEyebrow: 'Capabilities · Web',
  heroTitle: 'Web Development',
  heroBlurb:
    'A site that looks like your business and gives you room to grow. Built mobile-first, then scaled up.',
  stretchEnabled: true,
  stretchTarget: 'Reach',
  stretchFont: 'roboto-flex',
  stretchCurve: 'ramp',
  baseWidth: 100,
  peakWidth: 151,
  customWidths: '100,112,128,140,151',
  weight: 700,
  letterSpacing: -0.01,
  opticalSize: 120,
  stretchStagger: 0.05,
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
  grainOpacity: 0.045,
  ctaHeadline: 'Ready when you are.',
  ctaBlurb: 'Tell me what you need. I map the build from there.',
  ctaLabel: 'Start a project',
}

export function loadWebDevTuner(): WebDevTuner {
  try {
    const raw = localStorage.getItem(WEB_DEV_STORAGE_KEY)
    if (!raw) return defaultWebDevTuner
    return { ...defaultWebDevTuner, ...JSON.parse(raw) }
  } catch {
    return defaultWebDevTuner
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

  const values = useControls(
    {
      'Web Dev page': folder(
        {
          Hero: folder(
            {
              heroEyebrow: { value: initial.heroEyebrow, label: 'eyebrow' },
              heroTitle: { value: initial.heroTitle, label: 'title' },
              heroBlurb: { value: initial.heroBlurb, label: 'blurb' },
            },
            { collapsed: true },
          ),
          'Headline stretch': folder(
            {
              stretchEnabled: { value: initial.stretchEnabled, label: 'enabled' },
              stretchTarget: {
                value: initial.stretchTarget,
                label: 'stretch word',
              },
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
                options: {
                  'Ramp (narrow → wide)': 'ramp',
                  'Tail (last letters reach)': 'tail',
                  'Peak (middle widest)': 'peak',
                  'Valley (ends widest)': 'valley',
                  'Flat (all same)': 'flat',
                  'Custom (type widths)': 'custom',
                },
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
            },
            { collapsed: false },
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
              testimonialEyebrow: {
                value: initial.testimonialEyebrow,
                label: 'eyebrow',
              },
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
              grainOpacity: {
                value: initial.grainOpacity,
                min: 0,
                max: 0.15,
                step: 0.005,
                label: 'grain',
              },
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
        { collapsed: false },
      ),
    },
    { store },
  )

  const flat = { ...defaultWebDevTuner, ...(values as Partial<WebDevTuner>) }

  useEffect(() => {
    try {
      localStorage.setItem(WEB_DEV_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <Ctx.Provider value={flat}>{children}</Ctx.Provider>
}

export function useWebDevTuner() {
  return useContext(Ctx)
}
