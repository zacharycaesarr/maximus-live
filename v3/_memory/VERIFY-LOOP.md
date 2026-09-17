# Agent verify loop (standing)

Before telling Zachary a UI fix is done:

1. Open the live v3 URL (`npm run dev` → localhost).
2. Screenshot the full hero (and a narrow width if layout/responsive was touched).
3. Actually exercise the change: hover Get Started for the hand, drag Leva sliders that were added, drag/surf cards if touched.
4. Confirm nothing is clipped off-screen and Leva-driven transforms are visible on screen.
5. Only then report done.

Code compiling / HMR updating is not enough.
