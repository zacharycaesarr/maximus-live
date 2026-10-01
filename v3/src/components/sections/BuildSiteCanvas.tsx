'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { Safari } from '@/components/ui/safari'

type Props = {
  activeStep: number
  reducedMotion?: boolean
  className?: string
  url?: string
}

/** stage size per step: width % of column, height as % of width */
const STAGE = [
  { w: 58, ratio: 1.0, chrome: 0.12 }, // direction: small square, barely a window
  { w: 82, ratio: 0.8, chrome: 0.75 }, // structure
  { w: 98, ratio: 0.7, chrome: 0.92 }, // trust — wider so lights + icons fit
  { w: 98, ratio: 0.82, chrome: 1 }, // finish
]

const IMG_HERO =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70&auto=format'
const IMG_MEDIA =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=70&auto=format'
const IMG_CARD_A =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=70&auto=format'
const IMG_CARD_B =
  'https://images.unsplash.com/photo-1556911220-bff31c812d84?w=600&q=70&auto=format'

const EASE = 'expo.out'

/**
 * The stage. A window that starts as a small blank square and grows
 * as bolder pieces land: hero slab, text band, trust strip, media pane,
 * then real color, photos, cards, and a cursor pressing the CTA.
 */
export function BuildSiteCanvas({
  activeStep,
  reducedMotion = false,
  className,
  url = 'youramazingwebsite.com',
}: Props) {
  const root = useRef<HTMLDivElement>(null)
  const prev = useRef(-1)
  const cursorTl = useRef<gsap.core.Timeline | null>(null)

  const q = (sel: string) => root.current?.querySelectorAll<HTMLElement>(sel) ?? []
  const one = (sel: string) => root.current?.querySelector<HTMLElement>(sel) ?? null

  // initial state: everything past step 0 hidden
  useLayoutEffect(() => {
    if (!root.current) return
    gsap.set(q('[data-s="1"],[data-s="2"],[data-s="3"]'), { autoAlpha: 0 })
    gsap.set(one('[data-el="slab"]'), { clipPath: 'inset(0 100% 0 0 round 10px)' })
    gsap.set(one('[data-el="media"]'), { clipPath: 'inset(100% 0 0 0 round 10px)' })
    gsap.set(one('[data-el="band"]'), { clipPath: 'inset(0 0 100% 0)' })
    gsap.set(q('[data-el="card"]'), { y: 18 })
    gsap.set(one('[data-el="cursor"]'), { autoAlpha: 0, x: 120, y: 90 })
    gsap.set(one('[data-el="sweep"]'), { xPercent: -130 })
    gsap.set(one('[data-el="pill-label"]'), { opacity: 0, scale: 0.6 })
    const s = STAGE[0]
    gsap.set(one('[data-el="stage"]'), { width: `${s.w}%` })
    gsap.set(one('[data-el="ratio"]'), { paddingTop: `${s.ratio * 100}%` })
    root.current.style.setProperty('--chrome', String(s.chrome))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const step = Math.max(0, Math.min(3, activeStep))
    const up = step > prev.current
    const s = STAGE[step]
    cursorTl.current?.kill()

    if (reducedMotion) {
      gsap.set(one('[data-el="stage"]'), { width: `${s.w}%` })
      gsap.set(one('[data-el="ratio"]'), { paddingTop: `${s.ratio * 100}%` })
      el.style.setProperty('--chrome', String(s.chrome))
      for (let i = 0; i <= 3; i++) gsap.set(q(`[data-s="${i}"]`), { autoAlpha: i <= step ? 1 : 0 })
      gsap.set(one('[data-el="guides"]'), { autoAlpha: step === 0 ? 1 : 0 })
      gsap.set(one('[data-el="slab"]'), { clipPath: step >= 1 ? 'inset(0 0 0 0 round 10px)' : 'inset(0 100% 0 0 round 10px)' })
      gsap.set(one('[data-el="band"]'), { clipPath: step >= 2 ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' })
      gsap.set(one('[data-el="media"]'), { clipPath: step >= 2 ? 'inset(0 0 0 0 round 10px)' : 'inset(100% 0 0 0 round 10px)' })
      gsap.set(q('[data-el="card"]'), { y: 0 })
      gsap.set(one('[data-el="pill-label"]'), { opacity: step >= 3 ? 1 : 0, scale: 1 })
      prev.current = step
      return
    }

    const tl = gsap.timeline({ defaults: { ease: EASE } })

    // 1. stage grows / shrinks
    tl.to(one('[data-el="stage"]'), { width: `${s.w}%`, duration: 0.9 }, 0)
    tl.to(one('[data-el="ratio"]'), { paddingTop: `${s.ratio * 100}%`, duration: 0.9 }, 0)
    tl.to(el, { '--chrome': s.chrome, duration: 0.6 } as gsap.TweenVars, 0)

    // 2. hide anything past the step (fast, quiet)
    for (let i = step + 1; i <= 3; i++) {
      tl.to(q(`[data-s="${i}"]`), { autoAlpha: 0, duration: 0.25 }, 0)
    }
    if (step < 1) tl.to(one('[data-el="slab"]'), { clipPath: 'inset(0 100% 0 0 round 10px)', duration: 0.4 }, 0)
    if (step < 2) {
      tl.to(one('[data-el="band"]'), { clipPath: 'inset(0 0 100% 0)', duration: 0.3 }, 0)
      tl.to(one('[data-el="media"]'), { clipPath: 'inset(100% 0 0 0 round 10px)', duration: 0.3 }, 0)
    }
    if (step < 3) {
      tl.set(q('[data-el="card"]'), { y: 18 }, 0.3)
      tl.set(one('[data-el="pill-label"]'), { opacity: 0, scale: 0.6 }, 0)
    }

    // 3. make sure everything at or below the step is present
    for (let i = 0; i <= step; i++) {
      if (up && i === step) continue // this one gets the real entrance
      tl.to(q(`[data-s="${i}"]`), { autoAlpha: 1, duration: 0.35 }, 0)
    }
    tl.to(one('[data-el="guides"]'), { autoAlpha: step === 0 ? 1 : 0, duration: 0.4 }, 0)
    if (step >= 1 && !(up && step === 1)) tl.set(one('[data-el="slab"]'), { clipPath: 'inset(0 0 0 0 round 10px)' }, 0)
    if (step >= 2 && !(up && step === 2)) {
      tl.set(one('[data-el="band"]'), { clipPath: 'inset(0 0 0% 0)' }, 0)
      tl.set(one('[data-el="media"]'), { clipPath: 'inset(0 0 0 0 round 10px)' }, 0)
    }
    if (step >= 3 && !(up && step === 3)) {
      tl.set(q('[data-el="card"]'), { y: 0 }, 0)
      tl.set(one('[data-el="pill-label"]'), { opacity: 1, scale: 1 }, 0)
    }

    // 4. the entrance for the new step
    if (up) {
      if (step === 0) {
        tl.fromTo(one('[data-el="dot"]'), { scale: 0 }, { scale: 1, duration: 0.6 }, 0.2)
        tl.fromTo(one('[data-el="rule"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9 }, 0.45)
      }
      if (step === 1) {
        tl.set(q('[data-s="1"]'), { autoAlpha: 1 }, 0.35)
        tl.fromTo(one('[data-el="nav"]'), { y: -14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.4)
        tl.to(one('[data-el="slab"]'), { clipPath: 'inset(0 0% 0 0 round 10px)', duration: 1.0 }, 0.5)
        tl.fromTo(one('[data-el="mark"]'), { letterSpacing: '0.35em', autoAlpha: 0 }, { letterSpacing: '0.02em', autoAlpha: 1, duration: 1.0 }, 0.75)
        tl.fromTo(one('[data-el="pill"]'), { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.6 }, 1.0)
      }
      if (step === 2) {
        tl.set(q('[data-s="2"]'), { autoAlpha: 1 }, 0.3)
        tl.to(one('[data-el="band"]'), { clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, 0.35)
        tl.to(one('[data-el="media"]'), { clipPath: 'inset(0% 0 0 0 round 10px)', duration: 0.9 }, 0.5)
        tl.fromTo(one('[data-el="media-img"]'), { scale: 1.18 }, { scale: 1, duration: 1.4 }, 0.5)
        tl.fromTo(q('[data-el="avatar"]'), { scale: 0, x: -6 }, { scale: 1, x: 0, duration: 0.5, stagger: 0.07 }, 0.9)
        tl.fromTo(one('[data-el="score"]'), { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 1.1)
      }
      if (step === 3) {
        tl.set(q('[data-s="3"]'), { autoAlpha: 1 }, 0.3)
        tl.fromTo(one('[data-el="photo"]'), { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0.35)
        tl.fromTo(one('[data-el="sweep"]'), { xPercent: -130 }, { xPercent: 130, duration: 1.4, ease: 'power2.inOut' }, 0.5)
        tl.to(q('[data-el="card"]'), { y: 0, duration: 0.7, stagger: 0.1 }, 0.7)
        tl.fromTo(one('[data-el="live"]'), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, 1.1)
        tl.fromTo(
          q('[data-el="body-lines"] > span'),
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' },
          0.85,
        )
        // cursor glides to the CTA, presses it, then REQUEST pops in
        const c = gsap.timeline({ delay: 1.2, defaults: { ease: 'power3.inOut' } })
        c.to(one('[data-el="cursor"]'), { autoAlpha: 1, duration: 0.2 })
          .to(one('[data-el="cursor"]'), { x: 0, y: 0, duration: 1.1 })
          .to(one('[data-el="pill"]'), { scale: 0.94, duration: 0.14, ease: 'power2.in' }, '-=0.05')
          .to(one('[data-el="pill"]'), { scale: 1, duration: 0.35, ease: 'back.out(3)' })
          .to(one('[data-el="pill-ring"]'), { scale: 1.8, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, '<')
          .set(one('[data-el="pill-ring"]'), { scale: 1, autoAlpha: 0.6 })
          .to(one('[data-el="cursor"]'), { autoAlpha: 0, duration: 0.4 }, '+=0.4')
          .fromTo(
            one('[data-el="pill-label"]'),
            { opacity: 0, scale: 0.55 },
            { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.4)' },
            '+=0.15',
          )
        cursorTl.current = c
      }
    }

    prev.current = step
    return () => {
      tl.kill()
    }
  }, [activeStep, reducedMotion])

  return (
    <div ref={root} className={cn('w-full', className)}>
      <div data-el="stage" className="relative mx-auto" style={{ width: '58%' }}>
        {/* ratio box */}
        <div data-el="ratio" className="relative w-full" style={{ paddingTop: '100%' }}>
          <div className="absolute inset-0">
            <Safari url={url} className="h-full">
            <div className="absolute inset-0 h-full [container-type:inline-size]">
              {/* step 0 — direction: crop marks + a single point that becomes a line */}
              <div data-el="guides" data-s="0" className="absolute inset-0">
                <div className="absolute inset-[9%] rounded-[6px] border border-dashed border-espresso/15" />
                {/* crop marks */}
                {[
                  'left-[5%] top-[5%] border-l border-t',
                  'right-[5%] top-[5%] border-r border-t',
                  'left-[5%] bottom-[5%] border-l border-b',
                  'right-[5%] bottom-[5%] border-r border-b',
                ].map((c) => (
                  <span key={c} className={cn('absolute h-3 w-3 border-espresso/35', c)} />
                ))}
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
                  <span data-el="dot" className="h-2.5 w-2.5 rounded-full bg-espresso" />
                  <span data-el="rule" className="block h-px w-24 bg-espresso/40 sm:w-32" />
                </div>
                <p className="absolute bottom-[6%] left-[9%] font-nhg text-[8px] uppercase tracking-[0.2em] text-espresso/35">
                  01 · Direction
                </p>
              </div>

              {/* step 1 — structure: nav band (left only — right is LIVE on finish) */}
              <div data-el="nav" data-s="1" className="absolute inset-x-[5%] top-[5%] flex h-[7%] items-center justify-between">
                <span className="h-2 w-2 rounded-full bg-espresso" />
                <div className="flex gap-2 pr-[22%]">
                  <span className="h-1 w-6 rounded bg-espresso/30" />
                  <span className="h-1 w-6 rounded bg-espresso/30" />
                  <span className="h-1 w-4 rounded bg-espresso/30" />
                </div>
              </div>

              <div
                data-el="slab"
                data-s="1"
                className="absolute inset-x-[5%] top-[14%] h-[44%] overflow-hidden rounded-[10px] bg-espresso"
              >
                {/* step 3 photo fill */}
                <img
                  data-el="photo"
                  data-s="3"
                  src={IMG_HERO}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-0"
                  loading="lazy"
                />
                <div data-s="3" className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/10" />
                <div
                  data-el="sweep"
                  aria-hidden
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <div className="relative flex h-full flex-col justify-between p-[6%]">
                  <p
                    data-el="mark"
                    className="font-nhg text-[clamp(14px,4.6cqw,30px)] font-bold uppercase leading-none text-[#FCFAF2]"
                    style={{
                      fontFamily: '"Roboto Flex", "Neue Haas Grotesk Display", sans-serif',
                      fontVariationSettings: '"wdth" 140, "wght" 750',
                      fontStretch: '140%',
                    }}
                  >
                    Reach
                  </p>
                  <div className="flex items-end justify-between">
                    <div className="space-y-1.5">
                      <span className="block h-1.5 w-[70%] rounded bg-[#FCFAF2]/70" />
                      <span className="block h-1.5 w-[45%] rounded bg-[#FCFAF2]/40" />
                    </div>
                    <div className="relative">
                      <span
                        data-el="pill-ring"
                        className="absolute inset-0 rounded-full border border-[#c4a574]"
                        style={{ opacity: 0.6 }}
                      />
                      <span
                        data-el="pill"
                        className="relative flex h-5 w-14 items-center justify-center overflow-hidden rounded-full bg-[#c4a574] sm:h-6 sm:w-16"
                      >
                        <span
                          data-el="pill-label"
                          className="font-nhg text-[5px] font-semibold uppercase tracking-[0.1em] text-[#1a1612] sm:text-[6px]"
                          style={{ opacity: 0, transform: 'scale(0.6)' }}
                        >
                          REQUEST
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* step 2 — trust: title + reviews up high so cards never cover them */}
              <div
                data-el="band"
                data-s="2"
                className="absolute left-[5%] top-[61%] w-[52%]"
              >
                <p className="font-tiempos text-[clamp(11px,3.4cqw,20px)] leading-[1.05] text-espresso">
                  Built to be
                  <br />
                  trusted.
                </p>
                <div className="mt-[4%] flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {['#c4a574', '#8B6950', '#D9C3B0'].map((c) => (
                      <span
                        key={c}
                        data-el="avatar"
                        className="h-3.5 w-3.5 rounded-full border-2 border-[#f8f6f1] sm:h-4 sm:w-4"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <span data-el="score" className="font-nhg text-[9px] font-medium text-espresso/70 sm:text-[10px]">
                    4.9 · 120 reviews
                  </span>
                </div>
              </div>

              {/* short gray lines in the gap between title and media (step 4) */}
              <div
                data-el="body-lines"
                data-s="3"
                className="absolute left-[42%] top-[68%] w-[14%] space-y-1.5"
              >
                <span className="block h-1 w-full rounded bg-espresso/20" />
                <span className="block h-1 w-[78%] rounded bg-espresso/14" />
                <span className="block h-1 w-[55%] rounded bg-espresso/10" />
              </div>

              <div
                data-el="media"
                data-s="2"
                className="absolute right-[5%] top-[61%] h-[34%] w-[36%] overflow-hidden rounded-[10px] bg-[#D9C3B0]"
              >
                <img
                  data-el="media-img"
                  src={IMG_MEDIA}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* step 3 — finish: cards + live badge (lines sit under the badge) + cursor */}
              <div data-s="3" className="absolute bottom-[4%] left-[5%] flex w-[52%] gap-2">
                {[IMG_CARD_A, IMG_CARD_B].map((src) => (
                  <div
                    key={src}
                    data-el="card"
                    className="flex h-[26px] flex-1 items-center gap-1.5 rounded-md bg-white p-1 shadow-[0_8px_20px_-10px_rgba(44,37,32,0.4)] ring-1 ring-espresso/8 sm:h-[32px]"
                  >
                    <img src={src} alt="" className="h-full w-[38%] rounded object-cover" loading="lazy" />
                    <div className="flex-1 space-y-1">
                      <span className="block h-1 w-[80%] rounded bg-espresso/30" />
                      <span className="block h-1 w-[50%] rounded bg-espresso/15" />
                    </div>
                  </div>
                ))}
              </div>
              <div
                data-el="live"
                data-s="3"
                className="absolute right-[5%] top-[3.5%] z-10 flex flex-col items-end gap-1"
              >
                <span className="flex items-center gap-1 rounded-full bg-espresso px-2 py-0.5 font-nhg text-[7px] uppercase tracking-[0.16em] text-[#FCFAF2]">
                  <span className="h-1 w-1 rounded-full bg-[#a9d3a3]" />
                  Live
                </span>
                <div className="flex w-full flex-col items-end gap-0.5 pr-0.5">
                  <span className="block h-0.5 w-8 rounded bg-espresso/25" />
                  <span className="block h-0.5 w-6 rounded bg-espresso/15" />
                </div>
              </div>

              {/* cursor that presses the CTA (positioned to the pill via translate) */}
              <svg
                data-el="cursor"
                data-s="3"
                viewBox="0 0 24 24"
                className="absolute right-[10%] top-[47%] z-30 h-4 w-4 drop-shadow"
                aria-hidden
              >
                <path d="M5 3l14 8-6 1.5L9.5 19 5 3z" fill="#FCFAF2" stroke="#2C2520" strokeWidth="1.4" />
              </svg>
            </div>
            </Safari>
          </div>
        </div>
      </div>
    </div>
  )
}
