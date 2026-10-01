export type MockVersion = 'before' | 'after'

export type WorkMockMeta = {
  slug: string
  title: string
  clientLabel: string
  category: 'web' | 'ads' | 'creative'
  blurb: string
  metric: string
  subtext: string
}

export const WEB_MOCKS: WorkMockMeta[] = [
  {
    slug: 'summit-hvac',
    title: 'Rounds HVAC',
    clientLabel: 'Home Services · Emergency Dispatch',
    category: 'web',
    subtext: 'Home Services · Emergency Dispatch',
    blurb: 'Dated brochure template converted to an instant mobile dispatch engine.',
    metric: '+140% Emergency Service Calls',
  },
  {
    slug: 'northline-dental',
    title: 'Augusta Dental Arts',
    clientLabel: 'Cosmetic & Restorative Dentistry',
    category: 'web',
    subtext: 'Cosmetic & Restorative Dentistry',
    blurb: 'Frictionless online consult booking with interactive smile transformation gallery.',
    metric: '42% Increase in High-Ticket Consults',
  },
  {
    slug: 'ridge-plumbing',
    title: 'West & Clay',
    clientLabel: 'Custom Carpentry & Additions',
    category: 'web',
    subtext: 'Custom Carpentry & Additions',
    blurb: 'Portfolio redesign focusing on project lookbooks, upfront pricing guides, and lead capture.',
    metric: '2.8x Qualified Project Inquiries',
  },
]
