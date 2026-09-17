# Session longevity (30-day feel)

## Code (already set)
`src/lib/supabase.ts`: `persistSession: true`, `autoRefreshToken: true`, storage key `mr-v3-portal-auth`.

That means: after one successful login, the browser keeps a refresh token and quietly renews access. Clients should not need a new code every day.

## Zachary dashboard check (do once)
Supabase → **Authentication → Sessions** (or Auth settings):
1. Leave **Time-box user sessions** off (or set ≥ 720 hours / 30 days if you use it).
2. Leave **Inactivity timeout** off (or very long) while testing.
3. JWT expiry can stay ~3600s (1 hour). Refresh handles the rest.

## Note
Clearing site data / private browsing / new device still requires a fresh login. That is normal.
