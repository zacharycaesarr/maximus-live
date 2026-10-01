'use client'

import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { FunnelChart } from '@/components/ui/funnel-chart'
import { cn } from '@/lib/utils'

export type FunnelStage = {
  label: string
  value: number
  displayValue?: string
  color: string
}

type Props = {
  stages: FunnelStage[]
  exampleLabel?: string
  decisionLabel?: string
  decisionBody?: string
  className?: string
  /** Band thickness 0.35–0.7 */
  thickness?: number
  /** Drawn taper floor (0 = true %). Keep ~0–0.08 so stages shrink. */
  minNorm?: number
  /** Desktop chart min height */
  chartMinH?: number
  /** Mobile chart min height */
  chartMinHMobile?: number
}

export default function AdsConversionFunnel({
  stages,
  exampleLabel = 'Example funnel',
  decisionLabel = 'The decision',
  decisionBody = 'Shift spend toward campaigns producing booked jobs, not just cheap clicks.',
  className,
  thickness = 0.55,
  minNorm = 0.04,
  chartMinH = 300,
  chartMinHMobile = 440,
}: Props) {
  const [vertical, setVertical] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setVertical(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const chartData = useMemo(
    () =>
      stages.map((s) => ({
        label: s.label,
        value: s.value,
        displayValue: s.displayValue,
        color: s.color,
      })),
    [stages],
  )

  const primaryColor = stages[0]?.color ?? '#8B6950'

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-hidden rounded-[18px] border border-espresso/12 bg-[#f7f3ec]/80 p-4 md:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <p className="m-0 font-tiempos text-[13px] font-medium uppercase tracking-[0.12em] text-espresso md:text-[14px]">
            From ad to customer
          </p>
          <p className="m-0 shrink-0 font-nhg text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B6950] md:text-[11px]">
            {exampleLabel}
          </p>
        </div>

        <div
          className="overflow-hidden text-foreground [--background:#f7f3ec] [--color-muted:rgba(44,37,32,0.06)] [--chart-grid:rgba(44,37,32,0.12)] [--foreground:#2c2520] [--muted-foreground:rgba(44,37,32,0.55)]"
          style={
            {
              '--foreground': '#2c2520',
              '--background': '#f7f3ec',
            } as CSSProperties
          }
        >
          <FunnelChart
            data={chartData}
            orientation={vertical ? 'vertical' : 'horizontal'}
            color={primaryColor}
            layers={3}
            thickness={thickness}
            minNorm={minNorm}
            grid={{
              bands: true,
              bandColor: 'rgba(44, 37, 32, 0.04)',
              lines: true,
              lineColor: 'rgba(44, 37, 32, 0.12)',
            }}
            showPercentage
            showValues
            showLabels
            className="font-nhg text-[#2c2520] [&_.font-semibold]:font-tiempos [&_.font-semibold]:text-[clamp(1.05rem,2.2vw,1.45rem)] [&_.font-semibold]:font-light [&_.rounded-full]:bg-[#2c2520] [&_.rounded-full]:text-[#FCFAF2]"
            style={{
              aspectRatio: vertical ? '1 / 1.65' : '2.15 / 1.15',
              minHeight: vertical ? chartMinHMobile : chartMinH,
            }}
          />
        </div>
      </div>

      <motion.div
        className="mt-3 flex items-center gap-3 overflow-hidden rounded-[14px] border border-espresso/12 bg-[#f7f3ec]/80 px-4 py-3.5 md:px-5 md:py-4"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <ArrowRight className="h-4 w-4 shrink-0 text-[#8B6950]" strokeWidth={1.75} aria-hidden />
        <span className="hidden h-8 w-px shrink-0 bg-espresso/15 sm:block" aria-hidden />
        <div className="min-w-0">
          <p className="m-0 font-nhg text-[10px] font-medium uppercase tracking-[0.16em] text-[#8B6950]">
            {decisionLabel}
          </p>
          <p className="m-0 mt-1 font-tiempos text-[15px] font-light leading-snug text-espresso md:text-[17px]">
            {decisionBody}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
