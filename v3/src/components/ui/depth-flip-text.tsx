// Built using Hyperiux Vault: https://vault.hyperiux.com
// Exact animation. Color/font via props. Phrase uses forwardRef (React 18).

'use client'

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

interface DepthFlipTextProps {
  phrases?: string[]
  className?: string
  backgroundColor?: string
  textColor?: string
  fontClassName?: string
  loop?: boolean
  holdDuration?: number
  transitionDuration?: number
  charStagger?: number
  useOpacityTransition?: boolean
  scrub?: boolean
  scrollStart?: string
  scrollEnd?: string
  /** When true, not full-viewport (section embed) */
  compact?: boolean
}

const DEFAULT_PHRASES = ['See it in action?', 'Proof comes next.']

const LINE_HEIGHT = 0.9
const CHAR_PERSPECTIVE = 1200
const FLIP_EASE = 'power4.inOut'

const DepthFlipText = ({
  phrases = DEFAULT_PHRASES,
  className = '',
  backgroundColor = 'transparent',
  textColor = '#2C2520',
  fontClassName = 'font-nhg',
  loop = true,
  holdDuration = 0.4,
  transitionDuration = 1.4,
  charStagger = 0.02,
  useOpacityTransition = false,
  scrub = false,
  scrollStart = 'top 80%',
  scrollEnd = 'bottom 20%',
  compact = true,
}: DepthFlipTextProps) => {
  const normalizedPhrases = useMemo(
    () => phrases.map((phrase) => phrase.trim()).filter(Boolean),
    [phrases],
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [fontsReady, setFontsReady] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLParagraphElement>(null)
  const nextRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    let cancelled = false
    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      if (!cancelled) setFontsReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const displayIndex = scrub ? 0 : activeIndex
  const isLast = displayIndex >= normalizedPhrases.length - 1
  const hasNext = normalizedPhrases.length > 1 && (!isLast || (!scrub && loop))
  const nextIndex = isLast ? 0 : displayIndex + 1
  const currentPhrase = normalizedPhrases[displayIndex] ?? ''
  const nextPhrase = hasNext ? (normalizedPhrases[nextIndex] ?? '') : ''

  useGSAP(
    () => {
      const currentEl = currentRef.current
      const nextEl = nextRef.current
      if (!fontsReady || !currentEl || !nextEl) return

      let currentSplit: { chars: Element[]; revert: () => void } | null = null
      let nextSplit: { chars: Element[]; revert: () => void } | null = null

      try {
        currentSplit = SplitText.create(currentEl, { type: 'words, chars' })
        nextSplit = SplitText.create(nextEl, { type: 'words, chars' })
      } catch {
        currentSplit = null
        nextSplit = null
      }

      const cleanup = () => {
        currentSplit?.revert()
        nextSplit?.revert()
      }

      gsap.set([currentEl, nextEl], { opacity: 1 })

      // Fallback: whole-line 3D flip (still not a plain fade) if SplitText unavailable
      if (!currentSplit?.chars?.length || !nextSplit) {
        if (!hasNext) return cleanup
        gsap.set(currentEl, {
          transformOrigin: '50% 50% -20px',
          transformPerspective: CHAR_PERSPECTIVE,
          rotationX: 0,
          opacity: 1,
        })
        gsap.set(nextEl, {
          transformOrigin: '50% 50% -20px',
          transformPerspective: CHAR_PERSPECTIVE,
          rotationX: -90,
          opacity: 1,
        })
        gsap
          .timeline({
            delay: scrub ? 0 : holdDuration,
            onComplete: scrub ? undefined : () => setActiveIndex(nextIndex),
            scrollTrigger: scrub
              ? {
                  trigger: containerRef.current,
                  start: scrollStart,
                  end: scrollEnd,
                  scrub: true,
                }
              : undefined,
          })
          .to(currentEl, { rotationX: 90, duration: transitionDuration, ease: FLIP_EASE }, 0)
          .to(nextEl, { rotationX: 0, duration: transitionDuration, ease: FLIP_EASE }, 0)
        return cleanup
      }

      if (!hasNext) {
        gsap.set(nextSplit.chars, { opacity: 0 })
        return cleanup
      }

      const faceOffset = (currentSplit.chars[0] as HTMLElement).offsetHeight / 2
      const faceProps = {
        transformOrigin: `50% 50% ${-faceOffset}px`,
        transformPerspective: CHAR_PERSPECTIVE,
        backfaceVisibility: 'hidden' as const,
        force3D: true,
      }

      gsap.set(currentSplit.chars, { ...faceProps, rotationX: 0, opacity: 1 })
      gsap.set(nextSplit.chars, {
        ...faceProps,
        rotationX: -90,
        opacity: useOpacityTransition ? 0 : 1,
      })
      const advance = () => setActiveIndex(nextIndex)

      gsap
        .timeline({
          delay: scrub ? 0 : holdDuration,
          onComplete: scrub ? undefined : advance,
          scrollTrigger: scrub
            ? {
                trigger: containerRef.current,
                start: scrollStart,
                end: scrollEnd,
                scrub: true,
              }
            : undefined,
        })
        .to(
          currentSplit.chars,
          {
            rotationX: 90,
            opacity: useOpacityTransition ? 0 : 1,
            duration: transitionDuration,
            ease: FLIP_EASE,
            stagger: charStagger,
          },
          0,
        )
        .to(
          nextSplit.chars,
          {
            rotationX: 0,
            opacity: 1,
            duration: transitionDuration,
            ease: FLIP_EASE,
            stagger: charStagger,
          },
          0,
        )

      return cleanup
    },
    {
      scope: containerRef,
      revertOnUpdate: true,
      dependencies: [
        activeIndex,
        nextIndex,
        hasNext,
        fontsReady,
        currentPhrase,
        nextPhrase,
        scrub,
        scrollStart,
        scrollEnd,
        holdDuration,
        transitionDuration,
        charStagger,
        useOpacityTransition,
      ],
    },
  )

  return (
    <section
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden px-4 sm:px-6',
        compact ? 'min-h-[22vw] py-6 md:min-h-[140px] md:py-8' : 'min-h-screen',
        className,
      )}
      style={{ backgroundColor }}
    >
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-[1400px] max-md:min-h-[18vw]"
        style={{ opacity: fontsReady ? 1 : 0 }}
      >
        <Phrase
          key={`current-${activeIndex}`}
          ref={currentRef}
          text={currentPhrase}
          tone={textColor}
          fontClassName={fontClassName}
        />
        <Phrase
          key={`next-${nextIndex}`}
          ref={nextRef}
          text={nextPhrase}
          tone={textColor}
          fontClassName={fontClassName}
          secondary
        />
      </div>
    </section>
  )
}

const Phrase = forwardRef<
  HTMLParagraphElement,
  { text: string; tone: string; secondary?: boolean; fontClassName: string }
>(({ text, tone, secondary = false, fontClassName }, ref) => (
  <p
    ref={ref}
    className={cn(
      'm-0 w-full whitespace-nowrap text-center text-[6vw] font-medium tracking-[-0.04em] max-[1025px]:text-[7vw] max-md:text-[8vw]',
      fontClassName,
      secondary ? 'absolute inset-0' : 'relative',
    )}
    style={{
      color: tone,
      lineHeight: LINE_HEIGHT,
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
    }}
  >
    {text}
  </p>
))
Phrase.displayName = 'DepthFlipPhrase'

export default DepthFlipText
