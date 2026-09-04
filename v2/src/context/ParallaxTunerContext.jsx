import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import { ParallaxProvider } from './ParallaxContext'
import {
  defaultParallaxTuner,
  loadParallaxTuner,
  PARALLAX_TUNER_STORAGE_KEY,
  toFlatParallaxTuner,
} from '../lib/parallaxDefaults'

const ParallaxTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function ParallaxTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadParallaxTuner(), [])
  const settingsRef = useRef(defaultParallaxTuner)

  const tuner = useControls(
    '3D Parallax',
    {
      Global: folder({
        enabled: { value: initial.enabled, label: 'Parallax on' },
        intensity: { value: initial.intensity, min: 0, max: 2, step: 0.05 },
        maxRotate: { value: initial.maxRotate, min: 0, max: 20, step: 0.5, label: 'Max tilt (deg)' },
        maxTranslate: { value: initial.maxTranslate, min: 0, max: 60, step: 1, label: 'Max shift (px)' },
        smoothing: { value: initial.smoothing, min: 0.02, max: 0.3, step: 0.01 },
        gyroEnabled: { value: initial.gyroEnabled, label: 'Phone tilt (gyro)' },
        bgOverscan: { value: initial.bgOverscan, min: 100, max: 130, step: 1, label: 'BG scale %' },
      }, { collapsed: true }),
      Depths: folder({
        bgDepth: { value: initial.bgDepth, min: 0, max: 1.5, step: 0.05, label: 'Background' },
        textDepth: { value: initial.textDepth, min: 0, max: 1.5, step: 0.05, label: 'Hero text' },
        subheadDepth: { value: initial.subheadDepth, min: 0, max: 1.5, step: 0.05, label: 'Subhead' },
        logoDepth: { value: initial.logoDepth, min: 0, max: 1.5, step: 0.05, label: 'Logo' },
        navDepth: { value: initial.navDepth, min: 0, max: 1.5, step: 0.05, label: 'Nav pill' },
        cardsDepth: { value: initial.cardsDepth, min: 0, max: 1.5, step: 0.05, label: 'Service cards' },
      }, { collapsed: true }),
      Actions: folder({
        'Reset defaults': button(() => {
          localStorage.removeItem(PARALLAX_TUNER_STORAGE_KEY)
          window.location.reload()
        }),
      }, { collapsed: true }),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatParallaxTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(PARALLAX_TUNER_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <ParallaxTunerContext.Provider value={{ settings }}>
      <ParallaxProvider settings={settings}>{children}</ParallaxProvider>
    </ParallaxTunerContext.Provider>
  )
}

export function ParallaxTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <ParallaxTunerContext.Provider value={{ settings: defaultParallaxTuner }}>
        <ParallaxProvider settings={defaultParallaxTuner}>{children}</ParallaxProvider>
      </ParallaxTunerContext.Provider>
    )
  }

  return (
    <ParallaxTunerProviderInner store={store}>
      {children}
    </ParallaxTunerProviderInner>
  )
}

export function useParallaxTuner() {
  const ctx = useContext(ParallaxTunerContext)
  if (!ctx) return { settings: defaultParallaxTuner }
  return ctx
}
