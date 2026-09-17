import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  defaultHeroLayout,
  loadHeroLayout,
  HERO_LAYOUT_STORAGE_KEY,
  type HeroLayoutTuner,
} from '@/lib/heroLayoutDefaults'

const HeroLayoutCtx = createContext<HeroLayoutTuner>(defaultHeroLayout)

export function HeroLayoutTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadHeroLayout(), [])

  const values = useControls(
    {
      'Hero layout & copy': folder(
        {
          showEyebrow: initial.showEyebrow,
          eyebrow: initial.eyebrow,
          subhead: { value: initial.subhead, label: 'body (use | for lines)' },
          scrollLabel: initial.scrollLabel,
          showSidePlaceholder: { value: initial.showSidePlaceholder, label: 'side column' },
          columnSplit: { value: initial.columnSplit, min: 28, max: 50, step: 1 },
          imageOnTopMobile: initial.imageOnTopMobile,
          sideImageUrl: initial.sideImageUrl,
          sideBg: initial.sideBg,
          copyMaxWidth: { value: initial.copyMaxWidth, min: 320, max: 1200, step: 10 },
          sideRadius: { value: initial.sideRadius, min: 0, max: 40, step: 1 },
          showCtas: initial.showCtas,
          ctaGetStarted: initial.ctaGetStarted,
          ctaPortal: initial.ctaPortal,
          Hand: folder(
            {
              handEnabled: { value: initial.handEnabled, label: 'enabled' },
              handPreview: {
                value: initial.handPreview,
                label: 'preview (force show)',
              },
              handSide: {
                value: initial.handSide,
                options: { left: 'left', right: 'right' },
                label: 'side',
              },
              handLayer: {
                value: initial.handLayer,
                options: { 'below column': 'below', 'above column': 'above' },
                label: 'layer',
              },
              handScale: { value: initial.handScale, min: 0.5, max: 3, step: 0.05, label: 'scale' },
              handOffsetX: {
                value: initial.handOffsetX,
                min: -400,
                max: 400,
                step: 1,
                label: 'offset X',
              },
              handOffsetY: {
                value: initial.handOffsetY,
                min: -400,
                max: 400,
                step: 1,
                label: 'offset Y',
              },
              handSlidePx: {
                value: initial.handSlidePx,
                min: 40,
                max: 320,
                step: 4,
                label: 'edge slide px',
              },
              handRevealMs: { value: initial.handRevealMs, min: 80, max: 600, step: 10, label: 'slide in ms' },
              handLeaveDelayMs: {
                value: initial.handLeaveDelayMs,
                min: 0,
                max: 400,
                step: 10,
                label: 'leave delay ms',
              },
              handFadeOutMs: {
                value: initial.handFadeOutMs,
                min: 40,
                max: 500,
                step: 10,
                label: 'slide out ms',
              },
              handFadeEarly: {
                value: initial.handFadeEarly,
                min: 0,
                max: 0.9,
                step: 0.05,
                label: 'retract early (0-1)',
              },
              handRetractHoldMs: {
                value: initial.handRetractHoldMs,
                min: 0,
                max: 400,
                step: 5,
                label: 'retract peek ms',
              },
              handSpeed: { value: initial.handSpeed, min: 0.5, max: 2.5, step: 0.05, label: 'play speed' },
            },
            { collapsed: true },
          ),
          Parallax: folder(
            {
              parallaxEnabled: {
                value: initial.parallaxEnabled,
                label: 'enabled (content + bg)',
              },
              parallaxStrength: {
                value: initial.parallaxStrength,
                min: 0,
                max: 40,
                step: 0.5,
                label: 'shift strength',
              },
              parallaxMaxTilt: {
                value: initial.parallaxMaxTilt,
                min: 0,
                max: 18,
                step: 0.25,
                label: 'max tilt deg',
              },
              parallaxPerspective: {
                value: initial.parallaxPerspective,
                min: 400,
                max: 1600,
                step: 20,
                label: 'perspective',
              },
            },
            { collapsed: true },
          ),
          Surfer: folder(
            {
              surferEnabled: { value: initial.surferEnabled, label: 'enabled' },
              surferOpacity: { value: initial.surferOpacity, min: 0.2, max: 1, step: 0.02, label: 'opacity' },
              surferScale: { value: initial.surferScale, min: 0.5, max: 1.8, step: 0.05, label: 'scale' },
              surferOffsetX: {
                value: initial.surferOffsetX,
                min: -200,
                max: 200,
                step: 1,
                label: 'offset X',
              },
              surferOffsetY: {
                value: initial.surferOffsetY,
                min: -300,
                max: 200,
                step: 1,
                label: 'offset Y',
              },
              surferWidth: {
                value: initial.surferWidth,
                min: 280,
                max: 900,
                step: 10,
                label: 'width px',
              },
            },
            { collapsed: true },
          ),
          Watermark: folder(
            {
              showWatermark: initial.showWatermark,
              watermarkLine1: { value: initial.watermarkLine1, label: 'line 1' },
              watermarkLine2: { value: initial.watermarkLine2, label: 'line 2' },
              watermarkOpacity: {
                value: initial.watermarkOpacity,
                min: 0,
                max: 1,
                step: 0.01,
                label: 'opacity',
              },
              watermarkSize: { value: initial.watermarkSize, min: 3, max: 16, step: 0.25, label: 'size (vw)' },
              watermarkTracking: {
                value: initial.watermarkTracking,
                min: -0.1,
                max: 0.1,
                step: 0.005,
                label: 'tracking',
              },
              watermarkColor: { value: initial.watermarkColor, label: 'color' },
              watermarkRight: { value: initial.watermarkRight, min: 0, max: 40, step: 0.5, label: 'right %' },
              watermarkBottom: {
                value: initial.watermarkBottom,
                min: 0,
                max: 40,
                step: 0.5,
                label: 'bottom %',
              },
              watermarkOffsetX: {
                value: initial.watermarkOffsetX,
                min: -120,
                max: 120,
                step: 1,
                label: 'offset X',
              },
              watermarkOffsetY: {
                value: initial.watermarkOffsetY,
                min: -120,
                max: 120,
                step: 1,
                label: 'offset Y',
              },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember hero layout': button(() => {
                try {
                  localStorage.setItem(
                    `${HERO_LAYOUT_STORAGE_KEY}:remember`,
                    localStorage.getItem(HERO_LAYOUT_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${HERO_LAYOUT_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(HERO_LAYOUT_STORAGE_KEY, raw)
                  window.location.reload()
                } catch {
                  /* ignore */
                }
              }),
            },
            { collapsed: true },
          ),
        },
        { collapsed: true },
      ),
    },
    { store },
  )

  const flat = { ...defaultHeroLayout, ...(values as Partial<HeroLayoutTuner>) } as HeroLayoutTuner

  useEffect(() => {
    try {
      localStorage.setItem(HERO_LAYOUT_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <HeroLayoutCtx.Provider value={flat}>{children}</HeroLayoutCtx.Provider>
}

export function useHeroLayoutTuner() {
  return useContext(HeroLayoutCtx)
}
