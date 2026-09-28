/** Background controls are deliberately independent of Homepage Colors. */
export const PAGE_SCROLL_BG_STORAGE_KEY = 'mr-v3-homepage-background-final-v2'

export const defaultPageScrollBg = {
  starsOpacity: 0.86,
  starsFadeEnd: 92,
  lightTransitionStart: -8,
  lightTransitionEnd: 10,
  speckleOpacity: 3,
  speckleDensity: 55,
  creamLightStrength: 8,
  grainOpacity: 1,
  darkReturnStart: -12,
  darkReturnEnd: 5,
  waveSpeed: 1,
  waveStrength: 55,
  waveAcidAmount: 7,
}

export type PageScrollBgTuner = typeof defaultPageScrollBg

export function loadPageScrollBg(): PageScrollBgTuner {
  try {
    const raw = localStorage.getItem(PAGE_SCROLL_BG_STORAGE_KEY)
    if (!raw) return { ...defaultPageScrollBg }
    const saved = JSON.parse(raw) as Record<string, unknown>
    const settings = { ...defaultPageScrollBg }
    for (const key of Object.keys(settings) as (keyof PageScrollBgTuner)[]) {
      const value = saved[key]
      if (typeof value === 'number' && Number.isFinite(value)) settings[key] = value
    }
    // Earlier in-progress defaults were saved by Leva before the shortened transitions.
    if (settings.lightTransitionEnd === 34) settings.lightTransitionEnd = defaultPageScrollBg.lightTransitionEnd
    if (settings.darkReturnStart === -35 || settings.darkReturnStart === -18) {
      settings.darkReturnStart = defaultPageScrollBg.darkReturnStart
    }
    return settings
  } catch {
    return { ...defaultPageScrollBg }
  }
}
