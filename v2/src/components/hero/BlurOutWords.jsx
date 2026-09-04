import { useMemo } from 'react'

/**
 * Inline word-by-word blur in/out (adapted from 21st.dev framecn/blur-out-up).
 * No Tailwind — plain CSS keyframes, fits inside hero line.
 */
export default function BlurOutWords({
  text = '',
  staggerDelay = 4,
  speed = 1,
  fps = 30,
  durationInFrames = 90,
  color = '#1a1612',
  fontWeight = 600,
  textShadow,
  className,
  hold = false,
}) {
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
    <span className={className} style={{ color, fontWeight, textShadow }}>
      <style>{`
        @keyframes mr-bou-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes mr-bou-out {
          from { opacity: 1; transform: translateY(0); filter: blur(0); }
          to { opacity: 0; transform: translateY(-14px); filter: blur(8px); }
        }
      `}</style>
      {words.map((word, i) => {
        const enter = `mr-bou-in ${enterMs}ms cubic-bezier(0.22,1,0.36,1) ${i * staggerMs}ms backwards`
        const exit = hold
          ? ''
          : `, mr-bou-out ${exitMs}ms cubic-bezier(0.64,0,0.78,0) ${exitStartMs + i * staggerMs}ms forwards`
        return (
          <span
            key={`${word}-${i}`}
            className="hero-blur-word"
            style={{ animation: `${enter}${exit}` }}
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}
