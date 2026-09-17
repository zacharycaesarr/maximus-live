import { useMemo } from 'react'

type BlurOutWordsProps = {
  text?: string
  staggerDelay?: number
  speed?: number
  fps?: number
  durationInFrames?: number
  color?: string
  fontWeight?: number
  textShadow?: string
  className?: string
  hold?: boolean
}

/**
 * Word-by-word blur in/out — copied from v2 (21st blur-out-up adapted).
 * Soft glow is applied per word so it does not form a clipped box.
 */
export default function BlurOutWords({
  text = '',
  staggerDelay = 4,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  color = '#1a1612',
  fontWeight = 500,
  textShadow,
  className,
  hold = false,
}: BlurOutWordsProps) {
  const { enterMs, exitMs, staggerMs, exitStartMs } = useMemo(() => {
    const durationMs = (durationInFrames / fps) * 1000
    const safeSpeed = Math.max(0.01, speed)
    const frameMs = 1000 / fps
    const enter = (17 * frameMs) / safeSpeed
    const exit = (14 * frameMs) / safeSpeed
    const stagger = (staggerDelay * frameMs) / safeSpeed
    const words = text.split(' ').filter(Boolean)
    const exitStart = Math.max(0, durationMs - exit - (words.length - 1) * stagger)
    return { enterMs: enter, exitMs: exit, staggerMs: stagger, exitStartMs: exitStart }
  }, [durationInFrames, fps, speed, staggerDelay, text])

  const words = useMemo(() => text.split(' ').filter(Boolean), [text])

  if (!words.length) return null

  return (
    <span className={className} style={{ color, fontWeight }}>
      {words.map((word, i) => {
        const enter = `mr-v3-bou-in ${enterMs}ms cubic-bezier(0.22,1,0.36,1) ${i * staggerMs}ms backwards`
        const exit = hold
          ? ''
          : `, mr-v3-bou-out ${exitMs}ms cubic-bezier(0.64,0,0.78,0) ${exitStartMs + i * staggerMs}ms forwards`
        return (
          <span
            key={`${word}-${i}`}
            className="hero-blur-word"
            style={{ animation: `${enter}${exit}`, textShadow }}
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}
