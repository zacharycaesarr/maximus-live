/** Reference mechanics, kept together for later tuning. Portrait settings are separate. */
export const aboutMotionConfig = {
  breakpoint: 769,
  services: { wrapperTravel: 100, visualTravel: 15, characterTravel: 150, transitionDuration: 1.25, transitionEase: 'power1.inOut', characterDuration: 1, characterEase: 'power2.out', characterStagger: .02, characterDelay: .2, tolerance: 10, wheelSpeed: -1, gestureQuietMs: 250, pinTravelVh: 15 },
} as const
