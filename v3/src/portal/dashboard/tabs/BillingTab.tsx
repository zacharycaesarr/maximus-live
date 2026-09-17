import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, CreditCard, ExternalLink, Wallet } from 'lucide-react'
import { FEE_FREE_METHODS, type FeeFreeProvider } from '@/portal/lib/billingConfig'
import StripePayPanel from '@/portal/billing/StripePayPanel'
import StripeAchPanel from '@/portal/billing/StripeAchPanel'
import RippleButton from '@/portal/ui/RippleButton'

const PAYPAL = FEE_FREE_METHODS.find((m) => m.id === 'paypal')
const APP_METHODS = FEE_FREE_METHODS.filter((m) => m.id !== 'paypal')

/**
 * Hybrid billing: fee-free apps (Venmo / Cash App) | Fees (card, ACH, PayPal).
 */
export default function BillingTab() {
  const [provider, setProvider] = useState<Exclude<FeeFreeProvider, 'paypal'>>('venmo')
  const method = APP_METHODS.find((m) => m.id === provider) ?? APP_METHODS[0]

  return (
    <div data-portal-slot="billing-panel" className="space-y-4">
      <p className="m-0 max-w-2xl font-nhg text-sm text-white/45">
        Choose how you want to pay. Left side is typically free. Right side covers card, bank, and
        PayPal when you want a receipt trail.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.section
          className="portal-card overflow-hidden p-4 md:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border-b border-emerald-400/20 pb-3">
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/90">
              No fees
            </p>
            <p className="mt-1 font-nhg text-lg text-white">Venmo or Cash App</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {APP_METHODS.map((m) => {
              const on = m.id === provider
              return (
                <RippleButton
                  key={m.id}
                  type="button"
                  onClick={() => setProvider(m.id as 'venmo' | 'cashapp')}
                  className={[
                    'portal-btn-secondary rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide',
                    on
                      ? 'portal-btn-secondary-on border-emerald-400/50 bg-emerald-500/15 text-white'
                      : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/75',
                  ].join(' ')}
                  rippleClassName="bg-emerald-300/30"
                >
                  {m.label}
                </RippleButton>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(150px,180px)] sm:items-start"
            >
              <div>
                <p className="m-0 font-nhg text-base text-white">
                  {method.label}{' '}
                  <span className="text-white/45">{method.handle}</span>
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-4 font-nhg text-sm leading-relaxed text-white/50">
                  {method.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <a
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-btn-fee-free mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/15 px-4 py-2.5 font-nhg text-sm text-emerald-100 no-underline ring-1 ring-emerald-400/30 transition hover:bg-emerald-500/25"
                >
                  Open {method.label}
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="mx-auto w-full max-w-[180px]">
                <div className="overflow-hidden rounded-lg bg-white p-2.5">
                  <img
                    src={method.qrSrc}
                    alt={`${method.label} QR`}
                    className="block h-auto w-full object-contain"
                  />
                </div>
                <p className="mt-2 mb-0 text-center font-mono text-[10px] text-white/40">
                  {method.handle}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.section
          className="portal-card overflow-hidden p-4 md:p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border-b border-orange-400/20 pb-3">
            <p className="m-0 font-mono text-[10px] uppercase tracking-[0.16em] text-orange-300/90">
              Fees
            </p>
            <p className="mt-1 font-nhg text-lg text-white">Card, bank, or PayPal</p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-400/30 bg-orange-500/10 text-orange-300">
                  <CreditCard size={18} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 font-nhg text-base text-white">Pay by card</p>
                  <p className="mt-1 font-nhg text-sm leading-relaxed text-white/45">
                    Secure checkout on this page. Card details stay with Stripe. Processing fees
                    apply.
                  </p>
                </div>
              </div>
              <StripePayPanel />
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/10 text-sky-300">
                  <Building2 size={18} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 font-nhg text-base text-white">Pay by bank (ACH)</p>
                  <p className="mt-1 font-nhg text-sm leading-relaxed text-white/45">
                    Debit a US bank account through Stripe. Usually cheaper than cards. Clears in a
                    few business days.
                  </p>
                </div>
              </div>
              <StripeAchPanel />
            </div>

            {PAYPAL ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-200">
                    <Wallet size={18} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="m-0 font-nhg text-base text-white">PayPal</p>
                      <span className="rounded border border-amber-400/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-200/90">
                        ~2.99% + $0.49
                      </span>
                    </div>
                    <p className="mt-1 font-nhg text-sm leading-relaxed text-white/45">
                      Opens the PayPal checkout page. Add your Invoice ID or business name in the
                      note.
                    </p>
                    <a
                      href={PAYPAL.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-nhg text-sm font-medium text-[#0c0c0d] no-underline transition hover:opacity-90"
                    >
                      Continue to PayPal
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
