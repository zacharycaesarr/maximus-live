# Revert to pre scroll-window hero (2026-09-02)

## What this checkpoint is

The hero section was locked (shader, kinetic text, subhead, particles, nav, service cards, parallax) **before** the scroll-into-browser-window animation was added.

## Your tuned values

Saved at `_memory/checkpoints/pre-scroll-window-2026-09-02.json`. Paste into localStorage keys or say **"lock these in"** in chat to bake into code defaults.

## Git revert (recommended once v2 is committed)

```bash
cd C:\Users\hitso\Projects\mcclure-realty-overhaul
git tag checkpoint/pre-scroll-window   # if not tagged yet
git checkout checkpoint/pre-scroll-window -- v2/
```

Or create a branch at this point:

```bash
git checkout -b checkpoint/pre-scroll-window
git add v2 _memory
git commit -m "checkpoint: hero locked before scroll window"
```

Then to experiment on scroll, branch off:

```bash
git checkout -b feature/scroll-window
```

To go back:

```bash
git checkout checkpoint/pre-scroll-window
```

## Disable scroll window without git

In `v2/src/App.jsx`, set `SCROLL_WINDOW_ENABLED = false` (flag added for safe rollback).
