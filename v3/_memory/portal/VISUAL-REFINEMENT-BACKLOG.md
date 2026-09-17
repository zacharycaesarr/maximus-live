# Visual refinement + upgrade backlog

Logged 2026-09-11 from Zachary’s big refinement prompt. Track status here.

## Phase 10 sync check
- [x] Meta sync works (spend ~$218, CPL ~$3.07 correct on admin)
- [ ] Leads showed **355** (bug: counted every Meta “lead*” action). Fix in edge function; **redeploy** then Sync again → expect **71**

## Done / in this pass
- [x] 30-day stay-signed-in (client already refreshes; dashboard steps + storage key)
- [x] Tab underline color morphs **while** sliding (per-tab colors)
- [x] Softer empty-state / intro copy (less “Maximus is king”)
- [x] Greeting: first name → company → “there” (not raw email local-part)
- [x] Bento card labels + admin editor headers pop more
- [x] History: work log (changelog) + notes layout; admin can add both kinds
- [x] Action Required banner (admin toggle; hidden when off)
- [x] Portal theme toggle (dark / light) + expanded Leva (dev)
- [x] Login alert edge function (email to Zachary; optional secret)
- [x] Memory: Stripe Elements plan, transparent QR how-to, pre-live leftovers

## Opinions locked (Zachary decide later)
- Theme toggle: ship now as low-risk CSS vars; final light palette after 21st.dev pass
- Onboarding questionnaire: **hybrid** — you invite + prefill name/company/focus; optional short “confirm your details” on first login only if name empty
- Growth layouts by service_focus: later brick (ads vs web vs video bentos)
- Login alerts: **email first** (Resend), not SMS (cheaper, no Twilio yet); off-switch when noisy
- Custom Stripe Elements: mapped in `STRIPE-ELEMENTS-PLAN.md` — after visuals settle
- Admin will need tabs/categories later when panels pile up

## Still open (not this pass or partial)
- [ ] Transparent QR assets (Zachary export steps in `QR-TRANSPARENT.md`)
- [ ] Stripe Elements custom checkout (plan only)
- [ ] Per-client Growth layout variants
- [ ] Admin panel IA / categories
- [ ] Hide zero metric cards (pipeline $0) — included if coded this pass
- [ ] Google Ads sync
- [ ] Full custom payment flow before public launch
- [ ] Strip TEST-STRIP.md rows
- [ ] 21st.dev History / Growth swaps

## 21st.dev search ideas (History changelog)
- “timeline” “activity feed” “changelog” “vertical timeline dark”
- “project updates feed” “agency status timeline”
- “bento timeline” “work log”

## History layout (locked for now)
- **Main (left / top):** Work log timeline (date + short line of what was done)
- **Side / below:** Longer notes / recaps (existing notes)
