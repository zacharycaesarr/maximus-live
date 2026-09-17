export const HERO_TEXT_TUNER_STORAGE_KEY = 'mr-v3-hero-text-tuner-v20'

export const defaultHeroPhrases = [
  'build my website',
  'manage my ads',
  'get me more leads',
  'create automation',
  'edit my video',
  'stop my budget bleed',
  'get me more followers',
  'fix my website',
  'redesign my brand',
  'set up my CRM',
  'build my sales funnel',
  'improve my SEO',
  'send my emails automatically',
  'grow my digital presence',
]

/** Default phrase → Apple-style emoji (editable in Leva). Format: phrase||emoji ||| … */
export const defaultPhraseBadges = [
  ['build my website', '💻'],
  ['manage my ads', '📣'],
  ['get me more leads', '🎯'],
  ['create automation', '⚡'],
  ['edit my video', '🎬'],
  ['stop my budget bleed', '🩹'],
  ['get me more followers', '📈'],
  ['fix my website', '🔧'],
  ['redesign my brand', '✨'],
  ['set up my CRM', '🗂️'],
  ['build my sales funnel', '🧲'],
  ['improve my SEO', '🔍'],
  ['send my emails automatically', '✉️'],
  ['grow my digital presence', '🌐'],
]
  .map(([p, e]) => `${p}||${e}`)
  .join('|||')

export const defaultHeroTextTuner = {
  stemText: 'I want Maximus to',
  phrases: defaultHeroPhrases.join('|'),
  fontSize: 72,
  maxWidth: 920,
  singleLine: false,
  stemWeight: 400,
  phraseWeight: 700,
  stemColor: '#1a1612',
  phraseColor: '#1a1612',
  glowColor: '#000000',
  glowStrength: 0.06,
  /** Extra space after "to" (em). Stem already includes a trailing space. */
  spaceAfterTo: 0.05,
  letterSpacing: -0.03,
  lineHeight: 0.95,
  typeSpeed: 45,
  cycleSeconds: 2.4,
  staggerDelay: 4,
  blurSpeed: 1,
  blurFps: 30,
  blurDurationFrames: 90,
  scrollPhrase: 'do it all',
  showCursor: true,
  pauseCycle: false,
  /** Reposition headline + subhead + CTAs as one block */
  copyOffsetX: 0,
  copyOffsetY: 0,
  /** Headline only: Tiempos default; body/nav stay Neue Haas */
  headlineFont: 'tiempos' as 'nhg' | 'tiempos',
  phraseHoverEnabled: true,
  phraseHoverScale: 1.035,
  phraseArrowSize: 26,
  /** Gap between phrase end and arrow (px) */
  phraseArrowGap: 2,
  /** After hover leave, advance to next phrase this fast (ms) */
  phraseHoverResumeMs: 280,
  phraseHref: '#get-started',
  /** Micro badge above stem — live-swaps with rotating phrase */
  badgeEnabled: true,
  badgeSize: 44,
  badgeRadius: 12,
  badgeBg: '#ffffff',
  badgeBorder: 'rgba(44,37,32,0.12)',
  badgeSlideMs: 320,
  badgeGapBelow: 14,
  /** phrase||emoji ||| phrase2||emoji2 */
  phraseBadges: defaultPhraseBadges,
}

export type HeroTextTuner = typeof defaultHeroTextTuner

export function parsePhrases(raw: string) {
  if (!raw || typeof raw !== 'string') return [...defaultHeroPhrases]
  return raw
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Map phrase (lowercase) → emoji */
export function parsePhraseBadges(raw: string): Record<string, string> {
  const map: Record<string, string> = {}
  if (!raw || typeof raw !== 'string') return map
  raw.split('|||').forEach((chunk) => {
    const [phrase, emoji] = chunk.split('||').map((s) => s.trim())
    if (phrase && emoji) map[phrase.toLowerCase()] = emoji
  })
  return map
}

export function emojiForPhrase(phrase: string, map: Record<string, string>, fallback = '✨') {
  const key = phrase.trim().toLowerCase()
  if (map[key]) return map[key]
  // soft match: first map key contained in phrase or vice versa
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return fallback
}

export function loadHeroTextTuner(): HeroTextTuner {
  try {
    const raw = localStorage.getItem(HERO_TEXT_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultHeroTextTuner }
    const parsed = JSON.parse(raw) as Partial<HeroTextTuner> & { siteFont?: string }
    // Migrate old site-wide font key → headline-only
    if (!parsed.headlineFont && parsed.siteFont) {
      parsed.headlineFont = parsed.siteFont === 'tiempos' ? 'tiempos' : 'nhg'
    }
    return { ...defaultHeroTextTuner, ...parsed }
  } catch {
    return { ...defaultHeroTextTuner }
  }
}

export function toFlatHeroTuner(tuner: Partial<HeroTextTuner>): HeroTextTuner {
  return { ...defaultHeroTextTuner, ...tuner }
}
