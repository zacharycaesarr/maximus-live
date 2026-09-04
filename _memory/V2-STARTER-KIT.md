# V2 starter kit — reuse on new client projects

Copy this foundation when starting a new website so Zachary does not reinstall and re-explain the same workflow every time.

## What to copy

From this repo's `v2/` folder:

```
src/lib/
  panelPositions.js      # Leva panel drag persistence
  exportAllTuners.js     # Copy ALL JSON
  parallaxDefaults.js    # (optional) 3D tilt system

src/context/
  ParallaxContext.jsx
  ParallaxTunerContext.jsx
  # Pattern: *TunerContext.jsx per brick

src/components/parallax/
  ParallaxLayer.jsx

src/hooks/
  useScrollActivated.js

_memory/
  V2-LEVA-ORGANIZATION.md
  V2-EDIT-GUIDE.md
```

## npm packages (install once per project)

```bash
npm install leva gsap lenis
# Add when needed:
npm install three @react-three/fiber @react-three/drei
npm install framer-motion
```

## Cursor setup for new projects

1. Create `_memory/RULES.md` with client brand notes
2. Create `_memory/V2-RESET.md` from template (brick checkpoints)
3. Add a Cursor rule: "Read `_memory/RULES.md` and `V2-RESET.md` before V2 work. Every brick gets Leva tuners. Remove Leva before live deploy."
4. Optional: save a **Cursor Skill** from this project's Leva + export pattern

## 21st.dev workflow

Zachary does **not** need Builder plan for implementation.

| What Zachary sends | What AI does |
|--------------------|--------------|
| 21st.dev component URL | Fetch via MCP or adapt from prompt |
| Downloaded file | Use as reference |
| Install prompt from 21st | Adapt to plain React + CSS (no shadcn/Tailwind required) |

Builder plan is only if Zachary wants to preview/tweak in 21st's UI first.

## Standard dev workflow (every project)

1. `npm run dev`
2. Tune sliders in Leva panels
3. Drag panels once (positions save automatically)
4. **Copy ALL JSON** when happy
5. Paste in chat: "lock these in"
6. Before live: remove Leva, bake defaults, remove dev buttons

## Parallax on every element

Wrap any hero/frame element:

```jsx
<ParallaxLayer depth={0.5}>
  <YourComponent />
</ParallaxLayer>
```

Tune global + per-element depth in `Hero · Parallax` panel.

## Gyro on iPhone

First tap on page requests motion permission (iOS requirement). Toggle off in parallax panel if unwanted.
