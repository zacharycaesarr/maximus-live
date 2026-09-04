import { useState } from 'react'
import ParallaxLayer from '../parallax/ParallaxLayer'
import { useParallaxTuner } from '../../context/ParallaxTunerContext'
import './mac-notch-navbar.css'

const LINKS = [
  { href: '#services', label: 'Capabilities' },
  { href: '#process', label: 'Systems' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Pricing' },
]

function NotchEar({ side }) {
  const d =
    side === 'left'
      ? 'M16 0v16C16 7.163 8.837 0 0 0h16z'
      : 'M0 0v16C0 7.163 7.163 0 16 0H0z'
  return (
    <span className={`mac-notch-ear mac-notch-ear--${side}`} aria-hidden="true">
      <svg viewBox="0 0 16 16" width="16" height="16">
        <path d={d} fill="currentColor" />
      </svg>
    </span>
  )
}

export default function MacNotchNavbar({ settings }) {
  const { settings: parallax } = useParallaxTuner()
  const [open, setOpen] = useState(false)

  const bg = settings.notchBg ?? '#0d0f14'
  const top = settings.top ?? 0

  return (
    <ParallaxLayer depth={parallax.navDepth} className="mac-notch-wrap" style={{ top }}>
      <nav
        className="mac-notch"
        aria-label="Primary"
        style={{
          background: bg,
          color: settings.textColor,
          borderColor: `rgba(255, 255, 255, ${settings.borderOpacity})`,
          fontSize: settings.fontSize,
          '--notch-bg': bg,
          gap: settings.linkGap,
        }}
      >
        <NotchEar side="left" />
        <NotchEar side="right" />

        <a className="mac-notch__brand" href="#top">
          <span className="mac-notch__mark" aria-hidden="true">
            <img src="/images/logo-mr-icon.png" alt="" />
          </span>
          <span className="mac-notch__name">MAXIMUS REACH</span>
        </a>

        <div className="mac-notch__links">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <a className="mac-notch__cta" href="#contact">
          Book a call
        </a>

        <button
          type="button"
          className={`mac-notch__menu-btn${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className={`mac-notch__drawer${open ? ' is-open' : ''}`} hidden={!open}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)}>
          Book a call
        </a>
      </div>
    </ParallaxLayer>
  )
}

/** Back-compat export name used across the app. */
export { MacNotchNavbar as GlassNav }
