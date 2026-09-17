import type { SVGProps } from 'react'

/** Client Portal door icon (user-provided Door01Icon) */
export function Door01Icon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path
          strokeLinejoin="round"
          d="M18 20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M4 6.848v10.304c0 1.593 0 2.39.465 2.946c.464.555 1.25.698 2.82.983l3 .544c2.185.397 3.278.595 3.996-.003c.719-.599.719-1.708.719-3.925V6.303c0-2.217 0-3.326-.719-3.925c-.718-.598-1.81-.4-3.997-.003l-3 .544c-1.57.285-2.355.428-2.82.983C4 4.458 4 5.255 4 6.848"
        />
        <path d="M11.625 12H11.5m.25 0a.25.25 0 1 1-.5 0a.25.25 0 0 1 .5 0Z" />
      </g>
    </svg>
  )
}

/** Alias used across nav + CTA */
export function PortalIcon({ size = 14, className }: { size?: number; className?: string }) {
  return <Door01Icon size={size} className={className} aria-hidden />
}
