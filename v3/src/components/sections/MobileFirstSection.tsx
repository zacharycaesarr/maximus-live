'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import PhoneBeforeAfterCarousel, {
  type PhoneBeforeAfterSlide,
} from '@/components/ui/PhoneBeforeAfterCarousel'
import { Reveal } from '@/components/ui/reveal'
import HeroBottomBlend from '@/components/ui/HeroBottomBlend'
import { cn } from '@/lib/utils'

const MOBILE_SUB =
  'More than 63% of global web traffic now starts on mobile, so we design for that screen first.'

const SERVICES = [
  {
    id: 'marketing',
    title: 'Marketing sites',
    body: 'Clean lead machines. Clear offers, fast load, mobile-first from the first pixel.',
  },
  {
    id: 'portals',
    title: 'Client portals',
    body: 'Logged-in spaces for status, files, and next steps. Less email ping-pong.',
  },
  {
    id: 'rebuilds',
    title: 'Site rebuilds',
    body: 'Dated templates rebuilt into something people actually trust and click.',
  },
  {
    id: 'cms',
    title: 'CMS + integrations',
    body: 'Forms, booking, CRM, analytics. Wired so you can edit without breaking it.',
  },
]

type MobileFirstSectionProps = {
  slides: PhoneBeforeAfterSlide[]
}

/**
 * Desktop: accordion left + phone rising from blur on the right.
 * Phone: after first, mouse-track slot peeks at before. Slides slide between builds.
 */
export default function MobileFirstSection({ slides }: MobileFirstSectionProps) {
  const [open, setOpen] = useState(SERVICES[0].id)
  const reduced = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const apply = () => setIsDesktop(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <section className="relative bg-[#f3f1ec]">
      <HeroBottomBlend toColor="#f7f7f5" height={120} className="z-[2]" />
      <div className="mx-auto hidden max-w-6xl gap-12 px-6 py-20 md:grid md:grid-cols-2 md:items-center md:py-28 lg:gap-16">
        <div>
          <Reveal delay={0}>
            <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
              Built for phones first
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-tiempos text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] tracking-tight text-espresso">
              Mobile-first.
              <br />
              <span className="text-espresso/45">Then everything else.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 max-w-md font-nhg text-[15px] leading-relaxed text-espresso">
              {MOBILE_SUB}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 border-t border-espresso/12">
              {SERVICES.map((s) => {
                const isOpen = open === s.id
                return (
                  <li key={s.id} className="border-b border-espresso/12">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? '' : s.id)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        data-magnetic
                        className={cn(
                          'inline-block rounded-[8px] px-1.5 py-0.5 font-nhg text-[13px] font-medium uppercase tracking-[0.12em] transition-colors',
                          isOpen ? 'text-espresso' : 'text-espresso/50',
                        )}
                      >
                        {s.title}
                      </span>
                      {isOpen ? (
                        <Minus size={14} className="shrink-0 text-espresso/40" />
                      ) : (
                        <Plus size={14} className="shrink-0 text-espresso/30" />
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 pr-8 font-nhg text-sm leading-relaxed text-espresso">
                            {s.body}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>

        {isDesktop === true ? (
          <DesktopPhoneRise slides={slides} reduced={!!reduced} />
        ) : null}
      </div>

      <div className="md:hidden">
        <div className="overflow-x-clip px-5 py-14">
          <Reveal delay={0}>
            <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
              Built for phones first
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 font-tiempos text-[1.85rem] font-light leading-tight text-espresso">
              Mobile-first.
              <span className="text-espresso/45"> Then everything else.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-3 max-w-sm font-switzer text-[14px] font-medium leading-relaxed text-espresso">
              {MOBILE_SUB}
            </p>
          </Reveal>
          <div className="mt-8 flex justify-center">
            {isDesktop === false ? (
              <PhoneBeforeAfterCarousel slides={slides} startId="northline" />
            ) : null}
          </div>
          <AccordionBlock />
        </div>
      </div>
    </section>
  )
}

function DesktopPhoneRise({
  slides,
  reduced,
}: {
  slides: PhoneBeforeAfterSlide[]
  reduced: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex justify-center">
      <motion.div
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
        animate={inView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <PhoneBeforeAfterCarousel slides={slides} startId="northline" />
      </motion.div>
    </div>
  )
}

function AccordionBlock() {
  const [open, setOpen] = useState(SERVICES[0].id)
  return (
    <ul className="mt-6 border-t border-espresso/12">
      {SERVICES.map((s) => {
        const isOpen = open === s.id
        return (
          <li key={s.id} className="border-b border-espresso/12">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? '' : s.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span
                className={cn(
                  'font-nhg text-[12px] font-medium uppercase tracking-[0.12em]',
                  isOpen ? 'text-espresso' : 'text-espresso/50',
                )}
              >
                {s.title}
              </span>
              {isOpen ? (
                <Minus size={14} className="text-espresso/40" />
              ) : (
                <Plus size={14} className="text-espresso/30" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 font-nhg text-sm leading-relaxed text-espresso">{s.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
