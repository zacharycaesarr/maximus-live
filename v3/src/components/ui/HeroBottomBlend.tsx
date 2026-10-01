/**
 * Soft fade at the bottom of a hero so the next section doesn't hard-cut.
 * Sit absolute at the bottom of the hero; pass the NEXT section's bg color.
 * Taller + multi-stop so it reads as a blend, not a line.
 */
export default function HeroBottomBlend({
  toColor = '#f3f1ec',
  height = 140,
  className = '',
}: {
  toColor?: string
  height?: number
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] ${className}`}
      style={{
        height,
        background: `linear-gradient(to bottom, transparent 0%, ${toColor}55 42%, ${toColor} 100%)`,
      }}
    />
  )
}
