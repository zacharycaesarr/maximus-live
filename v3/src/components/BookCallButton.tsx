import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { getCalApi } from '@calcom/embed-react'
import {
  CAL_BOOKING_LINK,
  CAL_NAMESPACE,
  CAL_UI_CONFIG,
} from '@/portal/lib/calConfig'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  /** Separate namespace if multiple buttons on one page. */
  namespace?: string
}

/**
 * Opens Cal.com booking in a popup (full UI with back-to-date).
 * Safe to reuse on homepage / other marketing pages later.
 */
export default function BookCallButton({
  children,
  namespace = CAL_NAMESPACE,
  className,
  ...rest
}: Props) {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace })
      cal('ui', {
        hideEventTypeDetails: false,
        layout: CAL_UI_CONFIG.layout,
        theme: CAL_UI_CONFIG.theme,
      })
    })()
  }, [namespace])

  return (
    <button
      type="button"
      data-cal-namespace={namespace}
      data-cal-link={CAL_BOOKING_LINK}
      data-cal-config={JSON.stringify(CAL_UI_CONFIG)}
      className={className}
      {...rest}
    >
      {children}
    </button>
  )
}
