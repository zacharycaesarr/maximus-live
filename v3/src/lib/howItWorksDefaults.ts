export const HOW_IT_WORKS_STORAGE_KEY = 'mr-v3-how-it-works-v5'

export const defaultHowItWorks = {
  enabled: true,
  title: 'How it works',
  canopySubtitle:
    'A streamlined, three-step engine built to turn traffic into qualified paying leads without agency bloat.',
  canopyHighlight: 'qualified paying leads',
  cardBg: '#eae6df',
  canopyBg: '#0e0d0c',
  idleScale: 0.88,
  /** Scrub feel — higher = snappier follow */
  scrubStiffness: 90,
  /** Elbow fillets — tune in Leva until the curve looks right */
  filletSize: 50,
  filletLeftX: -50,
  filletLeftY: 50,
  filletLeftRotate: -180,
  filletRightX: 48,
  filletRightY: 50,
  filletRightRotate: 180,
  card1Tag: '01',
  card1Title: 'Spot the Bleed & Map the Blueprint',
  card1Body:
    'We dig into your current ad spend, website conversion bottlenecks, and lead tracking to pinpoint exactly where money is leaking and where easy wins live.',
  card1Emoji: '🔍',
  card2Tag: '02',
  card2Title: 'High-Converting Sites & Smart Ads',
  card2Body:
    'We build the custom landing pages, set up the Meta and Google ad skeletons, and connect automated email and SMS lead alerts into your pipeline.',
  card2Emoji: '🚀',
  card3Tag: '03',
  card3Title: 'Ongoing Optimization & Revenue Growth',
  card3Body:
    'Weekly campaign tuning, continuous CRO improvements, and lead generation running on autopilot so you can focus strictly on closing clients.',
  card3Emoji: '📈',
}

export type HowItWorksTuner = typeof defaultHowItWorks

export function loadHowItWorks(): HowItWorksTuner {
  try {
    const raw = localStorage.getItem(HOW_IT_WORKS_STORAGE_KEY)
    if (!raw) return { ...defaultHowItWorks }
    return { ...defaultHowItWorks, ...JSON.parse(raw) }
  } catch {
    return { ...defaultHowItWorks }
  }
}
