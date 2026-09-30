'use client'

import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, UserRound } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StartProjectIcon } from '@/components/ui/icons-footer'
import { useFooterTuner } from '@/context/FooterTunerContext'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

function Magnetic({ as: Comp = 'a', className, children, ...props }: {
  as?: ElementType
  className?: string
  children: ReactNode
  href?: string
  to?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return undefined
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .2, duration: .35, ease: 'power2.out' })
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'power3.out' })
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      gsap.killTweensOf(el)
    }
  }, [])

  return <Comp ref={ref} className={cn('cursor-pointer', className)} {...props}>{children}</Comp>
}

export default function MotionGetStarted() {
  const t = useFooterTuner()
  const wrapRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current || !contentRef.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const elements = Array.from(contentRef.current.children)
    const ctx = gsap.context(() => {
      gsap.fromTo(elements, { y: 16, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: .75, stagger: .09, ease: 'power2.out',
        scrollTrigger: { trigger: wrapRef.current, start: 'top 82%', once: true },
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  if (!t.enabled) return null

  const bookHref = t.secondaryHref === '/portal' ? 'mailto:hello@maximusreach.com' : t.secondaryHref
  const button = 'mr-closing-button inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-8 py-4 font-nhg text-sm font-semibold no-underline md:text-base'

  return (
    <section id="get-started" ref={wrapRef} className="mr-closing-cta relative z-[3] flex items-center justify-center px-5 text-center" aria-label="Get started">
      <div ref={contentRef} className="mr-closing-content relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
        <div className="mr-closing-lockup" aria-label="Maximus Reach">
          <img src="/assets/mrlogo-smooth-black-01.svg" alt="" width={32} height={32} />
          <span><b>Maximus</b><b>Reach</b></span>
        </div>
        <h2 className="mr-closing-headline m-0 text-[#142117]">
          <span>Ready to</span>
          <em>reach further?</em>
        </h2>
        <p className="mr-closing-support mb-0 mt-7 max-w-[560px] font-nhg text-[15px] leading-[1.55] text-[#405141] md:mt-9 md:text-[18px]">
          Tell us what you’re building. We’ll help shape the direction and turn it into something that moves.
        </p>
        <div className="mr-closing-actions mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:mt-11">
          <Magnetic as={Link} to={t.primaryHref} className={cn(button, 'border border-[#142117] bg-[#142117] text-[#f7f8f0] shadow-[0_18px_35px_-18px_rgba(18,36,19,.48)]')}><StartProjectIcon size={20} />Start Your Project</Magnetic>
          <Magnetic href={bookHref} className={cn(button, 'border border-[#142117]/55 bg-[#f8f8f0]/65 text-[#142117] backdrop-blur-md')}><CalendarDays size={20} />Book a Call</Magnetic>
        </div>
        <Link to={t.secondaryHref} className="mr-closing-client-link"><UserRound size={16} strokeWidth={1.8} />Existing Client?</Link>
      </div>
    </section>
  )
}
