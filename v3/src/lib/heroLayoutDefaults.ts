export const HERO_LAYOUT_STORAGE_KEY = 'mr-v3-hero-layout-v18'

export const defaultHeroLayout = {
  /** Layout trial: left-aligned copy w/ room on the right for floating 3D objects */
  heroAlign: 'left' as 'left' | 'center',
  /** Video loop bg vs the old mesh-gradient bg (mesh stays wired, just off) */
  bgVideoEnabled: true,
  /** Dark wash over the video so left-aligned copy stays legible */
  heroVideoOverlay: 0.55,
  /** Shift the <video> only (px). + = down, − = up. Desktop default clears megaphone under fixed nav. */
  heroVideoOffsetYDesktop: 36,
  /** Mobile: slight nudge up so models sit a touch higher */
  heroVideoOffsetYMobile: -18,
  eyebrow: 'Digital Growth · Web Development · Ad Management',
  showEyebrow: true,
  /** Pipe-separated lines for stacked body copy */
  subhead:
    'Digital growth for businesses that are ready to look sharper and move faster.|Websites, ads, automation, and creative. One partner who can actually ship it.',
  scrollLabel: 'Scroll Down',
  columnSplit: 38,
  imageOnTopMobile: false,
  sideImageUrl: '',
  sideBg: '#efe4d4',
  placeholderPulse: false,
  /** Off for reuno-layout trial */
  showSidePlaceholder: false,
  copyMaxWidth: 900,
  sideRadius: 0,
  showCtas: true,
  ctaGetStarted: 'Get Started',
  ctaPortal: 'Client Portal',
  /** Hand Lottie — right side, flipped */
  handEnabled: true,
  /** Force-show hand for Leva tuning (no Get Started hover needed) */
  handPreview: false,
  handLayer: 'below' as 'below' | 'above',
  handSide: 'right' as 'left' | 'right',
  handScale: 0.85,
  handOffsetX: -18,
  handOffsetY: 8,
  /** How far the hand slides from the page edge (px) */
  handSlidePx: 140,
  handRevealMs: 280,
  /** Keep at 0 for near-immediate retract on hover-off */
  handLeaveDelayMs: 0,
  /** Slide/fade out duration (ms) — after retract peek */
  handFadeOutMs: 240,
  /** Start cleaning reverse early (0–1); higher = snappier leave */
  handFadeEarly: 0.42,
  /** ms of reverse visible before fade/slide starts */
  handRetractHoldMs: 145,
  handSpeed: 1.55,
  /** Hero mouse parallax / tilt — on; hover uses geometric hit-test */
  parallaxEnabled: true,
  parallaxStrength: 8,
  parallaxPerspective: 900,
  parallaxMaxTilt: 6,
  /** Surfer as background visual (right) */
  surferEnabled: true,
  surferOpacity: 0.85,
  surferScale: 1,
  /** Positive X nudges right from the 48% left anchor */
  surferOffsetX: 0,
  surferOffsetY: 0,
  surferWidth: 560,
  /** Watermark off */
  showWatermark: false,
  watermarkLine1: 'MAXIMUS',
  watermarkLine2: 'REACH',
  watermarkOpacity: 0.12,
  watermarkSize: 8,
  watermarkTracking: -0.04,
  watermarkColor: '#2C2520',
  watermarkRight: 2,
  watermarkBottom: 8,
  watermarkOffsetX: 0,
  watermarkOffsetY: 0,
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
