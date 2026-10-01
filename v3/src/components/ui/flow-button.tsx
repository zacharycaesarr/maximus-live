import type { ReactNode, MouseEvent, FocusEvent, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetStartedHover } from '@/context/GetStartedHoverContext'

type FlowButtonProps = {
  text?: string
  href?: string
  variant?: 'outline' | 'filled'
  className?: string
  icon?: ReactNode
  /** When true, drives the hand Lottie hover/tap interaction */
  getStartedTrigger?: boolean
  /** Hero arms this after Get Started finishes entering */
  ctaArmed?: boolean
  /** Smooth in-page scroll (e.g. Lenis) instead of hard jump */
  onNavigate?: (href: string) => void
}

function isCoarsePointer() {
  try {
    return window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches
  } catch {
    return false
  }
}

/**
 * From 21st.dev @xubohuah/flow-button
 * Get Started hover uses live getBoundingClientRect so parallax tilt
 * does not break hand activation.
 */
export function FlowButton({
  text = 'Modern Button',
  href,
  variant = 'outline',
  className,
  icon,
  getStartedTrigger = false,
  ctaArmed = true,
  onNavigate,
}: FlowButtonProps) {
  const filled = variant === 'filled'
  const hover = useGetStartedHover()
  const elRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
  const activeRef = useRef(hover.active)
  activeRef.current = hover.active

  useEffect(() => {
    if (!getStartedTrigger || isCoarsePointer()) return undefined

    const onMove = (e: PointerEvent) => {
      const el = elRef.current
      if (!el) return
      // Stay quiet until hero arms the Get Started CTA (after it finishes animating in)
      if (el.getAttribute('data-cta-armed') !== '1') return
      const r = el.getBoundingClientRect()
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      if (inside) hover.activate()
      else if (activeRef.current) hover.deactivate()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [getStartedTrigger, hover.activate, hover.deactivate, ctaArmed])

  const classes = cn(
    'group relative inline-flex items-center gap-1 overflow-hidden rounded-[10px] border-[1.5px] px-8 py-3 font-nhg text-sm font-medium cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[10px] active:scale-[0.95]',
    filled
      ? 'relative z-[12] border-transparent bg-home-acid text-home-on-light hover:border-transparent hover:bg-home-acid hover:text-home-on-dark'
      : 'border-home-line/50 bg-transparent text-home-on-dark hover:text-home-on-dark',
    className,
  )

  const onClick = (e: MouseEvent) => {
    if (getStartedTrigger) {
      if (isCoarsePointer() && !hover.active) {
        e.preventDefault()
        hover.activate()
        return
      }
      if (isCoarsePointer() && hover.active) {
        window.setTimeout(() => hover.deactivate(), 120)
      }
    }
    if (href && onNavigate && href.startsWith('#')) {
      e.preventDefault()
      onNavigate(href)
    }
  }

  const bindHover = getStartedTrigger
    ? {
        onFocus: (_e: FocusEvent) => {
          if (!ctaArmed) return
          hover.activate()
        },
        onBlur: (_e: FocusEvent) => {
          if (isCoarsePointer()) return
          hover.deactivate()
        },
        onClick,
      }
    : { onClick }

  const inner = (
    <>
      <ArrowRight className="absolute left-[-25%] z-[9] h-4 w-4 fill-none stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-white" />

      <span className="relative z-[1] flex -translate-x-3 items-center gap-2 transition-all duration-[800ms] ease-out group-hover:translate-x-3">
        {icon}
        {text}
      </span>

      <span
        className={cn(
          'absolute left-1/2 top-1/2 z-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#050505] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100',
          filled && 'bg-[#050505]',
        )}
      />

      <ArrowRight className="absolute right-4 z-[9] h-4 w-4 fill-none stroke-current transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-white" />
    </>
  )

  if (href) {
    return (
      <a
        ref={elRef as RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        style={{ textDecoration: 'none' }}
        data-get-started-btn={getStartedTrigger ? '1' : undefined}
        data-cta-armed={getStartedTrigger ? (ctaArmed ? '1' : '0') : undefined}
        {...bindHover}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={elRef as RefObject<HTMLButtonElement>}
      type="button"
      className={classes}
      data-get-started-btn={getStartedTrigger ? '1' : undefined}
      data-cta-armed={getStartedTrigger ? (ctaArmed ? '1' : '0') : undefined}
      {...bindHover}
    >
      {inner}
    </button>
  )
}
