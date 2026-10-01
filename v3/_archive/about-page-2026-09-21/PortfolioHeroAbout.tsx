'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function BlurText({
  text,
  delay = 50,
  animateBy = 'words',
  className,
  stacked,
}: {
  text: string
  delay?: number
  animateBy?: 'words' | 'letters'
  className?: string
  stacked?: boolean
}) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), {
      threshold: 0.12,
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const segments = useMemo(
    () => (animateBy === 'words' ? text.split(' ') : text.split('')),
    [text, animateBy],
  )

  return (
    <p
      ref={ref}
      className={cn(
        stacked ? 'flex flex-col items-center' : 'inline-flex flex-wrap justify-center',
        className,
      )}
    >
      {segments.map((seg, i) => (
        <span
          key={`${seg}-${i}`}
          style={{
            display: stacked ? 'block' : 'inline-block',
            filter: inView ? 'blur(0px)' : 'blur(10px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(-16px)',
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {seg}
          {animateBy === 'words' && !stacked && i < segments.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  )
}

type Props = {
  eyebrow: string
  line1: string
  line2: string
  tagline: string
  onScrollDown?: () => void
}

/** Original About hero — blur letters, portrait overlay. Keep this. */
export default function PortfolioHeroAbout({ eyebrow, line1, line2, tagline, onScrollDown }: Props) {
  return (
    <section className="relative flex min-h-[88vh] flex-col bg-[#0e0d0c] text-[#FCFAF2]">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(196,165,116,0.14),transparent_58%)]"
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-28 md:pb-32 md:pt-36">
        <p className="mb-8 font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-[#FCFAF2]/40">
          {eyebrow}
        </p>

        <div className="relative flex flex-col items-center text-center">
          <BlurText
            text={line1}
            delay={70}
            animateBy="letters"
            className="font-nhg text-[clamp(3.2rem,12vw,8.5rem)] font-semibold uppercase leading-[0.82] tracking-tighter text-[#efeae2]"
          />
          <BlurText
            text={line2}
            delay={70}
            animateBy="letters"
            className="-mt-1 font-nhg text-[clamp(3.2rem,12vw,8.5rem)] font-semibold uppercase leading-[0.82] tracking-tighter text-[#c4a574]"
          />

          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[92px] w-[58px] overflow-hidden rounded-full shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-105 sm:h-[120px] sm:w-[76px] md:h-[148px] md:w-[94px] lg:h-[172px] lg:w-[108px]">
              <img
                src="/assets/zachary-portrait.jpg"
                alt="Zachary Maximus"
                className="h-full w-full object-cover object-[center_18%]"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-lg px-4">
          <BlurText
            text={tagline}
            delay={90}
            animateBy="words"
            className="font-nhg text-[15px] leading-relaxed text-[#FCFAF2]/55 md:text-lg"
          />
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#FCFAF2]/40 transition hover:text-[#FCFAF2]/80"
        aria-label="Scroll to story"
        onClick={onScrollDown}
      >
        <ChevronDown className="h-6 w-6 md:h-8 md:w-8" />
      </button>
    </section>
  )
}
