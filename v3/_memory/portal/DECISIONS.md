# Portal decisions

## 2026-09-10 — Phase 8 hybrid (locked)

- Fee-free apps left (Venmo / Cash App / PayPal). Fees right: Stripe card + PayPal bank/ACH.
- PayPal NCP: `G6B2ZPGDG4WTC`, handle `@zacharycaesar`. ACH = that same PayPal checkout.
- Prebuilt links for now. **Custom payment flow required before go-live.**

## 2026-09-12 — Invite-only portal

- Public login cannot create accounts. Admin invite still can.
- Funnel: Cal book → talk → Zachary invites + tailors → invoice + portal link.
- Homepage keeps a portal entry that only signs invited clients in.

## 2026-09-10 — Phase 6 media

- Deliverables via Supabase Storage; history notes in `info_history`.
- Private bucket; signed download links for clients.

## 2026-09-10 — Phase 5 + visuals process

- Live Realtime metrics. Admin edits whole account including website/video progress fields.
- Visuals/21st.dev/Leva deep polish waits until build phases settle (`FUTURE-LEVA.md`).
- Production: Leva stays DEV-only; visitors never see it. Bake Remembered values before go-live.

## 2026-09-10 — Phase 4 visuals

- Client dashboard tabs + Growth bento are the visual home base.
- Zachary swaps looks via 21st.dev using `data-portal-slot` ids (see TEST-STRIP.md).
- Live Realtime chart updates wait for Phase 5.

## 2026-09-10 — Auth + admin

- PKCE callback hardened (session-first). OTP code is primary login UX.
- Resend SMTP + email templates with `{{ .Token }}` (Zachary configured).
- Phase 3 admin tools landed under `/portal/admin`.
- Agents must re-read portal `STATUS.md` every turn. Track temp UI in `TEST-STRIP.md`.

## 2026-09-10 — Portal memory bank

- Portal-specific memory lives in `v3/_memory/portal/`.
- This chat is the home for all `/portal` work.
- Explain everything for a non-coder (see HOW-TO-TALK.md).

## 2026-09-10 — Stack + routes

- Vite + React Router inside V3 (not Next.js).
- Routes: `/portal/login`, `/portal/dashboard`, `/portal/admin`, `/portal/auth/callback`.
- Auth: Supabase magic link / email OTP. React AuthProvider (not Next middleware).
- Admin role: `profiles.role = 'admin'`. Elevate via SQL in Supabase (see PHASES.md).
