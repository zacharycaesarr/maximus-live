# Pre-live checklist (functionally done)

Fill / check as we finish. Visuals can still change after this.

## Showcase (built)
- [x] Auth (OTP / magic link) + admin
- [x] Growth live metrics + Meta sync (Katie test)
- [x] Deliverables + History (work log + notes)
- [x] Activity logs
- [x] Billing hybrid (apps + Stripe card modal + Stripe ACH)
- [x] Support email + Cal.com
- [x] Action Required banner
- [x] Theme toggle + Leva (dev)
- [x] Session persistence (refresh + dashboard settings)
- [x] Overview packages (ads / website / video) + empty calm state
- [x] Onboard stamps roster only (no email from onboard)
- [x] Light-mode billing CTA contrast

## Client-facing copy cleanup (before live)
- [x] Card name placeholder → Cardholder (not real names)
- [x] Remove internal “card preview updates…” helper under pay card
- [x] Rename “Maximus card checkout” → “Pay by card”
- [x] Soften dashboard header / Overview empty + month-to-month package copy
- [ ] Sweep remaining internal/dev blurbs across portal (login, admin hints, test IDs)
- [ ] Strip TEST-STRIP placeholders
- [ ] Client profiles have real full names (no demo Katie / Zachary leftovers in UI)

## Before calling it “done enough”
- [ ] Meta lead count fixed on redeploy (71 not 355)
- [ ] SQL 006 run
- [ ] SQL 007 + 008 run (packages + video progress toggle)
- [ ] Login alert function deployed + Resend secret (or skip)
- [ ] Transparent QR assets
- [ ] Redeploy `create-payment-intent` after ACH method support
- [ ] Confirm Stripe ACH enabled + Financial Connections in Test mode
- [ ] Custom full payment flow locked before public launch
- [ ] Optional: Google Ads sync

## Not required for “functionally done”
- 21st.dev final visuals
- Deep Leva every pixel
- Admin category tabs (later when panels pile up)
