'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  text?: string
  children?: ReactNode
  className?: string
  delay?: number
  duration?: number
  wipeColor?: string
  accentColor?: string
  animateOnScroll?: boolean
}

/**
 * Block wipe. Text stays fully hidden until the wipe has covered it (no pre-flash).
 */
export function TextBlockAnimation({
  text,
  children,
  className,
  delay = 0,
  duration = 0.7,
  wipeColor = '#8B6950',
  accentColor,
  animateOnScroll = true,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const line = root.querySelector<HTMLElement>('[data-line]')
    const block = root.querySelector<HTMLElement>('[data-wipe]')
    if (!line || !block) return

    gsap.set(line, { autoAlpha: 0 })
    gsap.set(block, { scaleX: 0, transformOrigin: 'left center' })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(line, { autoAlpha: 1 })
      return
    }

    const tl = gsap.timeline({
      delay,
      defaults: { ease: 'expo.inOut' },
      scrollTrigger: animateOnScroll
        ? {
            trigger: root,
            start: 'top 82%',
            toggleActions: 'play none none none',
          }
        : undefined,
    })

    // cover first, only then reveal text, then pull wipe away
    tl.to(block, { scaleX: 1, duration, backgroundColor: wipeColor })
      .set(line, { autoAlpha: 1 })
      .to(block, {
        scaleX: 0,
        duration,
        transformOrigin: 'right center',
        backgroundColor: accentColor || wipeColor,
      })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      gsap.set(line, { autoAlpha: 0 })
    }
  }, [text, children, delay, duration, wipeColor, accentColor, animateOnScroll])

  return (
    <div ref={rootRef} className={cn('relative overflow-hidden', className)}>
      <div
        data-line=""
        className="relative z-[1]"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        {children ?? text}
      </div>
      <span
        data-wipe=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ backgroundColor: wipeColor, transform: 'scaleX(0)', transformOrigin: 'left center' }}
      />
    </div>
  )
}

export default TextBlockAnimation
