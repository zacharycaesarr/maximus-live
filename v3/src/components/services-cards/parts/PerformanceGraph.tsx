import * as m from 'framer-motion/m'

/** SVG performance stroke with a one-time path draw in the Web intro. */
const LINE =
  'M6 53 C20 33 29 30 41 42 S62 56 75 39 S94 41 109 28 S136 -1 165 15'

export function PerformanceGraph({ path = LINE, animated = false, introStagger = .17 }: { path?: string; animated?: boolean; introStagger?: number }) {
  return (
    <svg
      className="performance-graph"
      viewBox="0 0 170 70"
      fill="none"
      aria-hidden
    >
      <path className="performance-glow" d={path} />
      {animated ? <m.path className="performance-line" d={path} variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: .85, delay: introStagger * 3, ease: 'easeOut' } } }} /> : <path className="performance-line" d={path} />}
    </svg>
  )
}
