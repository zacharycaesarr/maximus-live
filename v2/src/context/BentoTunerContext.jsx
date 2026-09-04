import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  BENTO_TUNER_STORAGE_KEY,
  defaultBentoTuner,
  loadBentoTuner,
  toFlatBentoTuner,
} from '../lib/bentoDefaults'
import { makeRememberActions } from '../lib/levaRemember'

const BentoTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function BentoTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadBentoTuner(), [])
  const settingsRef = useRef(defaultBentoTuner)

  const remember = makeRememberActions({
    storageKey: BENTO_TUNER_STORAGE_KEY,
    getFlat: () => settingsRef.current,
    label: 'bento',
  })

  const tuner = useControls(
    'Bento boxes (4)',
    {
      Layout: folder(
        {
          overallScale: {
            value: initial.overallScale,
            min: 0.7,
            max: 1.35,
            step: 0.01,
            label: 'Overall size (keeps proportions)',
          },
          maxWidth: { value: initial.maxWidth, min: 420, max: 720, step: 4, label: 'Base width' },
          gap: { value: initial.gap, min: 12, max: 40, step: 2, label: 'Gap' },
          cardHeight: { value: initial.cardHeight, min: 240, max: 380, step: 4, label: 'Card height' },
          radius: { value: initial.radius, min: 12, max: 36, step: 1 },
          padding: { value: initial.padding, min: 16, max: 40, step: 1 },
          webFlex: { value: initial.webFlex, min: 0.7, max: 2, step: 0.05, label: 'Web rest flex' },
          adsFlex: { value: initial.adsFlex, min: 0.7, max: 2, step: 0.05, label: 'Ads rest flex' },
          autoFlex: { value: initial.autoFlex, min: 0.7, max: 2, step: 0.05, label: 'Auto rest flex' },
          creativeFlex: { value: initial.creativeFlex, min: 0.7, max: 2, step: 0.05, label: 'Creative rest flex' },
          hoverFlex: { value: initial.hoverFlex, min: 1.2, max: 2.2, step: 0.05, label: 'Active flex' },
        },
        { collapsed: true },
      ),
      Motion: folder(
        {
          springMs: { value: initial.springMs, min: 180, max: 700, step: 10, label: 'Elastic speed (ms)' },
        },
        { collapsed: true },
      ),
      Style: folder(
        {
          cardBg: { value: initial.cardBg, label: 'Card bg' },
          borderColor: { value: initial.borderColor, label: 'Border' },
          glowColor: { value: initial.glowColor, label: 'Hover glow' },
          washColor: { value: initial.washColor, label: 'Card wash' },
          titleColor: { value: initial.titleColor },
          bodyColor: { value: initial.bodyColor },
        },
        { collapsed: true },
      ),
      Copy: folder(
        {
          webTitle: { value: initial.webTitle, label: 'Web title' },
          webBody: { value: initial.webBody, label: 'Web body', rows: 2 },
          adsTitle: { value: initial.adsTitle, label: 'Ads title' },
          adsBody: { value: initial.adsBody, label: 'Ads body', rows: 2 },
          autoTitle: { value: initial.autoTitle, label: 'Auto title' },
          autoBody: { value: initial.autoBody, label: 'Auto body', rows: 2 },
          creativeTitle: { value: initial.creativeTitle, label: 'Creative title' },
          creativeBody: { value: initial.creativeBody, label: 'Creative body', rows: 2 },
        },
        { collapsed: true },
      ),
      Actions: folder(
        {
          'Remember bento': button(remember['Remember bento']),
          'Revert to remembered': button(remember['Revert to remembered']),
          'Reset defaults': button(() => {
            localStorage.removeItem(BENTO_TUNER_STORAGE_KEY)
            localStorage.removeItem('mr-bento-tuner-v1')
            window.location.reload()
          }),
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatBentoTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(BENTO_TUNER_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <BentoTunerContext.Provider value={{ settings }}>
      {children}
    </BentoTunerContext.Provider>
  )
}

export function BentoTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <BentoTunerContext.Provider value={{ settings: defaultBentoTuner }}>
        {children}
      </BentoTunerContext.Provider>
    )
  }
  return <BentoTunerProviderInner store={store}>{children}</BentoTunerProviderInner>
}

export function useBentoTuner() {
  const ctx = useContext(BentoTunerContext)
  if (!ctx) return { settings: defaultBentoTuner }
  return ctx
}
