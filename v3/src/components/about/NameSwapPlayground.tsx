'use client'

/**
 * About hero motion playground.
 * MAXIMUS, ZACHARY lockup: letter slide-up + scale entrance, then rearrange.
 * Comma vanishes on swap. Real DOM text. GSAP + Leva.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useControls, folder, button } from 'leva'
import type { LevaStore } from '@/lib/levaStore'
import { cn } from '@/lib/utils'

gsap.registerPlugin(useGSAP)

const STORAGE = 'mr-v3-about-name-play-v2'

type PlayDefaults = {
  wordA: string
  wordB: string
  showComma: boolean
  letterDuration: number
  letterStagger: number
  wordDelay: number
  yPercent: number
  enterScale: number
  letterEase: string
  swapDelay: number
  swapDuration: number
  swapEase: string
  swapY: number
  fontSize: number
  letterSpacing: number
  fontWeight: number
  gap: number
}

const DEFAULTS: PlayDefaults = {
  wordA: 'MAXIMUS',
  wordB: 'ZACHARY',
  showComma: true,
  letterDuration: 0.55,
  letterStagger: 0.045,
  wordDelay: 0.18,
  yPercent: 110,
  enterScale: 1.22,
  letterEase: 'expo.out',
  swapDelay: 0.35,
  swapDuration: 0.85,
  swapEase: 'expo.inOut',
  swapY: 18,
  fontSize: 56,
  letterSpacing: -0.04,
  fontWeight: 700,
  gap: 10,
}

function load(): PlayDefaults {
  try {
    const raw = localStorage.getItem(STORAGE)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

function splitLetters(word: string) {
  return word.split('').map((ch, i) => ({
    ch: ch === ' ' ? '\u00A0' : ch,
    key: `${word}-${i}-${ch}`,
  }))
}

type Props = {
  store: LevaStore
  className?: string
}

export default function NameSwapPlayground({ store, className }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lockupRef = useRef<HTMLDivElement>(null)
  const wordARef = useRef<HTMLSpanElement>(null)
  const wordBRef = useRef<HTMLSpanElement>(null)
  const commaRef = useRef<HTMLSpanElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const valsRef = useRef<PlayDefaults>(DEFAULTS)
  const [replayKey, setReplayKey] = useState(0)
  const initial = useRef(load()).current

  const vals = useControls(
    {
      'Name playground': folder(
        {
          wordA: { value: initial.wordA, label: 'first word (enters 1st)' },
          wordB: { value: initial.wordB, label: 'second word (enters 2nd)' },
          showComma: { value: initial.showComma, label: 'show comma' },
          fontSize: { value: initial.fontSize, min: 22, max: 120, step: 1, label: 'size (px)' },
          fontWeight: {
            value: initial.fontWeight,
            min: 400,
            max: 900,
            step: 50,
            label: 'weight',
          },
          letterSpacing: {
            value: initial.letterSpacing,
            min: -0.12,
            max: 0.08,
            step: 0.005,
            label: 'letter spacing',
          },
          gap: { value: initial.gap, min: 4, max: 48, step: 1, label: 'gap between words' },
        },
        { collapsed: false },
      ),
      'Letter enter': folder(
        {
          letterDuration: {
            value: initial.letterDuration,
            min: 0.15,
            max: 1.8,
            step: 0.05,
            label: 'duration',
          },
          letterStagger: {
            value: initial.letterStagger,
            min: 0,
            max: 0.2,
            step: 0.005,
            label: 'stagger',
          },
          wordDelay: {
            value: initial.wordDelay,
            min: 0,
            max: 1.2,
            step: 0.05,
            label: 'delay before 2nd word',
          },
          yPercent: {
            value: initial.yPercent,
            min: 40,
            max: 160,
            step: 5,
            label: 'slide up from (y%)',
          },
          enterScale: {
            value: initial.enterScale,
            min: 1,
            max: 1.8,
            step: 0.02,
            label: 'start zoom (scale)',
          },
          letterEase: {
            value: initial.letterEase,
            options: [
              'expo.out',
              'expo.inOut',
              'power3.out',
              'power4.out',
              'power2.inOut',
              'sine.out',
              'none',
            ],
            label: 'ease',
          },
        },
        { collapsed: false },
      ),
      Swap: folder(
        {
          swapDelay: {
            value: initial.swapDelay,
            min: 0,
            max: 2,
            step: 0.05,
            label: 'pause before swap',
          },
          swapDuration: {
            value: initial.swapDuration,
            min: 0.2,
            max: 2.5,
            step: 0.05,
            label: 'swap duration',
          },
          swapEase: {
            value: initial.swapEase,
            options: ['expo.inOut', 'power3.inOut', 'power2.inOut', 'sine.inOut', 'none'],
            label: 'swap ease',
          },
          swapY: {
            value: initial.swapY,
            min: 0,
            max: 60,
            step: 1,
            label: 'swap arc (px)',
          },
        },
        { collapsed: false },
      ),
      Play: folder(
        {
          Replay: button(() => setReplayKey((k) => k + 1)),
          Remember: button(() => {
            try {
              const raw = JSON.stringify(valsRef.current)
              localStorage.setItem(STORAGE, raw)
              localStorage.setItem(`${STORAGE}:remember`, raw)
            } catch {
              /* ignore */
            }
          }),
          Revert: button(() => {
            try {
              const raw = localStorage.getItem(`${STORAGE}:remember`)
              if (!raw) return
              localStorage.setItem(STORAGE, raw)
              window.location.reload()
            } catch {
              /* ignore */
            }
          }),
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  valsRef.current = vals as PlayDefaults

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(vals))
    } catch {
      /* ignore */
    }
  }, [vals])

  const run = useCallback(() => {
    const lockup = lockupRef.current
    const aEl = wordARef.current
    const bEl = wordBRef.current
    const commaEl = commaRef.current
    if (!lockup || !aEl || !bEl) return

    const v = valsRef.current
    const aChars = aEl.querySelectorAll<HTMLElement>('[data-char]')
    const bChars = bEl.querySelectorAll<HTMLElement>('[data-char]')
    if (!aChars.length || !bChars.length) return

    tlRef.current?.kill()

    gsap.set([aEl, bEl], { clearProps: 'x,y' })
    gsap.set(aEl, { x: 0, y: 0 })
    gsap.set(bEl, { x: 0, y: 0 })
    gsap.set(aChars, { yPercent: v.yPercent, opacity: 0, willChange: 'transform' })
    gsap.set(bChars, { yPercent: v.yPercent, opacity: 0, willChange: 'transform' })
    gsap.set(lockup, { scale: v.enterScale, transformOrigin: '50% 50%' })
    if (commaEl) {
      gsap.set(commaEl, { opacity: v.showComma ? 1 : 0, scale: 1, width: 'auto' })
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.to(
      lockup,
      {
        scale: 1,
        duration: v.letterDuration * 1.35 + v.wordDelay + v.letterDuration,
        ease: v.letterEase,
      },
      0,
    )

    tl.to(
      aChars,
      {
        yPercent: 0,
        opacity: 1,
        duration: v.letterDuration,
        stagger: v.letterStagger,
        ease: v.letterEase,
      },
      0,
    )

    tl.to(
      bChars,
      {
        yPercent: 0,
        opacity: 1,
        duration: v.letterDuration,
        stagger: v.letterStagger,
        ease: v.letterEase,
      },
      `+=${v.wordDelay}`,
    )

    const aLeft = aEl.offsetLeft
    const bLeft = bEl.offsetLeft
    const aTargetX = bLeft - aLeft
    const bTargetX = aLeft - bLeft

    const swapAt = `+=${v.swapDelay}`

    if (commaEl && v.showComma) {
      tl.to(
        commaEl,
        {
          opacity: 0,
          scale: 0.6,
          duration: v.swapDuration * 0.35,
          ease: 'power2.in',
        },
        swapAt,
      )
    }

    tl.to(
      aEl,
      {
        x: aTargetX,
        y: v.swapY,
        duration: v.swapDuration,
        ease: v.swapEase,
      },
      swapAt,
    )
    tl.to(
      bEl,
      {
        x: bTargetX,
        y: -v.swapY,
        duration: v.swapDuration,
        ease: v.swapEase,
      },
      '<',
    )
    tl.to(
      [aEl, bEl],
      {
        y: 0,
        duration: v.swapDuration * 0.45,
        ease: v.swapEase,
      },
      '>-0.15',
    )
  }, [])

  useGSAP(
    () => {
      const id = requestAnimationFrame(() => run())
      return () => {
        cancelAnimationFrame(id)
        tlRef.current?.kill()
      }
    },
    {
      scope: rootRef,
      dependencies: [replayKey, vals],
    },
  )

  const lettersA = splitLetters(String(vals.wordA || 'MAXIMUS'))
  const lettersB = splitLetters(String(vals.wordB || 'ZACHARY'))

  const wordStyle = {
    fontFamily: 'var(--font-nhg), system-ui, sans-serif',
    fontSize: vals.fontSize,
    fontWeight: vals.fontWeight,
    letterSpacing: `${vals.letterSpacing}em`,
    lineHeight: 1,
    color: '#1a1612',
  } as const

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <p className="mb-4 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
        Motion playground · open Leva · hit Replay to re-run
      </p>

      <div
        ref={lockupRef}
        className="inline-flex flex-wrap items-baseline will-change-transform"
        style={{ gap: vals.gap }}
      >
        <span ref={wordARef} className="inline-flex overflow-hidden" style={wordStyle}>
          {lettersA.map(({ ch, key }) => (
            <span key={key} data-char className="inline-block">
              {ch}
            </span>
          ))}
        </span>

        {vals.showComma ? (
          <span
            ref={commaRef}
            className="inline-block origin-center"
            style={{
              ...wordStyle,
              marginLeft: vals.gap * -0.35,
              marginRight: vals.gap * 0.15,
            }}
            aria-hidden
          >
            ,
          </span>
        ) : null}

        <span ref={wordBRef} className="inline-flex overflow-hidden" style={wordStyle}>
          {lettersB.map(({ ch, key }) => (
            <span key={key} data-char className="inline-block">
              {ch}
            </span>
          ))}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setReplayKey((k) => k + 1)}
        className="mt-8 rounded-full border border-espresso/15 bg-white/70 px-4 py-2 font-nhg text-[12px] text-espresso"
      >
        Replay animation
      </button>
    </div>
  )
}
