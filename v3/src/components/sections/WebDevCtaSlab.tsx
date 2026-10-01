'use client'

import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'
import type { StretchTextProps } from '@/components/ui/StretchText'
import { cn } from '@/lib/utils'

type Props = {
  headline: string
  blurb: string
  label: string
  eyebrow?: string
  tone?: 'dark' | 'light'
  href?: string
  /** kept for callers, no longer rendered — CTA stays calm now */
  stretch?: Omit<StretchTextProps, 'text'>
  ticker?: string[]
}

/**
 * Closing slab. Calm and final: one headline, one line, one button.
 * Soft glow is static (no scroll-linked blur) to avoid scroll jank.
 */
export default function WebDevCtaSlab({
  headline,
  blurb,
  label,
  eyebrow = 'Next step',
  tone = 'dark',
  href = '/start',
}: Props) {
  const dark = tone === 'dark'

  return (
    <section
      className={cn(
        'relative overflow-hidden px-6 py-24 md:py-36',
        dark ? 'bg-[#2C2520] text-[#FCFAF2]' : 'bg-[#f3f1ec] text-espresso',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4a574] opacity-25 blur-[160px]"
      />
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          dark ? 'opacity-[0.05]' : 'opacity-[0.04]',
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal duration={2.85} delay={0.06} y={48}>
          <p
            className={cn(
              'font-nhg text-[11px] uppercase tracking-[0.2em]',
              dark ? 'text-[#FCFAF2]/40' : 'text-espresso/40',
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
        <Reveal duration={3.05} delay={0.22} y={56}>
          <h2 className="mt-5 font-tiempos text-[clamp(2.2rem,6vw,4.25rem)] font-light leading-[1.02] tracking-tight">
            {headline}
          </h2>
        </Reveal>
        <Reveal duration={2.9} delay={0.42} y={40}>
          <p
            className={cn(
              'mx-auto mt-5 max-w-md font-nhg text-[15px] leading-relaxed',
              dark ? 'text-[#FCFAF2]/60' : 'text-espresso/55',
            )}
          >
            {blurb}
          </p>
        </Reveal>
        <Reveal duration={2.8} delay={0.6} y={36}>
          <Link
            to={href}
            data-magnetic
            className={cn(
              'group mt-10 inline-flex items-center gap-3 rounded-full border px-7 py-4 font-nhg text-[14px] font-medium no-underline backdrop-blur-sm transition-colors',
              dark
                ? 'border-white/15 bg-white/[0.07] text-[#FCFAF2] hover:bg-white/[0.12]'
                : 'border-espresso/15 bg-white/50 text-espresso hover:bg-white/80',
            )}
          >
            {label}
            <span
              className={cn(
                'grid h-6 w-6 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45',
                dark ? 'bg-[#c4a574] text-espresso' : 'bg-espresso text-[#FCFAF2]',
              )}
            >
              <ArrowUpRight size={13} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
