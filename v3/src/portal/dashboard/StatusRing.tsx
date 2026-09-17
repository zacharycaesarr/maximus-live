import { motion } from 'framer-motion'

type Props = {
  percent: number
  label?: string
}

/** Circular status ring (Railway-style uptime vibe). */
export default function StatusRing({ percent, label = 'on track' }: Props) {
  const size = 112
  const stroke = 8
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, percent))
  const offset = c - (clamped / 100) * c

  return (
    <div className="relative mx-auto flex h-[120px] w-[120px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#34d399"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-nhg text-xl font-medium text-white">{clamped.toFixed(1)}%</span>
        <span className="max-w-[88px] text-center font-mono text-[8px] uppercase leading-tight tracking-[0.08em] text-white/35">
          {label}
        </span>
      </div>
    </div>
  )
}
