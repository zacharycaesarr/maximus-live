import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Brand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'
export type CardFocusZone = 'number' | 'name' | 'expiry' | 'cvc' | null

type Props = {
  cardholderName: string
  /** Raw digits only (0–16). Drives every lit circle. */
  cleanDigits: string
  brand?: Brand
  expiryDisplay: string
  cvv: string
  flipped?: boolean
  focusZone?: CardFocusZone
  className?: string
}

function brandLabel(brand: Brand) {
  if (brand === 'visa') return 'VISA'
  if (brand === 'mastercard') return 'MASTERCARD'
  if (brand === 'amex') return 'AMEX'
  if (brand === 'discover') return 'DISCOVER'
  return 'CARD'
}

function GlowBox({
  active,
  className,
  style,
  children,
}: {
  active: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-md transition-[box-shadow,background-color,transform] duration-200',
        active && 'bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.38),0_0_14px_rgba(255,255,255,0.12)]',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function PulseDot({
  filled,
  isCurrent,
  tone = 'light',
}: {
  filled: boolean
  isCurrent: boolean
  /** light = white on dark card face; dark = black on the light CVV strip */
  tone?: 'light' | 'dark'
}) {
  const prev = useRef(filled)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    if (filled && !prev.current) {
      setBurst(true)
      const t = window.setTimeout(() => setBurst(false), 110)
      prev.current = filled
      return () => window.clearTimeout(t)
    }
    prev.current = filled
  }, [filled])

  const lit = tone === 'dark' ? 'bg-neutral-950 opacity-100' : 'bg-white opacity-100'
  const dim = tone === 'dark' ? 'bg-neutral-950 opacity-25' : 'bg-white opacity-[0.22]'
  const popped = filled && (burst || isCurrent)

  return (
    <span
      className={cn(
        'inline-block h-[6px] w-[6px] shrink-0 rounded-full transition-transform duration-100 ease-out sm:h-[7px] sm:w-[7px]',
        filled ? lit : dim,
        popped ? '-translate-y-[2px]' : 'translate-y-0',
      )}
    />
  )
}

function NumberRow({
  cleanDigits,
  brand,
  active,
}: {
  cleanDigits: string
  brand: Brand
  active: boolean
}) {
  const total = brand === 'amex' ? 15 : 16
  const len = Math.min(cleanDigits.length, total)
  const pad = 'var(--pay-glow-pad, 6px)'
  const nudgeX = 'var(--pay-glow-x, 0px)'
  const nudgeY = 'var(--pay-glow-y, 0px)'

  return (
    <div className="flex justify-center">
      <GlowBox
        active={active}
        className="w-fit"
        style={{
          padding: pad,
          transform: `translate(${nudgeX}, ${nudgeY})`,
        }}
      >
        {/* Continuous track of dots (not chunked groups) */}
        <div className="flex items-center justify-center gap-[5px] sm:gap-[6px]">
          {Array.from({ length: total }).map((_, i) => (
            <PulseDot
              key={i}
              filled={i < len}
              /* only pop while typing in card number; settle when they leave the field */
              isCurrent={active && len > 0 && i === len - 1}
            />
          ))}
        </div>
      </GlowBox>
    </div>
  )
}

function CvvDots({ cvv, active }: { cvv: string; active: boolean }) {
  const n = Math.min(cvv.replace(/\D/g, '').length, 4)
  const slots = 3
  const filledCount = Math.min(n, slots)
  return (
    <div className="flex items-center gap-[5px]">
      {Array.from({ length: slots }).map((_, i) => (
        <PulseDot
          key={i}
          tone="dark"
          filled={i < filledCount}
          isCurrent={active && filledCount > 0 && i === filledCount - 1}
        />
      ))}
    </div>
  )
}

/** Visual-only flippable card. Digits come from controlled form state (not Stripe iframe). */
export default function FlippableCreditCard({
  cardholderName,
  cleanDigits,
  brand = 'unknown',
  expiryDisplay,
  cvv,
  flipped = false,
  focusZone = null,
  className,
}: Props) {
  return (
    <div className={cn('h-44 w-full max-w-[320px] [perspective:1000px]', className)}>
      <div
        className={cn(
          'relative h-full w-full rounded-xl shadow-xl transition-transform duration-700 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2a2a2e] to-[#121214] text-white [backface-visibility:hidden] ring-1 ring-white/10">
          <div className="relative flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200/90 to-amber-500/70 opacity-90" />
              <p className="m-0 font-mono text-[11px] font-semibold tracking-[0.18em] text-white/70">
                {brandLabel(brand)}
              </p>
            </div>

            <NumberRow
              cleanDigits={cleanDigits}
              brand={brand}
              active={focusZone === 'number'}
            />

            <div className="flex items-end justify-between gap-3">
              <GlowBox active={focusZone === 'name'} className="min-w-0 flex-1 px-1.5 py-1">
                <p className="m-0 text-[9px] font-semibold uppercase tracking-wide text-white/45">
                  Card holder
                </p>
                <p className="m-0 truncate font-mono text-sm text-white/90">
                  {cardholderName.trim() || 'Cardholder'}
                </p>
              </GlowBox>
              <GlowBox active={focusZone === 'expiry'} className="px-1.5 py-1 text-right">
                <p className="m-0 text-[9px] font-semibold uppercase tracking-wide text-white/45">
                  Expires
                </p>
                <p className="m-0 font-mono text-sm text-white/90">{expiryDisplay || 'MM/YY'}</p>
              </GlowBox>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2a2a2e] to-[#121214] text-white [backface-visibility:hidden] [transform:rotateY(180deg)] ring-1 ring-white/10">
          <div className="flex h-full flex-col">
            <div className="mt-5 h-10 w-full bg-neutral-950" />
            <div className="mx-4 mt-4 flex justify-end">
              <div
                className={cn(
                  'flex h-8 w-full items-center justify-end rounded-md bg-neutral-200 pr-3 transition-shadow',
                  focusZone === 'cvc' && 'shadow-[0_0_0_1px_rgba(34,197,94,0.5)]',
                )}
              >
                <CvvDots cvv={cvv} active={focusZone === 'cvc'} />
              </div>
            </div>
            <p className="mt-1 self-end pr-4 text-[9px] font-semibold uppercase text-white/45">
              CVV
            </p>
            <div className="mt-auto flex justify-end p-4">
              <div className="flex -space-x-3">
                <span className="h-8 w-8 rounded-full bg-red-500/90" />
                <span className="h-8 w-8 rounded-full bg-amber-400/90" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
