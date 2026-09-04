export const SHADER_TUNER_STORAGE_KEY = 'mr-shader-tuner-v1'

/** Locked in from Zachary's tuner session (2026-08-31) */
export const defaultShaderTuner = {
  color1: '#ebe1ca',
  color2: '#a78a68',
  color3: '#4f433b',
  color4: '#83765b',
  timeScale: 1.54,
  drift: 0.11,
  scale: 2.16,
  rotate: 5.65,
  offsetX: 0.11,
  offsetY: 0.25,
  seed: 2576,
  grain: 0.18,
  vignette: 0.12,
  blur: 0.01,
  contrast: 1.23,
  intensity: 0.54,
  warp: 0.14,
  detail: 1.53,
  brightness: 0.01,
  saturation: 1.02,
  cursorEnabled: true,
  cursorEffect: 4,
  cursorStrength: 0.23,
  cursorRadius: 0.36,
}

export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return [0, 0, 0]
  const n = hex.replace('#', '')
  if (n.length < 6) return [0, 0, 0]
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ]
}

export function loadShaderTuner() {
  try {
    const raw = localStorage.getItem(SHADER_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultShaderTuner }
    const parsed = JSON.parse(raw)
    const merged = { ...defaultShaderTuner, ...parsed }
    ;['color1', 'color2', 'color3', 'color4'].forEach((key) => {
      if (typeof merged[key] !== 'string' || !merged[key].startsWith('#')) {
        merged[key] = defaultShaderTuner[key]
      }
    })
    return merged
  } catch {
    return { ...defaultShaderTuner }
  }
}

export function shaderTunerToExportPayload(flat) {
  return {
    colors: {
      deepBackground: flat.color1,
      teal: flat.color2,
      mint: flat.color3,
      cream: flat.color4,
    },
    motion: {
      speed: flat.timeScale,
      drift: flat.drift,
      scale: flat.scale,
      rotate: flat.rotate,
      offsetX: flat.offsetX,
      offsetY: flat.offsetY,
      seed: flat.seed,
    },
    look: {
      filmGrain: flat.grain,
      vignette: flat.vignette,
      blur: flat.blur,
      contrast: flat.contrast,
      orbGlow: flat.intensity,
      warp: flat.warp,
      detail: flat.detail,
      brightness: flat.brightness,
      saturation: flat.saturation,
    },
    cursor: {
      reactToCursor: flat.cursorEnabled,
      pushRadius: flat.cursorEffect,
      cursorParam1: flat.cursorStrength,
      cursorParam2: flat.cursorRadius,
    },
  }
}

export function tunerToUniforms(tuner) {
  const safe = { ...defaultShaderTuner, ...tuner }
  const c1 = hexToRgb(safe.color1)
  const c2 = hexToRgb(safe.color2)
  const c3 = hexToRgb(safe.color3)
  const c4 = hexToRgb(safe.color4)

  return {
    colors: [c1, c2, c3, c4, c4, c4, c4, c4],
    colorCount: 4,
    scale: safe.scale,
    intensity: safe.intensity,
    paramA: 0.47,
    warp: safe.warp,
    detail: safe.detail,
    contrast: safe.contrast,
    brightness: safe.brightness,
    saturation: safe.saturation,
    hue: 0,
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
    oklab: 0,
    timeScale: safe.timeScale,
  }
}
