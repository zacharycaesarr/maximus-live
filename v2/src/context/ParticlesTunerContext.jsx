import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultParticlesTuner,
  loadParticlesTuner,
  PARTICLES_TUNER_STORAGE_KEY,
  toFlatParticlesTuner,
} from '../components/background/particlesDefaults'

const ParticlesTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function ParticlesTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadParticlesTuner(), [])
  const settingsRef = useRef(defaultParticlesTuner)

  const tuner = useControls(
    'Aether Particles',
    {
      Global: folder(
        {
          enabled: { value: initial.enabled, label: 'Particles on' },
          count: { value: initial.count, min: 12, max: 60, step: 2 },
          color: { value: initial.color },
        },
        { collapsed: true },
      ),
      Look: folder(
        {
          dotOpacity: { value: initial.dotOpacity, min: 0.1, max: 0.9, step: 0.01 },
          linkOpacity: { value: initial.linkOpacity, min: 0.05, max: 0.6, step: 0.01 },
          linkDistance: { value: initial.linkDistance, min: 60, max: 200, step: 5 },
        },
        { collapsed: true },
      ),
      Interaction: folder(
        {
          mouseRadius: { value: initial.mouseRadius, min: 60, max: 280, step: 5 },
          mouseStrength: { value: initial.mouseStrength, min: 1, max: 10, step: 0.25 },
        },
        { collapsed: true },
      ),
      Actions: folder(
        {
          'Reset defaults': button(() => {
            localStorage.removeItem(PARTICLES_TUNER_STORAGE_KEY)
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

  const settings = useMemo(() => toFlatParticlesTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(PARTICLES_TUNER_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <ParticlesTunerContext.Provider value={{ settings }}>
      {children}
    </ParticlesTunerContext.Provider>
  )
}

export function ParticlesTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <ParticlesTunerContext.Provider value={{ settings: defaultParticlesTuner }}>
        {children}
      </ParticlesTunerContext.Provider>
    )
  }

  return <ParticlesTunerProviderInner store={store}>{children}</ParticlesTunerProviderInner>
}

export function useParticlesTuner() {
  const ctx = useContext(ParticlesTunerContext)
  if (!ctx) return { settings: defaultParticlesTuner }
  return ctx
}
