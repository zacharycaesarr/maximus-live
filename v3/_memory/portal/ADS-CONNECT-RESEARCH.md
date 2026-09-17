# Ads connect research (lean)

Goal: paste once at onboard, then zero daily upkeep. Sync pulls numbers on demand (or a future cron).

## Meta (already wired)

**What we use:** System User access token + `sync-meta-ads` Edge Function.

**Zachary pastes at onboard / Meta panel:** Meta Ad Account ID only (digits, no `act_` needed). Example: `2924124977850038`.

**One-time setup (already done for Maximus):**
1. Meta Business Manager → System User with Ads access
2. Token stored as Supabase secret `META_ACCESS_TOKEN`
3. Assign each client ad account to that System User
4. Deploy: `npx supabase functions deploy sync-meta-ads --no-verify-jwt`

**Daily upkeep:** none. Click Sync (or later: scheduled invoke). Token only needs refresh if Meta expires/revokes it.

See also: `META-SYNC-SETUP.md`.

## Google Ads (not built yet)

**Path that matches Meta (zero daily upkeep):**
1. Google Cloud project + OAuth client (Web)
2. One-time OAuth consent as Maximus (or MCC manager)
3. Store **refresh token** as Supabase secret (e.g. `GOOGLE_ADS_REFRESH_TOKEN`)
4. Store developer token + customer id linking like `client_ad_accounts.platform = 'google'`
5. Edge Function exchanges refresh → access token, pulls spend/conversions, writes `client_metrics`

**Zachary would paste at onboard:** Google Ads customer ID (and optional MCC link). Not the OAuth dance every time.

**Avoid:** short-lived access tokens in the UI, per-client daily logins, or desktop scripts.

## Recommendation

Ship Meta-first (done). Add Google when a client needs it: same `client_ad_accounts` row shape, one refresh token secret, one sync function. Keep onboard field optional until then.
