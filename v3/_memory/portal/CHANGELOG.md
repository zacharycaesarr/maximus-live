# Portal changelog

## 2026-09-14 — Overview polish + onboard safety + light billing

- `packagesFromFocus`: mixed/unknown returns `[]` (calm empty Overview, not all three packages).
- Overview: lucide icons, "Your active work" / single-package labels, cycle line, optional video progress ring.
- SQL `008_video_progress_visible.sql` + admin checkbox.
- Onboard: roster email match only. No OTP / no email from onboard (Send invite stays).
- Billing light mode: bank + PayPal match Stripe CTA; Venmo/Cash App toggles + Open button contrast.
- Portal static CSS grain (opacity ~0.04–0.06). Softened package preset copy for month-to-month.

## 2026-09-14 — Overview tab + package onboard

- Growth → Overview tab (`overview`); collapsible ads / website / video sections.
- SQL `007_client_packages_onboard.sql`: packages, cycle dates, web_phase, package_order.
- Admin Onboard client modal + roster package pills + metrics package editor.
- Research: `ADS-CONNECT-RESEARCH.md` (Meta system user + Google refresh path).

## 2026-09-11 — Visual refinement + History work log

- Tab underline color morphs while sliding; theme dark/light slider; Leva expanded.
- Greeting fallback; softer copy; card labels + admin editor sections pop more.
- History: work log timeline + notes; Action Required banner; login alert function.
- Memory: VISUAL-REFINEMENT-BACKLOG, Stripe Elements plan, QR how-to, session longevity.

## 2026-09-10 — Cal scroll fix + Phase 10 start

- Support: full-width month Cal (no clipped time-only trap) + popup for back-to-date.
- Shared `BookCallButton` + `_memory/SHARED-CAL-BOOKING.md` for hero/marketing chat.
- Phase 10: Meta research, SQL `005`, edge function `sync-meta-ads`, admin Meta sync panel (Katie test).

## 2026-09-10 — Phase 9 Cal.com + tab icons

- `@calcom/embed-react`: inline month view + element-click popup button.
- Link: `zachary-maximus-ambrcs/booking`.
- Dashboard tabs: icons for Growth / Deliverables / History / Support / Billing.

## 2026-09-10 — Phase 8 finish + Phase 9 start

- PayPal NCP link + `@zacharycaesar` + `/portal/paypal-pay.png`.
- Note copy: Invoice ID or business name.
- Fees bank/ACH uses same PayPal link (ACH enabled there).
- Support: mailto request form + Cal.com iframe via `VITE_CAL_COM_URL`.
- Before go-live: custom on-site payment flow (prebuilt OK until then).

## 2026-09-10 — Phase 8 hybrid billing

- Billing tab: No Fees (Venmo/Cash App/PayPal) | Fees (Stripe + ACH).
- QR images in `public/portal/`. Stripe via `VITE_STRIPE_PAYMENT_LINK`.
- Decision: hybrid D from payments research.

## 2026-09-10 — Admin sections + payments research

- Admin Media/History/Activity: dividers, colored titles, icons.
- OTP: shortest allowed is 6 (not 4). Email From display likely SimpleLogin rewrite.
- `PAYMENTS-RESEARCH.md`: fee-free = Venmo/Zelle/Nickel ACH; Stripe has fees.

## 2026-09-10 — Phase 7 activity + force download

- Deliverables download saves the file (no PDF browser preview).
- Audit logs for login, tab views, downloads; roster last_action updates.
- Admin recent activity panel. View-as does not write client activity.

## 2026-09-10 — Phase 6 media vault + saved history

- Storage bucket `portal-assets` + SQL `004_media_storage.sql`.
- Admin upload/delete deliverables; client Deliverables download.
- Admin CRUD history notes; client History tab reads them.

## 2026-09-10 — Phase 5 live metrics + richer account editor

- Realtime `client_metrics` → Growth tab updates without refresh.
- Admin: profile name/company, service focus (ads/website/video/mixed), status, progress %, blurb.
- SQL `003_metrics_engagement_fields.sql`.
- Memory: client types, Phase 4 inventory, FUTURE-LEVA (Leva after phases; hidden in production).

## 2026-09-10 — Phase 4 dashboard shell

- Real tabs with animated transitions: Growth, Deliverables, History, Support, Billing.
- Growth bento: sparkline, status ring, spend mix, week/month toggle; metrics from Supabase.
- `data-portal-slot` markers for 21st.dev swaps. TEST-STRIP updated.

## 2026-09-10 — Auth PKCE fix + code-first login + Phase 3 admin

- Auth callback: session wins; exchange once; strip URL; no PKCE error card when signed in.
- Login leads with 6-digit code (Resend templates).
- Admin: live roster, invite, metrics save, view-as-client.
- Memory: STATUS every turn, TEST-STRIP list, SMTP/OTP notes.

## 2026-09-10 — Phase 2 auth

- Magic link + email code login on `/portal/login`.
- Auth callback at `/portal/auth/callback`.
- Dashboard locked to signed-in users. Admin locked to `profiles.role = admin`.
- Portal memory bank + HOW-TO-TALK (Zachary is not a coder).

## 2026-09-10 — Portal memory bank

- Added `v3/_memory/portal/` (RULES, INDEX, HOW-TO-TALK, DECISIONS, PHASES, CHANGELOG).
- Cursor rule points agents at this bank for `/portal` work.

## 2026-09-10 — Phase 1 foundation

- Shells: `/portal/login`, `/portal/dashboard`, `/portal/admin`.
- Supabase client + SQL migration + `vercel.json` + `.env.example`.
