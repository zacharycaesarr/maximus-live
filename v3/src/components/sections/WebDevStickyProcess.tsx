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
 * Desktop: stage pinned left, steps scroll right.
 * Pin ends at the last-step CTA so the window never rides into testimonials.
 * No overflow clip on this section — that broke pin end + ate the Safari shadow.
 */
export default function WebDevStickyProcess({ eyebrow, title, steps, mediaSide = 'left' }: Props) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const deskCanvas = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLElement | null)[]>([])
  const mobileTrack = useRef<HTMLDivElement>(null)
  const n = steps.length

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const pinEl = deskCanvas.current
        const cta = section.querySelector('[data-build-cta]') as HTMLElement | null
        const lastStep = section.querySelector('[data-build-step-last]') as HTMLElement | null
        const endEl = cta || lastStep

        const pin =
          pinEl && !reduced
            ? ScrollTrigger.create({
                trigger: section,
                start: 'top top+=88',
                endTrigger: endEl || section,
                // unpin as soon as the Talk through button sits near the lower third
                end: endEl ? 'bottom bottom-=80' : 'bottom bottom-=280',
                pin: pinEl,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              })
            : null

        const triggers = stepRefs.current.filter(Boolean).map((el, i) =>
          ScrollTrigger.create({
            trigger: el as HTMLElement,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          }),
        )
        return () => {
          pin?.kill()
          triggers.forEach((t) => t.kill())
        }
      })

      mm.add('(max-width: 767px)', () => {
        const track = mobileTrack.current
        if (!track) return
        const st = ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const idx = Math.min(n - 1, Math.max(0, Math.round(self.progress * (n - 1))))
            setActive((a) => (a === idx ? a : idx))
          },
        })
        return () => st.kill()
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [n, reduced] },
  )

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => window.clearTimeout(t)
  }, [])

  const step = steps[active] ?? steps[0]

  return (
    <section
      ref={sectionRef}
      id="how-we-build"
      className="relative border-t border-espresso/8 bg-[#f7f7f5]"
    >
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <Reveal>
          <p className="font-switzer text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
            {title}
          </h2>
        </Reveal>
      </div>

      <div
        className={cn(
          'mx-auto hidden max-w-6xl gap-10 px-6 pb-16 md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:pb-20 lg:gap-14',
          mediaSide === 'right' && 'md:[direction:rtl] md:[&>*]:[direction:ltr]',
        )}
      >
        {/* padding keeps Safari shadow; no overflow-hidden here */}
        <div ref={deskCanvas} className="relative self-start pt-6">
          <div className="w-full max-w-none px-3 pb-8 pt-2 md:max-w-[540px] lg:max-w-[600px]">
            <BuildSiteCanvas activeStep={active} reducedMotion={!!reduced} />
            <StepDots n={n} active={active} className="mt-6" />
          </div>
        </div>

        <div>
          {steps.map((s, i) => (
            <article
              key={s.id}
              data-build-step=""
              {...(i === n - 1 ? { 'data-build-step-last': '' } : {})}
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className={cn(
                'flex flex-col justify-center border-b border-espresso/8 py-16 last:border-b-0',
                i === n - 1 ? 'min-h-[40vh] pb-12' : 'min-h-[80vh]',
              )}
            >
              <p className="font-switzer text-[11px] uppercase tracking-[0.16em] text-espresso/40">
                Step {String(i + 1).padStart(2, '0')} · {s.label}
              </p>
              <h3
                data-magnetic
                className={cn(
                  'mt-3 inline-block max-w-md font-tiempos text-[clamp(1.6rem,3vw,2.25rem)] font-light leading-tight text-espresso transition-opacity duration-300',
                  active === i ? 'opacity-100' : 'opacity-40',
                )}
              >
                {s.heading}
              </h3>
              <p className="mt-4 max-w-md font-switzer text-[15px] font-medium leading-relaxed text-espresso">
                {s.body}
              </p>
              {s.bullets.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="font-switzer text-sm text-espresso">
                      · {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.ctaLabel && s.ctaHref && (
                <Link
                  to={s.ctaHref}
                  data-magnetic
                  data-build-cta=""
                  className="mt-8 inline-flex w-fit items-center gap-1.5 rounded-[11px] border border-white/50 bg-white/55 px-4 py-2.5 font-switzer text-[13px] font-medium text-espresso no-underline shadow-[0_8px_24px_-12px_rgba(44,37,32,0.35)] backdrop-blur-[6px]"
                >
                  {s.ctaLabel}
                  <ArrowUpRight size={14} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>

      <div
        ref={mobileTrack}
        className="relative md:hidden"
        style={{ height: `${n * 90}svh` }}
      >
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center px-5 pb-[calc(env(safe-area-inset-bottom)+88px)] pt-[72px]">
          <div className="mx-auto w-full max-w-[300px] shrink-0">
            <BuildSiteCanvas activeStep={active} reducedMotion={!!reduced} />
          </div>

          <div className="relative mx-auto mt-5 min-h-[9.5rem] w-full max-w-[22rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-0"
              >
                <p className="font-switzer text-[10px] uppercase tracking-[0.18em] text-espresso/40">
                  {String(active + 1).padStart(2, '0')} · {step.label}
                </p>
                <h3 className="mt-2 font-tiempos text-[1.45rem] font-light leading-[1.1] text-espresso">
                  {step.heading}
                </h3>
                <p className="mt-2 font-switzer text-[13px] font-medium leading-relaxed text-espresso">
                  {step.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <StepDots n={n} active={active} className="mt-4" />
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
    </div>
  )
}
