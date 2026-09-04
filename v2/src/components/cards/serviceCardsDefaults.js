export const CARDS_TUNER_STORAGE_KEY = 'mr-service-cards-tuner-v1'

const defaultCard = (badge, title, description, cta, accent, imageUrl) => ({
  badgeText: badge,
  badgeColor: accent,
  title,
  description,
  ctaText: cta,
  ctaHref: '#',
  imageUrl,
  accent,
})

export const defaultServiceCards = [
  defaultCard(
    'Architecture',
    'Web Platforms',
    'Ultra-fast, custom web engines built to replace bloated templates and turn traffic into clients.',
    'Explore builds',
    '#a78a68',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=80',
  ),
  defaultCard(
    'Automated',
    'CRM and Pipelines',
    'Zero-leak lead capture, instant SMS dispatch, and workflows that connect your ads straight to your phone.',
    'See automation flow',
    '#4f433b',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=80',
  ),
  defaultCard(
    'Acquisition',
    'Ad Engines',
    'Targeted Meta and Google campaigns with strict filters to stop budget bleed and scale what works.',
    'Scale acquisition',
    '#83765b',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=480&q=80',
  ),
]

export const defaultCardsTuner = {
  rightPercent: 18,
  bottomPercent: 6.5,
  cardWidth: 268,
  cardMinHeight: 340,
  dealStartDelay: 2.8,
  dealStagger: 0.45,
  stackOffsetY: 16,
  stackOffsetX: -10,
  stackRotate: 2.2,
  spreadGap: 290,
  springStiffness: 360,
  springDamping: 20,
  spreadStiffness: 210,
  spreadDamping: 32,
  cardBg: '#1a1612',
  titleColor: '#f5f0e8',
  bodyColor: 'rgba(245,240,232,0.72)',
  ctaColor: '#f5f0e8',
  badgeBg: 'rgba(255,255,255,0.08)',
  badgeColor: 'rgba(245,240,232,0.85)',
  borderColor: 'rgba(255,255,255,0.1)',
  cardShadow: '0 16px 48px rgba(0,0,0,0.28)',
  cards: defaultServiceCards,
}

function cardFromTuner(tuner, index) {
  const prefix = `card${index + 1}`
  const fallback = defaultServiceCards[index]
  return {
    badgeText: tuner[`${prefix}Badge`] ?? fallback.badgeText,
    badgeColor: tuner[`${prefix}Accent`] ?? fallback.badgeColor,
    title: tuner[`${prefix}Title`] ?? fallback.title,
    description: tuner[`${prefix}Desc`] ?? fallback.description,
    ctaText: tuner[`${prefix}Cta`] ?? fallback.ctaText,
    ctaHref: tuner[`${prefix}Href`] ?? fallback.ctaHref,
    imageUrl: tuner[`${prefix}Image`] ?? fallback.imageUrl,
    accent: tuner[`${prefix}Accent`] ?? fallback.accent,
  }
}

export function loadCardsTuner() {
  try {
    const raw = localStorage.getItem(CARDS_TUNER_STORAGE_KEY)
    if (!raw) return { ...defaultCardsTuner }
    const parsed = JSON.parse(raw)
    return { ...defaultCardsTuner, ...parsed }
  } catch {
    return { ...defaultCardsTuner }
  }
}

export function toFlatCardsTuner(tuner) {
  return {
    rightPercent: tuner.rightPercent ?? defaultCardsTuner.rightPercent,
    bottomPercent: tuner.bottomPercent ?? defaultCardsTuner.bottomPercent,
    cardWidth: tuner.cardWidth ?? defaultCardsTuner.cardWidth,
    cardMinHeight: tuner.cardMinHeight ?? defaultCardsTuner.cardMinHeight,
    dealStartDelay: tuner.dealStartDelay ?? defaultCardsTuner.dealStartDelay,
    dealStagger: tuner.dealStagger ?? defaultCardsTuner.dealStagger,
    stackOffsetY: tuner.stackOffsetY ?? defaultCardsTuner.stackOffsetY,
    stackOffsetX: tuner.stackOffsetX ?? defaultCardsTuner.stackOffsetX,
    stackRotate: tuner.stackRotate ?? defaultCardsTuner.stackRotate,
    spreadGap: tuner.spreadGap ?? defaultCardsTuner.spreadGap,
    springStiffness: tuner.springStiffness ?? defaultCardsTuner.springStiffness,
    springDamping: tuner.springDamping ?? defaultCardsTuner.springDamping,
    spreadStiffness: tuner.spreadStiffness ?? defaultCardsTuner.spreadStiffness,
    spreadDamping: tuner.spreadDamping ?? defaultCardsTuner.spreadDamping,
    cardBg: tuner.cardBg ?? defaultCardsTuner.cardBg,
    titleColor: tuner.titleColor ?? defaultCardsTuner.titleColor,
    bodyColor: tuner.bodyColor ?? defaultCardsTuner.bodyColor,
    ctaColor: tuner.ctaColor ?? defaultCardsTuner.ctaColor,
    badgeBg: tuner.badgeBg ?? defaultCardsTuner.badgeBg,
    badgeColor: tuner.badgeColor ?? defaultCardsTuner.badgeColor,
    borderColor: tuner.borderColor ?? defaultCardsTuner.borderColor,
    cardShadow: tuner.cardShadow ?? defaultCardsTuner.cardShadow,
    cards: [0, 1, 2].map((i) => cardFromTuner(tuner, i)),
  }
}
