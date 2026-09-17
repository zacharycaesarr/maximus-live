# Phase 10 — Ads APIs (research + plan)

**Started:** 2026-09-10  
**Test client:** Katie / McClure Realty (Staunton VA) — Meta ads Zachary already manages.

## Goal (plain English)
Growth tab numbers (spend, leads, cost per lead) fill in **automatically from Meta** instead of only typing them in admin. Manual edit still works as backup.

## What we are NOT doing in the first brick
- Google Ads (later in Phase 10 if needed)
- Letting clients connect their own Meta login (agency model: Maximus pulls on their behalf)
- Putting any Meta token in the browser or `VITE_*` env (that would leak the key)

## How Meta access works
1. Meta Business Manager already has Katie’s ad account (Zachary has access).
2. Create a **System User** on Maximus’s Business, assign Katie’s **Ad account** (Analyst is enough to read).
3. Generate a System User token with **`ads_read`** (never expires if set up right).
4. Store that token only in **Supabase Edge Function secrets** (`META_ACCESS_TOKEN`).
5. Portal admin saves Katie’s **Ad account ID** (the number from Ads Manager, often shown as `act_123456789`).
6. Admin clicks **Sync Meta ads** → server calls Meta → writes into `client_metrics` → dashboard updates live.

### API (what the server calls)
```
GET https://graph.facebook.com/v21.0/act_{AD_ACCOUNT_ID}/insights
  ?fields=spend,actions,cost_per_action_type
  &date_preset=last_30d
  &level=account
  &access_token=…
```
- **Spend** → `ad_spend`
- **Leads** → from `actions` where `action_type` includes `lead` (or lead form types Meta returns)
- **CPL** → spend / leads (or Meta `cost_per_action_type` for lead)

Development-mode Meta apps can read accounts owned/shared with the Business that owns the app **without** full App Review, as long as the System User is assigned those assets. Good enough for Maximus + Katie testing.

## Architecture (fits Vite + Supabase, not Next.js)
| Piece | Role |
|---|---|
| `client_ad_accounts` table | Links a portal client → Meta (or later Google) account id |
| Supabase Edge Function `sync-meta-ads` | Holds the secret token; talks to Meta; updates metrics |
| Admin “Sync Meta ads” button | Zachary triggers sync (cron can come later) |
| Existing Realtime on `client_metrics` | Client Growth tab updates without refresh |

## Zachary setup checklist (do these when ready)
1. Open [Meta Business Suite](https://business.facebook.com) → find McClure / Katie ad account → copy **Ad account ID**.
2. Developers → your app (or create “Maximus Reach Portal”) → add Marketing API.
3. Business Settings → System Users → create e.g. `maximus-portal-sync` → **Add Assets** → that ad account → Analyst.
4. Generate token → scopes: **`ads_read`** (only). Copy once.
5. Supabase → Project Settings → Edge Functions → Secrets → add `META_ACCESS_TOKEN` = that token. Also need `SUPABASE_SERVICE_ROLE_KEY` available to the function (usually automatic).
6. Run SQL `005_meta_ad_sync.sql` in Supabase SQL Editor.
7. Deploy function `sync-meta-ads` (Zachary can use Dashboard or CLI; agent will provide files).
8. In portal admin on Katie’s row: paste ad account ID → Sync.

## Success for Phase 10 (Meta slice)
- [ ] Katie linked to Meta ad account id in admin
- [ ] Sync pulls real spend/leads into Growth
- [ ] Manual numbers still editable
- [ ] Token never in frontend
- [ ] Google Ads = optional follow-up brick

## After Phase 10 (showcase)
Fill `portal/PRE-LIVE-CHECKLIST.md`: what we built, what’s optional left, checklist before “functionally done” (visuals still later).
