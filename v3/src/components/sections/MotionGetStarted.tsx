'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AccountIcon, StartProjectIcon } from '@/components/ui/icons-footer'
import { useFooterTuner } from '@/context/FooterTunerContext'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

function Magnetic({
  as: Comp = 'a',
  className,
  children,
  ...props
}: {
  as?: ElementType
  className?: string
  children: ReactNode
  href?: string
  to?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        scale: 1.04,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
    const leave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.35)',
      })
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <Comp ref={ref} className={cn('cursor-pointer', className)} {...props}>
      {children}
    </Comp>
  )
}

/**
 * Get Started: gradient headline + magnetic pills.
 * Colors follow Homepage Colors on #home-page.
 */
export default function MotionGetStarted() {
  const t = useFooterTuner()
  const wrapRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return undefined
    const mobile = window.matchMedia('(max-width: 767px)')
    let ctx: gsap.Context | undefined
    const sync = () => {
      ctx?.revert()
      ctx = undefined
      // The scrubbed desktop reveal must be cleared when crossing into mobile.
      if (mobile.matches) return
      ctx = gsap.context(() => {
        gsap.fromTo(
          [headingRef.current, linksRef.current],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapRef.current,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 0.8,
            },
          },
        )
      }, wrapRef)
    }
    sync()
    mobile.addEventListener('change', sync)
    return () => {
      mobile.removeEventListener('change', sync)
      ctx?.revert()
    }
  }, [])

  if (!t.enabled) return null

  const pill =
    'rounded-full border border-home-line/40 bg-home-surface-light px-8 py-4 font-nhg text-sm font-semibold text-home-on-light shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors hover:border-home-line hover:opacity-95 md:px-10 md:py-5 md:text-base'

  return (
    <section
      id="get-started"
      ref={wrapRef}
      className="relative z-[2] overflow-visible px-5 py-20 md:py-28"
      aria-label="Get started"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center overflow-visible text-center">
        <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-home-muted">
          06
        </p>
        <h2
          ref={headingRef}
          className="m-0 max-w-3xl overflow-visible bg-gradient-to-b from-[#FCFAF2] via-[#E8DFD4] to-[#C4A574] bg-clip-text pb-2 font-nhg text-[clamp(2.4rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-transparent"
          style={{ paddingBottom: '0.12em' }}
        >
          {t.headline}
        </h2>

        <div ref={linksRef} className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Magnetic as={Link} to={t.primaryHref} className={cn(pill, 'inline-flex items-center gap-3 no-underline')}>
            <StartProjectIcon size={22} className="text-home-muted" />
            {t.primaryLabel}
          </Magnetic>
          <Magnetic as={Link} to={t.secondaryHref} className={cn(pill, 'inline-flex items-center gap-3 no-underline')}>
            <AccountIcon size={22} className="text-home-muted" />
            {t.secondaryLabel}
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
