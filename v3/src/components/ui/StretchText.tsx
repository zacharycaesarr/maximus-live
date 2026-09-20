import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
} from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

/**
 * Editorial per-letter stretch. Each letter gets its own wdth value
 * along a curve, so the word looks art-directed, not scaled.
 * Real variable-font axes only. No scaleX.
 *
 * Roboto Flex is self-hosted (public/fonts/RobotoFlex-Variable.woff2).
 * Live edits from Leva are applied on every render; the intro animation
 * runs once and never fights the sliders.
 */

export type StretchFont = 'roboto-flex' | 'mona-sans'
export type StretchCurve = 'ramp' | 'tail' | 'peak' | 'valley' | 'flat' | 'custom'

const FONT_STACK: Record<StretchFont, string> = {
  'roboto-flex': '"Roboto Flex", "Neue Haas Grotesk Display", system-ui, sans-serif',
  'mona-sans': '"Mona Sans", "Neue Haas Grotesk Display", system-ui, sans-serif',
}

const FONT_AXES: Record<StretchFont, { hasOpsz: boolean; min: number; max: number }> = {
  'roboto-flex': { hasOpsz: true, min: 25, max: 151 },
  'mona-sans': { hasOpsz: false, min: 75, max: 125 },
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2)

/** width per letter index along the chosen curve */
export function letterWidths(
  count: number,
  base: number,
  peak: number,
  curve: StretchCurve,
  custom?: string,
): number[] {
  if (count <= 0) return []
  if (curve === 'custom' && custom) {
    const parts = custom
      .split(/[,\s]+/)
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v))
    if (parts.length) {
      return Array.from({ length: count }, (_, i) => parts[Math.min(i, parts.length - 1)])
    }
  }
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 1 : i / (count - 1)
    let k = 0
    switch (curve) {
      case 'ramp':
        k = easeOut(t)
        break
      case 'tail':
        k = t < 0.55 ? 0 : easeOut((t - 0.55) / 0.45)
        break
      case 'peak':
        k = 1 - Math.abs(t * 2 - 1)
        break
      case 'valley':
        k = Math.abs(t * 2 - 1)
        break
      case 'flat':
      default:
        k = 1
    }
    return base + (peak - base) * k
  })
}

export type StretchTextProps = {
  text: string
  as?: ElementType
  className?: string
  baseWidth?: number
  peakWidth?: number
  curve?: StretchCurve
  /** "100,112,128,140,151" per-letter overrides when curve = custom */
  customWidths?: string
  weight?: number
  letterSpacing?: number
  opticalSize?: number
  stretchFont?: StretchFont
  /** letters expand from narrow when scrolled into view (runs once) */
  animateIn?: boolean
  stagger?: number
  hoverBreathe?: boolean
}

export function StretchText({
  text,
  as: Tag = 'span',
  className = '',
  baseWidth = 100,
  peakWidth = 140,
  curve = 'ramp',
  customWidths,
  weight = 650,
  letterSpacing = -0.01,
  opticalSize = 96,
  stretchFont = 'roboto-flex',
  animateIn = true,
  stagger = 0.045,
  hoverBreathe = true,
}: StretchTextProps) {
  const axes = FONT_AXES[stretchFont]
  const letters = Array.from(text)
  const widths = letterWidths(
    letters.length,
    clamp(baseWidth, axes.min, axes.max),
    clamp(peakWidth, axes.min, axes.max),
    curve,
    customWidths,
  ).map((w) => clamp(w, axes.min, axes.max))
  const wght = clamp(weight, 100, 1000)
  const opsz = clamp(opticalSize, 8, 144)

  const rootRef = useRef<HTMLElement>(null)
  const introDone = useRef(false)
  // latest values for the intro/hover closures
  const live = useRef({ widths, wght, opsz, axes })
  live.current = { widths, wght, opsz, axes }

  const fvs = (w: number, wg = live.current.wght, os = live.current.opsz) =>
    live.current.axes.hasOpsz
      ? `"wght" ${wg}, "wdth" ${w}, "opsz" ${os}`
      : `"wght" ${wg}, "wdth" ${w}`

  const applyLive = () => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-letter]').forEach((s, i) => {
      const w = live.current.widths[Math.min(i, live.current.widths.length - 1)]
      s.style.fontVariationSettings = fvs(w)
      s.style.fontStretch = `${w}%`
    })
  }

  // intro: runs exactly once when the word first scrolls in
  useEffect(() => {
    const root = rootRef.current
    if (!root || !animateIn || introDone.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      introDone.current = true
      return
    }
    const spans = Array.from(root.querySelectorAll<HTMLElement>('[data-letter]'))
    if (!spans.length) return

    const startW = Math.max(live.current.axes.min, live.current.widths[0] - 30)
    spans.forEach((s) => {
      s.style.fontVariationSettings = fvs(startW)
      s.style.fontStretch = `${startW}%`
    })

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || introDone.current) return
        introDone.current = true
        spans.forEach((s, i) => {
          const st = { w: startW }
          gsap.to(st, {
            w: live.current.widths[i],
            duration: 1.1,
            delay: i * stagger,
            ease: 'expo.out',
            onUpdate: () => {
              s.style.fontVariationSettings = fvs(st.w)
              s.style.fontStretch = `${st.w}%`
            },
            onComplete: applyLive,
          })
        })
        io.disconnect()
      },
      { threshold: 0.3 },
    )
    io.observe(root)
    return () => io.disconnect()
    // intentionally mount-only: intro must never re-run on Leva edits
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Leva / prop edits: always push the current values to the DOM
  // (after the intro has claimed the letters, or immediately if no intro)
  useEffect(() => {
    if (animateIn && !introDone.current) return
    applyLive()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widths.join(','), wght, opsz, stretchFont, animateIn])

  const onEnter = () => {
    if (!hoverBreathe || !rootRef.current || !introDone.current) return
    if (window.matchMedia('(hover: none)').matches) return
    rootRef.current.querySelectorAll<HTMLElement>('[data-letter]').forEach((s, i) => {
      const base = live.current.widths[i]
      const st = { w: base }
      gsap.to(st, {
        w: clamp(base + 6, live.current.axes.min, live.current.axes.max),
        duration: 0.5,
        delay: i * 0.02,
        ease: 'power2.out',
        onUpdate: () => {
          s.style.fontVariationSettings = fvs(st.w)
          s.style.fontStretch = `${st.w}%`
        },
      })
    })
  }
  const onLeave = () => {
    if (!hoverBreathe || !rootRef.current || !introDone.current) return
    rootRef.current.querySelectorAll<HTMLElement>('[data-letter]').forEach((s, i) => {
      const base = live.current.widths[i]
      const st = { w: base + 6 }
      gsap.to(st, {
        w: base,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          s.style.fontVariationSettings = fvs(st.w)
          s.style.fontStretch = `${st.w}%`
        },
      })
    })
  }

  const rootStyle: CSSProperties = {
    fontFamily: FONT_STACK[stretchFont],
    fontWeight: wght,
    fontOpticalSizing: axes.hasOpsz ? 'auto' : undefined,
    letterSpacing: `${letterSpacing}em`,
    display: 'inline-flex',
    whiteSpace: 'pre',
    textRendering: 'geometricPrecision',
    WebkitFontSmoothing: 'antialiased',
  }

  return createElement(
    Tag,
    {
      ref: rootRef,
      className: cn('stretch-text', className),
      style: rootStyle,
      'aria-label': text,
      onMouseEnter: onEnter,
      onMouseLeave: onLeave,
    },
    letters.map((ch, i) =>
      createElement(
        'span',
        {
          key: `${ch}-${i}`,
          'data-letter': '',
          'aria-hidden': true,
          style: {
            display: 'inline-block',
            fontStretch: `${widths[i]}%`,
            fontVariationSettings: fvs(widths[i], wght, opsz),
            willChange: 'font-variation-settings',
          },
        },
        ch === ' ' ? '\u00A0' : ch,
      ),
    ),
  )
}
