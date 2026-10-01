'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  text: string
  className?: string
  fontSize?: number
  minWeight?: number
  maxWeight?: number
  animationDuration?: number
  delayMultiplier?: number
}

/**
 * Letter weight breath (21st animated-text / breathing-text idea).
 * Roboto Flex variable axis.
 */
export function AnimatedText({
  text,
  className,
  fontSize,
  minWeight = 200,
  maxWeight = 800,
  animationDuration = 1.8,
  delayMultiplier = 0.08,
}: Props) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '40px', threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const spans = containerRef.current.querySelectorAll<HTMLElement>('span[data-breath]')
    const n = spans.length
    spans.forEach((span, i) => {
      const mapped = i - n / 2
      span.style.animationDelay = `${mapped * delayMultiplier}s`
    })
  }, [text, delayMultiplier])

  return (
    <p
      ref={containerRef}
      aria-label={text}
      className={cn('m-0 inline-flex', className)}
      style={{
        fontFamily: '"Roboto Flex", "Neue Haas Grotesk Display", sans-serif',
        fontSize: fontSize ? `${fontSize}px` : undefined,
        fontFeatureSettings: '"wght"',
      }}
    >
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          data-breath=""
          aria-hidden
          className="inline-block whitespace-pre"
          style={{
            animation: `mr-breath ${animationDuration}s alternate cubic-bezier(0.37, 0, 0.63, 1) infinite both`,
            animationPlayState: inView ? 'running' : 'paused',
            fontVariationSettings: `"wght" ${minWeight}`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      <style>{`
        @keyframes mr-breath {
          0% { font-variation-settings: "wght" ${minWeight}; }
          100% { font-variation-settings: "wght" ${maxWeight}; }
        }
      `}</style>
    </p>
  )
}

/** Alias used on Start page Book a call */
export function BreathingText({ text, className }: { text: string; className?: string }) {
  return (
    <AnimatedText
      text={text}
      className={className}
      minWeight={280}
      maxWeight={780}
      animationDuration={1.65}
      delayMultiplier={0.07}
    />
  )
}
