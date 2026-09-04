import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  BODY_FONT_OPTIONS,
  DISPLAY_FONT_OPTIONS,
  TYPOGRAPHY_STORAGE_KEY,
  defaultTypographyTuner,
  loadTypographyTuner,
  toFlatTypographyTuner,
  typographyToCssVars,
} from '../lib/typographyDefaults'
import { makeRememberActions } from '../lib/levaRemember'

const TypographyContext = createContext(null)
const isDev = import.meta.env.DEV

function applyCssVars(cssVars) {
  const root = document.documentElement
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

function TypographyProviderInner({ children, store }) {
  const initial = useMemo(() => loadTypographyTuner(), [])
  const settingsRef = useRef(defaultTypographyTuner)

  const remember = makeRememberActions({
    storageKey: TYPOGRAPHY_STORAGE_KEY,
    getFlat: () => settingsRef.current,
    label: 'fonts',
  })

  const tuner = useControls(
    'Site Typography',
    {
      displayFont: {
        value: initial.displayFont,
        options: Object.keys(DISPLAY_FONT_OPTIONS),
        label: 'Display / headers',
      },
      bodyFont: {
        value: initial.bodyFont,
        options: Object.keys(BODY_FONT_OPTIONS),
        label: 'Body / subheads',
      },
      Actions: folder(
        {
          'Remember fonts': button(remember['Remember fonts']),
          'Revert to remembered': button(remember['Revert to remembered']),
          'Reset defaults': button(() => {
            localStorage.removeItem(TYPOGRAPHY_STORAGE_KEY)
            window.location.reload()
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatTypographyTuner(tuner), [tuner])
  const cssVars = useMemo(() => typographyToCssVars(settings), [settings])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(TYPOGRAPHY_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    applyCssVars(cssVars)
  }, [cssVars])

  return (
    <TypographyContext.Provider value={{ settings, cssVars }}>
      {children}
    </TypographyContext.Provider>
  )
}

export function TypographyProvider({ children, store }) {
  if (!isDev || !store) {
    const settings = defaultTypographyTuner
    const cssVars = typographyToCssVars(settings)
    return (
      <TypographyContext.Provider value={{ settings, cssVars }}>
        <TypographyCssBridge cssVars={cssVars}>{children}</TypographyCssBridge>
      </TypographyContext.Provider>
    )
  }
  return <TypographyProviderInner store={store}>{children}</TypographyProviderInner>
}

function TypographyCssBridge({ cssVars, children }) {
  useEffect(() => {
    applyCssVars(cssVars)
  }, [cssVars])
  return children
}

export function useTypography() {
  const ctx = useContext(TypographyContext)
  if (!ctx) {
    return { settings: defaultTypographyTuner, cssVars: typographyToCssVars(defaultTypographyTuner) }
  }
  return ctx
}
