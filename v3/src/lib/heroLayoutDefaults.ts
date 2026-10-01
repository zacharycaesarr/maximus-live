export const HERO_LAYOUT_STORAGE_KEY = 'mr-v3-hero-layout-v23'

export const defaultHeroLayout = {
  heroAlign: 'left' as 'left' | 'center',
  bgVideoEnabled: true,
  heroVideoOverlay: 0.48,
  heroVideoOffsetYDesktop: 0,
  heroVideoOffsetYMobile: 0,
  eyebrow: 'Digital Growth · Web Development · Ad Management',
  showEyebrow: true,
  /** Scale of the eyebrow line (1 = 100%). Default ~15% smaller. */
  eyebrowScale: 0.85,
  subhead:
    'Maximus Reach helps ambitious businesses look sharper, grow larger, and Reach Further.',
  copyBreathMs: 720,
  subheadLagMs: 420,
  /** Whole copy block (eyebrow + headline + sub + CTAs) — locked from Zach's Leva */
  copyScale: 1.14,
  ctaScale: 1.12,
  copyOffsetX: 43,
  copyOffsetY: 145,
  scrollLabel: 'Scroll Down',
  showCtas: true,
  ctaGetStarted: 'Get Started',
  ctaPortal: 'Client Portal',
  handEnabled: true,
  handPreview: false,
  handLayer: 'below' as 'below' | 'above',
  handSide: 'left' as 'left' | 'right',
  handScale: 0.85,
  /** Locked from Zach's Hand Leva (server restart safe) */
  handOffsetX: 279,
  handOffsetY: 8,
  handSlidePx: 140,
  handRevealMs: 280,
  handLeaveDelayMs: 0,
  handFadeOutMs: 240,
  handFadeEarly: 0.42,
  handRetractHoldMs: 145,
  handSpeed: 1.55,
  /** Mouse tilt on the copy block */
  parallaxEnabled: true,
  parallaxStrength: 22,
  parallaxPerspective: 1100,
  parallaxMaxTilt: 14,
}

export type HeroLayoutTuner = typeof defaultHeroLayout

export function loadHeroLayout(): HeroLayoutTuner {
  try {
    const raw = localStorage.getItem(HERO_LAYOUT_STORAGE_KEY)
    if (!raw) return { ...defaultHeroLayout }
    return { ...defaultHeroLayout, ...JSON.parse(raw) }
  } catch {
    return { ...defaultHeroLayout }
  }
}

export function splitSubhead(raw: string) {
  return raw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
}
