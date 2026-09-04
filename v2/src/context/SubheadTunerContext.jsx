import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultSubheadTuner,
  loadSubheadTuner,
  SUBHEAD_TUNER_STORAGE_KEY,
  toFlatSubheadTuner,
} from '../components/hero/subheadDefaults'

const SubheadTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function SubheadTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadSubheadTuner(), [])
  const settingsRef = useRef(defaultSubheadTuner)

  const tuner = useControls(
    'Subtext Paragraph (Hero Section)',
    {
      Copy: folder(
        {
          text: { value: initial.text, rows: 3, label: 'Body copy' },
          brandLabel: { value: initial.brandLabel, label: 'Brand name (bold pulse)' },
        },
        { collapsed: true },
      ),
      Layout: folder(
        {
          posX: { value: initial.posX, min: 0, max: 50, step: 0.5, label: 'Left %' },
          posY: { value: initial.posY, min: 20, max: 90, step: 0.5, label: 'Top %' },
          maxWidth: { value: initial.maxWidth, min: 280, max: 720, step: 10 },
        },
        { collapsed: true },
      ),
      Typography: folder(
        {
          fontSize: { value: initial.fontSize, min: 13, max: 24, step: 1 },
          fontWeight: { value: initial.fontWeight, min: 300, max: 600, step: 100 },
          color: { value: initial.color },
          brandWeight: { value: initial.brandWeight, min: 500, max: 900, step: 100 },
          brandColor: { value: initial.brandColor },
          lineHeight: { value: initial.lineHeight, min: 1.2, max: 1.8, step: 0.05 },
          letterSpacing: { value: initial.letterSpacing, min: -0.02, max: 0.08, step: 0.005 },
        },
        { collapsed: true },
      ),
      Readability: folder(
        {
          backdropEnabled: { value: initial.backdropEnabled, label: 'Scrim behind text' },
          backdropColor: { value: initial.backdropColor },
          backdropOpacity: { value: initial.backdropOpacity, min: 0, max: 1, step: 0.02 },
          backdropBlur: { value: initial.backdropBlur, min: 0, max: 20, step: 1 },
          backdropPadding: { value: initial.backdropPadding, min: 0, max: 32, step: 2 },
          backdropRadius: { value: initial.backdropRadius, min: 0, max: 24, step: 1 },
        },
        { collapsed: true },
      ),
      Animation: folder(
        {
          animDelay: { value: initial.animDelay, min: 0, max: 4, step: 0.1, label: 'Delay (s)' },
          animDuration: { value: initial.animDuration, min: 0.3, max: 2, step: 0.05, label: 'Duration (s)' },
        },
        { collapsed: true },
      ),
      Actions: folder(
        {
          'Reset defaults': button(() => {
            localStorage.removeItem(SUBHEAD_TUNER_STORAGE_KEY)
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

  const settings = useMemo(() => toFlatSubheadTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(SUBHEAD_TUNER_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <SubheadTunerContext.Provider value={{ settings }}>
      {children}
    </SubheadTunerContext.Provider>
  )
}

export function SubheadTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <SubheadTunerContext.Provider value={{ settings: defaultSubheadTuner }}>
        {children}
      </SubheadTunerContext.Provider>
    )
  }

  return <SubheadTunerProviderInner store={store}>{children}</SubheadTunerProviderInner>
}

export function useSubheadTuner() {
  const ctx = useContext(SubheadTunerContext)
  if (!ctx) return { settings: defaultSubheadTuner }
  return ctx
}
