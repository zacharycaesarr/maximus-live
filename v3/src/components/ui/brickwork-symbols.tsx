export function PaidMediaMark({ channel, className }: { channel: 'Meta' | 'Google'; className?: string }) {
  // Paths from the existing local brand SVGs, inlined to avoid image requests.
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {channel === 'Meta' ? <path fill="#0668E1" d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
        : <path fill="#4285F4" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />}
    </svg>
  )
}

export function CampaignSymbol({ kind }: { kind: 'house' | 'search' | 'return' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {kind !== 'return' && <path d="m4 15 11-9 11 9M7 13v14h16V13M12 27v-9h6v9" />}
      {kind === 'search' && <><circle cx="24" cy="22" r="4.5" fill="#151918" /><path d="m27.5 25.5 3 3" /></>}
      {kind === 'return' && <><path d="M25 12a10 10 0 1 0 1 8M25 6v6h-6" /><circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" /></>}
    </svg>
  )
}

/** Decorative trend cue, not a plot of unprovided campaign-level results. */
export function MicroBars({ green = false, className }: { green?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 80 36" className={className} fill={green ? '#75b58c' : '#508fc7'} aria-hidden="true">
      <rect x="1" y="26" width="7" height="10" rx="1" /><rect x="12" y="22" width="7" height="14" rx="1" />
      <rect x="23" y="24" width="7" height="12" rx="1" /><rect x="34" y="17" width="7" height="19" rx="1" />
      <rect x="45" y="13" width="7" height="23" rx="1" /><rect x="56" y="9" width="7" height="27" rx="1" />
      <rect x="67" y="3" width="7" height="33" rx="1" />
    </svg>
  )
}
