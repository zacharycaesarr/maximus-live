import { cn } from '@/lib/utils'

type Props = {
  className?: string
  tone?: 'dark' | 'light'
  /** Maximus over Reach — main navbar only */
  stacked?: boolean
}

/** Brand lockup — tight tracking. stacked = two lines for main nav. */
export function BrandInline({ className, tone = 'dark', stacked = false }: Props) {
  const color = tone === 'light' ? 'text-white' : 'text-espresso'

  if (stacked) {
    return (
      <span
        className={cn(
          'inline-flex flex-col items-start font-nhg font-semibold leading-[0.92] tracking-[-0.045em]',
          color,
          className,
        )}
        aria-label="Maximus Reach"
      >
        <span className="text-[12px] md:text-[13px]">Maximus</span>
        <span className="text-[12px] md:text-[13px]">Reach</span>
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
