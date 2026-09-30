import * as m from 'framer-motion/m'
import { fade } from '../scenes/webMotion'

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 16l8 4 8-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M4 16l4.5-4 3.5 3 2.5-2L20 16" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function IconText() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 7h12M12 7v11M9 18h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

const TOOLS = [
  { id: 'home', active: true, Icon: IconHome },
  { id: 'layers', active: false, Icon: IconLayers },
  { id: 'image', active: false, Icon: IconImage },
  { id: 'text', active: false, Icon: IconText },
  { id: 'plus', active: false, Icon: IconPlus },
] as const

export function ToolRail({ animated = false, introStagger = .17 }: { animated?: boolean; introStagger?: number }) {
  return (
    <div className="panel tool-rail" aria-hidden>
      {TOOLS.map(({ id, active, Icon }, index) => (
        <m.div
          key={id}
          className={`tool-rail__btn${active ? ' tool-rail__btn--active' : ''}`}
          variants={animated ? fade(introStagger * (1.6 + index * .34), .38) : undefined}
        >
          <Icon />
        </m.div>
      ))}
    </div>
  )
}
