# Meta ads sync — click-by-click (Zachary)

You already made the Meta app + System User + secret + SQL. This is only how to finish and test.

## A. Redeploy the sync brain (one command)

1. Open Cursor terminal in the **`v3`** folder.
2. Run:

```bash
npx supabase functions deploy sync-meta-ads --no-verify-jwt
```

3. Wait until it says the function deployed.

## B. Put Katie’s ad numbers on YOUR row (no invite to Katie)

1. Open the site → `/portal/admin` (you must be admin).
2. Click **your own email** in the client list (not Katie).
3. Scroll to **Meta ads sync**.
4. In **Meta ad account ID** paste: `2924124977850038`
5. Label (optional): `McClure Realty`
6. Click **Save link**.
7. Click **Sync Meta ads**.

### Success
You should see a message like: last 30 days spend / leads / CPL.  
Leads should be about **71** (not 355). Spend about **$218**.

### If it errors
- “function not found” → do step A again.
- Meta permission error → System User still has the ad account + token secret `META_ACCESS_TOKEN` in Supabase → Edge Functions → Secrets.

## C. Later (when ready for Katie)
1. Admin → **Send invite** to her real email (that creates her account).
2. Open her row → same Meta ad account ID → Save link → Sync.
3. Clear the Meta link from your own row if you want.

You do **not** need a new Meta app every time. One token covers every client ad account you assign to that System User.
