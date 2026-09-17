# Portal Leva + go-live visuals (do after build phases)

## Decision
Finish functional phases first (through media/billing as needed). **Then** expand Leva on the portal so Zachary can tweak spacing, accents, card radius, motion, copy, etc. without code.

## How Leva works today
- Panel title: **Maximus · Portal**
- Already **dev-only**: wrapped in `import.meta.env.DEV`
- Keys: `mr-v3-portal-*` (+ Remember like the marketing site)

## Will clients see Leva when the site is live?
**No.** When we ship a production build (`npm run build` → Vercel), that DEV check is false, so the black Leva panel is **not included** for visitors.

You do **not** need to manually delete Leva right before go-live for safety. It simply will not show on the live site.

## How Zachary edits visuals after go-live
1. **While building / on localhost:** use Leva + Remember (after we expand portal tuners).
2. **Before go-live:** bake the remembered values into code defaults (agent does this when Zachary says lock visuals).
3. **After go-live tweaks:** change on localhost (or a private preview), Remember, bake again, redeploy. Visitors never get the panel.

Optional later (only if needed): a secret `/portal/admin/design` mode for Zachary only. Not required now.

## Todo when phases settle
- [ ] Expand portal Leva folders (Growth, Tabs, Cards, Motion, Copy)
- [ ] Wire tuners to CSS variables / props on dashboard shells
- [ ] Document Remember keys in TEST-STRIP / CHANGELOG
- [ ] On go-live: bake values; confirm Leva absent in production build
