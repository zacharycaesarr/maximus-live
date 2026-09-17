import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  label: string
  children: ReactNode
  className?: string
  delay?: number
  hint?: string
  slot?: string
}

/** Shared dark bento tile. Hover lifts slightly. */
export default function BentoCard({ label, children, className = '', delay = 0, hint, slot }: Props) {
  return (
    <motion.div
      data-portal-slot={slot}
      className={`portal-card group relative flex flex-col justify-between overflow-hidden p-4 md:p-5 ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.14)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="portal-card-label font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
          {label}
        </span>
        {hint ? <span className="font-mono text-[9px] text-white/35">{hint}</span> : null}
      </div>
      <div className="mt-3 min-h-0 flex-1">{children}</div>
    </motion.div>
  )
}
