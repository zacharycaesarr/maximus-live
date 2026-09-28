import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  defaultPageScrollBg,
  loadPageScrollBg,
  PAGE_SCROLL_BG_STORAGE_KEY,
  type PageScrollBgTuner,
} from '@/lib/pageScrollBgDefaults'

const Ctx = createContext<PageScrollBgTuner>(defaultPageScrollBg)

export function PageScrollBgTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadPageScrollBg(), [])
  const values = useControls({
    'Homepage Background': folder({
      starsOpacity: { value: initial.starsOpacity, min: 0, max: 1, step: 0.01, label: 'Stars Opacity' },
      starsFadeEnd: { value: initial.starsFadeEnd, min: 55, max: 100, step: 1, label: 'Stars Fade End' },
      lightTransitionStart: { value: initial.lightTransitionStart, min: -30, max: 50, step: 1, label: 'Light Transition Start (vh)' },
      lightTransitionEnd: { value: initial.lightTransitionEnd, min: 5, max: 90, step: 1, label: 'Light Transition End (vh)' },
      speckleOpacity: { value: initial.speckleOpacity, min: 0, max: 12, step: 1, label: 'Speckle Opacity' },
      speckleDensity: { value: initial.speckleDensity, min: 25, max: 110, step: 1, label: 'Speckle Density' },
      creamLightStrength: { value: initial.creamLightStrength, min: 0, max: 25, step: 1, label: 'Cream Light Strength' },
      grainOpacity: { value: initial.grainOpacity, min: 0, max: 6, step: 1, label: 'Grain Opacity' },
      darkReturnStart: { value: initial.darkReturnStart, min: -60, max: 15, step: 1, label: 'Dark Return Start (vh)' },
      darkReturnEnd: { value: initial.darkReturnEnd, min: 5, max: 90, step: 1, label: 'Dark Return End (vh)' },
      waveSpeed: { value: initial.waveSpeed, min: 0.1, max: 2, step: 0.05, label: 'Wave Speed' },
      waveStrength: { value: initial.waveStrength, min: 0, max: 100, step: 1, label: 'Wave Strength' },
      waveAcidAmount: { value: initial.waveAcidAmount, min: 0, max: 30, step: 1, label: 'Wave Acid Amount' },
    }, { collapsed: true }),
  }, { store })

  const settings = useMemo(() => ({ ...defaultPageScrollBg, ...values }) as PageScrollBgTuner, [values])
  useEffect(() => {
    try { localStorage.setItem(PAGE_SCROLL_BG_STORAGE_KEY, JSON.stringify(settings)) }
    catch { /* storage unavailable */ }
  }, [settings])
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>
}

export function usePageScrollBgTuner() { return useContext(Ctx) }
