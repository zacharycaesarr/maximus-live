/** Inline AE mark — used if CDN fails. Purple square with AE. */
export function AfterEffectsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="4" fill="#1F0740" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="#D291FF"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
      >
        Ae
      </text>
    </svg>
  )
}
