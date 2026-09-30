import type { Variants } from 'framer-motion'

export type WebMotionSettings = {
  enabled: boolean
  visible: boolean
  introComplete: boolean
  introDuration: number
  introDistance: number
  introStagger: number
  idleBrowser: number
  idleRail: number
  idleAnalytics: number
  idleBoost: number
  idleSway: number
  idleBrowserDuration: number
  idleRailDuration: number
  idleAnalyticsDuration: number
}

const ease = [0.22, 1, 0.36, 1] as const

export function entrance(distance: number, delay: number, duration: number): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease } },
  }
}

export function fade(delay: number, duration: number): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration, delay, ease: 'easeOut' } },
  }
}
