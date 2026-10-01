'use client'

import TiltSurface from '@/components/ui/TiltSurface'
import { cn } from '@/lib/utils'

export type ProofCard = {
  id: string
  platform: string
  client: string
  headline: string
  metrics: string[]
  status?: string
}

type Props = {
  cards: ProofCard[]
  className?: string
}

function TiltCard({ card }: { card: ProofCard }) {
  return (
    <TiltSurface
      as="article"
      className="rounded-[11px] border border-white/55 bg-[rgba(255,255,255,0.28)] p-5 shadow-[0_12px_32px_-12px_rgba(44,37,32,0.35)] backdrop-blur-[8px] md:p-6"
    >
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="font-switzer text-[11px] uppercase tracking-[0.16em] text-espresso/40">
            {card.platform} · {card.client}
          </p>
          {card.status && (
            <span className="rounded-[8px] bg-[#2C2520] px-2.5 py-1 font-switzer text-[10px] uppercase tracking-[0.12em] text-[#FCFAF2]">
              {card.status}
            </span>
          )}
        </div>
        <p className="mt-4 font-tiempos text-[1.15rem] font-light leading-snug text-espresso md:text-[1.25rem]">
          {card.headline}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {card.metrics.map((m) => (
            <li
              key={m}
              className="rounded-full border border-[#8B6950]/25 bg-[#8B6950]/10 px-3 py-1 font-switzer text-[11px] font-medium text-[#2C2520]"
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </TiltSurface>
  )
}

/**
 * Three proof cards with a light tilt on hover.
 * Real campaign numbers, mocha palette.
 */
export default function AdsProofCards({ cards, className }: Props) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-3 md:gap-5', className)}>
      {cards.map((card, i) => (
        <div key={card.id} className={cn(i === 1 && 'md:translate-y-6')}>
          <TiltCard card={card} />
        </div>
      ))}
    </div>
  )
}
