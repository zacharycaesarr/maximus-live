import { useState } from 'react'
import './scroll-pill-dock.css'

const DOCK_ICONS = ['◫', '◎', '⇄', '▶']

export default function ScrollPillDock({ settings }) {
  const items = settings.dockItems
  const [activeIndex, setActiveIndex] = useState(settings.dockActiveIndex)

  return (
    <nav className="scroll-pill-dock" aria-label="Services">
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`scroll-pill-dock-item${i === activeIndex ? ' scroll-pill-dock-item--active' : ''}`}
          onClick={() => setActiveIndex(i)}
          aria-pressed={i === activeIndex}
        >
          <span className="scroll-pill-dock-icon" aria-hidden="true">
            {DOCK_ICONS[i % DOCK_ICONS.length]}
          </span>
          <span className="scroll-pill-dock-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
