/** Preserve section rhythm without drawing a seam through the shared surface. */
export default function SectionBreak() {
  return (
    <div className="relative py-2 md:py-3" aria-hidden>
      <div className="h-px" />
    </div>
  )
}
