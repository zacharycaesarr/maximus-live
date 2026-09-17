export const INTRO_STORAGE_KEY = 'mr-v3-intro-tuner-v2'

export const defaultIntroTuner = {
  enabled: true,
  preview: false,
  word: 'Maximus',
  bg: '#fafafa',
  color: '#1a1612',
  fontFamily: 'tiempos' as 'nhg' | 'tiempos' | 'druk',
  fontWeight: 500,
  letterSpacing: -0.03,
  startSize: 72,
  holdMs: 500,
  dockMs: 900,
  easeX1: 0.16,
  easeY1: 1,
  easeX2: 0.3,
  easeY2: 1,
  fadeInMs: 700,
  fadeInStaggerMs: 80,
}

export type IntroTuner = typeof defaultIntroTuner

export function loadIntroTuner(): IntroTuner {
  try {
    const raw = localStorage.getItem(INTRO_STORAGE_KEY)
    if (!raw) return { ...defaultIntroTuner }
    // preview must never load sticky — it leaves a full-screen click blocker
    return { ...defaultIntroTuner, ...JSON.parse(raw), preview: false }
  } catch {
    return { ...defaultIntroTuner }
  }
}
