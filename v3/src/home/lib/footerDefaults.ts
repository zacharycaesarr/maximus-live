export const FOOTER_STORAGE_KEY = 'mr-v3-footer-v3'

export const defaultFooterTuner = {
  enabled: true,
  headline: 'Ready to reach further?',
  primaryLabel: 'Start Your Project',
  primaryHref: '/start',
  secondaryLabel: 'Existing Client?',
  secondaryHref: '/portal',
  brandName: 'Maximus Reach',
  brandBlurb: 'Digital growth for businesses ready to look sharper and move faster.',
  col1Title: 'Explore',
  col1Links:
    'Home|/ || About|/about || Work|/work || Start|/start || Why Maximus|/#why-maximus || Privacy|/privacy || Terms|/terms',
  col2Title: 'Work with us',
  col2Links: 'Get started|/start || Client Portal|/portal || How it works|/#how-it-works || FAQ|/#faq',
  col3Title: 'Connect',
  col3Links: 'Book a call|mailto:hello@maximusreach.com || Call|tel:+15404162983',
  flickerText: 'Maximus Reach',
  flickerTextMobile: 'Maximus',
  copyright: '© Maximus Reach. All rights reserved.',
}

export type FooterTuner = typeof defaultFooterTuner

export type FooterLink = { label: string; href: string }
export type FooterColumn = { title: string; links: FooterLink[] }

export function loadFooterTuner(): FooterTuner {
  try {
    const raw = localStorage.getItem(FOOTER_STORAGE_KEY)
    if (!raw) return { ...defaultFooterTuner }
    const saved = JSON.parse(raw)
    // Preserve custom copy while migrating the previous default headline.
    if (saved.headline === "Let's get started.") saved.headline = defaultFooterTuner.headline
    return { ...defaultFooterTuner, ...saved }
  } catch {
    return { ...defaultFooterTuner }
  }
}

/** Parse "Label|/path || Label2|#hash" */
export function parseFooterLinks(raw: string): FooterLink[] {
  return raw
    .split('||')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [label, href] = chunk.split('|').map((s) => s.trim())
      return { label: label || 'Link', href: href || '#' }
    })
}

export function buildFooterColumns(t: FooterTuner): FooterColumn[] {
  return [
    { title: t.col1Title, links: parseFooterLinks(t.col1Links) },
    { title: t.col2Title, links: parseFooterLinks(t.col2Links) },
    { title: t.col3Title, links: parseFooterLinks(t.col3Links) },
  ]
}
