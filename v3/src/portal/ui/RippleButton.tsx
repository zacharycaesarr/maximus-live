import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Ripple = { id: number; x: number; y: number; size: number }

type Props = {
  children: ReactNode
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  /** Ripple ink color */
  rippleClassName?: string
}

/**
 * Material-style click ripple. Same look as 21st Motion example, no layout change.
 */
export default function RippleButton({
  children,
  className,
  type = 'button',
  disabled,
  onClick,
  rippleClassName = 'bg-white/35',
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])

  function spawn(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 1.35
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now() + Math.random()
    setRipples((r) => [...r, { id, x, y, size }])
    window.setTimeout(() => {
      setRipples((r) => r.filter((item) => item.id !== id))
    }, 520)
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={(e) => {
        spawn(e)
        onClick?.(e)
      }}
      className={cn(
        'relative overflow-hidden transition-transform duration-150 active:scale-[0.98]',
        className,
      )}
    >
      <span className="relative z-[1] inline-flex items-center justify-center gap-2">{children}</span>
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className={cn('pointer-events-none absolute rounded-full', rippleClassName)}
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>
    </button>
  )
}
