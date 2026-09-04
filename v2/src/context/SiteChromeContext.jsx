import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  SITE_CHROME_STORAGE_KEY,
  defaultSiteChrome,
  loadSiteChrome,
  toFlatSiteChrome,
} from '../lib/siteChromeDefaults'
import { makeRememberActions } from '../lib/levaRemember'

const SiteChromeContext = createContext(null)
const isDev = import.meta.env.DEV

function SiteChromeProviderInner({ children, store }) {
  const initial = useMemo(() => loadSiteChrome(), [])
  const settingsRef = useRef(defaultSiteChrome)

  const remember = makeRememberActions({
    storageKey: SITE_CHROME_STORAGE_KEY,
    getFlat: () => settingsRef.current,
    label: 'footer',
  })

  const tuner = useControls(
    'Footer Section',
    {
      logoSrc: { value: initial.logoSrc, label: 'Logo URL' },
      logoSize: { value: initial.logoSize, min: 18, max: 48, step: 1, label: 'Logo size' },
      logoInvert: { value: initial.logoInvert, label: 'Invert logo (dark UI)' },
      navCta: { value: initial.navCta, label: 'Nav CTA' },
      footerTag: { value: initial.footerTag, label: 'Footer line', rows: 2 },
      email: { value: initial.email, label: 'Email' },
      instagram: { value: initial.instagram, label: 'Instagram URL' },
      linkedin: { value: initial.linkedin, label: 'LinkedIn URL' },
      xUrl: { value: initial.xUrl, label: 'X URL' },
      Actions: folder(
        {
          'Remember footer': button(remember['Remember footer']),
          'Revert to remembered': button(remember['Revert to remembered']),
          'Reset defaults': button(() => {
            localStorage.removeItem(SITE_CHROME_STORAGE_KEY)
            window.location.reload()
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatSiteChrome(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(SITE_CHROME_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <SiteChromeContext.Provider value={{ settings }}>
      {children}
    </SiteChromeContext.Provider>
  )
}

export function SiteChromeProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <SiteChromeContext.Provider value={{ settings: defaultSiteChrome }}>
        {children}
      </SiteChromeContext.Provider>
    )
  }
  return <SiteChromeProviderInner store={store}>{children}</SiteChromeProviderInner>
}

export function useSiteChrome() {
  const ctx = useContext(SiteChromeContext)
  if (!ctx) return { settings: defaultSiteChrome }
  return ctx
}
