import { type ReactNode } from 'react'
import { BrandMention } from '@/components/brand/BrandInline'

/** Swap plain "Maximus Reach" for the branded mention. */
export function withBrandMentions(text: string): ReactNode {
  const parts = text.split(/(Maximus Reach)/g)
  return parts.map((part, i) =>
    part === 'Maximus Reach' ? <BrandMention key={i} /> : <span key={i}>{part}</span>,
  )
}
