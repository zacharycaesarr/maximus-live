import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'

const STORAGE = 'mr-v3-services-overview-v3'

export type ServiceCardTune = {
  title: string
  blurb: string
  /** Lucide-ish key: monitor | megaphone | workflow */
  symbol: string
  /** Card face color — ready for per-card paints */
  bg: string
  /** Title + body on dark cards */
  ink: string
  bullet1: string
  bullet2: string
  bullet3: string
  bullet4: string
}

export type ServicesOverviewTuner = {
  sectionTitle: string
  /** Designjoy-tall cards */
  cardMinH: number
  card1: ServiceCardTune
  card2: ServiceCardTune
  card3: ServiceCardTune
}

const defaultCard = (
  title: string,
  blurb: string,
  symbol: string,
  bg: string,
  ink: string,
  bullets: [string, string, string, string],
): ServiceCardTune => ({
  title,
  blurb,
  symbol,
  bg,
  ink,
  bullet1: bullets[0],
  bullet2: bullets[1],
  bullet3: bullets[2],
  bullet4: bullets[3],
})

export const defaultServicesOverview: ServicesOverviewTuner = {
  sectionTitle: 'Services overview',
  cardMinH: 480,
  card1: defaultCard(
    'Web',
    'Design that sells on phones first.',
    'monitor',
    '#E8D5A8',
    '#1a1612',
    [
      'Layouts built for real phones',
      'One primary offer path',
      'Proof above the fold',
      'Handoff you can edit',
    ],
  ),
  card2: defaultCard(
    'Ads',
    'Ads aimed at paying leads, not vanity.',
    'megaphone',
    '#7BA3C4',
    '#FCFAF2',
    [
      'Audience + offer mapped',
      'Creative that matches the site',
      'Honest budget testing',
      'Reports you can read',
    ],
  ),
  card3: defaultCard(
    'Creative Studio',
    'Brand, video, and creative that matches the site.',
    'palette',
    '#C4785A',
    '#FCFAF2',
    [
      'Brand systems you can reuse',
      'Motion + stills for ads',
      'Campaign kits that match',
      'Fast creative turnarounds',
    ],
  ),
}

function load(): ServicesOverviewTuner {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (!raw) return { ...defaultServicesOverview }
    const parsed = JSON.parse(raw) as Partial<ServicesOverviewTuner>
    const card3 = { ...defaultServicesOverview.card3, ...parsed.card3 }
    // Rename pass: old "Systems" → Creative Studio
    if (/^systems$/i.test(String(card3.title || ''))) {
      Object.assign(card3, defaultServicesOverview.card3)
    }
    return {
      ...defaultServicesOverview,
      ...parsed,
      card1: { ...defaultServicesOverview.card1, ...parsed.card1 },
      card2: { ...defaultServicesOverview.card2, ...parsed.card2 },
      card3,
    }
  } catch {
    return { ...defaultServicesOverview }
  }
}

const Ctx = createContext<ServicesOverviewTuner>(defaultServicesOverview)

export function ServicesOverviewTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => load(), [])

  const v = useControls(
    {
      'Services overview': folder(
        {
          sectionTitle: { value: initial.sectionTitle, label: 'section title' },
          cardMinH: {
            value: initial.cardMinH,
            min: 320,
            max: 640,
            step: 8,
            label: 'card min height (px)',
          },
          'Card 1': folder(
            {
              c1title: { value: initial.card1.title, label: 'title' },
              c1blurb: { value: initial.card1.blurb, label: 'blurb' },
              c1symbol: { value: initial.card1.symbol, label: 'symbol (monitor/megaphone/workflow)' },
              c1bg: { value: initial.card1.bg, label: 'card color' },
              c1ink: { value: initial.card1.ink, label: 'text color' },
              c1b1: { value: initial.card1.bullet1, label: 'flap bullet 1' },
              c1b2: { value: initial.card1.bullet2, label: 'flap bullet 2' },
              c1b3: { value: initial.card1.bullet3, label: 'flap bullet 3' },
              c1b4: { value: initial.card1.bullet4, label: 'flap bullet 4' },
            },
            { collapsed: true },
          ),
          'Card 2': folder(
            {
              c2title: { value: initial.card2.title, label: 'title' },
              c2blurb: { value: initial.card2.blurb, label: 'blurb' },
              c2symbol: { value: initial.card2.symbol, label: 'symbol (monitor/megaphone/workflow)' },
              c2bg: { value: initial.card2.bg, label: 'card color' },
              c2ink: { value: initial.card2.ink, label: 'text color' },
              c2b1: { value: initial.card2.bullet1, label: 'flap bullet 1' },
              c2b2: { value: initial.card2.bullet2, label: 'flap bullet 2' },
              c2b3: { value: initial.card2.bullet3, label: 'flap bullet 3' },
              c2b4: { value: initial.card2.bullet4, label: 'flap bullet 4' },
            },
            { collapsed: true },
          ),
          'Card 3': folder(
            {
              c3title: { value: initial.card3.title, label: 'title' },
              c3blurb: { value: initial.card3.blurb, label: 'blurb' },
              c3symbol: { value: initial.card3.symbol, label: 'symbol (monitor/megaphone/workflow)' },
              c3bg: { value: initial.card3.bg, label: 'card color' },
              c3ink: { value: initial.card3.ink, label: 'text color' },
              c3b1: { value: initial.card3.bullet1, label: 'flap bullet 1' },
              c3b2: { value: initial.card3.bullet2, label: 'flap bullet 2' },
              c3b3: { value: initial.card3.bullet3, label: 'flap bullet 3' },
              c3b4: { value: initial.card3.bullet4, label: 'flap bullet 4' },
            },
            { collapsed: true },
          ),
          Remember: button(() => {
            try {
              const raw = localStorage.getItem(STORAGE)
              if (raw) localStorage.setItem(`${STORAGE}:remember`, raw)
            } catch {
              /* ignore */
            }
          }),
          Revert: button(() => {
            try {
              const raw = localStorage.getItem(`${STORAGE}:remember`)
              if (!raw) return
              localStorage.setItem(STORAGE, raw)
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

  const flat: ServicesOverviewTuner = {
    sectionTitle: String(v.sectionTitle ?? defaultServicesOverview.sectionTitle),
    cardMinH: Number(v.cardMinH ?? defaultServicesOverview.cardMinH),
    card1: {
      title: String(v.c1title),
      blurb: String(v.c1blurb),
      symbol: String(v.c1symbol),
      bg: String(v.c1bg),
      ink: String(v.c1ink),
      bullet1: String(v.c1b1),
      bullet2: String(v.c1b2),
      bullet3: String(v.c1b3),
      bullet4: String(v.c1b4),
    },
    card2: {
      title: String(v.c2title),
      blurb: String(v.c2blurb),
      symbol: String(v.c2symbol),
      bg: String(v.c2bg),
      ink: String(v.c2ink),
      bullet1: String(v.c2b1),
      bullet2: String(v.c2b2),
      bullet3: String(v.c2b3),
      bullet4: String(v.c2b4),
    },
    card3: {
      title: String(v.c3title),
      blurb: String(v.c3blurb),
      symbol: String(v.c3symbol),
      bg: String(v.c3bg),
      ink: String(v.c3ink),
      bullet1: String(v.c3b1),
      bullet2: String(v.c3b2),
      bullet3: String(v.c3b3),
      bullet4: String(v.c3b4),
    },
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <Ctx.Provider value={flat}>{children}</Ctx.Provider>
}

export function useServicesOverviewTuner() {
  return useContext(Ctx)
}
