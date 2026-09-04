# Standing rules — Maximus Reach

Read this file at the start of every prompt / task before changing the site.

## 1. AI privacy (non-negotiable, every live push)

Nobody must know AI helped build or maintain this website. Everything must look like it was made by Zachary / Maximus Reach only.

This applies to every change that goes live, every push, every public file.

- No AI fingerprints in public copy, comments, commit messages, or any file that ships live
- No tooling watermarks or obvious generated-template language in the UI
- Public-facing work should read as human-written and hand-built
- Before any live push, re-check copy and comments against this rule

## 2. Check the memory bank every time

Before doing work, open `_memory/INDEX.md` then `_memory/RULES.md`. Open only the topic files the task needs. Do not load every memory file into context.

When something important changes, update the relevant short file (CHANGELOG / BUSINESS / NEXT / DECISIONS). Do not add a checkpoint unless Zachary asks.

## 7. Premium quality (V2)

V2 must feel hand built and premium. No glitchy materials, no cluttered 3D, no cheap scroll effects. Simplify before adding more. If it does not look like a $10k site, stop and fix before adding features.

## 11. Build vs brainstorm (permanent)

If Zachary asks to add a page section (bento, navbar, footer, etc.), **mount it in the app on that turn** unless he explicitly says brainstorm/ideas only. Memory notes are not a substitute for visible UI. Always verify at `localhost:5174` by scrolling to the new section before saying it is done.

## 9. Design tuner (dev only)

V2 has a Leva slider panel in dev mode so Zachary can adjust layout himself. Remove the DesignTunerProvider and Leva dependency before any live deploy. Zachary's tuned values should be baked into code when he says "lock these in."

## 3. Zachary is not a coder

Explain things in plain language. He is tech-comfortable but does not write code. Prefer short step-by-step directions over jargon. When he needs to edit something himself, say exactly which file to open and what to change.

## 4. No dashes in public text

Do not use dashes of any kind in website copy (no em dashes, no en dashes, no hyphenated asides that read like AI writing). Rewrite with commas, periods, or shorter sentences instead. This includes FAQ answers, headlines, and UI text that visitors see.

## 5. Live deploy

Do not push to the live site until Zachary explicitly says to. Build and preview locally first.

## 6. Brand

Keep the existing Maximus Reach theme (cream / tan / dark brown, Playfair + Inter + DM Mono, motion system) unless he asks to change it.

## 8. Future layout: Z pattern

When expanding the site with new sections after the hero, use a Z pattern layout: content starts on the left, next section shifts emphasis to the right, then back left, and so on. Creates rhythm for a fuller marketing site instead of everything centered like the old business card layout. Mobile still stacks one column.

## 12. Scroll window naming (V2)

- **Browser window** = the shrinking framed hero
- **Pill Dock** = the floating tab bar under the browser window (Web Platforms / Ad Engines / …). Never let it overlap the browser window.
- **Explore stack** = connector line + “EXPLORE MAXIMUS REACH” + seam divider under the Pill Dock
- **Reality Waves Background** = waves behind the scroll/hold reality
- **Explore Waves Background** = waves behind the post-scroll sections

Do not casually restructure the scroll shrink (Checkpoint 18 save point) unless Zachary asks.

## 13. Checkpoints

Only create a new `_memory/checkpoints/` savepoint when Zachary asks. Everyday fixes go in CHANGELOG / BUSINESS / NEXT notes, not a new checkpoint file.
