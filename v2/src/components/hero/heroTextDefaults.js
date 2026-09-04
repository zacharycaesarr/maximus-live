export const HERO_TEXT_TUNER_STORAGE_KEY = 'mr-hero-text-tuner-v1'

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

/** Locked in from Zachary's tuner session (2026-08-31) */
export const defaultHeroTextTuner = {
  stemText: 'I want Maximus to',
  phrases: defaultHeroPhrases.join('|'),
  posX: 3,
  posY: 45,
  maxWidth: 900,
  fontSize: 24,
  stemWeight: 300,
  phraseWeight: 600,
  stemColor: '#1a1612',
  phraseColor: '#1a1612',
  glowColor: '#000000',
  glowStrength: 0.04,
  letterSpacing: 0,
  lineHeight: 1.08,
  typeSpeed: 55,
  cycleSeconds: 2.2,
  staggerDelay: 4,
  blurSpeed: 1,
  blurFps: 30,
  blurDurationFrames: 90,
  scrollPhrase: 'do it all',
  showCursor: true,
  pauseCycle: false,
}

export function parsePhrases(raw) {
  if (!raw || typeof raw !== 'string') return [...defaultHeroPhrases]
  return raw
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)
}

export function loadHeroTextTuner() {
  try {
    const raw = localStorage.getItem(HERO_TEXT_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultHeroTextTuner }
    return { ...defaultHeroTextTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultHeroTextTuner }
  }
}

export function toFlatHeroTuner(tuner) {
  return {
    stemText: tuner.stemText ?? defaultHeroTextTuner.stemText,
    phrases: tuner.phrases ?? defaultHeroTextTuner.phrases,
    posX: tuner.posX ?? defaultHeroTextTuner.posX,
    posY: tuner.posY ?? defaultHeroTextTuner.posY,
    maxWidth: tuner.maxWidth ?? defaultHeroTextTuner.maxWidth,
    fontSize: tuner.fontSize ?? defaultHeroTextTuner.fontSize,
    stemWeight: tuner.stemWeight ?? defaultHeroTextTuner.stemWeight,
    phraseWeight: tuner.phraseWeight ?? defaultHeroTextTuner.phraseWeight,
    stemColor: tuner.stemColor ?? defaultHeroTextTuner.stemColor,
    phraseColor: tuner.phraseColor ?? defaultHeroTextTuner.phraseColor,
    glowColor: tuner.glowColor ?? defaultHeroTextTuner.glowColor,
    glowStrength: tuner.glowStrength ?? defaultHeroTextTuner.glowStrength,
    letterSpacing: tuner.letterSpacing ?? defaultHeroTextTuner.letterSpacing,
    lineHeight: tuner.lineHeight ?? defaultHeroTextTuner.lineHeight,
    typeSpeed: tuner.typeSpeed ?? defaultHeroTextTuner.typeSpeed,
    cycleSeconds: tuner.cycleSeconds ?? defaultHeroTextTuner.cycleSeconds,
    staggerDelay: tuner.staggerDelay ?? defaultHeroTextTuner.staggerDelay,
    blurSpeed: tuner.blurSpeed ?? defaultHeroTextTuner.blurSpeed,
    blurFps: tuner.blurFps ?? defaultHeroTextTuner.blurFps,
    blurDurationFrames: tuner.blurDurationFrames ?? defaultHeroTextTuner.blurDurationFrames,
    scrollPhrase: tuner.scrollPhrase ?? defaultHeroTextTuner.scrollPhrase,
    showCursor: tuner.showCursor ?? defaultHeroTextTuner.showCursor,
    pauseCycle: tuner.pauseCycle ?? defaultHeroTextTuner.pauseCycle,
  }
}

/** Friendly labels for copy-paste back to chat */
export function heroTunerToExportPayload(settings) {
  return {
    stem: settings.stemText,
    phrases: settings.phrases,
    leftPercent: settings.posX,
    topPercent: settings.posY,
    maxWidth: settings.maxWidth,
    fontSize: settings.fontSize,
    stemWeight: settings.stemWeight,
    phraseWeight: settings.phraseWeight,
    stemColor: settings.stemColor,
    phraseColor: settings.phraseColor,
    glowColor: settings.glowColor,
    glowStrength: settings.glowStrength,
    letterSpacing: settings.letterSpacing,
    lineHeight: settings.lineHeight,
    typeSpeed: settings.typeSpeed,
    cycleInterval: settings.cycleSeconds,
    staggerDelay: settings.staggerDelay,
    blurSpeed: settings.blurSpeed,
    blurFps: settings.blurFps,
    blurDurationFrames: settings.blurDurationFrames,
    showCursor: settings.showCursor,
    pauseOnHover: settings.pauseCycle,
    scrollPhrase: settings.scrollPhrase,
  }
}
