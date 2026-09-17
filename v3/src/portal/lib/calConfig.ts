/**
 * Shared Cal.com booking helpers.
 * Used by portal Support tab. Marketing site can import the same constants / BookCallButton.
 */
export const CAL_NAMESPACE = 'booking'
export const CAL_BOOKING_LINK = 'zachary-maximus-ambrcs/booking'
export const CAL_ORIGIN = 'https://app.cal.com'

export const CAL_UI_CONFIG = {
  layout: 'month_view' as const,
  theme: 'dark' as const,
}

/** Full public URL (optional env override). */
export function getCalComUrl() {
  const fromEnv = (import.meta.env.VITE_CAL_COM_URL as string | undefined)?.trim()
  if (fromEnv) return fromEnv
  return `https://cal.com/${CAL_BOOKING_LINK}`
}
