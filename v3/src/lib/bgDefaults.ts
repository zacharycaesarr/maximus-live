export const BG_STORAGE_KEY = 'mr-v3-bg-tuner-v7'

/**
 * Near-white MeshGradient remap of 21st @reuno-ui/hero paper shaders.
 * Soft stone / warm gray waves (no purple, no cyan).
 */
export const defaultBgTuner = {
  color0: '#fafafa',
  color1: '#f0eeea',
  color2: '#d6d2ca',
  color3: '#9a948a',
  color4: '#5c574f',
  speed: 0.28,
  wireOpacity: 0.35,
  vignetteStrength: 0.85,
  /** Legacy grid overlays kept off for this trial */
  showNoise: false,
  showGrid: false,
  showDiagonal: false,
  noiseOpacity: 0.03,
  gridOpacity: 0,
  diagonalOpacity: 0,
  gridSize: 60,
  diagonalSize: 40,
  stop0: '#fafafa',
  stop1: '#f5f5f3',
  stop2: '#efefec',
  stop3: '#e8e6e1',
  stop4: '#dfddd6',
}

export type BgTuner = typeof defaultBgTuner

export function loadBgTuner(): BgTuner {
  try {
    const raw = localStorage.getItem(BG_STORAGE_KEY)
    if (!raw) return { ...defaultBgTuner }
    return { ...defaultBgTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultBgTuner }
  }
}
