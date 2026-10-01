/** Background controls are deliberately independent of Homepage Colors. */
export const PAGE_SCROLL_BG_STORAGE_KEY = 'mr-v3-homepage-background-cohesive-v6'
const PREVIOUS_STORAGE_KEY = 'mr-v3-homepage-background-cohesive-v3'

export const defaultPageScrollBg = {
  servicesFadeLength: 26,
  servicesFadeCurve: 52,
  creamBase: '#F3F0E8',
  creamToneLight: '#F8F5EE',
  creamToneShade: '#EBE6DC',
  creamTonalStrength: 12,
  creamTextureOpacity: 1,
  creamTextureScale: 1,
  nodeOpacity: 2,
  nodeScale: 1,
  nodeLineColor: '#252820',
  nodeDotColor: '#11120E',
  darkReturnStart: 35,
  darkReturnLength: 65,
  ctaDarkening: 85,
  ctaBurstColor: '#F8F5EE',
  ctaBurstOpacity: 18,
  ctaBurstSize: 1,
  ctaNoiseOpacity: 5,
  ctaNoiseSpeed: 1,
  ctaNoiseScale: 1,
}

export type PageScrollBgTuner = typeof defaultPageScrollBg

export function loadPageScrollBg(): PageScrollBgTuner {
  try {
    const raw = localStorage.getItem(PAGE_SCROLL_BG_STORAGE_KEY) ?? localStorage.getItem(PREVIOUS_STORAGE_KEY)
    if (!raw) return { ...defaultPageScrollBg }
    const saved = JSON.parse(raw) as Record<string, unknown>
    const settings = { ...defaultPageScrollBg }
    for (const key of Object.keys(settings) as (keyof PageScrollBgTuner)[]) {
      const value = saved[key]
      if (typeof settings[key] === 'number' && typeof value === 'number' && Number.isFinite(value)) {
        (settings as Record<string, string | number>)[key] = value
      } else if (typeof settings[key] === 'string' && typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)) {
        (settings as Record<string, string | number>)[key] = value
      }
    }
    // The old default grain was noticeably heavy; preserve lower tuned values.
    if (!localStorage.getItem(PAGE_SCROLL_BG_STORAGE_KEY)) {
      settings.creamTextureOpacity = Math.min(settings.creamTextureOpacity, 1)
    }
    return settings
  } catch {
    return { ...defaultPageScrollBg }
  }
}
