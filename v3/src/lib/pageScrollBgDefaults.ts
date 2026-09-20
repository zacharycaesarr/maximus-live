/**
 * Homepage scroll BG below hero. Top color must match hero fade end.
 * Grain = exact 21st Custom gradient SVG noise (opacity 0.365 @ 73 grain).
 */

export const PAGE_SCROLL_BG_STORAGE_KEY = 'mr-v3-page-scroll-bg-v4'

export const ARCHIVED_21ST_BLUE = {
  color0: '#000428',
  color0Name: 'Space',
  color1: '#004E92',
  color1Name: 'Ocean',
  angle: 254,
  grain: 73,
  vignette: 42,
  speed: 55,
  motionAmount: 61,
  motionReverse: true,
  backdrop: '#EAF4FC',
} as const

export const ARCHIVED_DUSK_SLUDGE = {
  color0: '#2C241E',
  color0Name: 'Dusk mocha',
  color1: '#0C0A09',
  color1Name: 'Deep espresso',
  angle: 178,
  grain: 78,
  vignette: 48,
  speed: 18,
  motionAmount: 22,
  motionReverse: true,
  backdrop: '#2C241E',
} as const

/**
 * Idea: sunset haze → warm mocha (bridges hero sky, then brand).
 * Not grey. Soft peach-cream at the seam from the clouds.
 */
export const defaultPageScrollBg = {
  enabled: true,
  /** Soft sunset paper — reads with orange sky haze */
  color0: '#F3E8DC',
  color0Name: 'Sunset paper',
  /** Warm mocha brown (not grey sludge) */
  color1: '#3B271C',
  color1Name: 'Warm mocha',
  angle: 182,
  /** 21st prompt grain */
  grain: 73,
  vignette: 32,
  speed: 14,
  motionAmount: 14,
  motionReverse: true,
  backdrop: '#F3E8DC',
  unlockAfterHero: 0.85,
  scrollDarkenMax: 0.12,
  /** How far page-sections pulls up under the hero fade (px) */
  seamOverlapPx: 120,
}

export type PageScrollBgTuner = typeof defaultPageScrollBg

export function loadPageScrollBg(): PageScrollBgTuner {
  try {
    const raw = localStorage.getItem(PAGE_SCROLL_BG_STORAGE_KEY)
    if (!raw) return { ...defaultPageScrollBg }
    return { ...defaultPageScrollBg, ...JSON.parse(raw) }
  } catch {
    return { ...defaultPageScrollBg }
  }
}

/** Must match color0 — used by hero soft fade end */
export const HERO_SOFT_BLEND_END = defaultPageScrollBg.color0

/** Exact 21st grain layer (opacity tuned to grain/100 * 0.5 ≈ 0.365 at 73) */
export function pageScrollGrainDataUrl(grain: number) {
  const op = Math.max(0.12, Math.min(0.55, (grain / 100) * 0.5))
  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${op}'/></svg>")`
}
