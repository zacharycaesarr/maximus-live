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
 * 21st motion-footer cherry-pick: gradient headline + magnetic glass pills.
 * Theme: cream/mocha, NHG. No marquee / app-store / scroll-to-reveal wrapper.
 */
export default function MotionGetStarted() {
  const t = useFooterTuner()
  const wrapRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return undefined
    const ctx = gsap.context(() => {
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
    return () => ctx.revert()
  }, [])

  if (!t.enabled) return null

  const pill =
    'rounded-full border border-white/20 bg-white/90 px-8 py-4 font-nhg text-sm font-semibold text-espresso shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white md:px-10 md:py-5 md:text-base'

  return (
    <section
      id="get-started"
      ref={wrapRef}
      className="relative overflow-visible px-5 py-20 md:py-28"
      aria-label="Get started"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[min(80vh,640px)] -translate-y-1/2 opacity-90 blur-[90px]"
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 50%, rgba(196,165,116,0.28) 0%, rgba(26,22,18,0.2) 42%, rgba(26,22,18,0) 78%)',
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center overflow-visible text-center">
        <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
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
            <StartProjectIcon size={22} className="text-espresso/70" />
            {t.primaryLabel}
          </Magnetic>
          <Magnetic as={Link} to={t.secondaryHref} className={cn(pill, 'inline-flex items-center gap-3 no-underline')}>
            <AccountIcon size={22} className="text-espresso/70" />
            {t.secondaryLabel}
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
