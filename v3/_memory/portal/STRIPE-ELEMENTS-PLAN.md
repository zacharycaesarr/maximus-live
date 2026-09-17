# Custom Stripe Payment Element (plan)

Replace “open Stripe Payment Link” with an **on-site** card form in Billing (Fees column). Keep a small “Powered by Stripe” trust line; button/branding stays Maximus Reach.

## Why an Edge Function
Vite cannot hold `sk_live` / `sk_test`. Browser only gets a short-lived `clientSecret`.

## Stack
- `@stripe/stripe-js` + `@stripe/react-stripe-js` (`PaymentElement`)
- Supabase Edge Function `create-payment-intent`
- Secrets: `STRIPE_SECRET_KEY`, optional `STRIPE_WEBHOOK_SECRET`
- Frontend: `VITE_STRIPE_PUBLISHABLE_KEY` only

## Flow
1. Client enters amount (and optional invoice note) on Billing.
2. Frontend `functions.invoke('create-payment-intent', { amountCents, clientId })`.
3. Function verifies auth, creates PaymentIntent, returns `clientSecret`.
4. Mount `<Elements><PaymentElement /></Elements>` in a Maximus-styled panel.
5. `stripe.confirmPayment` → success UI; webhook later can mark invoice paid.

## Files to add (when building)
- `supabase/functions/create-payment-intent/index.ts`
- `src/portal/billing/StripePayPanel.tsx`
- Wire into `BillingTab.tsx` Fees → card section
- `.env.example` publishable key note

## Zachary needs
1. Stripe Dashboard → Developers → API keys (test first).
2. Supabase secret `STRIPE_SECRET_KEY`.
3. `VITE_STRIPE_PUBLISHABLE_KEY` in `.env.local`.
4. Deploy function.

## Order vs visuals
Build after portal visual pass settles so the form matches final dark/light tokens. Payment Link stays until then.
