# Stripe Elements — how-to

## Visual stage: yes
Card modal is live. Edit look in `StripePayPanel.tsx` + `FlippableCreditCard.tsx`.

## Bring back the Stripe Developers toolbar
1. Open portal Billing → Continue with Stripe (modal open).
2. Click into Card number so an Element is focused.
3. Look for a small floating **stripe Developers** chip (often bottom of the page or over the form).
4. If missing: hard refresh, stay on `http://localhost:…`, Test mode publishable key only.
5. That toolbar is Stripe’s overlay. It is not part of Maximus. Appearance tweaks there reset unless we put them in our code (which we already do).

## Test card
`4242 4242 4242 4242` · any future expiry · any CVC · then Pay.
Yes: fill amount + note + card → Pay. That is the whole path.

## ACH (bank)
1. ACH Direct Debit enabled in Stripe (you did this).
2. Edge Function deployed with `method: us_bank_account`.
3. Billing → Pay by bank → amount → Continue with bank.
4. Stripe shows Financial Connections / bank form.
5. Test banks: use Stripe’s test account numbers from their ACH docs.

## Look for payments
Stripe Dashboard → **Payments → Payments** (not Acceptance analytics) · Test mode.

## Font
Do not set `fontFamily: 'inherit'`. Use the explicit sans stack in code.
