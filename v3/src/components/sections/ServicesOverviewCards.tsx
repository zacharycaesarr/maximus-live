'use client'

/**
 * Home services cards. Desktop = 3-up row. Mobile = one-card horizontal swipe.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Megaphone, Palette, type LucideIcon } from 'lucide-react'
import TiltSurface from '@/components/ui/TiltSurface'
import CardPixelStars from '@/components/ui/CardPixelStars'
import {
  useServicesOverviewTuner,
  type ServiceCardTune,
} from '@/context/ServicesOverviewTunerContext'
import { cn } from '@/lib/utils'

type CardKey = 'card1' | 'card2' | 'card3'

const SYMBOLS: Record<string, LucideIcon> = {
  monitor: Monitor,
  megaphone: Megaphone,
  workflow: Palette,
  palette: Palette,
}

const HREFS: Record<CardKey, string> = {
  card1: '/capabilities/web-development',
  card2: '/capabilities/ad-management',
  card3: '/capabilities/creative-studio',
}

function SymbolMark({ name, color }: { name: string; color: string }) {
  const Icon = SYMBOLS[name.toLowerCase()] ?? Monitor
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
      style={{ background: `${color}22`, color }}
      aria-hidden
    >
      <Icon size={22} strokeWidth={1.75} />
    </span>
  )
}

function flapBullets(card: ServiceCardTune) {
  return [card.bullet1, card.bullet2, card.bullet3, card.bullet4].filter((b) => b && b.trim())
}

function CardFace({
  card,
  cardKey,
  minH,
  open,
  onToggle,
}: {
  card: ServiceCardTune
  cardKey: CardKey
  minH: number
  open: boolean
  onToggle: () => void
}) {
  const ink = card.ink || '#1a1612'
  const bullets = flapBullets(card)
  const face = (
    <button
      type="button"
      onClick={onToggle}
      className="relative z-[2] flex w-full flex-col overflow-hidden text-left"
      style={{ minHeight: minH, background: card.bg }}
      aria-expanded={open}
    >
      <CardPixelStars className="pointer-events-none absolute inset-0 z-[1]" opacity={0.72} />

      <AnimatePresence>
        {open ? (
          <motion.div
            key="learn"
            initial={{ y: '-110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-3 right-3 top-3 z-[4] max-h-[38%] overflow-y-auto rounded-xl border border-white/12 px-3 py-2.5 shadow-[0_14px_32px_-14px_rgba(0,0,0,0.5)]"
            style={{ background: 'rgba(11,13,19,0.94)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="m-0 font-nhg text-[12px] font-semibold tracking-wide text-[#FFEDD5]">
              Learn more
            </p>
            <ul className="mt-2 m-0 space-y-1.5 p-0">
              {bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.28 }}
                  className="list-none font-nhg text-[11px] leading-snug text-[#FFEDD5]/75"
                >
                  {b}
                </motion.li>
              ))}
            </ul>
            <Link
              to={HREFS[cardKey]}
              className="mt-2.5 inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1.5 font-nhg text-[11px] font-medium text-[#0B0D13] no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              Open {card.title} →
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative z-[2] min-h-[52%] flex-1 px-6 pt-6 md:px-7 md:pt-7" aria-hidden />

      <div className="relative z-[2] mt-auto flex flex-col gap-3 px-6 pb-6 pt-4 md:px-7 md:pb-7">
        <div className="flex items-end justify-between gap-3">
          <h3
            className="m-0 font-nhg text-[1.65rem] font-semibold leading-none tracking-tight md:text-[1.85rem]"
            style={{ color: ink }}
          >
            {card.title}
          </h3>
          <SymbolMark name={card.symbol} color={ink} />
        </div>
        <p
          className="m-0 max-w-[18ch] font-nhg text-[14px] font-medium leading-snug md:text-[15px]"
          style={{ color: ink, opacity: 0.78 }}
        >
          {card.blurb}
        </p>
        <p
          className="m-0 font-switzer text-[10px] uppercase tracking-[0.14em]"
          style={{ color: ink, opacity: 0.4 }}
        >
          {open ? 'Tap to close' : 'Tap for more'}
        </p>
      </div>
    </button>
  )

  const shellClass =
    'relative z-[2] overflow-hidden rounded-[1.75rem] shadow-[0_18px_40px_-18px_rgba(44,37,32,0.28)]'

  if (open) {
    return <div className={shellClass}>{face}</div>
  }

  return (
    <TiltSurface as="div" className={shellClass}>
      {face}
    </TiltSurface>
  )
}

export default function ServicesOverviewCards() {
  const t = useServicesOverviewTuner()
  const [open, setOpen] = useState<CardKey | null>(null)

  const cards: { key: CardKey; data: ServiceCardTune }[] = [
    { key: 'card1', data: t.card1 },
    { key: 'card2', data: t.card2 },
    { key: 'card3', data: t.card3 },
  ]

  const renderCard = (key: CardKey, data: ServiceCardTune, i: number, mobile?: boolean) => {
    const isOpen = open === key
    return (
      <div
        key={key}
        className={cn(
          'relative min-w-0',
          mobile
            ? 'w-[82%] max-w-[340px] shrink-0 snap-center'
            : cn('md:basis-0 md:flex-1', i === 1 && !open && 'md:translate-y-3'),
        )}
      >
        <CardFace
          card={data}
          cardKey={key}
          minH={mobile ? Math.min(t.cardMinH, 420) : t.cardMinH}
          open={isOpen}
          onToggle={() => setOpen((p) => (p === key ? null : key))}
        />
      </div>
    )
  }

  return (
    <>
      {/* Mobile: one card at a time, swipe sideways */}
      <div
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {cards.map(({ key, data }, i) => renderCard(key, data, i, true))}
      </div>

      {/* Desktop / tablet: 3-up row */}
      <div className="hidden md:flex md:flex-row md:items-stretch md:gap-4 lg:gap-5">
        {cards.map(({ key, data }, i) => renderCard(key, data, i, false))}
      </div>
    </>
  )
}
