export type MockVersion = 'before' | 'after'

export type WorkMockMeta = {
  slug: string
  title: string
  clientLabel: string
  category: 'web' | 'ads' | 'creative'
  blurb: string
  metric: string
}

export const WEB_MOCKS: WorkMockMeta[] = [
  {
    slug: 'ridge-plumbing',
    title: 'Ridge Plumbing Co.',
    clientLabel: 'Local trades · web',
    category: 'web',
    blurb: 'Dated brochure site → premium lead machine with clear calls and mobile-first layout.',
    metric: 'Clearer offers · stronger calls',
  },
  {
    slug: 'northline-dental',
    title: 'Northline Dental',
    clientLabel: 'Healthcare · web',
    category: 'web',
    blurb: 'Crowded clinic template → calm, trust-first experience that books visits.',
    metric: 'Booking path front and center',
  },
]
