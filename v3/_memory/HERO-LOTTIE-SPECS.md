# Hero hand Lottie — docking method (locked)

## Problem
Absolute positioning relative to the hero box fails when:
- the Get Started button sits inside a parallax/transformed parent
- the window resizes
- Lenis or browser chrome changes scroll metrics

That made the hand look “random” on smaller Chrome windows.

## Solution (use this forever)
1. **Portal the hand to `document.body`**
2. Use **`position: fixed`**
3. Every frame (rAF) while shown, read **`[data-get-started-btn].getBoundingClientRect()`** and place the hand against that edge
4. Transform origin = the button edge the hand grows from
5. Scale down to fit leftover viewport space instead of teleporting or hiding (except true mobile / very narrow)

Never subtract hero-relative offsets for the live dock. Viewport coords only.

## UX
- Hand emerges from the Get Started button (default: right side)
- Idle Get Started = mocha; hover = black (matches the sketch hand)
- Get Started sits on the right of the CTA pair so a right-side hand has room
