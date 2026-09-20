import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import { defaultNavTuner, loadNavTuner, NAV_STORAGE_KEY, type NavTuner } from '@/lib/navDefaults'

const NavCtx = createContext<NavTuner>(defaultNavTuner)

export function NavTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadNavTuner(), [])

  const values = useControls(
    {
      Nav: folder(
        {
          barHeight: { value: initial.barHeight, min: 44, max: 88, step: 1 },
          barColor: initial.barColor,
          linkColor: initial.linkColor,
          barShape: {
            value: initial.barShape,
            options: {
              'See-through → pill (new)': 'glass',
              'Full bar': 'flat',
              'V2 curved notch': 'notch',
            },
            label: 'bar shape',
          },
          notchRadius: { value: initial.notchRadius, min: 8, max: 28, step: 1, label: 'notch radius' },
          scrollSolidAt: {
            value: initial.scrollSolidAt,
            min: 8,
            max: 200,
            step: 4,
            label: 'pill after scroll px',
          },
          glassMenuBg: { value: initial.glassMenuBg, label: 'pill bg' },
          glassMenuOpacity: {
            value: initial.glassMenuOpacity,
            min: 0.4,
            max: 1,
            step: 0.02,
            label: 'pill opacity',
          },
          link1: initial.link1,
          link2: initial.link2,
          link3: initial.link3,
          ctaLabel: initial.ctaLabel,
          ctaBg: initial.ctaBg,
          ctaText: initial.ctaText,
          showCtaArrow: initial.showCtaArrow,
          Logo: folder(
            {
              showLogo: initial.showLogo,
              logoStyle: {
                value: initial.logoStyle ?? 'short',
                options: {
                  'Short (new mark)': 'short',
                  'Classic SVG (smooth trial)': 'smooth',
                },
                label: 'logo mark',
              },
              logoSize: { value: initial.logoSize, min: 12, max: 48, step: 1, label: 'size (px)' },
              logoGap: { value: initial.logoGap, min: 0, max: 24, step: 1, label: 'gap to wordmark' },
              logoOffsetX: { value: initial.logoOffsetX, min: -24, max: 24, step: 1, label: 'offset X' },
              logoOffsetY: { value: initial.logoOffsetY, min: -16, max: 16, step: 1, label: 'offset Y' },
            },
            { collapsed: true },
          ),
          Persist: folder(
            {
              'Remember nav': button(() => {
                try {
                  localStorage.setItem(
                    `${NAV_STORAGE_KEY}:remember`,
                    localStorage.getItem(NAV_STORAGE_KEY) ?? '',
                  )
                } catch {
                  /* ignore */
                }
              }),
              'Revert to remembered': button(() => {
                try {
                  const raw = localStorage.getItem(`${NAV_STORAGE_KEY}:remember`)
                  if (!raw) return
                  localStorage.setItem(NAV_STORAGE_KEY, raw)
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

  const flat = { ...defaultNavTuner, ...(values as Partial<NavTuner>) } as NavTuner

  useEffect(() => {
    try {
      localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(flat))
    } catch {
      /* ignore */
    }
  }, [flat])

  return <NavCtx.Provider value={flat}>{children}</NavCtx.Provider>
}

export function useNavTuner() {
  return useContext(NavCtx)
}
