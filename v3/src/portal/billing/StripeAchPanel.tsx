import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { usePortalAuth } from '@/portal/auth/AuthContext'
import PaySpinner from '@/portal/billing/PaySpinner'
import RippleButton from '@/portal/ui/RippleButton'

const pk = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)?.trim() || ''
const stripePromise = pk ? loadStripe(pk) : null

const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

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
            aria-label="Close bank payment"
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Bank ACH payment"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[1] max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0c0c0d] p-4 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6"
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function AchCheckout({
  onPaid,
  onClose,
}: {
  onPaid: (intentId: string) => void
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onPay(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setBusy(true)
    setErr(null)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/portal/dashboard?billing=ach`,
        },
        redirect: 'if_required',
      })
      if (error) throw new Error(error.message || 'Bank payment failed.')
      const status = paymentIntent?.status
      if (status === 'succeeded' || status === 'processing' || status === 'requires_action') {
        onPaid(paymentIntent?.id || '')
        return
      }
      throw new Error('Bank payment did not finish. Try again.')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Bank payment failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onPay} className="space-y-5">
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
            <h2 className="m-0 font-nhg text-xl text-white">Bank / ACH</h2>
            {busy ? <PaySpinner className="h-4 w-4 text-white/70" /> : null}
          </div>
          <p className="mt-1 m-0 font-nhg text-sm text-white/45">
            Link your US bank account. Settles in a few business days.
          </p>
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

      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['us_bank_account'],
        }}
      />

      {err ? <p className="m-0 font-nhg text-sm text-rose-300/90">{err}</p> : null}

      <RippleButton
        type="submit"
        disabled={!stripe || busy}
        className="w-full rounded-lg bg-white px-4 py-3 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
        rippleClassName="bg-[#0c0c0d]/20"
      >
        {busy ? (
          <>
            <PaySpinner />
            Connecting bank…
          </>
        ) : (
          'Pay with bank'
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

/** Stripe ACH Direct Debit modal (replaces PayPal bank link on Fees side). */
export default function StripeAchPanel() {
  const { user } = usePortalAuth()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)
  const [lastIntent, setLastIntent] = useState('')

  const dollarsLabel = useMemo(() => {
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return '$0.00'
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
  }, [amount])

  function close() {
    setOpen(false)
    setClientSecret(null)
    setErr(null)
  }

  async function startAch() {
    if (!pk || !stripePromise) return
    const dollars = Number(amount)
    if (!Number.isFinite(dollars) || dollars < 0.5) {
      setErr('Enter at least $0.50.')
      return
    }
    setBusy(true)
    setErr(null)
    setPaid(false)
    try {
      const client = getSupabase()
      const { data, error } = await client.functions.invoke('create-payment-intent', {
        body: {
          amountCents: Math.round(dollars * 100),
          description: note.trim() || 'Client portal ACH payment',
          clientId: user?.id,
          method: 'us_bank_account',
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
      const secret = data?.clientSecret as string | undefined
      if (!secret) throw new Error('No payment secret returned.')
      setClientSecret(secret)
      setOpen(true)
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Could not start bank pay.')
    } finally {
      setBusy(false)
    }
  }

  return (
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
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-nhg text-sm text-white outline-none"
        />
      </label>

      {err && !open ? <p className="m-0 font-nhg text-sm text-rose-300/90">{err}</p> : null}

      {!pk ? (
        <p className="m-0 font-mono text-[11px] text-white/35">
          Stripe publishable key missing. Add VITE_STRIPE_PUBLISHABLE_KEY and restart.
        </p>
      ) : (
        <RippleButton
          type="button"
          onClick={() => void startAch()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-nhg text-sm font-medium text-[#0c0c0d] disabled:opacity-40"
          rippleClassName="bg-[#0c0c0d]/20"
        >
          {busy ? (
            <>
              <PaySpinner />
              Starting…
            </>
          ) : (
            `Continue with bank · ${dollarsLabel}`
          )}
        </RippleButton>
      )}

      <ModalShell open={open} onClose={close}>
        {paid ? (
          <div className="px-1 py-6 text-center">
            <CheckCircle2 className="mx-auto text-emerald-400" size={28} />
            <p className="mt-3 m-0 font-nhg text-lg text-white">Bank payment started</p>
            <p className="mt-1 font-nhg text-sm text-white/50">
              ACH usually settles in a few business days. You will get an email when it clears.
            </p>
            {lastIntent ? (
              <p className="mt-2 font-mono text-[10px] text-white/30">ID: {lastIntent}</p>
            ) : null}
            <button
              type="button"
              className="mt-5 rounded-lg border border-white/15 px-4 py-2 font-nhg text-sm text-white"
              onClick={close}
            >
              Close
            </button>
          </div>
        ) : clientSecret && stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#22c55e',
                  colorBackground: '#141416',
                  colorText: '#f5f5f5',
                  colorDanger: '#f87171',
                  fontFamily: FONT,
                  borderRadius: '10px',
                },
              },
            }}
          >
            <AchCheckout
              onClose={close}
              onPaid={(id) => {
                setLastIntent(id)
                setPaid(true)
                window.setTimeout(() => close(), 2400)
              }}
            />
          </Elements>
        ) : null}
      </ModalShell>
    </div>
  )
}
