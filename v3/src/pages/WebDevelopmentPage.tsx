import { useEffect, useState } from 'react'
import { LevaPanel, useCreateStore } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import WebDevShowcase from '@/components/sections/WebDevShowcase'
import MobileFirstSection from '@/components/sections/MobileFirstSection'
import WebDevStickyProcess, {
  type StickyStep,
} from '@/components/sections/WebDevStickyProcess'
import WebDevTestimonials, {
  type WebTestimonial,
} from '@/components/sections/WebDevTestimonials'
import { MagneticCursor } from '@/components/ui/magnetic-cursor'
import WebDevCtaSlab from '@/components/sections/WebDevCtaSlab'
import { StretchText } from '@/components/ui/StretchText'
import GrainOverlay from '@/components/ui/GrainOverlay'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { WebDevTunerProvider, useWebDevTuner } from '@/context/WebDevTunerContext'
import type { PhoneImage } from '@/components/ui/phone-mockups'

const PHONES: PhoneImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=75',
    alt: 'Ridge Plumbing after — mobile',
  },
  {
    src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=75',
    alt: 'Northline Dental after — mobile',
  },
  {
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=75',
    alt: 'Ridge before contrast — mobile',
  },
]

function buildStickySteps(t: ReturnType<typeof useWebDevTuner>): StickyStep[] {
  return [
    {
      id: 'direction',
      label: t.step1Label,
      heading: t.step1Heading,
      body: t.step1Body,
      bullets: ['Offer and audience mapped', 'Must-have pages only', 'Clear success metric'],
    },
    {
      id: 'structure',
      label: t.step2Label,
      heading: t.step2Heading,
      body: t.step2Body,
      bullets: ['Mobile wire first', 'One primary CTA path', 'Speed baked in early'],
    },
    {
      id: 'trust',
      label: t.step3Label,
      heading: t.step3Heading,
      body: t.step3Body,
      bullets: ['Proof near the offer', 'Clear section rhythm', 'Trust without clutter'],
    },
    {
      id: 'finish',
      label: t.step4Label,
      heading: t.step4Heading,
      body: t.step4Body,
      bullets: ['Custom UI, not theme leftovers', 'Subtle motion where it helps', 'Handoff you can edit'],
      ctaLabel: 'Talk through a build',
      ctaHref: '/start',
    },
  ]
}

const TESTIMONIALS: WebTestimonial[] = [
  {
    id: 't1',
    quote:
      'The new site finally looks like us. Calls started coming in the first week after launch.',
    excerpt: 'The new site finally looks like us. Calls started coming in…',
    name: 'Marcus R.',
    role: 'Owner',
    company: 'Ridge Plumbing Co.',
    category: 'Website',
    metric: 'Clearer offers · stronger calls',
  },
  {
    id: 't2',
    quote:
      'Patients can book without calling. That alone was worth the rebuild.',
    excerpt: 'Patients can book without calling. That alone was worth…',
    name: 'Dr. Elena N.',
    role: 'Practice lead',
    company: 'Northline Dental',
    category: 'Website',
    metric: 'Booking path front and center',
  },
  {
    id: 't3',
    quote:
      'Zachary kept it simple. No jargon. Just a site that works on phones.',
    excerpt: 'Zachary kept it simple. No jargon. Just a site that works…',
    name: 'Priya S.',
    role: 'Founder',
    company: 'Local service brand',
    category: 'Website',
  },
  {
    id: 't4',
    quote: 'We went from looking dated to looking like a real company overnight.',
    excerpt: 'We went from looking dated to looking like a real company…',
    name: 'James T.',
    role: 'Ops',
    company: 'Trades client',
    category: 'Website',
  },
]

function WebDevMain() {
  const t = useWebDevTuner()
  const stickySteps = buildStickySteps(t)
  const [desktopCursor, setDesktopCursor] = useState(false)

  useEffect(() => {
    document.title = 'Web Development · Maximus Reach'
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setDesktopCursor(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  const titleParts = t.heroTitle.split(/\s+/)
  const stretchWord = t.stretchTarget.trim()
  const stretchProps = {
    baseWidth: t.baseWidth,
    peakWidth: t.peakWidth,
    curve: t.stretchCurve,
    customWidths: t.customWidths,
    weight: t.weight,
    letterSpacing: t.letterSpacing,
    opticalSize: t.opticalSize,
    stretchFont: t.stretchFont,
    stagger: t.stretchStagger,
  }

  const page = (
      <div className="mr-caps-page min-h-screen bg-[#f3efe8] md:cursor-none">
        <GrainOverlay opacity={Math.max(0.055, t.grainOpacity)} />
        <DirectNav />

        <section className="relative overflow-x-clip px-5 pb-12 pt-24 md:px-6 md:pb-20 md:pt-36">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
            <Reveal>
              <p className="mb-3 font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
                {t.heroEyebrow}
              </p>
              <h1 className="m-0 max-w-[18ch] text-[clamp(2.4rem,8vw,4.75rem)] font-light leading-[0.95] tracking-tight text-espresso">
                {titleParts.map((word, i) => {
                  const isStretch =
                    t.stretchEnabled &&
                    word.toLowerCase().replace(/[^\w]/g, '') ===
                      stretchWord.toLowerCase().replace(/[^\w]/g, '')
                  return (
                    <span key={`${word}-${i}`}>
                      {i > 0 ? ' ' : null}
                      {isStretch ? (
                        <StretchText
                          text={word}
                          {...stretchProps}
                          className="align-baseline"
                        />
                      ) : (
                        <span className="font-tiempos">{word}</span>
                      )}
                    </span>
                  )
                })}
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="m-0 max-w-sm font-serotiva text-[15px] font-medium leading-relaxed text-espresso/55 md:pb-2">
                {t.heroBlurb}
              </p>
            </Reveal>
          </div>
        </section>

        <MobileFirstSection phones={PHONES} />

        <section className="overflow-x-clip border-t border-espresso/8 bg-[#f7f7f5]/80 px-5 py-14 md:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <Reveal>
                <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
                  {t.proofEyebrow}
                </p>
                <h2 className="mt-2 font-tiempos text-[clamp(1.75rem,3.5vw,2.5rem)] font-light tracking-tight text-espresso">
                  {t.proofTitle}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="max-w-xs font-serotiva text-sm font-medium text-espresso/50">{t.proofHint}</p>
              </Reveal>
            </div>
            <WebDevShowcase />
          </div>
        </section>

        <WebDevStickyProcess
          eyebrow={t.stickyEyebrow}
          title={t.stickyTitle}
          steps={stickySteps}
          mediaSide="left"
        />

        <WebDevTestimonials
          eyebrow={t.testimonialEyebrow}
          title={t.testimonialTitle}
          items={TESTIMONIALS}
          submitLabel={t.submitLabel}
          cardRadius={t.boxRadius}
        />

        <WebDevCtaSlab headline={t.ctaHeadline} blurb={t.ctaBlurb} label={t.ctaLabel} />

        <SiteFooter />
      </div>
  )

  if (!desktopCursor) return page

  return (
    <MagneticCursor
      hoverStyle="outline"
      outlineColor="#2C2520"
      cursorColor="#2C2520"
      blendMode="normal"
      pullElements={false}
      magneticFactor={0.12}
      cursorSize={18}
      hoverPadding={6}
      contrastBoost={1}
      disableOnTouch
    >
      {page}
    </MagneticCursor>
  )
}

export default function WebDevelopmentPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <WebDevTunerProvider store={store}>
            <SmoothScroll>
              <WebDevMain />
            </SmoothScroll>
            {isDev && (
              <div
                data-lenis-prevent
                className="mr-v3-leva-host"
                onWheel={(e) => e.stopPropagation()}
              >
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
                  titleBar={{ title: 'Maximus · Web Dev', filter: false }}
                  oneLineLabels
                />
              </div>
            )}
          </WebDevTunerProvider>
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
