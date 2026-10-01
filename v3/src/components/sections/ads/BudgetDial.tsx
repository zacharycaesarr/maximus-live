'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  title: string
  note: string
  /** rough illustrative math. Leva-tunable */
  cpm?: number
  ctr?: number
  leadRate?: number
  min?: number
  max?: number
  start?: number
}

/**
 * Drag the budget. Reach, clicks, and leads follow with weight,
 * so the numbers feel like they carry something. Illustrative math.
 */
export default function BudgetDial({
  eyebrow,
  title,
  note,
  cpm = 14,
  ctr = 0.018,
  leadRate = 0.07,
  min = 500,
  max = 8000,
  start = 2000,
}: Props) {
  const [budget, setBudget] = useState(start)
  const pct = (budget - min) / (max - min)

  const impressions = (budget / cpm) * 1000
  const clicks = impressions * ctr
  const leads = clicks * leadRate

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="md:flex md:items-end md:justify-between md:gap-16">
          <div>
            <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">{eyebrow}</p>
            <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
              {title}
            </h2>
          </div>
          <p className="mt-4 max-w-xs font-nhg text-sm text-espresso md:mt-0">{note}</p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          {/* the dial */}
          <div className="rounded-[24px] border border-espresso/10 bg-white/70 p-6 md:p-8">
            <div className="flex items-baseline justify-between">
              <p className="font-nhg text-[11px] uppercase tracking-[0.16em] text-espresso/40">Monthly ad spend</p>
              <p className="font-nhg text-[11px] text-espresso/35">illustrative</p>
            </div>
            <p className="mt-3 font-tiempos text-[clamp(2.6rem,7vw,4.5rem)] font-light leading-none text-espresso">
              <Money value={budget} />
            </p>

            <div className="relative mt-8 h-14 touch-none select-none">
              {/* track */}
              <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-espresso/10" />
              <motion.div
                className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-espresso"
                animate={{ width: `${pct * 100}%` }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              />
              {/* ticks */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[1px]">
                {Array.from({ length: 16 }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-2 w-px bg-espresso/15',
                      i / 15 <= pct && 'bg-espresso/40',
                    )}
                  />
                ))}
              </div>
              <motion.div
                className="pointer-events-none absolute top-1/2 -ml-[18px] -mt-[18px] grid h-9 w-9 place-items-center rounded-full bg-espresso shadow-[0_10px_30px_-10px_rgba(44,37,32,0.6)]"
                animate={{ left: `${pct * 100}%` }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c4a574]" />
              </motion.div>
              <input
                aria-label="Monthly ad spend"
                type="range"
                min={min}
                max={max}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>
            <div className="mt-2 flex justify-between font-nhg text-[11px] text-espresso/35">
              <span>
                <Money value={min} />
              </span>
              <span>Drag it</span>
              <span>
                <Money value={max} />
              </span>
            </div>
          </div>

          {/* the readout */}
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-4">
            <Stat label="People reached" value={impressions} format="compact" />
            <Stat label="Clicks" value={clicks} format="int" />
            <Stat label="Leads, roughly" value={leads} format="int" highlight />
          </div>
        </div>
      </div>
    </section>
  )
}

function Money({ value }: { value: number }) {
  return <>${Math.round(value).toLocaleString()}</>
}

function Stat({
  label,
  value,
  format,
  highlight,
}: {
  label: string
  value: number
  format: 'compact' | 'int'
  highlight?: boolean
}) {
  const spring = useSpring(value, { stiffness: 90, damping: 22, mass: 0.9 })
  useEffect(() => {
    spring.set(value)
  }, [value, spring])
  const text = useTransform(spring, (v) =>
    format === 'compact'
      ? Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
      : Math.round(v).toLocaleString(),
  )
  return (
    <div
      className={cn(
        'rounded-[20px] border p-4 md:flex md:items-center md:justify-between md:px-6 md:py-5',
        highlight ? 'border-espresso bg-espresso text-[#FCFAF2]' : 'border-espresso/10 bg-white/60 text-espresso',
      )}
    >
      <p className={cn('font-nhg text-[10px] uppercase tracking-[0.16em] md:text-[11px]', highlight ? 'text-[#FCFAF2]/55' : 'text-espresso/40')}>
        {label}
      </p>
      <motion.p className="mt-2 font-tiempos text-[clamp(1.4rem,4vw,2.4rem)] font-light leading-none tabular-nums md:mt-0">
        {text}
      </motion.p>
    </div>
  )
}
