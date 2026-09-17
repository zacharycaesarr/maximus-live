# Future: Client Portal (robust + admin-editable)

**In progress — Phase 1 foundation landed under `/portal`.** Build brick by brick.

## What clients need

- **Dashboard** — home for their projects / jobs
- **Payments** — pay invoices / accept payment links (later)
- **Analytics / updates** — progress on the job (ads reporting if possible)
- **Media library** — download creatives, assets, files
- Plus anything else a serious agency portal needs (messages, files, invoices history, onboarding status)

## What Zachary needs (admin)

- Fully **editable / customizable** by him as admin at `/portal/admin`
- Change anything on client accounts on the fly
- Control what each client sees
- Store client-specific files and data
- Feels like a **corporation-grade** portal, not a thin demo
- Dark Railway-like polish; motion allowed; homepage stays cream/mocha

## Cost constraint

- Prefer **no monthly subscription** if possible; one-time fees OK
- Supabase Free works for build; free projects can pause after ~1 week idle. Keepalive or Pro later for real clients.
- Vercel Hobby for hosting the Vite SPA; confirm commercial terms before heavy production traffic.

## Stack (locked)

- **Vite + React Router** portal routes inside V3 (not Next.js)
- **Supabase** for auth, DB, realtime, storage
- **Stripe / Cal.com** deferred until Zachary asks
- GitHub Pages alone cannot host a secure login + payments portal
