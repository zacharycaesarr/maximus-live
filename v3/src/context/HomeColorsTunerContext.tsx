import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useControls, folder, button } from '@home-leva'
import type { LevaStore } from '@/home/lib/levaStore'
import {
  HOME_COLORS_STORAGE_KEY,
  defaultHomeColors,
  homeColorsToStyle,
  loadHomeColors,
  persistHomeColors,
  testRoutingHomeColors,
  type HomeColors,
} from '@/lib/homeColorsDefaults'

const Ctx = createContext<HomeColors>(defaultHomeColors)

/**
 * Leva: Homepage Colors — semantic roles only.
 * Values flow onto #home-page via HomePageShell.
 */
export function HomeColorsTunerProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  const initial = useMemo(() => loadHomeColors(), [])

  const values = useControls(
    {
      'Homepage Colors': folder(
        {
          bgLight: { value: initial.bgLight, label: 'Light Background' },
          bgDark: { value: initial.bgDark, label: 'Dark Background' },
          surfaceLight: { value: initial.surfaceLight, label: 'Light Surface' },
          surfaceDark: { value: initial.surfaceDark, label: 'Dark Surface' },
          textOnLight: { value: initial.textOnLight, label: 'Text on Light' },
          textOnDark: { value: initial.textOnDark, label: 'Text on Dark' },
          muted: { value: initial.muted, label: 'Muted Text' },
          line: { value: initial.line, label: 'Line / Border' },
          acid: { value: initial.acid, label: 'Acid Accent' },
          'Test Color Routing': button(() => {
            try {
              localStorage.setItem(
                HOME_COLORS_STORAGE_KEY,
                JSON.stringify(testRoutingHomeColors),
              )
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
          'Reset to Theme Defaults': button(() => {
            try {
              localStorage.setItem(
                HOME_COLORS_STORAGE_KEY,
                JSON.stringify(defaultHomeColors),
              )
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  const flat = useMemo<HomeColors>(
    () => ({
      bgLight: String((values as HomeColors).bgLight ?? defaultHomeColors.bgLight),
      bgDark: String((values as HomeColors).bgDark ?? defaultHomeColors.bgDark),
      surfaceLight: String(
        (values as HomeColors).surfaceLight ?? defaultHomeColors.surfaceLight,
      ),
      surfaceDark: String(
        (values as HomeColors).surfaceDark ?? defaultHomeColors.surfaceDark,
      ),
      textOnLight: String(
        (values as HomeColors).textOnLight ?? defaultHomeColors.textOnLight,
      ),
      textOnDark: String(
        (values as HomeColors).textOnDark ?? defaultHomeColors.textOnDark,
      ),
      muted: String((values as HomeColors).muted ?? defaultHomeColors.muted),
      line: String((values as HomeColors).line ?? defaultHomeColors.line),
      acid: String((values as HomeColors).acid ?? defaultHomeColors.acid),
    }),
    [values],
  )

  useEffect(() => {
    persistHomeColors(flat)
  }, [flat])

  return <Ctx.Provider value={flat}>{children}</Ctx.Provider>
}

export function useHomeColors() {
  return useContext(Ctx)
}

export function useHomeColorsStyle() {
  return homeColorsToStyle(useHomeColors())
}
