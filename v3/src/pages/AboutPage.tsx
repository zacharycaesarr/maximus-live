import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LevaPanel, useCreateStore } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import NameSwapPlayground from '@/components/about/NameSwapPlayground'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { defaultAboutTuner } from '@/lib/aboutDefaults'
import type { LevaStore } from '@/lib/levaStore'
import { cn } from '@/lib/utils'

/**
 * Clean-slate About + GSAP name motion playground.
 * Old layout: v3/_archive/about-page-2026-09-21/
 */

type SectionId = 'hero' | 'story' | 'do' | 'process' | 'cta'

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'story', label: 'Story' },
  { id: 'do', label: 'What I do' },
  { id: 'process', label: 'How it works' },
  { id: 'cta', label: 'CTA' },
]

const t = defaultAboutTuner

function SectionCopy({ id }: { id: SectionId }) {
  if (id === 'hero') {
    return (
      <div className="space-y-3 font-nhg text-sm text-espresso">
        <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-espresso/40">{t.heroEyebrow}</p>
        <p className="m-0 text-2xl font-semibold tracking-tight">{t.heroLine1}</p>
        <p className="m-0 text-2xl font-semibold tracking-tight">{t.heroLine2}</p>
        <p className="m-0 text-espresso/70">{t.heroTagline}</p>
      </div>
    )
  }
  if (id === 'story') {
    return (
      <div className="space-y-3 font-nhg text-sm leading-relaxed text-espresso">
        <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-espresso/40">{t.storyLabel}</p>
        <p className="m-0 text-xl font-semibold">{t.storyTitle}</p>
        <p className="m-0 text-espresso/75">{t.storyP1}</p>
        <p className="m-0 text-espresso/75">{t.storyP2}</p>
      </div>
    )
  }
  if (id === 'do') {
    return (
      <div className="space-y-4 font-nhg text-sm text-espresso">
        <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-espresso/40">{t.doLabel}</p>
        <p className="m-0 text-xl font-semibold">{t.doTitle}</p>
        {[
          [t.do1Title, t.do1Body],
          [t.do2Title, t.do2Body],
          [t.do3Title, t.do3Body],
          [t.do4Title, t.do4Body],
        ].map(([title, body]) => (
          <div key={title}>
            <p className="m-0 font-semibold">{title}</p>
            <p className="m-0 mt-1 text-espresso/70">{body}</p>
          </div>
        ))}
      </div>
    )
  }
  if (id === 'process') {
    return (
      <div className="space-y-4 font-nhg text-sm text-espresso">
        <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-espresso/40">{t.processLabel}</p>
        <p className="m-0 text-xl font-semibold">{t.processTitle}</p>
        {[
          [t.step1Title, t.step1Body],
          [t.step2Title, t.step2Body],
          [t.step3Title, t.step3Body],
          [t.step4Title, t.step4Body],
        ].map(([title, body], i) => (
          <div key={title}>
            <p className="m-0 font-semibold">
              0{i + 1} · {title}
            </p>
            <p className="m-0 mt-1 text-espresso/70">{body}</p>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3 font-nhg text-sm text-espresso">
      <p className="m-0 text-[11px] uppercase tracking-[0.16em] text-espresso/40">{t.ctaLabel}</p>
      <p className="m-0 text-xl font-semibold">{t.ctaTitle}</p>
      <p className="m-0 text-espresso/70">{t.ctaSub}</p>
      <p className="m-0">{t.ctaEmail}</p>
      <p className="m-0">{t.ctaButton}</p>
    </div>
  )
}

function AboutMain({ store }: { store: LevaStore }) {
  const [open, setOpen] = useState<SectionId | null>(null)

  useEffect(() => {
    document.title = 'About · Maximus Reach'
  }, [])

  return (
    <div className="min-h-screen bg-[#f3efe8]">
      <DirectNav />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-28 md:pt-36">
        <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
          About · clean slate
        </p>

        <NameSwapPlayground store={store} className="mt-6 md:mt-10" />

        <div className="mt-16 border-t border-espresso/10 pt-10">
          <p className="font-nhg text-[13px] leading-relaxed text-espresso/55">
            Old About layout is saved in{' '}
            <code className="rounded bg-espresso/8 px-1.5 py-0.5 text-[12px]">
              v3/_archive/about-page-2026-09-21
            </code>
            . Tap a section for the copy we are keeping.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setOpen((cur) => (cur === s.id ? null : s.id))}
                className={cn(
                  'rounded-full border px-4 py-2 font-nhg text-[13px] transition',
                  open === s.id
                    ? 'border-espresso bg-espresso text-[#FCFAF2]'
                    : 'border-espresso/15 bg-white/60 text-espresso hover:border-espresso/30',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {open && (
            <div className="mt-6 rounded-2xl border border-espresso/10 bg-white/70 p-6 shadow-[0_12px_40px_rgba(44,37,32,0.06)]">
              <SectionCopy id={open} />
            </div>
          )}
        </div>

        <div className="mt-12">
          <Link
            to="/start"
            className="inline-flex rounded-full border border-espresso/15 bg-white/70 px-5 py-3 font-nhg text-[13px] text-espresso no-underline"
          >
            Start a project
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function AboutPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(false)
  const [mountKey, setMountKey] = useState(0)

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <AboutMain store={store} />
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
                titleBar={{ title: 'Maximus · About', filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
