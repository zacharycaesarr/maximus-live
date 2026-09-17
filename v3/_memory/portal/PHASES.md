# Portal phases

| Phase | Status | Plain English |
|---|---|---|
| 1 Foundation | Done | Empty dark portal pages + database blueprint + keys wiring |
| 2 Auth | Done | Real email login + lock private pages |
| 3 Admin | Done | Roster, invite, edit metrics, view as client |
| 4 Dashboard shell | Done | Real tabs + Growth bento (21st.dev swap-ready) |
| 5 Live analytics | Done | Admin save → client dashboard updates live |
| 6 Media + history | Done | File vault uploads + saved notes |
| 7 Activity logs | Done | Login / tabs / downloads tracked on roster |
| 8 Stripe | Done (hybrid) | No-fee apps + Stripe card + PayPal bank/ACH |
| 9 Cal.com | Done | Inline Cal embed + popup button + email form |
| 10 Ads APIs | In progress | Meta sync first (Katie); Google later |

## How Zachary becomes admin (needed to test `/portal/admin`)

1. Log in once with magic link so your row exists in `profiles`.
2. Open Supabase → **Table Editor** → **profiles**.
3. Find your email row. Change **role** from `client` to `admin`. Save.
4. Or SQL Editor, paste (use your real email):

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL_HERE';
```

5. Refresh the portal (or sign out and back in). Open `/portal/admin`.
