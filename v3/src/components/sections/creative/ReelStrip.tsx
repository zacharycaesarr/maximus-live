'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type Frame = { src: string; label: string; kind: string }

type Props = {
  frames: Frame[]
  eyebrow: string
  title: string
}

/**
 * Tall section. The strip is pinned and slides sideways as you scroll down,
 * like scrubbing a timeline. Frame counter ticks with it.
 */
export default function ReelStrip({ frames, eyebrow, title }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const eased = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 })
  const x = useTransform(eased, [0, 1], ['4%', '-62%'])
  const frameNo = useTransform(eased, (v) => String(Math.round(v * 24 * 6)).padStart(4, '0'))
  const bar = useTransform(eased, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} className="relative bg-[#141110] text-[#FCFAF2]" style={{ height: reduced ? 'auto' : '260vh' }}>
      <div className={cn('flex flex-col justify-center overflow-hidden', reduced ? 'py-24' : 'sticky top-0 h-[100svh]')}>
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">{eyebrow}</p>
              <h2 className="mt-3 max-w-lg font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight">{title}</h2>
            </div>
            <p className="hidden font-nhg text-[11px] tabular-nums tracking-[0.2em] text-[#c4a574] md:block">
              FR <motion.span>{frameNo}</motion.span>
            </p>
          </div>
        </div>

        <motion.div style={{ x: reduced ? 0 : x }} className="mt-10 flex w-max gap-3 pl-6 md:mt-14 md:gap-5">
          {frames.map((f, i) => (
            <figure key={f.src} className="group relative w-[62vw] shrink-0 sm:w-[40vw] md:w-[28vw]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#221d1a] ring-1 ring-white/8">
                <img
                  src={f.src}
                  alt={f.label}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {/* sprocket holes */}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-2 pt-1.5">
                  {Array.from({ length: 6 }, (_, k) => (
                    <span key={k} className="h-2 w-3 rounded-[2px] bg-[#141110]" />
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-2 pb-1.5">
                  {Array.from({ length: 6 }, (_, k) => (
                    <span key={k} className="h-2 w-3 rounded-[2px] bg-[#141110]" />
                  ))}
                </div>
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between font-nhg text-[11px] uppercase tracking-[0.16em]">
                <span className="text-[#FCFAF2]/70">{f.label}</span>
                <span className="text-[#FCFAF2]/35">
                  {String(i + 1).padStart(2, '0')} · {f.kind}
                </span>
              </figcaption>
            </figure>
          ))}
        </motion.div>

        {/* timeline bar */}
        <div className="mx-auto mt-10 w-full max-w-6xl px-6 md:mt-14">
          <div className="relative h-px w-full bg-white/10">
            <motion.div style={{ width: bar }} className="absolute left-0 top-0 h-px bg-[#c4a574]" />
          </div>
          <div className="mt-2 flex justify-between font-nhg text-[10px] uppercase tracking-[0.16em] text-[#FCFAF2]/30">
            <span>In</span>
            <span className="md:hidden">
              FR <motion.span>{frameNo}</motion.span>
            </span>
            <span>Out</span>
          </div>
        </div>
      </div>
    </section>
  )
}
