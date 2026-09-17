import type { SVGProps } from 'react'

/** Animated account / existing-client mark (user-provided). */
export function AccountIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeDasharray="28" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="28;0" />
        </path>
        <path strokeDashoffset="28" d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" to="0" />
        </path>
      </g>
    </svg>
  )
}

/** Simple launch mark for Start Your Project (theme-friendly, no Apple logo). */
export function StartProjectIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5 19L12 5L19 19L12 16.5L5 19Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M12 16.5V21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}
