export const NAV_TUNER_STORAGE_KEY = 'mr-nav-tuner-v2'

export const defaultNavTuner = {
  top: 0,
  blur: 0,
  glassOpacity: 0,
  borderOpacity: 0.1,
  notchBg: '#0d0f14',
  logoVariant: 'icon',
  logoSize: 28,
  logoTop: 28,
  logoLeft: 28,
  showStandaloneLogo: true,
  linkGap: 4,
  fontSize: 12,
  textColor: '#f5f0e8',
}

export function loadNavTuner() {
  try {
    const raw =
      localStorage.getItem(NAV_TUNER_STORAGE_KEY) ||
      localStorage.getItem('mr-nav-tuner-v1')
    if (!raw) return { ...defaultNavTuner }
    return { ...defaultNavTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultNavTuner }
  }
}

export function toFlatNavTuner(tuner) {
  const src = tuner && typeof tuner === 'object' ? tuner : {}
  const pick = (key, folder) => {
    if (src[key] !== undefined && typeof src[key] !== 'object') return src[key]
    if (folder && src[folder] && src[folder][key] !== undefined) return src[folder][key]
    return defaultNavTuner[key]
  }
  return {
    top: pick('top', 'Notch'),
    blur: pick('blur', 'Notch'),
    glassOpacity: pick('glassOpacity', 'Notch'),
    borderOpacity: pick('borderOpacity', 'Notch'),
    notchBg: pick('notchBg', 'Notch'),
    logoVariant: pick('logoVariant', 'Logo'),
    logoSize: pick('logoSize', 'Logo'),
    logoTop: pick('logoTop', 'Logo'),
    logoLeft: pick('logoLeft', 'Logo'),
    showStandaloneLogo: pick('showStandaloneLogo', 'Logo'),
    linkGap: pick('linkGap', 'Notch'),
    fontSize: pick('fontSize', 'Notch'),
    textColor: pick('textColor', 'Notch'),
  }
}
