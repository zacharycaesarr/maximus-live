/** Brand logos for proof stack pills — simpleicons CDN, slightly rounded in UI. */
export const TECH_LOGOS: Record<string, string> = {
  'Next.js': 'https://cdn.simpleicons.org/nextdotjs/111111',
  'Meta Ads': 'https://cdn.simpleicons.org/meta/0081FB',
  'Meta Ads Manager': 'https://cdn.simpleicons.org/meta/0081FB',
  Twilio: 'https://cdn.simpleicons.org/twilio/F22F46',
  'Google Ads': 'https://cdn.simpleicons.org/googleads/4285F4',
  Klaviyo: 'https://cdn.simpleicons.org/klaviyo/000000',
  // adobeaftereffects (not generic adobe) — purple AE mark
  'After Effects': 'https://cdn.simpleicons.org/adobeaftereffects/9999FF',
  Lottie: 'https://cdn.simpleicons.org/lottiefiles/00DDB3',
  Notion: 'https://cdn.simpleicons.org/notion/000000',
  Vite: 'https://cdn.simpleicons.org/vite/646CFF',
  'Framer Motion': 'https://cdn.simpleicons.org/framer/0055FF',
  Resend: 'https://cdn.simpleicons.org/resend/000000',
}

export function techLogoUrl(name: string) {
  return TECH_LOGOS[name] ?? null
}
