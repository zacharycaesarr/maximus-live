# Client funnel (invite-only) — locked direction

## Order of operations
1. Prospect books a call from the **main site** (Cal).
2. You talk (~20 min).
3. You create/tailor their portal in **Admin → Onboard client** (email, packages, cycle). **No email goes out.**
4. When you are ready for them to log in, use **Send invite** (that one emails a login code). Or wait and send the portal link yourself later.
5. They enter email → get code → dashboard.

## Why invite-only (agree)
This is not a SaaS self-serve product. Open signup creates junk accounts and a messy first screen. Prefilling their project in admin is the whole point of the portal.

## Site
- Keep a **Client portal** link/button on the homepage (login only).
- Login: `shouldCreateUser: false` + friendly “Email not found…” copy.
- Also turn off public signups in Supabase Auth settings if available.

## Testing without Katie
- Use **your** admin account, or invite a throwaway email **you** own.
- Do not invite Katie until you are ready for her to see it.
