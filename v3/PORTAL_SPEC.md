# Maximus Reach Client Portal - Architecture Spec

## Tech Stack
- Vite + React + React Router (same V3 marketing app; portal isolated under `/portal`)
- Tailwind CSS & Framer Motion
- Supabase (PostgreSQL, Auth, Realtime, Storage)
- Deploy: Vercel SPA (`vercel.json` rewrites to `index.html`)

## Env (Vite)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Use `import.meta.env` only. Never `NEXT_PUBLIC_` or `process.env`.

## Account Creation (Hybrid Flow)
1. Admin-Provisioned (Closed Deals): Admin enters client details in `/portal/admin`. Supabase creates the user and sends a Magic Link welcome email.
2. Self-Serve (Inbound): Prospects completing `/start` can later be written via webhook and emailed a Magic Link.

## Database Schema (PostgreSQL)
See `supabase/migrations/001_portal_schema.sql`.
- `profiles`: id, email, role ('client' | 'admin'), full_name, company_name, last_login_at, last_action, last_action_at
- `client_metrics`: client_id, ad_spend, leads_generated, cost_per_lead, pipeline_value, spend_breakdown, updated_at
- `media_assets`: client_id, title, file_url, status
- `info_history`: client_id, title, body
- `audit_logs`: client_id, action_type, route, created_at

## Core Routes
- `/portal/login`: Passwordless email OTP / Magic Link (Phase 2)
- `/portal/dashboard`: Client hub. Protected. Metrics, media, history, support.
- `/portal/admin`: Agency control panel. Protected (role === admin). Roster, metrics editor, view-as-client.

## Auth (Vite, not Next middleware)
- React `PortalAuthProvider` wraps `/portal/*` only.
- `RequireAuth` / `RequireAdmin` route guards.
- Magic link redirect: `/portal/auth/callback`.
- Homepage / marketing routes stay untouched.
