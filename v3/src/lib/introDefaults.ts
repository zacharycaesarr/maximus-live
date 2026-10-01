export const INTRO_STORAGE_KEY = 'mr-v3-intro-tuner-v5'
export const INTRO_SESSION_KEY = 'hasSeenIntro'

export const defaultIntroTuner = {
  /** aperture = Integrated Bio style (live). dock = archived white Maximus preloader */
  mode: 'aperture' as 'aperture' | 'dock',
  enabled: true,
  preview: false,
  word: 'Maximus',
  bg: '#F8F7F4',
  color: '#1a1612',
  fontFamily: 'tiempos' as 'nhg' | 'tiempos' | 'druk',
  fontWeight: 500,
  letterSpacing: -0.03,
  startSize: 72,
  /** Logo stays put before aperture expands — gives first load time to settle */
  holdMs: 500,
  dockMs: 900,
  easeX1: 0.16,
  easeY1: 1,
  easeX2: 0.3,
  easeY2: 1,
  /** Hero chrome fade duration after aperture unlocks */
  fadeInMs: 1280,
  fadeInStaggerMs: 160,
  /** Pause after unlock before left copy — room breathes first */
  chromeDelayMs: 380,
  /** Aperture duration (ms) */
  apertureMs: 1400,
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

export function hasSeenIntroThisSession(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeenThisSession() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function clearIntroSeenThisSession() {
  try {
    sessionStorage.removeItem(INTRO_SESSION_KEY)
  } catch {
    /* ignore */
  }
}
