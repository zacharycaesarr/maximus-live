import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useControls, folder } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import { useLabTuners, type LabTunerValues } from '@/components/services-cards/tuners/LabTuners'
import { useAdsTuners, type AdsTunerValues } from '@/components/services-cards/tuners/AdsTuners'
import {
  useCreativeTuners,
  type CreativeTunerValues,
} from '@/components/services-cards/tuners/CreativeTuners'
import { usePersistTuners } from '@/components/services-cards/tuners/persistTuners'

const SECTION_STORAGE = 'mr-v3-services-overview-section-v1'

type ServicesOverviewTuner = {
  sectionTitle: string
  web: LabTunerValues
  ads: AdsTunerValues
  creative: CreativeTunerValues
  webReplayKey: number
  adsReplayKey: number
  creativeReplayKey: number
}

const defaultSectionTitle = 'Services overview'

function loadSectionTitle() {
  try {
    const raw = localStorage.getItem(SECTION_STORAGE)
    if (!raw) return defaultSectionTitle
    const parsed = JSON.parse(raw) as { sectionTitle?: string }
    return parsed.sectionTitle?.trim() || defaultSectionTitle
  } catch {
    return defaultSectionTitle
  }
}

const Ctx = createContext<ServicesOverviewTuner | null>(null)

export function ServicesOverviewTunerProvider({
  store,
  children,
}: {
  store?: LevaStore
  children: ReactNode
}) {
  usePersistTuners()

  const [webReplayKey, setWebReplayKey] = useState(0)
  const [adsReplayKey, setAdsReplayKey] = useState(0)
  const [creativeReplayKey, setCreativeReplayKey] = useState(0)

  const section = useControls(
    'Services overview',
    {
      Section: folder({
        sectionTitle: { value: loadSectionTitle(), label: 'section title' },
      }),
    },
    { collapsed: true, store },
  )

  const web = useLabTuners(() => setWebReplayKey((k) => k + 1), store)
  const ads = useAdsTuners(() => setAdsReplayKey((k) => k + 1), store)
  const creative = useCreativeTuners(() => setCreativeReplayKey((k) => k + 1), store)

  const value = useMemo<ServicesOverviewTuner>(
    () => ({
      sectionTitle: String(section.sectionTitle ?? defaultSectionTitle),
      web,
      ads,
      creative,
      webReplayKey,
      adsReplayKey,
      creativeReplayKey,
    }),
    [section.sectionTitle, web, ads, creative, webReplayKey, adsReplayKey, creativeReplayKey],
  )

  useEffect(() => {
    try {
      localStorage.setItem(
        SECTION_STORAGE,
        JSON.stringify({ sectionTitle: value.sectionTitle }),
      )
    } catch {
      /* ignore */
    }
  }, [value.sectionTitle])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useServicesOverviewTuner() {
  const ctx = useContext(Ctx)
  if (!ctx) {
    throw new Error('useServicesOverviewTuner must be used within ServicesOverviewTunerProvider')
  }
  return ctx
}
