import { hexToRgb } from './shaderDefaults'

export const HOLD_WAVES_STORAGE_KEY = 'mr-hold-waves-tuner-v1'
export const EXPLORE_WAVES_STORAGE_KEY = 'mr-explore-waves-tuner-v1'
/** @deprecated old single key; migrated on load */
export const WAVES_TUNER_STORAGE_KEY = HOLD_WAVES_STORAGE_KEY

export const defaultHoldWavesTuner = {
  enabled: true,
  color1: '#1A1423',
  color2: '#B75D69',
  color3: '#EACDC2',
  color4: '#FFF5EB',
  timeScale: -0.67,
  scale: 1.32,
  intensity: 0.49,
  colorReach: 0.85,
  warp: 0.01,
  detail: 1.73,
  contrast: 1.08,
  brightness: 0.07,
  saturation: 1.15,
  hue: 0,
  vignette: 0.22,
  blur: 0.04,
  grain: 0.35,
  seed: 4984,
  rotate: 3.37,
  drift: 0.4,
  oklab: true,
  offsetX: -0.13,
  offsetY: 0.05,
  cursorEnabled: false,
  cursorEffect: 3,
  cursorStrength: 0.54,
  cursorRadius: 0.56,
  seamBlend: 18,
}

export const defaultExploreWavesTuner = {
  ...defaultHoldWavesTuner,
  colorReach: 0.95,
  intensity: 0.42,
  vignette: 0.28,
  grain: 0.32,
  offsetY: 0.02,
  seed: 5120,
}

function pick(tuner, key, folder, fallback) {
  if (tuner[key] !== undefined && tuner[key] !== null && typeof tuner[key] !== 'object') {
    return tuner[key]
  }
  const nested = folder && tuner[folder] && typeof tuner[folder] === 'object' ? tuner[folder][key] : undefined
  if (nested !== undefined && nested !== null && typeof nested !== 'object') return nested
  const dotted = tuner[`${folder}.${key}`]
  if (dotted !== undefined && dotted !== null && typeof dotted !== 'object') return dotted
  return fallback
}

function normalizeHex(value, fallback) {
  if (typeof value === 'string' && value.startsWith('#') && value.length >= 7) return value.slice(0, 7)
  if (value && typeof value === 'object') {
    const r = Math.round(value.r ?? value.red ?? 0)
    const g = Math.round(value.g ?? value.green ?? 0)
    const b = Math.round(value.b ?? value.blue ?? 0)
    if ([r, g, b].every((n) => Number.isFinite(n))) {
      return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
    }
  }
  return fallback
}

/** Flatten Leva folders + normalize colors so sliders actually drive the shader. */
export function toFlatWavesTuner(tuner, defaults = defaultHoldWavesTuner) {
  const src = tuner && typeof tuner === 'object' ? tuner : {}
  return {
    enabled: Boolean(pick(src, 'enabled', null, defaults.enabled)),
    color1: normalizeHex(pick(src, 'color1', 'Colors', defaults.color1), defaults.color1),
    color2: normalizeHex(pick(src, 'color2', 'Colors', defaults.color2), defaults.color2),
    color3: normalizeHex(pick(src, 'color3', 'Colors', defaults.color3), defaults.color3),
    color4: normalizeHex(pick(src, 'color4', 'Colors', defaults.color4), defaults.color4),
    timeScale: pick(src, 'timeScale', 'Shape', defaults.timeScale),
    scale: pick(src, 'scale', 'Shape', defaults.scale),
    intensity: pick(src, 'intensity', 'Shape', defaults.intensity),
    colorReach: pick(src, 'colorReach', 'Shape', defaults.colorReach),
    warp: pick(src, 'warp', 'Shape', defaults.warp),
    detail: pick(src, 'detail', 'Shape', defaults.detail),
    rotate: pick(src, 'rotate', 'Shape', defaults.rotate),
    drift: pick(src, 'drift', 'Shape', defaults.drift),
    offsetX: pick(src, 'offsetX', 'Shape', defaults.offsetX),
    offsetY: pick(src, 'offsetY', 'Shape', defaults.offsetY),
    seed: pick(src, 'seed', 'Shape', defaults.seed),
    contrast: pick(src, 'contrast', 'Look', defaults.contrast),
    brightness: pick(src, 'brightness', 'Look', defaults.brightness),
    saturation: pick(src, 'saturation', 'Look', defaults.saturation),
    hue: pick(src, 'hue', 'Look', defaults.hue),
    vignette: pick(src, 'vignette', 'Look', defaults.vignette),
    blur: pick(src, 'blur', 'Look', defaults.blur),
    grain: pick(src, 'grain', 'Look', defaults.grain),
    oklab: Boolean(pick(src, 'oklab', 'Look', defaults.oklab)),
    cursorEnabled: Boolean(pick(src, 'cursorEnabled', 'Cursor', defaults.cursorEnabled)),
    cursorEffect: pick(src, 'cursorEffect', 'Cursor', defaults.cursorEffect),
    cursorStrength: pick(src, 'cursorStrength', 'Cursor', defaults.cursorStrength),
    cursorRadius: pick(src, 'cursorRadius', 'Cursor', defaults.cursorRadius),
    seamBlend: pick(src, 'seamBlend', 'Seam', defaults.seamBlend ?? 18),
  }
}

export function loadWavesTuner(storageKey, defaults) {
  try {
    let raw = localStorage.getItem(storageKey)
    if (!raw && storageKey === HOLD_WAVES_STORAGE_KEY) {
      raw = localStorage.getItem('mr-waves-tuner-v2') || localStorage.getItem('mr-waves-tuner-v1')
    }
    if (!raw) return { ...defaults }
    const flat = toFlatWavesTuner(JSON.parse(raw), defaults)
    // Old 21st preset used hue ~2.27 (130deg) which turns warm hexes blue.
    // Keep hue editable, but migrate that preset once so color sliders read true.
    if (flat.hue > 1.5) flat.hue = 0
    if (flat.saturation > 1.6) flat.saturation = defaults.saturation
    return flat
  } catch {
    return { ...defaults }
  }
}

export function wavesTunerToUniforms(tuner, defaults = defaultHoldWavesTuner) {
  const safe = toFlatWavesTuner(tuner, defaults)
  const c1 = hexToRgb(safe.color1)
  const c2 = hexToRgb(safe.color2)
  const c3 = hexToRgb(safe.color3)
  const c4 = hexToRgb(safe.color4)
  return {
    colors: [c1, c2, c3, c4, c4, c4, c4, c4],
    colorCount: 4,
    scale: safe.scale,
    intensity: safe.intensity,
    paramA: safe.colorReach,
    warp: safe.warp,
    detail: safe.detail,
    contrast: safe.contrast,
    brightness: safe.brightness,
    saturation: safe.saturation,
    hue: safe.hue,
    vignette: safe.vignette,
    blur: safe.blur,
    grain: safe.grain,
    seed: safe.seed,
    rotate: safe.rotate,
    offsetX: safe.offsetX,
    offsetY: safe.offsetY,
    drift: safe.drift,
    cursorEnabled: safe.cursorEnabled,
    cursorEffect: safe.cursorEffect,
    cursorStrength: safe.cursorStrength,
    cursorRadius: safe.cursorRadius,
    oklab: safe.oklab ? 1 : 0,
    timeScale: safe.timeScale,
  }
}
