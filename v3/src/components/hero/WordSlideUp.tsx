'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
  text: string
  className?: string
  /** When false, words stay clipped below until ready (intro chrome) */
  active?: boolean
  /** Delay before first word (seconds) */
  delay?: number
  /** Gap between words (seconds) — Motion-site feel ~0.04–0.08 */
  stagger?: number
  /** Per-word rise duration */
  duration?: number
}

/**
 * Motion-style masked word reveal: each word slides up from below a clip.
 * No blur, no letter scramble — just clean y% stagger.
 */
export default function WordSlideUp({
  text,
  className,
  active = true,
  delay = 0,
  stagger = 0.055,
  duration = 0.55,
}: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const [inView, setInView] = useState(false)

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])
  const ready = active && inView

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!words.length) return null

  if (reduce) {
    return (
      <p ref={ref} className={cn('m-0', className)}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={cn('m-0', className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={ready ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </p>
  )
}
