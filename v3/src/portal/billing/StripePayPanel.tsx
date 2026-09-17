import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { loadStripe } from '@stripe/stripe-js'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { usePortalAuth } from '@/portal/auth/AuthContext'
import FlippableCreditCard, { type CardFocusZone } from '@/portal/billing/FlippableCreditCard'
import PaySpinner from '@/portal/billing/PaySpinner'
import RippleButton from '@/portal/ui/RippleButton'

const pk = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim() || ''
const stripePromise = pk ? loadStripe(pk) : null

type Brand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

function detectBrand(digits: string): Brand {
  if (/^4/.test(digits)) return 'visa'
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard'
  if (/^6(?:011|5)/.test(digits)) return 'discover'
  return 'unknown'
}

function formatCardNumber(digits: string, brand: Brand) {
  const d = digits.replace(/\D/g, '').slice(0, brand === 'amex' ? 15 : 16)
  if (brand === 'amex') {
    const a = d.slice(0, 4)
    const b = d.slice(4, 10)
    const c = d.slice(10, 15)
    return [a, b, c].filter(Boolean).join(' ')
  }
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

/** Create PaymentMethod with publishable key (card → Stripe only, not our server). */
async function createCardPaymentMethod(opts: {
  number: string
  expMonth: string
  expYear: string
  cvc: string
  name?: string
  email?: string
}) {
  const body = new URLSearchParams()
  body.set('type', 'card')
  body.set('card[number]', opts.number)
  body.set('card[exp_month]', opts.expMonth)
  body.set('card[exp_year]', opts.expYear)
  body.set('card[cvc]', opts.cvc)
  if (opts.name) body.set('billing_details[name]', opts.name)
  if (opts.email) body.set('billing_details[email]', opts.email)

  const res = await fetch('https://api.stripe.com/v1/payment_methods', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pk}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const json = (await res.json()) as { id?: string; error?: { message?: string } }
  if (!res.ok || !json.id) {
    throw new Error(json.error?.message || 'Could not verify card.')
  }
  return json.id
}

function ModalShell({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close payment"
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Secure card payment"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[1] max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0c0c0d] p-4 shadow-2xl sm:max-w-3xl sm:rounded-2xl sm:p-6"
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function BrandHeader({ onClose, busy }: { onClose: () => void; busy: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-nhg text-sm font-medium tracking-tight text-white">
            Maximus Reach
          </span>
          <span className="text-white/35">×</span>
          <img
            src="/portal/stripe-wordmark.png"
            alt="Stripe"
            className="h-3.5 w-auto mix-blend-screen"
          />
        </div>
        <div className="mt-1.5 flex items-center gap-2.5">
          <h2 className="m-0 font-nhg text-xl text-white">Card payment</h2>
          {busy ? <PaySpinner className="h-4 w-4 text-white/70" /> : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-white/10 p-2 text-white/50 hover:text-white"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  )
}

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-nhg text-sm text-white outline-none placeholder:text-white/30'

function CheckoutForm({
  amount,
  setAmount,
  note,
  setNote,
  name,
  setName,
  onPaid,
  onClose,
}: {
  amount: string
  setAmount: (v: string) => void
  note: string
  setNote: (v: string) => void
  name: string
  setName: (v: string) => void
  onPaid: (intentId: string) => void
  onClose: () => void
}) {
  const { user } = usePortalAuth()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [cardDigits, setCardDigits] = useState('')
  const [expiryRaw, setExpiryRaw] = useState('')
  const [cvc, setCvc] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [focusZone, setFocusZone] = useState<CardFocusZone>(null)

  const brand = detectBrand(cardDigits)
  const cardDisplay = formatCardNumber(cardDigits, brand)
  const expiryDisplay = formatExpiry(expiryRaw)
  const cleanDigits = cardDigits.replace(/\D/g, '').slice(0, brand === 'amex' ? 15 : 16)

  const dollarsLabel = useMemo(() => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return '$0.00'
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
  }, [amount])

  async function onPay(e: FormEvent) {
    e.preventDefault()
    const dollars = Number(amount)
    if (!Number.isFinite(dollars) || dollars < 0.5) {
      setErr('Enter at least $0.50.')
      return
    }
    const digits = cleanDigits
    const exp = expiryRaw.replace(/\D/g, '')
    if (digits.length < 13) {
      setErr('Enter a valid card number.')
      return
    }
    if (exp.length < 4) {
      setErr('Enter a valid expiry (MM/YY).')
      return
    }
    if (cvc.replace(/\D/g, '').length < 3) {
      setErr('Enter a valid security code.')
      return
    }

    setBusy(true)
    setErr(null)
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load.')

      const client = getSupabase()
      const amountCents = Math.round(dollars * 100)
      const { data, error } = await client.functions.invoke('create-payment-intent', {
        body: {
          amountCents,
          description: note.trim() || 'Client portal payment',
          clientId: user?.id,
          method: 'card',
        },
      })
      if (error) {
        let detail = error.message
        try {
          const ctx = (error as { context?: Response }).context
          if (ctx) {
            const body = await ctx.clone().json()
            if (body?.error) detail = String(body.error)
          }
        } catch {
          /* ignore */
        }
        throw new Error(detail)
      }
      if (data?.error) throw new Error(String(data.error))
      const clientSecret = data?.clientSecret as string | undefined
      if (!clientSecret) throw new Error('No payment secret returned.')

      const mm = exp.slice(0, 2)
      let yy = exp.slice(2, 4)
      const yyNum = Number(yy)
      const expYear = yyNum >= 100 ? String(yyNum) : String(2000 + yyNum)

      const paymentMethodId = await createCardPaymentMethod({
        number: digits,
        expMonth: String(Number(mm)),
        expYear,
        cvc: cvc.replace(/\D/g, ''),
        name: name.trim() || user?.email || undefined,
        email: user?.email || undefined,
      })

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      })
      if (result.error) throw new Error(result.error.message || 'Payment failed.')
      const status = result.paymentIntent?.status
      if (status === 'succeeded' || status === 'processing') {
        onPaid(result.paymentIntent?.id || '')
        return
      }
      throw new Error('Payment did not finish. Try again.')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Payment failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onPay} className="space-y-5">
      <BrandHeader onClose={onClose} busy={busy} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] lg:items-start">
        <div className="space-y-3">
          <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Amount (USD)
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-nhg text-sm text-white/40">
                $
              </span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-7 pr-3 font-nhg text-sm text-white outline-none"
              />
            </div>
          </label>

          <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Note (optional)
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Invoice ID or business name"
              className={fieldClass}
            />
          </label>

          <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Name on card
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => {
                setFocusZone('name')
                setFlipped(false)
              }}
              onBlur={() => setFocusZone(null)}
              placeholder="Cardholder"
              className={fieldClass}
              autoComplete="cc-name"
            />
          </label>

          <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
            Card number
            <input
              value={cardDisplay}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 16)
                setCardDigits(next)
              }}
              onFocus={() => {
                setFocusZone('number')
                setFlipped(false)
              }}
              onBlur={() => setFocusZone(null)}
              placeholder="1234 1234 1234 1234"
              className={fieldClass}
              inputMode="numeric"
              autoComplete="cc-number"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
              Expiry
              <input
                value={expiryDisplay}
                onChange={(e) => setExpiryRaw(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onFocus={() => {
                  setFocusZone('expiry')
                  setFlipped(false)
                }}
                onBlur={() => setFocusZone(null)}
                placeholder="MM/YY"
                className={fieldClass}
                inputMode="numeric"
                autoComplete="cc-exp"
              />
            </label>
            <label className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
              Security code
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onFocus={() => {
                  setFocusZone('cvc')
                  setFlipped(true)
                }}
                onBlur={() => {
                  setFocusZone(null)
                  setFlipped(false)
                }}
                placeholder="CVC"
                className={fieldClass}
                inputMode="numeric"
                autoComplete="cc-csc"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 lg:pt-6">
          <FlippableCreditCard
            cardholderName={name}
            cleanDigits={cleanDigits}
            expiryDisplay={expiryDisplay}
            cvv={cvc}
            brand={brand}
            flipped={flipped}
            focusZone={focusZone}
          />
        </div>
      </div>

      {err ? <p className="m-0 font-nhg text-sm text-rose-300/90">{err}</p> : null}

      <RippleButton
        type="submit"
        disabled={busy || !pk}
        className="w-full rounded-lg bg-white px-4 py-3 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
        rippleClassName="bg-[#0c0c0d]/20"
      >
        {busy ? (
          <>
            <PaySpinner />
            Processing…
          </>
        ) : (
          `Pay ${dollarsLabel}`
        )}
      </RippleButton>
      <p className="m-0 flex items-center justify-center gap-1.5 font-mono text-[10px] text-white/35">
        Powered by
        <img
          src="/portal/stripe-mark.png"
          alt="Stripe"
          className="h-3 w-3 rounded-[3px] object-cover"
        />
      </p>
    </form>
  )
}

/** Opens a centered pay modal. Amount + note + card fields live together. */
export default function StripePayPanel() {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [name, setName] = useState('')
  const [paid, setPaid] = useState(false)
  const [lastIntent, setLastIntent] = useState('')

  function close() {
    setOpen(false)
  }

  function openPay() {
    if (!pk) return
    setPaid(false)
    setOpen(true)
  }

  return (
    <div className="space-y-3">
      {!pk ? (
        <p className="m-0 font-mono text-[11px] text-white/35">
          Stripe publishable key missing. Add VITE_STRIPE_PUBLISHABLE_KEY and restart.
        </p>
      ) : (
        <RippleButton
          type="button"
          onClick={openPay}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-nhg text-sm font-medium text-[#0c0c0d]"
          rippleClassName="bg-[#0c0c0d]/20"
        >
          Continue with Stripe
        </RippleButton>
      )}

      <ModalShell open={open} onClose={close}>
        {paid ? (
          <div className="px-1 py-6 text-center">
            <CheckCircle2 className="mx-auto text-emerald-400" size={28} />
            <p className="mt-3 m-0 font-nhg text-lg text-white">Payment received</p>
            <p className="mt-1 font-nhg text-sm text-white/50">
              Thanks. A receipt will go to your email when processing finishes.
            </p>
            {lastIntent ? (
              <p className="mt-2 font-mono text-[10px] text-white/30">ID: {lastIntent}</p>
            ) : null}
            <RippleButton
              type="button"
              className="mt-5 rounded-lg border border-white/15 px-4 py-2 font-nhg text-sm text-white"
              onClick={close}
              rippleClassName="bg-white/25"
            >
              Close
            </RippleButton>
          </div>
        ) : (
          <CheckoutForm
            amount={amount}
            setAmount={setAmount}
            note={note}
            setNote={setNote}
            name={name}
            setName={setName}
            onClose={close}
            onPaid={(id) => {
              setLastIntent(id)
              setPaid(true)
              window.setTimeout(() => setOpen(false), 2200)
            }}
          />
        )}
      </ModalShell>
    </div>
  )
}
