export const HOW_IT_WORKS_STORAGE_KEY = 'mr-v3-how-it-works-v14'

export const defaultHowItWorks = {
  enabled: true,
  title: 'How it works',
  canopySubtitle:
    'A streamlined, three-step engine built to turn traffic into qualified paying leads without agency bloat.',
  canopyHighlight: 'qualified paying leads',
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
  card1Tag: '1.',
  card1Title: 'Spot the Bleed & Map the Blueprint',
  card1Body:
    'We dig into your current ad spend, website conversion bottlenecks, and lead tracking to pinpoint exactly where money is leaking and where easy wins live.',
  card1Art: '/how/step-1-art.png?v=5',
  card1ArtScale: 1.15,
  card1ArtOpacity: 0.85,
  card1ArtX: 0,
  card1ArtY: 24,
  card2Tag: '2.',
  card2Title: 'High-Converting Sites & Smart Ads',
  card2Body:
    'We build the custom landing pages, set up the Meta and Google ad skeletons, and connect automated email and SMS lead alerts into your pipeline.',
  card2Art: '/how/step-2-art.png?v=5',
  card2ArtScale: 1.1,
  card2ArtOpacity: 0.8,
  card2ArtX: 10,
  card2ArtY: 16,
  card3Tag: '3.',
  card3Title: 'Ongoing Optimization & Revenue Growth',
  card3Body:
    'Weekly campaign tuning, continuous CRO improvements, and lead generation running on autopilot so you can focus strictly on closing clients.',
  card3Art: '/how/step-3-art.png?v=5',
  card3ArtScale: 1.12,
  card3ArtOpacity: 0.8,
  card3ArtX: 0,
  card3ArtY: 14,
}

export type HowItWorksTuner = typeof defaultHowItWorks

export function loadHowItWorks(): HowItWorksTuner {
  try {
    const raw = localStorage.getItem(HOW_IT_WORKS_STORAGE_KEY)
    if (!raw) return { ...defaultHowItWorks }
    const parsed = JSON.parse(raw) as Partial<HowItWorksTuner> & {
      cardBg?: string
      canopyBg?: string
    }
    // Drop old independent palette keys — canopy/cards follow Homepage Colors.
    const { cardBg: _cardBg, canopyBg: _canopyBg, ...rest } = parsed
    return {
      ...defaultHowItWorks,
      ...rest,
      card1Art: defaultHowItWorks.card1Art,
      card2Art: defaultHowItWorks.card2Art,
      card3Art: defaultHowItWorks.card3Art,
    }
  } catch {
    return { ...defaultHowItWorks }
  }
}
