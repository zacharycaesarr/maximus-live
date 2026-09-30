/**
 * Night-sky dots as a page-sections BACKGROUND layer (not inside Services cards).
 * Tracks the services layout band via #services / [data-services-band].
 * CSS opacity only. No canvas / rAF particles. Delete mount to remove.
 */

import { useEffect, useRef } from 'react'

const FAR = [
  [7, 10], [19, 26], [31, 14], [44, 38], [56, 18], [68, 44], [79, 12], [91, 32],
  [12, 52], [28, 66], [48, 58], [62, 72], [82, 62], [94, 78], [22, 84], [40, 90],
] as const

const MID = [
  [14, 20], [26, 42], [38, 8], [52, 28], [66, 48], [78, 22], [88, 54], [10, 70],
  [34, 78], [58, 86], [74, 68], [46, 46], [18, 36], [84, 40],
] as const

const NEAR = [
  [22, 16], [48, 24], [72, 10], [16, 48], [40, 62], [64, 52], [86, 74], [30, 88],
  [54, 14], [8, 28], [92, 46],
] as const

function Layer({
  pts,
  cls,
  rBase,
}: {
  pts: readonly (readonly [number, number])[]
  cls: string
  rBase: number
}) {
  return (
    <g className={cls}>
      {pts.map(([x, y], i) => (
        <circle
          key={`${cls}-${i}`}
          cx={`${x}%`}
          cy={`${y}%`}
          r={rBase + (i % 3) * 0.15}
          fill="var(--home-text-dark)"
          fillOpacity={0.22 + (i % 5) * 0.08}
        />
      ))}
    </g>
  )
}

/**
 * Absolute star field locked to the Services layout band on #page-sections.
 * Does not live inside SectionFocus, so card scale/parallax does not drag the stars.
 */
export default function ServicesStarField({ opacity = 1, fadeEnd = 100 }: { opacity?: number; fadeEnd?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const fadeStart = Math.max(35, fadeEnd - 30)
  const mask = `linear-gradient(to bottom, #000 0%, #000 ${fadeStart}%, transparent ${fadeEnd}%)`

  useEffect(() => {
    const page = document.getElementById('page-sections')
    const el = ref.current
    if (!page || !el) return undefined

    const sync = () => {
      const band =
        (document.querySelector('[data-services-band]') as HTMLElement | null) ||
        (document.getElementById('services') as HTMLElement | null)
      if (!band) return
      // Layout box relative to page-sections (ignores focus scale transform)
      let top = 0
      let node: HTMLElement | null = band
      while (node && node !== page) {
        top += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }
      el.style.top = `${top}px`
      el.style.height = `${band.offsetHeight}px`
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(page)
    const band = document.querySelector('[data-services-band]') || document.getElementById('services')
    if (band) ro.observe(band)
    window.addEventListener('resize', sync)
    // One late pass after fonts / cards settle
    const t = window.setTimeout(sync, 400)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      window.clearTimeout(t)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      data-services-star-field
      className="pointer-events-none absolute inset-x-0 z-0 overflow-hidden"
      style={{
        top: 0,
        height: 0,
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <Layer pts={FAR} cls="mr-svc-stars-far" rBase={0.55} />
        <Layer pts={MID} cls="mr-svc-stars-mid" rBase={0.7} />
        <Layer pts={NEAR} cls="mr-svc-stars-near" rBase={0.95} />
      </svg>
      <style>{`
        .mr-svc-stars-far {
          animation: mr-svc-star-op 12s ease-in-out infinite alternate;
          animation-delay: -3.2s;
        }
        .mr-svc-stars-mid {
          animation: mr-svc-star-op 16s ease-in-out infinite alternate;
          animation-delay: -7.5s;
        }
        .mr-svc-stars-near {
          animation: mr-svc-star-op 21s ease-in-out infinite alternate;
          animation-delay: -11s;
        }
        @keyframes mr-svc-star-op {
          from { opacity: 0.72; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mr-svc-stars-far,
          .mr-svc-stars-mid,
          .mr-svc-stars-near {
            animation: none;
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  )
}
