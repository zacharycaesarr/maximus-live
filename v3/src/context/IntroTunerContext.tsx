import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import {
  clearIntroSeenThisSession,
  defaultIntroTuner,
  INTRO_STORAGE_KEY,
  loadIntroTuner,
  type IntroTuner,
} from '@/lib/introDefaults'

type IntroCtx = IntroTuner & {
  ready: boolean
  showChrome: boolean
  runId: number
  markDocked: () => void
  markReady: () => void
  replay: () => void
}

const IntroCtx = createContext<IntroCtx | null>(null)

export function IntroTunerProvider({ store, children }: { store: LevaStore; children: ReactNode }) {
  const initial = useMemo(() => loadIntroTuner(), [])
  const [ready, setReady] = useState(() => !initial.enabled)
  const [showChrome, setShowChrome] = useState(() => !initial.enabled)
  const [runId, setRunId] = useState(0)

  const values = useControls(
    {
      Preloader: folder(
        {
          enabled: { value: initial.enabled, label: 'cinematic intro' },
          mode: {
            value: initial.mode,
            options: { Aperture: 'aperture', 'Dock (archived)': 'dock' },
            label: 'intro mode',
          },
          preview: { value: initial.preview, label: 'preview / hold overlay' },
          apertureMs: {
            value: initial.apertureMs,
            min: 800,
            max: 2800,
            step: 50,
            label: 'aperture ms',
          },
          word: { value: initial.word, label: 'dock word (archived)' },
          bg: { value: initial.bg, label: 'cover bg' },
          color: { value: initial.color, label: 'mark color' },
          fontFamily: {
            value: initial.fontFamily,
            options: { 'Neue Haas': 'nhg', Tiempos: 'tiempos', Druk: 'druk' },
            label: 'font',
          },
          fontWeight: { value: initial.fontWeight, min: 100, max: 900, step: 100 },
          letterSpacing: { value: initial.letterSpacing, min: -0.1, max: 0.1, step: 0.005 },
          startSize: { value: initial.startSize, min: 28, max: 120, step: 1, label: 'start size px' },
          holdMs: { value: initial.holdMs, min: 100, max: 2000, step: 50, label: 'hold ms' },
          dockMs: { value: initial.dockMs, min: 300, max: 2000, step: 50, label: 'dock ms' },
          fadeInMs: { value: initial.fadeInMs, min: 200, max: 2400, step: 50, label: 'fade-in ms' },
          fadeInStaggerMs: {
            value: initial.fadeInStaggerMs,
            min: 0,
            max: 400,
            step: 10,
            label: 'fade stagger ms',
          },
          chromeDelayMs: {
            value: initial.chromeDelayMs,
            min: 0,
            max: 1600,
            step: 20,
            label: 'chrome delay after unlock',
          },
          easeX1: { value: initial.easeX1, min: 0, max: 1, step: 0.01 },
          easeY1: { value: initial.easeY1, min: 0, max: 2, step: 0.01 },
          easeX2: { value: initial.easeX2, min: 0, max: 1, step: 0.01 },
          easeY2: { value: initial.easeY2, min: 0, max: 2, step: 0.01 },
          'Replay intro': button(() => {
            clearIntroSeenThisSession()
            setReady(false)
            setShowChrome(false)
            setRunId((n) => n + 1)
          }),
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  const flat = { ...defaultIntroTuner, ...(values as Partial<IntroTuner>) } as IntroTuner

  useEffect(() => {
    try {
      // Never persist preview: it leaves a full-screen click blocker
      localStorage.setItem(INTRO_STORAGE_KEY, JSON.stringify({ ...flat, preview: false }))
    } catch {
      /* ignore */
    }
  }, [flat])

  useEffect(() => {
    if (!flat.enabled && !flat.preview) {
      setReady(true)
      setShowChrome(true)
    }
  }, [flat.enabled, flat.preview])

  useEffect(() => {
    if (flat.preview) {
      setReady(false)
      setShowChrome(false)
      setRunId((n) => n + 1)
      // Preview is for Leva only — auto-release so Comet/Chrome never stay blocked
      const release = window.setTimeout(() => {
        setShowChrome(true)
        setReady(true)
      }, 2200)
      return () => window.clearTimeout(release)
    }
    return undefined
  }, [flat.preview])

  // Failsafe so the site is always interactive (every browser)
  useEffect(() => {
    const t = window.setTimeout(() => {
      setShowChrome(true)
      setReady(true)
    }, 3200)
    return () => window.clearTimeout(t)
  }, [runId, flat.enabled])

  const markDocked = useCallback(() => setShowChrome(true), [])
  const markReady = useCallback(() => setReady(true), [])
  const replay = useCallback(() => {
    clearIntroSeenThisSession()
    setReady(false)
    setShowChrome(false)
    setRunId((n) => n + 1)
  }, [])

  const ctx = useMemo(
    () => ({ ...flat, ready, showChrome, runId, markDocked, markReady, replay }),
    [flat, ready, showChrome, runId, markDocked, markReady, replay],
  )

  return <IntroCtx.Provider value={ctx}>{children}</IntroCtx.Provider>
}

export function useIntroTuner() {
  const ctx = useContext(IntroCtx)
  if (!ctx) {
    return {
      ...defaultIntroTuner,
      ready: true,
      showChrome: true,
      runId: 0,
      markDocked: () => undefined,
      markReady: () => undefined,
      replay: () => undefined,
    }
  }
  return ctx
}
