# Portal memory — standing rules

Zachary uses this chat for **everything under `/portal`**.

**Every turn / every prompt:** re-read `STATUS.md` + this file + `PHASES.md` before acting. Do not rely on chat memory alone.

1. Brick by brick. Do not start the next phase until Zachary says go (unless he explicitly says fix then continue).
2. **Never touch** the marketing homepage or cream/mocha marketing pages. Portal code stays in `src/portal/**`, `src/lib/supabase.ts`, SQL under `supabase/`, and light route mounts in `App.tsx` only.
3. Stack: Vite + React Router + Supabase. Env vars must be `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` via `import.meta.env`.
4. Admin lives at `/portal/admin` (not `/admin`).
5. Portal look: dark Railway-like (`#0c0c0d`), crisp borders, monospace labels. Motion is wanted (fluid, interactive). Visual polish comes from Zachary (21st.dev links, etc.); you own backend + structure.
6. Leva for portal: panel title **Maximus · Portal**. localStorage keys `mr-v3-portal-*`.
7. Do not push live until Zachary says so.
8. **Speak for a non-coder.** Zachary is not a developer. Explain in plain English, be thorough on *his* next steps, avoid jargon or translate it in one line. See `HOW-TO-TALK.md`.
9. Gemini / other AIs are optional second opinions. Cherry-pick. Do not follow bad advice.
10. Human-coded look. No em dashes in visitor-facing copy.
11. Free stack first (Supabase + Vercel). Stripe and Cal.com wait until Zachary asks.
12. After each phase: update `CHANGELOG.md` + `STATUS.md` and tell Zachary what changed + exact next clicks he needs.
13. Track temporary/test UI in `TEST-STRIP.md`. Strip before go-live.
14. Login UX: **6-digit email code is primary**. Magic link is backup. SMTP via Resend (`hello@maximusreach.com`).
15. Clients include website + video jobs, not only ads. Admin editor must support those visuals.
16. Deep visual/Leva polish after functional phases (`FUTURE-LEVA.md`). Leva is DEV-only on live builds.
