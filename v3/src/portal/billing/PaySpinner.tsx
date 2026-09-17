import { cn } from '@/lib/utils'

/** Payment-button loader. Circle reads as “working on your money” without feeling like a download bar. */
export default function PaySpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4 animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Tiny Stripe wordmark for “Maximus Reach × …” */
export function StripeWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-sans text-[11px] font-semibold lowercase leading-none tracking-tight text-[#635BFF]',
        className,
      )}
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      aria-label="Stripe"
    >
      stripe
    </span>
  )
}
