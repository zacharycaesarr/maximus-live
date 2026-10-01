export const LENIS_STORAGE_KEY = 'mr-v3-lenis-v1'

export const defaultLenisTuner = {
  enabled: true,
  duration: 1.2,
  lerp: 0.08,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
}

export type LenisTuner = typeof defaultLenisTuner

export function loadLenisTuner(): LenisTuner {
  try {
    const raw = localStorage.getItem(LENIS_STORAGE_KEY)
    if (!raw) return { ...defaultLenisTuner }
    return { ...defaultLenisTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultLenisTuner }
  }
}
