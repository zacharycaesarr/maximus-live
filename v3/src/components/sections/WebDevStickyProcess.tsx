'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'
import { BuildSiteCanvas } from '@/components/sections/BuildSiteCanvas'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type StickyStep = {
  id: string
  label: string
  heading: string
  body: string
  bullets: string[]
  ctaLabel?: string
  ctaHref?: string
}

type Props = {
  eyebrow: string
  title: string
  steps: StickyStep[]
  mediaSide?: 'left' | 'right'
}

/**
 * How we build.
 * Desktop: stage pinned left, four step blocks scroll on the right.
 * Mobile: one full-height sticky stage. Window on top, step text under it,
 * scroll snaps to each step.
 */
export default function WebDevStickyProcess({ eyebrow, title, steps, mediaSide = 'left' }: Props) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const deskCanvas = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLElement | null)[]>([])
  const mobileTrack = useRef<HTMLDivElement>(null)
  const n = steps.length

  // ---------- desktop ----------
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const pinEl = deskCanvas.current
        const pin = pinEl && !reduced
          ? ScrollTrigger.create({
              trigger: section,
              start: 'top top+=88',
              end: 'bottom bottom-=40',
              pin: pinEl,
              pinSpacing: false,
              anticipatePin: 1,
            })
          : null

        const triggers = stepRefs.current.filter(Boolean).map((el, i) =>
          ScrollTrigger.create({
            trigger: el as HTMLElement,
            start: 'top 58%',
            end: 'bottom 42%',
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          }),
        )
        return () => {
          pin?.kill()
          triggers.forEach((t) => t.kill())
        }
      })

      // ---------- mobile: progress → step, plus snap ----------
      mm.add('(max-width: 767px)', () => {
        const track = mobileTrack.current
        if (!track) return
        let snapTimer: number | undefined

        const st = ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (n - 1))
            setActive((a) => (a === idx ? a : idx))
            if (reduced) return
            window.clearTimeout(snapTimer)
            snapTimer = window.setTimeout(() => {
              // snap to nearest step when the user stops
              const target = self.start + (idx / (n - 1)) * (self.end - self.start)
              const cur = window.scrollY
              if (Math.abs(cur - target) < 6) return
              const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis
              if (lenis) lenis.scrollTo(target, { duration: 0.65 })
              else window.scrollTo({ top: target, behavior: 'smooth' })
            }, 140)
          },
        })
        return () => {
          window.clearTimeout(snapTimer)
          st.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [n, reduced] },
  )

  // keep ScrollTrigger honest after fonts/images settle
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => window.clearTimeout(t)
  }, [])

  const step = steps[active] ?? steps[0]

  return (
    <section ref={sectionRef} id="how-we-build" className="relative border-t border-espresso/8 bg-[#f7f7f5]">
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <Reveal>
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">{eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
            {title}
          </h2>
        </Reveal>
      </div>

      {/* ================= DESKTOP ================= */}
      <div
        className={cn(
          'mx-auto hidden max-w-6xl gap-12 px-6 pb-10 md:grid md:grid-cols-2 md:gap-16 md:pb-16',
          mediaSide === 'right' && 'md:[direction:rtl] md:[&>*]:[direction:ltr]',
        )}
      >
        <div ref={deskCanvas} className="relative self-start pt-6">
          <div className="w-full max-w-[520px]">
            <BuildSiteCanvas activeStep={active} reducedMotion={!!reduced} />
            <StepDots n={n} active={active} className="mt-6" />
          </div>
        </div>

        <div>
          {steps.map((s, i) => (
            <article
              key={s.id}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className="flex min-h-[88vh] flex-col justify-center border-b border-espresso/8 py-20 last:border-b-0"
            >
              <p className="font-nhg text-[11px] uppercase tracking-[0.16em] text-espresso/35">
                Step {String(i + 1).padStart(2, '0')} · {s.label}
              </p>
              <h3
                data-magnetic
                className={cn(
                  'mt-3 inline-block max-w-md rounded-[10px] font-tiempos text-[clamp(1.6rem,3vw,2.25rem)] font-light leading-tight text-espresso transition-opacity duration-300',
                  active === i ? 'opacity-100' : 'opacity-40',
                )}
              >
                {s.heading}
              </h3>
              <p className="mt-4 max-w-md font-nhg text-[15px] leading-relaxed text-espresso/55">{s.body}</p>
              {s.bullets.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="font-nhg text-sm text-espresso/45">
                      · {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.ctaLabel && s.ctaHref && (
                <Link
                  to={s.ctaHref}
                  data-magnetic
                  className="mt-8 inline-flex w-fit items-center gap-1.5 rounded-[10px] border border-espresso/15 bg-white/70 px-4 py-2.5 font-nhg text-[13px] text-espresso no-underline"
                >
                  {s.ctaLabel}
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div ref={mobileTrack} className="relative md:hidden" style={{ height: `${n * 100}svh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+92px)] pt-[84px]">
          {/* window */}
          <div className="mx-auto w-full max-w-[360px]">
            <BuildSiteCanvas activeStep={active} reducedMotion={!!reduced} />
          </div>

          {/* text sits under the window, swaps per step */}
          <div className="relative mt-6 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-0"
              >
                <p className="font-nhg text-[10px] uppercase tracking-[0.18em] text-espresso/40">
                  {String(active + 1).padStart(2, '0')} · {step.label}
                </p>
                <h3 className="mt-2 font-tiempos text-[1.55rem] font-light leading-[1.1] text-espresso">{step.heading}</h3>
                <p className="mt-3 max-w-[20rem] font-nhg text-[14px] leading-relaxed text-espresso/55">{step.body}</p>
                {step.ctaLabel && step.ctaHref && (
                  <Link
                    to={step.ctaHref}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-espresso/15 bg-white/70 px-4 py-2 font-nhg text-[12px] text-espresso no-underline"
                  >
                    {step.ctaLabel}
                    <ArrowUpRight size={13} />
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <StepDots n={n} active={active} className="mt-auto" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-2">
        <div className="h-px w-full bg-espresso/10" />
      </div>
    </section>
  )
}

function StepDots({ n, active, className }: { n: number; active: number; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1 rounded-full transition-all duration-400',
            i === active ? 'w-7 bg-espresso' : 'w-2 bg-espresso/20',
          )}
        />
      ))}
      <span className="ml-3 font-nhg text-[10px] uppercase tracking-[0.14em] text-espresso/35">
        {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
      </span>
    </div>
  )
}
