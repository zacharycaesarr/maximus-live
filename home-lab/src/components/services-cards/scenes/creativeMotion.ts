import type { Variants } from 'framer-motion'

export type CreativeMotionSettings = {
  enabled: boolean
  entered: boolean
  visible: boolean
  introComplete: boolean
  introDuration: number
  introStagger: number
  introDistance: number
  idleVideo: number
  idleSocial: number
  idleBrand: number
  idleVideoDuration: number
  idleSocialDuration: number
  idleBrandDuration: number
}

const ease = [0.22, 1, 0.36, 1] as const

/** Every independent entrance has a different start but the same finish. */
export function creativeEntrance(total: number, delay: number, y: number, x = 0): Variants {
  const start = Math.min(delay, Math.max(0, total - .28))
  return {
    hidden: { opacity: 0, x, y },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: total - start, delay: start, ease } },
  }
}
