import { useEffect, useState } from 'react'
import BrandMark from '../brand/BrandMark'
import { useSiteChrome } from '../../context/SiteChromeContext'
import './site-navbar.css'

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

export default function SiteNavbar() {
  const { settings } = useSiteChrome()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const stage = document.querySelector('.scroll-stage')
      if (!stage) {
        setVisible(window.scrollY > 120)
        return
      }
      setVisible(stage.getBoundingClientRect().bottom < window.innerHeight * 0.92)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!visible) setOpen(false)
  }, [visible])

  return (
    <header className={`site-navbar${visible ? ' is-visible' : ''}`} aria-label="Site">
      <div className="site-navbar__bar">
        <a className="site-navbar__brand" href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <BrandMark />
          <span>Maximus Reach</span>
        </a>

        <nav className="site-navbar__links" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="site-navbar__cta" href="#contact">
          {settings.navCta}
        </a>

        <button
          type="button"
          className={`site-navbar__menu-btn${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="site-navbar-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="site-navbar-drawer" className={`site-navbar__drawer${open ? ' is-open' : ''}`} hidden={!open}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="site-navbar__drawer-cta" href="#contact" onClick={() => setOpen(false)}>
          {settings.navCta}
        </a>
      </div>
    </header>
  )
}
