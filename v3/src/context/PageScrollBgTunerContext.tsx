import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  ARCHIVED_21ST_BLUE,
  ARCHIVED_DUSK_SLUDGE,
  defaultPageScrollBg,
  loadPageScrollBg,
  PAGE_SCROLL_BG_STORAGE_KEY,
  type PageScrollBgTuner,
} from '@/lib/pageScrollBgDefaults'

const Ctx = createContext<PageScrollBgTuner>(defaultPageScrollBg)

export function PageScrollBgTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadPageScrollBg(), [])

  const values = useControls(
    {
      'Page scroll BG': folder(
        {
          enabled: { value: initial.enabled, label: 'enabled' },
          color0: { value: initial.color0, label: 'color top (0%)' },
          color1: { value: initial.color1, label: 'color bottom (100%)' },
          angle: { value: initial.angle, min: 0, max: 360, step: 1, label: 'angle' },
          grain: { value: initial.grain, min: 0, max: 100, step: 1 },
          vignette: { value: initial.vignette, min: 0, max: 100, step: 1 },
          speed: { value: initial.speed, min: 0, max: 100, step: 1, label: 'motion speed' },
          motionAmount: {
            value: initial.motionAmount,
            min: 0,
            max: 100,
            step: 1,
            label: 'motion amount',
          },
          motionReverse: { value: initial.motionReverse, label: 'motion reverse' },
          unlockAfterHero: {
            value: initial.unlockAfterHero,
            min: 0.5,
            max: 1.2,
            step: 0.02,
            label: 'unlock after hero',
          },
          scrollDarkenMax: {
            value: initial.scrollDarkenMax,
            min: 0,
            max: 0.6,
            step: 0.02,
            label: 'scroll darken max',
          },
          'Load sunset paper (live)': button(() => {
            try {
              localStorage.setItem(PAGE_SCROLL_BG_STORAGE_KEY, JSON.stringify(defaultPageScrollBg))
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
          'Load dusk sludge (archived)': button(() => {
            try {
              localStorage.setItem(
                PAGE_SCROLL_BG_STORAGE_KEY,
                JSON.stringify({ ...defaultPageScrollBg, ...ARCHIVED_DUSK_SLUDGE, enabled: true }),
              )
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
          'Load 21st blue (archived)': button(() => {
            try {
              localStorage.setItem(
                PAGE_SCROLL_BG_STORAGE_KEY,
                JSON.stringify({ ...defaultPageScrollBg, ...ARCHIVED_21ST_BLUE, enabled: true }),
              )
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

  const flat = { ...defaultPageScrollBg, ...(values as Partial<PageScrollBgTuner>) } as PageScrollBgTuner

  useEffect(() => {
    try {
      localStorage.setItem(PAGE_SCROLL_BG_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <Ctx.Provider value={flat}>{children}</Ctx.Provider>
}

export function usePageScrollBgTuner() {
  return useContext(Ctx)
}
