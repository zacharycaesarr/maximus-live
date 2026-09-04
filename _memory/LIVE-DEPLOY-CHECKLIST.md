# Live deploy checklist (read before ANY push to maxmarket.live)

This is a permanent rule. Read `_memory/RULES.md` section 1 AND this file before going live.

## The standard

Nothing on the live site may look or read like AI built it. Fellow developers inspecting source must not suspect Cursor, Leva, or generated scaffolding.

## Before deploy

### Public copy
- [ ] No em dashes, en dashes, or hyphenated AI-style asides in visitor text
- [ ] No "delve", "leverage", "seamless", "cutting-edge", or template marketing filler
- [ ] Headlines sound like Zachary wrote them, not a landing page generator

### Code (view source / inspect element)
- [ ] Remove ALL Leva panels, dev stores, and `Copy ALL JSON` button
- [ ] Remove `scroll-spacer` and other dev-only DOM
- [ ] Strip comments that mention AI, Cursor, Leva, 21st, tuner, or dev workflow
- [ ] Rename generic component names if they read like imports (`AetherParticles` ok if styled; `HeroKineticText` fine)
- [ ] No `console.log` debug output
- [ ] Bake tuner values into `*Defaults.js` files, delete localStorage keys from docs

### Build
- [ ] `npm run build` passes
- [ ] Test mobile + desktop
- [ ] Lighthouse perf check (particles off or reduced on mobile if needed)

### Git
- [ ] Commit messages sound human, no "feat: implement AI hero"
- [ ] No `.cursor/`, `_memory/`, or dev guides in deploy branch if they would ship

## Optional hardening (later)
- Minify + bundle so source is harder to read (Vite production build already helps)
- Do NOT rely on hiding code from inspect (impossible). Focus on clean, human authorship instead.

## Who triggers this
Zachary says "push live" or "deploy". Agent must read this file first, every time.
