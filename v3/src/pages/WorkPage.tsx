import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LevaPanel, useCreateStore } from 'leva'
import { Clapperboard, Globe, TrendingUp } from 'lucide-react'
import DirectNav from '@/components/nav/DirectNav'
import SmoothScroll from '@/components/SmoothScroll'
import SiteFooter from '@/components/sections/SiteFooter'
import ProofShowcaseModal from '@/components/ui/proof-showcase-modal'
import { Reveal } from '@/components/ui/reveal'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import { FooterTunerProvider } from '@/context/FooterTunerContext'
import { defaultProofProjects, type ProofCategory, type ProofProject } from '@/lib/proofDefaults'
import { cn } from '@/lib/utils'

const titleGradient =
  'bg-gradient-to-br from-[#1a1612] via-[#2C2520] to-[#6b5a4a] bg-clip-text text-transparent'

const PILLARS: { id: ProofCategory | 'all'; label: string; Icon: typeof Globe }[] = [
  { id: 'all', label: 'All work', Icon: Globe },
  { id: 'web', label: 'Web', Icon: Globe },
  { id: 'ads', label: 'Ads', Icon: TrendingUp },
  { id: 'creative', label: 'Creative', Icon: Clapperboard },
]

function WorkMain() {
  const [filter, setFilter] = useState<ProofCategory | 'all'>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const projects = defaultProofProjects

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  )

  const active: ProofProject | null = activeId
    ? projects.find((p) => p.id === activeId) ?? null
    : null

  const idx = active ? projects.findIndex((p) => p.id === active.id) : -1

  useEffect(() => {
    document.title = 'Work · Maximus Reach'
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <DirectNav />

      <section className="px-6 pb-10 pt-28 md:pb-14 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="mb-2 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
              Work
            </p>
            <h1 className={cn('m-0 max-w-2xl font-nhg text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-tight', titleGradient)}>
              Proof you can flip through
            </h1>
            <p className="mt-4 max-w-xl font-nhg text-base leading-relaxed text-espresso/60">
              Web, ads, and creative in one place. Mock sites and deeper case studies land here as we build them.
              Tap a card for the full breakdown.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap gap-2">
              {PILLARS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 font-nhg text-[13px] transition',
                    filter === id
                      ? 'border-espresso bg-espresso text-[#FCFAF2]'
                      : 'border-espresso/12 bg-white/70 text-espresso/70 hover:border-espresso/25',
                  )}
                >
                  <Icon size={13} aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={0.05 * i}>
              <button
                type="button"
                onClick={() => setActiveId(p.id)}
                className="group w-full overflow-hidden rounded-2xl border border-espresso/8 bg-[#141210] text-left shadow-[0_16px_40px_rgba(26,22,18,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(26,22,18,0.18)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#efeae2]/95 px-2.5 py-1 font-nhg text-[11px] font-medium text-espresso">
                    {p.categoryIcon}
                  </span>
                </div>
                <div className="p-5">
                  <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.12em] text-white/35">{p.tag}</p>
                  <h2 className="mt-1 m-0 font-nhg text-xl font-semibold text-white">{p.title}</h2>
                  <p className="mt-2 m-0 font-nhg text-sm font-medium text-[#c4a574]">{p.metricHighlight}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 rounded-2xl border border-espresso/10 bg-white/60 px-6 py-8 text-center md:px-10">
            <h2 className="m-0 font-nhg text-xl font-semibold text-espresso">Want something like this?</h2>
            <p className="mx-auto mt-2 max-w-md font-nhg text-sm text-espresso/55">
              Mock site builds and deeper case writeups are coming. In the meantime, start a project and we will map the fit.
            </p>
            <Link
              to="/start"
              className="mt-5 inline-flex rounded-[10px] bg-[#1a1612] px-5 py-3 font-nhg text-sm font-medium text-[#FCFAF2] no-underline transition hover:bg-black"
            >
              Get started
            </Link>
          </div>
        </Reveal>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {active ? (
          <ProofShowcaseModal
            key="work-showcase"
            project={active}
            projects={projects}
            onClose={() => setActiveId(null)}
            onPrev={() => {
              const next = (idx - 1 + projects.length) % projects.length
              setActiveId(projects[next].id)
            }}
            onNext={() => {
              const next = (idx + 1) % projects.length
              setActiveId(projects[next].id)
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function WorkPage() {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <FooterTunerProvider store={store}>
          <SmoothScroll>
            <WorkMain />
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
                titleBar={{ title: 'Maximus · Work', filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </FooterTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
