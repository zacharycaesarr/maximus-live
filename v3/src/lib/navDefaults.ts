export const NAV_STORAGE_KEY = 'mr-v3-nav-tuner-v6'

export const defaultNavTuner = {
  barHeight: 64,
  barColor: '#0a0a0a',
  linkColor: '#2C2520',
  link1: 'Client Portal',
  link2: 'How it works',
  link3: 'FAQ',
  ctaLabel: 'Get started',
  ctaBg: '#c4a574',
  ctaText: '#0a0a0a',
  showCtaArrow: true,
  showLogo: true,
  logoSize: 22,
  logoOffsetX: 0,
  logoOffsetY: 0,
  logoGap: 8,
  /** flat = full-bleed; notch = V2 curved; glass = see-through → pill menu on scroll */
  barShape: 'glass' as 'flat' | 'notch' | 'glass',
  notchRadius: 18,
  /** Scroll Y (px) where glass nav morphs into the floating pill menu */
  scrollSolidAt: 48,
  glassMenuBg: '#ffffff',
  glassMenuOpacity: 0.92,
}

export type NavTuner = typeof defaultNavTuner

export function loadNavTuner(): NavTuner {
  try {
    const raw = localStorage.getItem(NAV_STORAGE_KEY)
    if (!raw) return { ...defaultNavTuner }
    return { ...defaultNavTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultNavTuner }
  }
}
