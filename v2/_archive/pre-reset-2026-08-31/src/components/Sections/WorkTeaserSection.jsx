import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../content/siteContent'
import '../../styles/glass.css'
import '../../styles/sections.css'

gsap.registerPlugin(ScrollTrigger)

export default function WorkTeaserSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('.reveal-item'), {
        opacity: 0,
        y: 32,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const { work } = siteContent

  return (
    <section className="section section-right" id="work" ref={sectionRef}>
      <div className="reveal-item" style={{ textAlign: 'right', maxWidth: '620px' }}>
        <p className="section-label">{work.label}</p>
        <h2 className="section-headline">
          {work.headline}
          <br />
          <em>{work.headlineEm}</em>
        </h2>
        <p className="section-sub" style={{ marginLeft: 'auto' }}>{work.sub}</p>
      </div>

      <div className="work-grid">
        {work.items.map((item) => (
          <a key={item.title} href={item.href} className="work-card glass-surface reveal-item">
            <div className="work-card-mock" aria-hidden="true" />
            <div className="work-card-body">
              <span className="work-badge">{item.badge}</span>
              <h3 className="work-card-title">{item.title}</h3>
              <p className="work-card-cat">{item.category}</p>
            </div>
          </a>
        ))}
      </div>

      <a href={work.viewAllHref} className="work-view-all reveal-item">
        {work.viewAll} →
      </a>
    </section>
  )
}
