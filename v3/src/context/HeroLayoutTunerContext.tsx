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
          'Layout': folder(
            {
              heroAlign: {
                value: initial.heroAlign,
                options: { Left: 'left', Center: 'center' },
                label: 'copy align',
              },
              bgVideoEnabled: { value: initial.bgVideoEnabled, label: 'video bg (vs mesh)' },
              heroVideoOverlay: {
                value: initial.heroVideoOverlay,
                min: 0,
                max: 1,
                step: 0.02,
                label: 'video dark wash',
              },
              heroVideoOffsetYDesktop: {
                value: initial.heroVideoOffsetYDesktop,
                min: -120,
                max: 120,
                step: 1,
                label: 'video Y desktop',
              },
              heroVideoOffsetYMobile: {
                value: initial.heroVideoOffsetYMobile,
                min: -120,
                max: 120,
                step: 1,
                label: 'video Y mobile',
              },
            },
            { collapsed: true },
          ),
          showEyebrow: initial.showEyebrow,
          eyebrow: initial.eyebrow,
          eyebrowScale: {
            value: initial.eyebrowScale,
            min: 0.55,
            max: 1.35,
            step: 0.01,
            label: 'eyebrow scale',
          },
          subhead: { value: initial.subhead, label: 'body (use | for lines)' },
          'Copy block (group)': folder(
            {
              copyOffsetX: {
                value: initial.copyOffsetX,
                min: -220,
                max: 220,
                step: 1,
                label: 'position X',
              },
              copyOffsetY: {
                value: initial.copyOffsetY,
                min: -220,
                max: 220,
                step: 1,
                label: 'position Y',
              },
              copyScale: {
                value: initial.copyScale,
                min: 0.85,
                max: 1.45,
                step: 0.01,
                label: 'whole block scale',
              },
              ctaScale: {
                value: initial.ctaScale,
                min: 0.9,
                max: 1.4,
                step: 0.01,
                label: 'buttons scale',
              },
              copyBreathMs: {
                value: initial.copyBreathMs,
                min: 0,
                max: 2000,
                step: 40,
                label: 'breathe before copy (ms)',
              },
              subheadLagMs: {
                value: initial.subheadLagMs,
                min: 0,
                max: 1200,
                step: 20,
                label: 'subtext after headline (ms)',
              },
              'Reset copy block': button(() => {
                try {
                  const cur = JSON.parse(
                    localStorage.getItem(HERO_LAYOUT_STORAGE_KEY) || '{}',
                  ) as Record<string, unknown>
                  localStorage.setItem(
                    HERO_LAYOUT_STORAGE_KEY,
                    JSON.stringify({
                      ...cur,
                      copyOffsetX: defaultHeroLayout.copyOffsetX,
                      copyOffsetY: defaultHeroLayout.copyOffsetY,
                      copyScale: defaultHeroLayout.copyScale,
                      ctaScale: defaultHeroLayout.ctaScale,
                      copyBreathMs: defaultHeroLayout.copyBreathMs,
                      subheadLagMs: defaultHeroLayout.subheadLagMs,
                    }),
                  )
                  window.location.reload()
                } catch {
                  /* ignore */
                }
              }),
            },
            { collapsed: false },
          ),
          showCtas: initial.showCtas,
          ctaGetStarted: initial.ctaGetStarted,
          ctaPortal: initial.ctaPortal,
          Hand: folder(
            {
              handEnabled: { value: initial.handEnabled, label: 'enabled' },
              handPreview: { value: initial.handPreview, label: 'preview (force show)' },
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
              handRevealMs: {
                value: initial.handRevealMs,
                min: 80,
                max: 600,
                step: 10,
                label: 'slide in ms',
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
                label: 'retract early',
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
              parallaxEnabled: { value: initial.parallaxEnabled, label: 'enabled' },
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
