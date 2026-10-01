import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from 'react'
import { cn } from '@/lib/utils'

export type StretchCurve = 'ramp' | 'peak' | 'valley' | 'tail' | 'flat' | 'custom'
export type StretchFont = 'roboto-flex' | 'mona-sans'

type StretchTextProps = {
  text: string
  as?: ElementType
  className?: string
  baseWidth?: number
  peakWidth?: number
  curve?: StretchCurve | string
  customWidths?: string
  weight?: number
  letterSpacing?: number
  opticalSize?: number
  stretchFont?: StretchFont
  animateIn?: boolean
  stagger?: number
  hoverBreathe?: boolean
  /** how much extra width on hover (Leva-friendly) */
  hoverBoost?: number
}

const FONT_STACK: Record<StretchFont, string> = {
  'roboto-flex': '"Roboto Flex", "Neue Haas Grotesk Display", sans-serif',
  'mona-sans': '"Mona Sans", "Neue Haas Grotesk Display", sans-serif',
}

const FONT_AXES: Record<StretchFont, { min: number; max: number; hasOpsz: boolean }> = {
  'roboto-flex': { min: 25, max: 151, hasOpsz: true },
  'mona-sans': { min: 75, max: 125, hasOpsz: false },
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function letterWidths(
  count: number,
  base: number,
  peak: number,
  curve: StretchCurve,
  custom: string,
): number[] {
  if (count <= 0) return []
  if (curve === 'flat') return Array.from({ length: count }, () => base)
  if (curve === 'custom') {
    const parts = custom
      .split(/[,\s]+/)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n))
    if (parts.length === 0) return Array.from({ length: count }, () => base)
    return Array.from({ length: count }, (_, i) => parts[Math.min(i, parts.length - 1)])
  }
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1)
    let k = t
    if (curve === 'ramp') k = t
    else if (curve === 'tail') k = t * t
    else if (curve === 'peak') k = 1 - Math.abs(t * 2 - 1)
    else if (curve === 'valley') k = Math.abs(t * 2 - 1)
    return base + (peak - base) * k
  })
}

export function normalizeCurve(raw: unknown): StretchCurve {
  const s = String(raw ?? 'ramp').toLowerCase()
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
  baseWidth = 45,
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
  hoverBoost = 22,
}: StretchTextProps) {
  const axes = FONT_AXES[stretchFont]
  const curveNorm = normalizeCurve(curve)
  const letters = Array.from(text)
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])
  // On phones the stretch is easy to miss — push the range wider so it still reads.
  const rawBase = Number(baseWidth) || 45
  const rawPeak = Number(peakWidth) || 151
  const base = clamp(narrow ? Math.min(rawBase, 38) : rawBase, axes.min, axes.max)
  const peak = clamp(narrow ? Math.max(rawPeak, 145) : rawPeak, axes.min, axes.max)
  const widths = letterWidths(letters.length, base, peak, curveNorm, String(customWidths ?? '')).map(
    (w) => clamp(w, axes.min, axes.max),
  )
  const wght = clamp(Number(weight) || 720, 100, 1000)
  const opsz = clamp(Number(opticalSize) || 96, 8, 144)
  const boost = clamp(Number(hoverBoost) || 22, 0, 60)

  const rootRef = useRef<HTMLElement>(null)
  const hoverRef = useRef(false)
  const leaveTimer = useRef(0)
  const skipIntro = useRef(false)
  const widthsKey = `${curveNorm}|${widths.join(',')}|${wght}|${opsz}|${stretchFont}|${boost}`

  const fvs = (w: number) =>
    axes.hasOpsz
      ? `"wght" ${wght}, "wdth" ${w}, "opsz" ${opsz}`
      : `"wght" ${wght}, "wdth" ${w}`

  const activeWidths = () =>
    hoverRef.current
      ? widths.map((w) => clamp(w + boost, axes.min, axes.max))
      : widths

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

  // ALWAYS apply current Leva widths. Respect hover so layout updates don't kill hover.
  useLayoutEffect(() => {
    skipIntro.current = true
    paint(activeWidths(), false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthsKey, letterSpacing])

  useEffect(() => {
    document.fonts.load(`${wght} 64px "Roboto Flex"`).catch(() => {})
    if (!animateIn) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = rootRef.current
    if (!root) return

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

  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  const onEnter = () => {
    if (!hoverBreathe) return
    if (window.matchMedia('(hover: none)').matches) return
    window.clearTimeout(leaveTimer.current)
    hoverRef.current = true
    paint(activeWidths(), true)
  }
  const onLeave = () => {
    if (!hoverBreathe) return
    hoverRef.current = false
    paint(widths, true)
    window.clearTimeout(leaveTimer.current)
    leaveTimer.current = window.setTimeout(() => {
      if (!hoverRef.current) paint(widths, false)
    }, 900)
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
