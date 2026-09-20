'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
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

      {/* mobile scroll stage */}
      <div className="md:hidden">
        <MobilePhoneScroll phones={phones} reduced={!!reduced} />
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

function MobilePhoneScroll({
  phones,
  reduced,
}: {
  phones: PhoneImage[]
  reduced: boolean
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [flashed, setFlashed] = useState(false)
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  })

  // 0–0.2 hold large, 0.2–0.55 shrink+move, 0.55–1 settle + copy
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.55, 1], [1.15, 1.15, 0.72, 0.72])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.55, 1], [40, 40, -80, -80])
  const flashOp = useTransform(scrollYProgress, [0.18, 0.22, 0.28], [0, 1, 0])
  const copyOp = useTransform(scrollYProgress, [0.5, 0.7], [0, 1])
  const copyY = useTransform(scrollYProgress, [0.5, 0.7], [24, 0])

  useEffect(() => {
    if (reduced) return
    const unsub = scrollYProgress.on('change', (v) => {
      if (v > 0.2 && !flashed) setFlashed(true)
    })
    return () => unsub()
  }, [scrollYProgress, flashed, reduced])

  if (reduced) {
    return (
      <div className="px-6 py-16">
        <p className="font-nhg text-[11px] uppercase tracking-[0.18em] text-espresso/40">
          Built for phones first
        </p>
        <h2 className="mt-3 font-tiempos text-[2rem] font-light text-espresso">Mobile-first.</h2>
        <div className="mt-8 flex justify-center">
          <PhoneMockups images={phones} />
        </div>
        <AccordionBlock />
      </div>
    )
  }

  return (
    <div ref={stageRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <motion.div style={{ scale, y }} className="relative z-10">
          <PhoneMockups images={phones} bare />
          {/* screenshot flash */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 rounded-[2.4rem] bg-white"
            style={{ opacity: flashOp }}
            aria-hidden
          />
        </motion.div>

        <motion.div style={{ opacity: copyOp, y: copyY }} className="relative z-10 mt-6 max-w-sm text-center">
          <p className="font-nhg text-[11px] uppercase tracking-[0.18em] text-espresso/40">
            Built for phones first
          </p>
          <h2 className="mt-2 font-tiempos text-[1.85rem] font-light leading-tight text-espresso">
            Mobile-first. Then everything else.
          </h2>
          <p className="mt-3 font-nhg text-sm leading-relaxed text-espresso/55">
            Most visitors land on a phone. We design that screen first.
          </p>
        </motion.div>
      </div>

      {/* accordion after the sticky stage ends */}
      <div className="relative z-20 bg-[#f3f1ec] px-6 pb-16 pt-4">
        <AccordionBlock />
      </div>
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
