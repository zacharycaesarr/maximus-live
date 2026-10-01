'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock3,
  MessageSquareWarning,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Side = {
  title: string
  description: string
  Icon: LucideIcon
}

type Row = {
  id: string
  category: string
  maximus: Side
  traditional: Side
}

const ROWS: Row[] = [
  {
    id: 'ownership',
    category: 'Ownership',
    maximus: {
      title: 'One partner who ships',
      description: 'Web, ads, and creative under one roof so nothing falls between vendors.',
      Icon: ShieldCheck,
    },
    traditional: {
      title: 'Agency handoffs',
      description: 'Separate teams for site, ads, and creative. Slow loops and mixed priorities.',
      Icon: Users,
    },
  },
  {
    id: 'speed',
    category: 'Speed',
    maximus: {
      title: 'Build → launch → tune',
      description: 'Pages and campaigns move together so traffic hits a page that converts.',
      Icon: Sparkles,
    },
    traditional: {
      title: 'Waiting on the queue',
      description: 'Tickets, revisions, and weekly meetings before anything ships live.',
      Icon: Clock3,
    },
  },
  {
    id: 'clarity',
    category: 'Clarity',
    maximus: {
      title: 'Plain numbers',
      description: 'Qualified leads, cost per lead, and what changed this week. No fog.',
      Icon: CheckCircle2,
    },
    traditional: {
      title: 'Vanity reports',
      description: 'Impressions and reach decks that look busy but do not explain revenue.',
      Icon: MessageSquareWarning,
    },
  },
]

/**
 * Placeholder comparison matrix for Why Maximus Reach.
 * Sync-hover rows. Mobile: pill + swipe between columns.
 */
export default function WhyComparisonMatrix() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'maximus' | 'traditional'>('maximus')
  const touchX = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.changedTouches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current
    touchX.current = null
    if (start == null) return
    const end = e.changedTouches[0]?.clientX ?? start
    const dx = end - start
    if (Math.abs(dx) < 48) return
    // Swipe left → Traditional, swipe right → Maximus
    if (dx < 0) setMobileTab('traditional')
    else setMobileTab('maximus')
  }

  return (
    <div className="w-full">
      {/* Mobile tabs */}
      <div className="mb-4 flex justify-center md:mb-5 md:hidden">
        <div className="inline-flex rounded-full border border-home-line/60 bg-home-surface-light/80 p-1 backdrop-blur">
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 font-nhg text-[12px] font-medium transition',
              mobileTab === 'maximus' ? 'bg-home-surface-dark text-home-on-dark' : 'text-home-muted',
            )}
            onClick={() => setMobileTab('maximus')}
          >
            Maximus Reach
          </button>
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 font-nhg text-[12px] font-medium transition',
              mobileTab === 'traditional' ? 'bg-home-surface-dark text-home-on-dark' : 'text-home-muted',
            )}
            onClick={() => setMobileTab('traditional')}
          >
            Traditional
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-home-line/50 bg-home-surface-light/40 p-3 md:p-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-0">
          <div className="pointer-events-none absolute inset-y-6 left-1/2 z-20 hidden -translate-x-1/2 md:block" aria-hidden>
            <div className="mx-auto h-full w-px bg-home-line/60" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-home-line bg-home-surface-light px-2.5 py-1 font-nhg text-[10px] font-semibold tracking-[0.18em] text-home-muted">
              VS
            </span>
          </div>

          <div
            className={cn(
              'rounded-2xl bg-home-surface-dark p-4 md:rounded-r-none md:p-5',
              mobileTab !== 'maximus' && 'hidden md:block',
            )}
          >
            <p className="mb-4 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-home-acid">
              Maximus Reach
            </p>
            <div className="flex flex-col gap-2.5">
              {ROWS.map((row, i) => {
                const active = hovered === row.id
                const dim = hovered !== null && !active
                const Icon = row.maximus.Icon
                return (
                  <motion.div
                    key={`m-${row.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    onMouseEnter={() => setHovered(row.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'rounded-xl border border-home-line/20 bg-home-on-dark/[0.03] p-3.5 transition-all duration-250 md:p-4',
                      active && 'border-home-acid/45 bg-home-acid/10',
                      dim && 'opacity-55',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-home-acid" aria-hidden />
                      <div>
                        <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.12em] text-home-muted/70">
                          {row.category}
                        </p>
                        <h3 className="mt-1 m-0 font-nhg text-[15px] font-semibold text-home-on-dark md:text-base">
                          {row.maximus.title}
                        </h3>
                        <p className="mt-1.5 m-0 font-nhg text-[13px] leading-relaxed text-home-muted">
                          {row.maximus.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div
            className={cn(
              'rounded-2xl border border-home-line/40 bg-home-surface-light/90 p-4 md:rounded-l-none md:border-l-0 md:p-5',
              mobileTab !== 'traditional' && 'hidden md:block',
            )}
          >
            <p className="mb-4 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-home-muted">
              Traditional agency
            </p>
            <div className="flex flex-col gap-2.5">
              {ROWS.map((row, i) => {
                const active = hovered === row.id
                const dim = hovered !== null && !active
                const Icon = row.traditional.Icon
                return (
                  <motion.div
                    key={`t-${row.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.05 + 0.04, duration: 0.35 }}
                    onMouseEnter={() => setHovered(row.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'rounded-xl border border-home-line/50 bg-home-bg-light/50 p-3.5 transition-all duration-250 md:p-4',
                      active && 'border-home-line bg-home-surface-light',
                      dim && 'opacity-55',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-home-muted" aria-hidden />
                      <div>
                        <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.12em] text-home-muted/80">
                          {row.category}
                        </p>
                        <h3 className="mt-1 m-0 font-nhg text-[15px] font-semibold text-home-on-light md:text-base">
                          {row.traditional.title}
                        </h3>
                        <p className="mt-1.5 m-0 font-nhg text-[13px] leading-relaxed text-home-muted">
                          {row.traditional.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
