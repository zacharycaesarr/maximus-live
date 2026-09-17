import { motion } from 'framer-motion'

type Props = {
  values: number[]
  className?: string
}

/** Tiny orange area chart. Pure SVG so we can swap for a real chart lib later. */
export default function Sparkline({ values, className = '' }: Props) {
  const w = 320
  const h = 72
  const pad = 4
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)

  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  })

  const line = points.join(' ')
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-full w-full ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="portalSparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--portal-accent, #f97316)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--portal-accent, #f97316)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={area}
        fill="url(#portalSparkFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.polyline
        points={line}
        fill="none"
        stroke="var(--portal-accent, #f97316)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
    </svg>
  )
}
