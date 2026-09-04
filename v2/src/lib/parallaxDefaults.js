export const PARALLAX_TUNER_STORAGE_KEY = 'mr-parallax-tuner-v1'

export const defaultParallaxTuner = {
  enabled: true,
  intensity: 1,
  maxRotate: 10,
  maxTranslate: 28,
  smoothing: 0.1,
  gyroEnabled: true,
  bgDepth: 0.35,
  textDepth: 0.75,
  subheadDepth: 0.78,
  logoDepth: 0.6,
  navDepth: 0.5,
  cardsDepth: 0.65,
  bgOverscan: 118,
}

function num(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function bool(value, fallback) {
  if (value === true || value === 1 || value === 'true') return true
  if (value === false || value === 0 || value === 'false') return false
  return fallback
}

function pick(tuner, keys, fallback) {
  for (const key of keys) {
    if (tuner[key] !== undefined && tuner[key] !== null) return tuner[key]
  }
  return fallback
}

/** Leva may return flat keys or folder-prefixed keys depending on store setup */
export function toFlatParallaxTuner(tuner) {
  return {
    enabled: bool(
      pick(tuner, ['enabled', 'Global.enabled', 'Hero · Parallax.enabled'], defaultParallaxTuner.enabled),
      defaultParallaxTuner.enabled,
    ),
    intensity: num(
      pick(tuner, ['intensity', 'Global.intensity'], defaultParallaxTuner.intensity),
      defaultParallaxTuner.intensity,
    ),
    maxRotate: num(
      pick(tuner, ['maxRotate', 'Global.maxRotate'], defaultParallaxTuner.maxRotate),
      defaultParallaxTuner.maxRotate,
    ),
    maxTranslate: num(
      pick(tuner, ['maxTranslate', 'Global.maxTranslate'], defaultParallaxTuner.maxTranslate),
      defaultParallaxTuner.maxTranslate,
    ),
    smoothing: num(
      pick(tuner, ['smoothing', 'Global.smoothing'], defaultParallaxTuner.smoothing),
      defaultParallaxTuner.smoothing,
    ),
    gyroEnabled: bool(
      pick(tuner, ['gyroEnabled', 'Global.gyroEnabled'], defaultParallaxTuner.gyroEnabled),
      defaultParallaxTuner.gyroEnabled,
    ),
    bgDepth: num(
      pick(tuner, ['bgDepth', 'Depths.bgDepth'], defaultParallaxTuner.bgDepth),
      defaultParallaxTuner.bgDepth,
    ),
    textDepth: num(
      pick(tuner, ['textDepth', 'Depths.textDepth'], defaultParallaxTuner.textDepth),
      defaultParallaxTuner.textDepth,
    ),
    logoDepth: num(
      pick(tuner, ['logoDepth', 'Depths.logoDepth'], defaultParallaxTuner.logoDepth),
      defaultParallaxTuner.logoDepth,
    ),
    navDepth: num(
      pick(tuner, ['navDepth', 'Depths.navDepth'], defaultParallaxTuner.navDepth),
      defaultParallaxTuner.navDepth,
    ),
    cardsDepth: num(
      pick(tuner, ['cardsDepth', 'Depths.cardsDepth'], defaultParallaxTuner.cardsDepth),
      defaultParallaxTuner.cardsDepth,
    ),
    subheadDepth: num(
      pick(tuner, ['subheadDepth', 'Depths.subheadDepth'], defaultParallaxTuner.subheadDepth),
      defaultParallaxTuner.subheadDepth,
    ),
    bgOverscan: num(
      pick(tuner, ['bgOverscan', 'Global.bgOverscan'], defaultParallaxTuner.bgOverscan),
      defaultParallaxTuner.bgOverscan,
    ),
  }
}

export function loadParallaxTuner() {
  try {
    const raw = localStorage.getItem(PARALLAX_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultParallaxTuner }
    return toFlatParallaxTuner({ ...defaultParallaxTuner, ...JSON.parse(raw) })
  } catch {
    return { ...defaultParallaxTuner }
  }
}
