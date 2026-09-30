import { StretchText } from '@/components/ui/StretchText'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  tone?: 'dark' | 'light'
  /** Maximus over Reach — main navbar only */
  stacked?: boolean
  /** stretch amount for Reach Further (nav wordmark) */
  stretchBase?: number
  stretchPeak?: number
}

/** Brand lockup — tight tracking. stacked = two lines for main nav. */
export function BrandInline({
  className,
  tone = 'dark',
  stacked = false,
  stretchBase = 55,
  stretchPeak = 140,
}: Props) {
  const color = tone === 'light' ? 'text-white' : 'text-espresso'

  if (stacked) {
    return (
      <span
        className={cn('inline-flex flex-col items-start leading-[0.92]', color, className)}
        aria-label="Reach Further"
      >
        <StretchText
          text="Reach"
          baseWidth={stretchBase}
          peakWidth={stretchPeak}
          curve="ramp"
          weight={650}
          letterSpacing={-0.04}
          opticalSize={48}
          hoverBoost={18}
          animateIn={false}
          className="text-[12px] md:text-[13px]"
        />
        <StretchText
          text="Further"
          baseWidth={stretchBase}
          peakWidth={stretchPeak}
          curve="ramp"
          weight={650}
          letterSpacing={-0.04}
          opticalSize={48}
          hoverBoost={18}
          animateIn={false}
          className="text-[12px] md:text-[13px]"
        />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'font-nhg text-[15px] font-semibold leading-none tracking-[-0.045em] md:text-[16px]',
        color,
        className,
      )}
    >
      Maximus Reach
    </span>
  )
}

/** Body-copy mention — mocha weight + soft underline. */
export function BrandMention({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-nhg font-semibold tracking-[-0.035em] text-[#1a1612]',
        'underline decoration-[#c4a574] decoration-2 underline-offset-[3px]',
        className,
      )}
    >
      Maximus Reach
    </span>
  )
}
