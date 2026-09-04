import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultNavTuner,
  loadNavTuner,
  NAV_TUNER_STORAGE_KEY,
  toFlatNavTuner,
} from '../components/nav/navDefaults'
import { makeRememberActions } from '../lib/levaRemember'

const NavTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function NavTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadNavTuner(), [])
  const settingsRef = useRef(defaultNavTuner)

  const remember = makeRememberActions({
    storageKey: NAV_TUNER_STORAGE_KEY,
    getFlat: () => settingsRef.current,
    label: 'nav',
  })

  const tuner = useControls(
    'Glass Menu',
    {
      Notch: folder(
        {
          top: { value: initial.top, min: 0, max: 40, step: 1, label: 'Top offset (px)' },
          notchBg: { value: initial.notchBg, label: 'Notch bg' },
          borderOpacity: { value: initial.borderOpacity, min: 0, max: 0.4, step: 0.01 },
          linkGap: { value: initial.linkGap, min: 0, max: 24, step: 1 },
          fontSize: { value: initial.fontSize, min: 11, max: 16, step: 1 },
          textColor: { value: initial.textColor },
        },
        { collapsed: true },
      ),
      Logo: folder(
        {
          logoVariant: {
            value: initial.logoVariant,
            options: ['black', 'icon', 'both'],
            label: 'Corner logo variant',
          },
          logoSize: { value: initial.logoSize, min: 24, max: 64, step: 2 },
          logoTop: { value: initial.logoTop, min: 8, max: 120, step: 2 },
          logoLeft: { value: initial.logoLeft, min: 8, max: 120, step: 2 },
          showStandaloneLogo: { value: initial.showStandaloneLogo, label: 'Show corner logos' },
        },
        { collapsed: true },
      ),
      Actions: folder(
        {
          'Remember nav': button(remember['Remember nav']),
          'Revert to remembered': button(remember['Revert to remembered']),
          'Reset defaults': button(() => {
            localStorage.removeItem(NAV_TUNER_STORAGE_KEY)
            localStorage.removeItem('mr-nav-tuner-v1')
            window.location.reload()
          }),
          'Copy JSON': button(() => {
            navigator.clipboard?.writeText(JSON.stringify(settingsRef.current, null, 2))
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatNavTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(NAV_TUNER_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <NavTunerContext.Provider value={{ settings }}>
      {children}
    </NavTunerContext.Provider>
  )
}

export function NavTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <NavTunerContext.Provider value={{ settings: defaultNavTuner }}>
        {children}
      </NavTunerContext.Provider>
    )
  }

  return (
    <NavTunerProviderInner store={store}>
      {children}
    </NavTunerProviderInner>
  )
}

export function useNavTuner() {
  const ctx = useContext(NavTunerContext)
  if (!ctx) return { settings: defaultNavTuner }
  return ctx
}
