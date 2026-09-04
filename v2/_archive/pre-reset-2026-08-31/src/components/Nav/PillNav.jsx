import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { siteContent } from '../../content/siteContent'
import '../../styles/nav.css'

export default function PillNav({ navRef }) {
  const localRef = useRef(null)
  const ref = navRef || localRef

  useEffect(() => {
    const nav = ref.current
    if (!nav) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      gsap.fromTo(
        nav,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' },
      )
    } else {
      gsap.set(nav, { opacity: 1, y: 0 })
    }

    const links = nav.querySelectorAll('a')
    if (!links) return undefined

    const onEnter = () => {
      document.querySelector('.cursor-dot')?.classList.add('is-hover')
      document.querySelector('.cursor-ring')?.classList.add('is-hover')
    }
    const onLeave = () => {
      document.querySelector('.cursor-dot')?.classList.remove('is-hover')
      document.querySelector('.cursor-ring')?.classList.remove('is-hover')
    }

    links.forEach((link) => {
      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener('mouseenter', onEnter)
        link.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [ref])

  return (
    <div className="pill-nav-wrap" ref={ref}>
      <nav className="pill-nav" aria-label="Main">
        <a href="/" className="pill-nav-brand" aria-label="Maximus Reach home">
          <img src="/assets/mm-logo.svg" alt="" className="pill-nav-mark" />
        </a>

        <div className="pill-nav-links">
          {siteContent.nav.map((item) => (
            <a key={item.label} href={item.href} className="pill-nav-link">
              {item.label}
            </a>
          ))}
        </div>

        <a href={siteContent.navCtaHref} className="pill-nav-cta">
          {siteContent.navCta}
        </a>
      </nav>
    </div>
  )
}
