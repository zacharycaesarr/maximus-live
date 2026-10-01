import { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LevaPanel, useCreateStore, useControls, folder, button } from 'leva'
import Cal from '@calcom/embed-react'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import { Reveal } from '@/components/ui/reveal'
import TiltSurface from '@/components/ui/TiltSurface'
import BloomFieldGradient, { type BloomColor } from '@/components/ui/BloomFieldGradient'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { CAL_BOOKING_LINK, CAL_UI_CONFIG } from '@/portal/lib/calConfig'
import { cn } from '@/lib/utils'
import { Mail, Phone, CalendarDays } from 'lucide-react'
import { Lottie } from 'lottie-react'
import { useReducedMotion } from 'framer-motion'

const titleGradient =
  'bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text text-transparent'

const START_KEY = 'mr-v3-start-v4'

const defaults = {
  eyebrow: 'Start here',
  title: "Let's build something that actually converts",
  sub: 'Book a call, email, or text. Tell me what you are working on and we will map the next step.',
  bookLabel: 'Book a call',
  bookHint: 'Pick a time that works. Calendar is right here on the page.',
  email: 'hello@maximusreach.com',
  phone: '(540) 416-2983',
  phoneHref: 'tel:+15404162983',
  contactLabel: 'Or reach out directly',
  revealDuration: 1.2,
  revealDelay: 0,
  backdrop: '#F7F1E6',
  colorA: '#F7F1E6',
  colorB: '#E8D4BC',
  colorC: '#D9C3B0',
  colorD: '#C4A574',
  grain: 100,
  vignette: 0.16,
  speed: 48,
  motionAmount: 1,
  animated: true,
}

function loadStart(): typeof defaults {
  try {
    const raw = localStorage.getItem(START_KEY)
    if (!raw) return { ...defaults }
    return { ...defaults, ...(JSON.parse(raw) as Partial<typeof defaults>) }
  } catch {
    return { ...defaults }
  }
}

type StartCopy = Omit<
  typeof defaults,
  | 'revealDuration'
  | 'revealDelay'
  | 'backdrop'
  | 'colorA'
  | 'colorB'
  | 'colorC'
  | 'colorD'
  | 'grain'
  | 'vignette'
  | 'speed'
  | 'motionAmount'
  | 'animated'
>

/** Mount Cal only when near viewport — big FPS saver on this page. */
function LazyCal() {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true)
          obs.disconnect()
        }
      },
      { rootMargin: '200px', threshold: 0.01 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-lenis-prevent
      className="mt-5 w-full overflow-x-auto overflow-y-visible rounded-2xl border border-white/10 bg-black/30 text-left md:overflow-hidden"
    >
      {ready ? (
        <Cal
          namespace="start-booking"
          calLink={CAL_BOOKING_LINK}
          style={{ width: '100%', height: 'auto', minHeight: '560px', maxWidth: '100%' }}
          className="min-h-[560px] md:min-h-[620px]"
          config={{
            ...CAL_UI_CONFIG,
            layout: 'month_view',
            hideEventTypeDetails: 'true',
          }}
        />
      ) : (
        <div className="flex min-h-[560px] items-center justify-center font-nhg text-sm text-[#FCFAF2]/40 md:min-h-[620px]">
          Loading calendar…
        </div>
      )}
    </div>
  )
}

/** After Effects Lottie above the Start headline (middle of hero). */
function StartMiddleLottie() {
  const reduce = useReducedMotion()
  return (
    <div
      className="mx-auto mb-4 flex h-[120px] w-[120px] items-center justify-center md:mb-6 md:h-[160px] md:w-[160px]"
      aria-hidden
    >
      <Lottie
        src="/lottie/start-middleanimation.json"
        loop
        autoplay={!reduce}
        className="h-full w-full"
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </div>
  )
}

function StartMain({
  t,
  revealDuration,
  revealDelay,
  bg,
}: {
  t: StartCopy
  revealDuration: number
  revealDelay: number
  bg: {
    backdrop: string
    colors: BloomColor[]
    grain: number
    vignette: number
    speed: number
    motionAmount: number
    animated: boolean
  }
}) {
  useEffect(() => {
    document.title = 'Start · Maximus Reach'
  }, [])

  return (
    <div className="relative min-h-screen">
      <BloomFieldGradient
        className="fixed inset-0 z-0"
        backdrop={bg.backdrop}
        colors={bg.colors}
        grain={bg.grain}
        vignette={bg.vignette}
        speed={bg.speed}
        motionAmount={bg.motionAmount}
        animated={bg.animated}
      />
      <div className="relative z-[1]">
        <DirectNav />

        <section className="relative overflow-hidden px-6 pb-10 pt-28 md:pb-12 md:pt-36">
          <div className="relative mx-auto max-w-3xl text-center">
            <StartMiddleLottie />
            <Reveal duration={revealDuration} delay={revealDelay}>
              <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
                {t.eyebrow}
              </p>
              <h1
                className={cn(
                  'm-0 font-nhg text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-tight',
                  titleGradient,
                )}
              >
                {t.title}
              </h1>
              <p className="mx-auto mt-5 max-w-xl font-nhg text-base leading-relaxed text-espresso md:text-lg">
                {t.sub}
              </p>
            </Reveal>
          </div>
        </section>

        <div
          className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-espresso/12 to-transparent"
          aria-hidden
        />

        <section className="mx-auto max-w-4xl px-6 py-8 md:py-10" aria-label="Book a call">
          <Reveal duration={revealDuration} delay={revealDelay + 0.06}>
            <div className="rounded-3xl border border-espresso/10 bg-[#0e0d0c] px-5 py-7 text-center md:px-8 md:py-9">
              <CalendarDays className="mx-auto mb-2 text-[#c4a574]" size={24} strokeWidth={1.5} />
              <h2 className="m-0 font-nhg text-xl font-semibold text-[#FCFAF2] md:text-2xl">
                {t.bookLabel}
              </h2>
              <p className="mx-auto mt-2 max-w-md font-nhg text-sm text-[#FCFAF2]/70">{t.bookHint}</p>
              <LazyCal />
            </div>
          </Reveal>
        </section>

        <div
          className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-espresso/12 to-transparent"
          aria-hidden
        />

        <section className="mx-auto max-w-3xl px-6 py-12 md:py-16" aria-label="Contact">
          <Reveal duration={revealDuration} delay={revealDelay + 0.1}>
            <p className="mb-2 text-center font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
              {t.contactLabel}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <TiltSurface
                as="a"
                href={`mailto:${t.email}`}
                className="flex items-center gap-3 rounded-[11px] border border-white/55 bg-[rgba(255,255,255,0.45)] px-5 py-4 no-underline shadow-[0_12px_32px_-12px_rgba(44,37,32,0.35)] backdrop-blur-[8px]"
              >
                <Mail className="text-[#8b6950]" size={20} />
                <span className="font-nhg text-sm font-medium text-espresso">{t.email}</span>
              </TiltSurface>
              <TiltSurface
                as="a"
                href={t.phoneHref}
                className="flex items-center gap-3 rounded-[11px] border border-white/55 bg-[rgba(255,255,255,0.45)] px-5 py-4 no-underline shadow-[0_12px_32px_-12px_rgba(44,37,32,0.35)] backdrop-blur-[8px]"
              >
                <Phone className="text-[#8b6950]" size={20} />
                <span className="font-nhg text-sm font-medium text-espresso">{t.phone}</span>
              </TiltSurface>
            </div>
            <p className="mt-8 text-center font-nhg text-sm text-espresso">
              Already a client?{' '}
              <Link
                to="/portal"
                className="font-medium text-espresso underline decoration-[#c4a574]/50 underline-offset-2"
              >
                Client Portal
              </Link>
            </p>
          </Reveal>
        </section>

        <SiteFooter />
      </div>
    </div>
  )
}

export default function StartPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)
  const [replayKey, setReplayKey] = useState(0)
  const initial = useMemo(() => loadStart(), [])

  const values = useControls(
    {
      Copy: folder(
        {
          eyebrow: { value: initial.eyebrow, label: 'eyebrow' },
          title: { value: initial.title, label: 'title' },
          sub: { value: initial.sub, label: 'sub' },
          bookLabel: { value: initial.bookLabel, label: 'book title' },
          bookHint: { value: initial.bookHint, label: 'book hint' },
          contactLabel: { value: initial.contactLabel, label: 'contact label' },
          email: { value: initial.email, label: 'email' },
          phone: { value: initial.phone, label: 'phone' },
          phoneHref: { value: initial.phoneHref, label: 'phone href' },
        },
        { collapsed: true },
      ),
      Background: folder(
        {
          backdrop: { value: initial.backdrop, label: 'backdrop' },
          colorA: { value: initial.colorA, label: 'blob A (cream)' },
          colorB: { value: initial.colorB, label: 'blob B (sand)' },
          colorC: { value: initial.colorC, label: 'blob C (mocha)' },
          colorD: { value: initial.colorD, label: 'blob D (gold)' },
          grain: { value: initial.grain, min: 0, max: 100, step: 1, label: 'grain (21st)' },
          vignette: { value: initial.vignette, min: 0, max: 0.5, step: 0.01, label: 'vignette' },
          speed: { value: initial.speed, min: 0, max: 100, step: 1, label: 'motion speed' },
          motionAmount: {
            value: initial.motionAmount,
            min: 0,
            max: 1,
            step: 0.05,
            label: 'motion amount',
          },
          animated: { value: initial.animated, label: 'animated' },
        },
        { collapsed: false },
      ),
      Animation: folder(
        {
          revealDuration: {
            value: initial.revealDuration ?? 1.2,
            min: 0.4,
            max: 2.5,
            step: 0.05,
            label: 'reveal duration',
          },
          revealDelay: {
            value: initial.revealDelay ?? 0,
            min: 0,
            max: 1,
            step: 0.05,
            label: 'reveal delay',
          },
          previewReplay: button(() => setReplayKey((k) => k + 1)),
        },
        { collapsed: true },
      ),
      Persist: folder(
        {
          remember: { value: false, label: 'Remember' },
          revert: { value: false, label: 'Revert' },
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  useEffect(() => {
    if ((values as { remember?: boolean }).remember) {
      const full = values as typeof defaults & { remember: boolean; revert: boolean }
      const rest: Partial<typeof full> = { ...full }
      delete rest.remember
      delete rest.revert
      localStorage.setItem(START_KEY, JSON.stringify(rest))
    }
    if ((values as { revert?: boolean }).revert) {
      localStorage.removeItem(START_KEY)
      window.location.reload()
    }
  }, [values])

  const t = {
    eyebrow: String(values.eyebrow),
    title: String(values.title),
    sub: String(values.sub),
    bookLabel: String(values.bookLabel),
    bookHint: String(values.bookHint),
    contactLabel: String(values.contactLabel),
    email: String(values.email),
    phone: String(values.phone),
    phoneHref: String(values.phoneHref),
  }

  const revealDuration = Number((values as { revealDuration?: number }).revealDuration) || 1.2
  const revealDelay = Number((values as { revealDelay?: number }).revealDelay) || 0

  const bg = useMemo(
    () => ({
      backdrop: String(values.backdrop || defaults.backdrop),
      colors: [
        { hex: String(values.colorA), x: 67, y: 46, phase: 1.1, phase2: 2.4 },
        { hex: String(values.colorB), x: 35, y: 66, phase: 2.7, phase2: 0.8 },
        { hex: String(values.colorC), x: 48, y: 20, phase: 0.4, phase2: 3.1 },
        { hex: String(values.colorD), x: 81, y: 88, phase: 3.6, phase2: 1.5 },
      ] as BloomColor[],
      grain: Number(values.grain) || 100,
      vignette: Number(values.vignette) || 0.16,
      speed: Number(values.speed) || 48,
      motionAmount: Number(values.motionAmount) || 1,
      animated: Boolean(values.animated),
    }),
    [
      values.backdrop,
      values.colorA,
      values.colorB,
      values.colorC,
      values.colorD,
      values.grain,
      values.vignette,
      values.speed,
      values.motionAmount,
      values.animated,
    ],
  )

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <StartMain
              key={replayKey}
              t={t}
              revealDuration={revealDuration}
              revealDelay={revealDelay}
              bg={bg}
            />
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
                titleBar={{ title: 'Maximus · Start', filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
