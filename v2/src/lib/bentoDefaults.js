export const BENTO_TUNER_STORAGE_KEY = 'mr-bento-tuner-v2'

export const defaultBentoTuner = {
  overallScale: 1,
  maxWidth: 560,
  gap: 24,
  cardHeight: 300,
  radius: 24,
  padding: 24,
  cardBg: '#0f1117',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  glowColor: 'rgba(240, 210, 168, 0.32)',
  washColor: 'rgba(240, 210, 168, 0.16)',
  titleColor: '#f7f2ea',
  bodyColor: 'rgba(245, 240, 232, 0.68)',
  webFlex: 1.4,
  adsFlex: 1,
  autoFlex: 1,
  creativeFlex: 1.4,
  hoverFlex: 1.75,
  springMs: 420,
  webTitle: 'Web Development',
  webBody: 'Sites that look sharp, load fast, and turn visitors into leads.',
  adsTitle: 'Lead & Ad Management',
  adsBody: 'Meta and Google campaigns tuned to what actually converts.',
  autoTitle: 'Automation & Systems',
  autoBody: 'CRM flows, follow ups, and a stack that runs without you babysitting it.',
  creativeTitle: 'Creative Studio',
  creativeBody: 'Video, graphics, and brand assets that match the rest of your digital presence.',
}

export function loadBentoTuner() {
  try {
    const raw =
      localStorage.getItem(BENTO_TUNER_STORAGE_KEY) ||
      localStorage.getItem('mr-bento-tuner-v1')
    if (!raw) return { ...defaultBentoTuner }
    return toFlatBentoTuner({ ...defaultBentoTuner, ...JSON.parse(raw) })
  } catch {
    return { ...defaultBentoTuner }
  }
}

export function toFlatBentoTuner(tuner) {
  const src = tuner && typeof tuner === 'object' ? tuner : {}
  const pick = (key, folder) => {
    if (src[key] !== undefined && typeof src[key] !== 'object') return src[key]
    if (folder && src[folder] && src[folder][key] !== undefined) return src[folder][key]
    return defaultBentoTuner[key]
  }
  return {
    overallScale: pick('overallScale', 'Layout'),
    maxWidth: pick('maxWidth', 'Layout'),
    gap: pick('gap', 'Layout'),
    cardHeight: pick('cardHeight', 'Layout'),
    radius: pick('radius', 'Layout'),
    padding: pick('padding', 'Layout'),
    webFlex: pick('webFlex', 'Layout'),
    adsFlex: pick('adsFlex', 'Layout'),
    autoFlex: pick('autoFlex', 'Layout'),
    creativeFlex: pick('creativeFlex', 'Layout'),
    hoverFlex: pick('hoverFlex', 'Layout'),
    springMs: pick('springMs', 'Motion') ?? pick('springStiffness', 'Motion') ?? defaultBentoTuner.springMs,
    cardBg: pick('cardBg', 'Style'),
    borderColor: pick('borderColor', 'Style'),
    glowColor: pick('glowColor', 'Style'),
    washColor: pick('washColor', 'Style'),
    titleColor: pick('titleColor', 'Style'),
    bodyColor: pick('bodyColor', 'Style'),
    webTitle: pick('webTitle', 'Copy'),
    webBody: pick('webBody', 'Copy'),
    adsTitle: pick('adsTitle', 'Copy'),
    adsBody: pick('adsBody', 'Copy'),
    autoTitle: pick('autoTitle', 'Copy'),
    autoBody: pick('autoBody', 'Copy'),
    creativeTitle: pick('creativeTitle', 'Copy'),
    creativeBody: pick('creativeBody', 'Copy'),
  }
}

/** Scaled layout numbers so overallScale keeps proportions uniform. */
export function bentoLayoutMetrics(settings) {
  const s = Math.max(0.55, Math.min(1.45, settings.overallScale ?? 1))
  return {
    scale: s,
    maxWidth: Math.round(settings.maxWidth * s),
    gap: Math.round(settings.gap * s),
    cardHeight: Math.round(settings.cardHeight * s),
    padding: Math.round(settings.padding * s),
    radius: Math.round(settings.radius * s),
  }
}
