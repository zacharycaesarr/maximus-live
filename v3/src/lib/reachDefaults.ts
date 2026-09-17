export const REACH_STORAGE_KEY = 'mr-v3-reach-wordmark-v5'

export const defaultReachTuner = {
  enabled: true,
  letterSpacingEm: 0.04,
  R: 1.2,
  E: 1.35,
  A: 1.5,
  C: 1.65,
  H: 1.85,
  fontSize: 17,
  color: '#ffffff',
  /** nhg = Neue Haas (default); druk = Druk Condensed trial */
  fontFamily: 'nhg' as 'nhg' | 'druk',
  showMaximus: true,
  maximusText: 'Maximus',
  maximusSize: 8,
  maximusWeight: 500,
  maximusTracking: 0.14,
  maximusOpacity: 0.9,
  stackGap: 0,
  stretchMaximus: false,
  Ma: 1,
  Ax: 1,
  Xx: 1,
  Ii: 1,
  Mm: 1,
  Uu: 1,
  Ss: 1,
}

export type ReachTuner = typeof defaultReachTuner

export function loadReachTuner(): ReachTuner {
  try {
    const raw = localStorage.getItem(REACH_STORAGE_KEY)
    if (!raw) return { ...defaultReachTuner }
    return { ...defaultReachTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultReachTuner }
  }
}
