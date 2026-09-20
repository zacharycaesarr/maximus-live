'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock3,
  Layers3,
  Megaphone,
  MessageSquareWarning,
  Puzzle,
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
  {
    id: 'stack',
    category: 'Stack',
    maximus: {
      title: 'Site + ads + follow-up',
      description: 'Landing pages, Meta/Google, and lead alerts wired as one system.',
      Icon: Layers3,
    },
    traditional: {
      title: 'Bolt-on tools',
      description: 'Disconnected platforms with nobody owning the full path to a booked call.',
      Icon: Puzzle,
    },
  },
  {
    id: 'creative',
    category: 'Creative',
    maximus: {
      title: 'Built for conversion',
      description: 'Copy, motion, and ads designed around the same offer and funnel.',
      Icon: Megaphone,
    },
    traditional: {
      title: 'Pretty, then patch',
      description: 'Brand work first, performance later. Creative rarely matches the media plan.',
      Icon: MessageSquareWarning,
    },
  },
]

/**
 * Placeholder comparison matrix for Why Maximus Reach.
 * Cream/mocha theme. Sync-hover rows. Mobile segmented control.
 */
export default function WhyComparisonMatrix() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'maximus' | 'traditional'>('maximus')

  return (
    <div className="w-full">
      {/* Mobile tabs */}
      <div className="mb-5 flex justify-center md:hidden">
        <div className="inline-flex rounded-full border border-espresso/15 bg-white/70 p-1 backdrop-blur">
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 font-nhg text-[12px] font-medium transition',
              mobileTab === 'maximus' ? 'bg-espresso text-cream' : 'text-espresso/60',
            )}
            onClick={() => setMobileTab('maximus')}
          >
            Maximus Reach
          </button>
          <button
            type="button"
            className={cn(
              'rounded-full px-4 py-2 font-nhg text-[12px] font-medium transition',
              mobileTab === 'traditional' ? 'bg-espresso text-cream' : 'text-espresso/60',
            )}
            onClick={() => setMobileTab('traditional')}
          >
            Traditional
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-espresso/15 bg-[#efeae2]/40 p-3 md:p-4">
        <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-0">
          {/* VS spine (desktop) */}
          <div className="pointer-events-none absolute inset-y-6 left-1/2 z-20 hidden -translate-x-1/2 md:block" aria-hidden>
            <div className="mx-auto h-full w-px bg-espresso/15" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-espresso/20 bg-[#f7f7f5] px-2.5 py-1 font-nhg text-[10px] font-semibold tracking-[0.18em] text-espresso/70">
              VS
            </span>
          </div>

          {/* Maximus column */}
          <div
            className={cn(
              'rounded-2xl bg-[#0e0d0c] p-4 md:rounded-r-none md:p-5',
              mobileTab !== 'maximus' && 'hidden md:block',
            )}
          >
            <p className="mb-4 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-[#c4a574]">
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
                      'rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-all duration-250 md:p-4',
                      active && 'border-[#c4a574]/45 bg-[#c4a574]/10',
                      dim && 'opacity-55',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#c4a574]" aria-hidden />
                      <div>
                        <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.12em] text-white/35">
                          {row.category}
                        </p>
                        <h3 className="mt-1 m-0 font-nhg text-[15px] font-semibold text-white md:text-base">
                          {row.maximus.title}
                        </h3>
                        <p className="mt-1.5 m-0 font-nhg text-[13px] leading-relaxed text-white/55">
                          {row.maximus.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Traditional column */}
          <div
            className={cn(
              'rounded-2xl border border-espresso/10 bg-[#efeae2]/90 p-4 md:rounded-l-none md:border-l-0 md:p-5',
              mobileTab !== 'traditional' && 'hidden md:block',
            )}
          >
            <p className="mb-4 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/45">
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
                      'rounded-xl border border-espresso/10 bg-white/40 p-3.5 transition-all duration-250 md:p-4',
                      active && 'border-espresso/25 bg-espresso/5',
                      dim && 'opacity-55',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-espresso/45" aria-hidden />
                      <div>
                        <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.12em] text-espresso/35">
                          {row.category}
                        </p>
                        <h3 className="mt-1 m-0 font-nhg text-[15px] font-semibold text-espresso/80 md:text-base">
                          {row.traditional.title}
                        </h3>
                        <p className="mt-1.5 m-0 font-nhg text-[13px] leading-relaxed text-espresso/50">
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
