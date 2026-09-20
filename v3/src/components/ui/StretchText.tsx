import {
  createElement,
  useLayoutEffect,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
} from 'react'
import { cn } from '@/lib/utils'

/**
 * Per-letter stretch via Roboto Flex wdth.
 * Leva always wins: every slider change snaps to the DOM immediately.
 * Intro animation is optional and never blocks live edits.
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
  customWidths?: string
  weight?: number
  letterSpacing?: number
  opticalSize?: number
  stretchFont?: StretchFont
  animateIn?: boolean
  stagger?: number
  hoverBreathe?: boolean
}

/** Leva sometimes returns the option LABEL instead of the value. Normalize. */
export function normalizeCurve(raw: unknown): StretchCurve {
  const s = String(raw ?? 'ramp').toLowerCase()
  if (s === 'ramp' || s === 'tail' || s === 'peak' || s === 'valley' || s === 'flat' || s === 'custom') {
    return s
  }
  if (s.includes('custom')) return 'custom'
  if (s.includes('tail')) return 'tail'
  if (s.includes('peak') || s.includes('middle')) return 'peak'
  if (s.includes('valley') || s.includes('ends')) return 'valley'
  if (s.includes('flat') || s.includes('same')) return 'flat'
  return 'ramp'
}

export function StretchText({
  text,
  as: Tag = 'span',
  className = '',
  baseWidth = 78,
  peakWidth = 151,
  curve = 'ramp',
  customWidths,
  weight = 720,
  letterSpacing = -0.02,
  opticalSize = 96,
  stretchFont = 'roboto-flex',
  animateIn = true,
  stagger = 0.04,
  hoverBreathe = true,
}: StretchTextProps) {
  const axes = FONT_AXES[stretchFont]
  const curveNorm = normalizeCurve(curve)
  const letters = Array.from(text)
  const base = clamp(Number(baseWidth) || 78, axes.min, axes.max)
  const peak = clamp(Number(peakWidth) || 151, axes.min, axes.max)
  const widths = letterWidths(letters.length, base, peak, curveNorm, String(customWidths ?? '')).map(
    (w) => clamp(w, axes.min, axes.max),
  )
  const wght = clamp(Number(weight) || 720, 100, 1000)
  const opsz = clamp(Number(opticalSize) || 96, 8, 144)

  const rootRef = useRef<HTMLElement>(null)
  const skipIntro = useRef(false)
  const widthsKey = `${curveNorm}|${widths.join(',')}|${wght}|${opsz}|${stretchFont}`

  const fvs = (w: number) =>
    axes.hasOpsz
      ? `"wght" ${wght}, "wdth" ${w}, "opsz" ${opsz}`
      : `"wght" ${wght}, "wdth" ${w}`

  const paint = (useWidths: number[], withTransition: boolean) => {
    const root = rootRef.current
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-letter]').forEach((el, i) => {
      const w = useWidths[Math.min(i, useWidths.length - 1)]
      el.style.transition = withTransition
        ? `font-variation-settings 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}s, font-stretch 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}s`
        : 'none'
      el.style.fontVariationSettings = fvs(w)
      el.style.fontStretch = `${w}%`
    })
  }

  // ALWAYS apply current Leva widths. Instant. Never blocked by intro.
  useLayoutEffect(() => {
    skipIntro.current = true
    paint(widths, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthsKey, letterSpacing])

  // Soft intro only on first paint if nothing has edited yet
  useEffect(() => {
    document.fonts.load(`${wght} 64px "Roboto Flex"`).catch(() => {})
    if (!animateIn) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = rootRef.current
    if (!root) return

    // brief delay: if Leva already wrote, skip
    const t0 = window.setTimeout(() => {
      if (skipIntro.current) return
      const startW = widths.map((w) => Math.max(axes.min, w - 45))
      paint(startW, false)
      void root.offsetWidth
      paint(widths, true)
      window.setTimeout(() => paint(widths, false), 1100)
    }, 40)

    return () => window.clearTimeout(t0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEnter = () => {
    if (!hoverBreathe) return
    if (window.matchMedia('(hover: none)').matches) return
    paint(
      widths.map((w) => clamp(w + 8, axes.min, axes.max)),
      true,
    )
  }
  const onLeave = () => {
    if (!hoverBreathe) return
    paint(widths, true)
    window.setTimeout(() => paint(widths, false), 600)
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
      'data-stretch-curve': curveNorm,
      'data-stretch-peak': String(peak),
      'data-stretch-base': String(base),
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
            fontFamily: FONT_STACK[stretchFont],
            fontWeight: wght,
            fontStretch: `${widths[i]}%`,
            fontVariationSettings: fvs(widths[i]),
          },
        },
        ch === ' ' ? '\u00A0' : ch,
      ),
    ),
  )
}
