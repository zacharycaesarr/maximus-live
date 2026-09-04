import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder } from 'leva'
import {
  defaultHeroTextTuner,
  HERO_TEXT_TUNER_STORAGE_KEY,
  heroTunerToExportPayload,
  loadHeroTextTuner,
  toFlatHeroTuner,
} from '../components/hero/heroTextDefaults'

const HeroTextTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function HeroTextTunerProviderInner({ children, store }) {
  const initial = useMemo(() => loadHeroTextTuner(), [])
  const settingsRef = useRef(defaultHeroTextTuner)

  const tuner = useControls(
    'Main (I want Max To..) Text',
    {
      Copy: folder({
        stemText: { value: initial.stemText, label: 'Stem (typed first)' },
        phrases: {
          value: initial.phrases,
          label: 'Phrases (pipe separated)',
          rows: 3,
        },
      }),
      Position: folder({
        posX: { value: initial.posX, min: 0, max: 50, step: 0.5, label: 'Left %' },
        posY: { value: initial.posY, min: 10, max: 90, step: 0.5, label: 'Top %' },
      }),
      Typography: folder({
        fontSize: { value: initial.fontSize, min: 24, max: 96, step: 1 },
        stemWeight: { value: initial.stemWeight, min: 300, max: 700, step: 100 },
        phraseWeight: { value: initial.phraseWeight, min: 500, max: 900, step: 100 },
        stemColor: { value: initial.stemColor },
        phraseColor: { value: initial.phraseColor },
        glowColor: { value: initial.glowColor },
        glowStrength: { value: initial.glowStrength, min: 0, max: 1, step: 0.01 },
        letterSpacing: { value: initial.letterSpacing, min: -0.08, max: 0.1, step: 0.005 },
        lineHeight: { value: initial.lineHeight, min: 0.9, max: 1.5, step: 0.01 },
      }),
      Animation: folder({
        typeSpeed: { value: initial.typeSpeed, min: 20, max: 200, step: 5, label: 'Type ms/char' },
        cycleSeconds: { value: initial.cycleSeconds, min: 1, max: 6, step: 0.1, label: 'Cycle interval' },
        staggerDelay: { value: initial.staggerDelay, min: 1, max: 12, step: 1, label: 'Word stagger' },
        blurSpeed: { value: initial.blurSpeed, min: 0.25, max: 3, step: 0.05, label: 'Blur speed' },
        blurFps: { value: initial.blurFps, min: 24, max: 60, step: 1 },
        blurDurationFrames: {
          value: initial.blurDurationFrames,
          min: 30,
          max: 180,
          step: 1,
          label: 'Blur duration (frames)',
        },
        scrollPhrase: { value: initial.scrollPhrase, label: 'On scroll phrase' },
        showCursor: { value: initial.showCursor },
        pauseCycle: { value: initial.pauseCycle, label: 'Pause phrase cycle' },
      }),
      Actions: folder({
        'Reset defaults': button(() => {
          localStorage.removeItem(HERO_TEXT_TUNER_STORAGE_KEY)
          window.location.reload()
        }),
        'Copy JSON': button(() => {
          const payload = heroTunerToExportPayload(settingsRef.current)
          navigator.clipboard?.writeText(JSON.stringify(payload, null, 2))
        }),
      }),
    },
    { collapsed: true },
    { store },
  )

  const settings = useMemo(() => toFlatHeroTuner(tuner), [tuner])
  settingsRef.current = settings

  useEffect(() => {
    localStorage.setItem(HERO_TEXT_TUNER_STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <HeroTextTunerContext.Provider value={{ settings }}>
      {children}
    </HeroTextTunerContext.Provider>
  )
}

export function HeroTextTunerProvider({ children, store }) {
  if (!isDev || !store) {
    return (
      <HeroTextTunerContext.Provider value={{ settings: defaultHeroTextTuner }}>
        {children}
      </HeroTextTunerContext.Provider>
    )
  }

  return (
    <HeroTextTunerProviderInner store={store}>
      {children}
    </HeroTextTunerProviderInner>
  )
}

export function useHeroTextTuner() {
  const ctx = useContext(HeroTextTunerContext)
  if (!ctx) return { settings: defaultHeroTextTuner }
  return ctx
}
