/** Local vector mark matching the compact After Effects pill. */
export function PremiereProMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#00005B" />
      <text x="16" y="21" textAnchor="middle" fill="#9999FF"
        fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700">Pr</text>
    </svg>
  )
}
