import { useEffect, useState } from 'react'

/**
 * Full-line blur-in entrance (adapted from 21st framecn/blur-out-up enter keyframe).
 */
export default function BlurInLine({ text, active, className, lineStyle }) {
  const [playKey, setPlayKey] = useState(0)

  useEffect(() => {
    if (active) setPlayKey((k) => k + 1)
  }, [active])

  if (!text) return null

  return (
    <span className={className}>
      <span
        key={playKey}
        className={`blur-in-line${active ? ' blur-in-line--play' : ''}`}
        style={lineStyle}
      >
        {text}
      </span>
    </span>
  )
}
