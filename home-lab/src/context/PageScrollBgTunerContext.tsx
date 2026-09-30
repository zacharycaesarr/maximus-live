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
      servicesFadeLength: { value: initial.servicesFadeLength, min: 16, max: 40, step: 1, label: 'Services Fade Length (vh)' },
      servicesFadeCurve: { value: initial.servicesFadeCurve, min: 0, max: 100, step: 1, label: 'Services Fade Curve' },
      creamBase: { value: initial.creamBase, label: 'Cream Base' },
      creamToneLight: { value: initial.creamToneLight, label: 'Cream Light Tone' },
      creamToneShade: { value: initial.creamToneShade, label: 'Cream Shade Tone' },
      creamTonalStrength: { value: initial.creamTonalStrength, min: 0, max: 30, step: 1, label: 'Cream Tonal Strength' },
      creamTextureOpacity: { value: initial.creamTextureOpacity, min: 0, max: 20, step: 0.5, label: 'Grain Opacity' },
      creamTextureScale: { value: initial.creamTextureScale, min: 0.5, max: 2, step: 0.05, label: 'Grain Scale' },
      nodeOpacity: { value: initial.nodeOpacity, min: 0, max: 15, step: 0.5, label: 'Node Opacity' },
      nodeScale: { value: initial.nodeScale, min: 0.6, max: 1.6, step: 0.05, label: 'Node Scale' },
      nodeMotion: { value: initial.nodeMotion, min: 0, max: 2, step: 0.1, label: 'Node Motion Strength' },
      nodeDensity: { value: initial.nodeDensity, min: 1, max: 3, step: 1, label: 'Node Density' },
      nodeLineColor: { value: initial.nodeLineColor, label: 'Node Line Color' },
      nodeDotColor: { value: initial.nodeDotColor, label: 'Node Dot Color' },
      ctaBurstColor: { value: initial.ctaBurstColor, label: 'CTA Burst Color' },
      ctaBurstOpacity: { value: initial.ctaBurstOpacity, min: 0, max: 35, step: 1, label: 'CTA Burst Opacity' },
      ctaBurstSize: { value: initial.ctaBurstSize, min: 0.5, max: 1.7, step: 0.05, label: 'CTA Burst Size' },
      ctaNoiseOpacity: { value: initial.ctaNoiseOpacity, min: 0, max: 12, step: 0.5, label: 'CTA Noise Opacity' },
      ctaNoiseSpeed: { value: initial.ctaNoiseSpeed, min: 0, max: 2, step: 0.05, label: 'CTA Noise Speed' },
      ctaNoiseScale: { value: initial.ctaNoiseScale, min: 0.5, max: 2, step: 0.05, label: 'CTA Noise Scale' },
    }, { collapsed: true }),
  }, { store })

  const settings = useMemo(() => {
    return { ...defaultPageScrollBg, ...values } as PageScrollBgTuner
  }, [values])
  useEffect(() => {
    try { localStorage.setItem(PAGE_SCROLL_BG_STORAGE_KEY, JSON.stringify(settings)) }
    catch { /* storage unavailable */ }
  }, [settings])
  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>
}

export function usePageScrollBgTuner() { return useContext(Ctx) }
