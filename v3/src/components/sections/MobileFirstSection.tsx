'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import PhoneMockups, { type PhoneImage } from '@/components/ui/phone-mockups'
import { cn } from '@/lib/utils'

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
  phones: PhoneImage[]
}

/**
 * Desktop: accordion left + phone rising from blur on the right.
 * Mobile: scroll stage — phone starts big, white flash, shrinks into place, copy appears under.
 */
export default function MobileFirstSection({ phones }: MobileFirstSectionProps) {
  const [open, setOpen] = useState(SERVICES[0].id)
  const reduced = useReducedMotion()

  return (
    <section className="relative border-t border-espresso/8 bg-[#f3f1ec]">
      {/* desktop / tablet */}
      <div className="mx-auto hidden max-w-6xl gap-12 px-6 py-20 md:grid md:grid-cols-2 md:items-center md:py-28 lg:gap-16">
        <div>
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
            Built for phones first
          </p>
          <h2 className="mt-3 font-tiempos text-[clamp(2rem,4vw,3rem)] font-light leading-[1.1] tracking-tight text-espresso">
            Mobile-first.
            <br />
            <span className="text-espresso/45">Then everything else.</span>
          </h2>
          <p className="mt-4 max-w-md font-nhg text-[15px] leading-relaxed text-espresso/55">
            Most of your visitors arrive on a phone. We design that screen first, then scale up.
          </p>

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
                        <p className="pb-4 pr-8 font-nhg text-sm leading-relaxed text-espresso/55">
                          {s.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </div>

        <DesktopPhoneRise phones={phones} reduced={!!reduced} />
      </div>

      {/* mobile: simple stack. No 220vh sticky scrub (that blanked real iPhones). */}
      <div className="md:hidden">
        <div className="overflow-x-clip px-5 py-14">
          <p className="font-serotiva text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
            Built for phones first
          </p>
          <h2 className="mt-3 font-tiempos text-[1.85rem] font-light leading-tight text-espresso">
            Mobile-first. Then everything else.
          </h2>
          <p className="mt-3 max-w-sm font-serotiva text-[14px] font-medium leading-relaxed text-espresso/55">
            Most visitors land on a phone. We design that screen first.
          </p>
          <div className="mt-8 flex justify-center">
            <PhoneMockups images={phones} />
          </div>
          <AccordionBlock />
        </div>
      </div>
    </section>
  )
}

function DesktopPhoneRise({
  phones,
  reduced,
}: {
  phones: PhoneImage[]
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
        <PhoneMockups images={phones} />
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
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 font-nhg text-sm leading-relaxed text-espresso/55">{s.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
