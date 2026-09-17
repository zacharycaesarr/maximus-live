/** Payment details for the Billing tab (hybrid no-fee + fee rails). */

export type FeeFreeProvider = 'venmo' | 'cashapp' | 'paypal'

export type FeeFreeMethod = {
  id: FeeFreeProvider
  label: string
  handle: string
  url: string
  /** Image under /public/portal */
  qrSrc: string
  steps: string[]
}

const NOTE_STEP =
  'In the payment note, add your Invoice ID (or your business name) so we can match the payment.'

export const FEE_FREE_METHODS: FeeFreeMethod[] = [
  {
    id: 'venmo',
    label: 'Venmo',
    handle: '@mximus',
    url: 'https://venmo.com/u/mximus',
    qrSrc: '/portal/venmo-qr.png',
    steps: [
      'Open Venmo (or tap Open Venmo below).',
      'Send to @mximus.',
      NOTE_STEP,
      'Or scan the QR with your phone camera / Venmo app.',
    ],
  },
  {
    id: 'cashapp',
    label: 'Cash App',
    handle: '$zmximus',
    url: 'https://cash.app/$zmximus',
    qrSrc: '/portal/cashapp-qr.png',
    steps: [
      'Open Cash App (or tap Open Cash App below).',
      'Send to $zmximus.',
      NOTE_STEP,
      'Or scan the QR with Cash App.',
    ],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    handle: '@zacharycaesar',
    url: 'https://www.paypal.com/ncp/payment/G6B2ZPGDG4WTC',
    qrSrc: '/portal/paypal-pay.png',
    steps: [
      'Open PayPal (or tap Open PayPal below).',
      'Pay using the Maximus Reach payment page.',
      NOTE_STEP,
      'Expect PayPal commercial fees on this link (about 2.99% + $0.49).',
    ],
  },
]

/** Stripe Payment Link from Dashboard → Payment links. */
export function getStripePaymentLink() {
  return (import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined)?.trim() || ''
}

