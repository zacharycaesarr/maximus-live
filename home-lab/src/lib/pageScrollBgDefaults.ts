/** Background controls are deliberately independent of Homepage Colors. */
export const PAGE_SCROLL_BG_STORAGE_KEY = 'mr-home-lab-background-v8'

export const defaultPageScrollBg = {
  servicesFadeLength: 26,
  servicesFadeCurve: 52,
  creamBase: '#F3F0E8',
  creamToneLight: '#FAF8F2',
  creamToneShade: '#E8ECE6',
  creamTonalStrength: 12,
  creamTextureOpacity: 6,
  creamTextureScale: 1,
  nodeOpacity: 4,
  nodeMotion: 0.5,
  nodeDensity: 2,
  nodeScale: 1,
  nodeLineColor: '#252820',
  nodeDotColor: '#11120E',
  darkReturnStart: 35,
  darkReturnLength: 65,
  ctaDarkening: 85,
  ctaBurstColor: '#FAF8F2',
  ctaBurstOpacity: 28,
  ctaBurstSize: 1,
  ctaNoiseOpacity: 8,
  ctaNoiseSpeed: 1,
  ctaNoiseScale: 1,
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
      if (typeof settings[key] === 'number' && typeof value === 'number' && Number.isFinite(value)) {
        (settings as Record<string, string | number>)[key] = value
      } else if (typeof settings[key] === 'string' && typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)) {
        (settings as Record<string, string | number>)[key] = value
      }
    }
    if (settings.creamTextureOpacity === 3.5) settings.creamTextureOpacity = defaultPageScrollBg.creamTextureOpacity
    if (settings.creamToneLight.toLowerCase() === '#f8f5ee') settings.creamToneLight = defaultPageScrollBg.creamToneLight
    if (settings.creamToneShade.toLowerCase() === '#ebe6dc') settings.creamToneShade = defaultPageScrollBg.creamToneShade
    return settings
  } catch {
    return { ...defaultPageScrollBg }
  }
}
