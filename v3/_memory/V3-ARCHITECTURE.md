# V3 architecture — Brick 1

```
v3/
  public/fonts/          Neue Haas Grotesk Display TTFs
  public/assets/         mm-logo.svg
  src/
    components/
      ui/tailwind-css-background-snippet.tsx   # 21st bg, mocha remap
      nav/DirectNav.tsx, ReachWordmark.tsx
      hero/DirectHero.tsx, HeroKineticText.tsx, BlurOutWords.tsx, SideVisualPlaceholder.tsx
    context/             Leva tuner providers
    lib/                 defaults + levaRemember + cn()
  _memory/               persistent notes
```

## Leva folders

- Main (I want Max To..) Text
- Nav
- Nav · REACH stretch
- Hero layout & copy
- Background

## Run

```bash
cd v3
npm run dev
```

Open http://localhost:5175
