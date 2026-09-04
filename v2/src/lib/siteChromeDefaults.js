export const SITE_CHROME_STORAGE_KEY = 'mr-site-chrome-tuner-v3'

export const defaultSiteChrome = {
  logoSrc: '/images/logo-mr-black.png',
  logoSize: 28,
  logoInvert: true,
  navCta: 'Book a call',
  footerTag: 'Digital growth for businesses that want more than a pretty site.',
  email: 'hello@maximusreach.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  xUrl: 'https://x.com',
}

export function loadSiteChrome() {
  try {
    const raw = localStorage.getItem(SITE_CHROME_STORAGE_KEY)
    if (!raw) return { ...defaultSiteChrome }
    return { ...defaultSiteChrome, ...JSON.parse(raw) }
  } catch {
    return { ...defaultSiteChrome }
  }
}

export function toFlatSiteChrome(tuner) {
  return { ...defaultSiteChrome, ...tuner }
}
