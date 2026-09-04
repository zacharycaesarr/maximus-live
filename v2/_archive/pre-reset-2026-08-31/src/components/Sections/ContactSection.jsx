import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteContent } from '../../content/siteContent'
import '../../styles/glass.css'
import '../../styles/sections.css'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
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
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const { contact } = siteContent

  return (
    <section className="section section-centered" id="contact" ref={sectionRef}>
      <div className="reveal-item" style={{ textAlign: 'center' }}>
        <p className="section-label">{contact.label}</p>
        <h2 className="section-headline">
          {contact.headline}
          <br />
          <em>{contact.headlineEm}</em>
        </h2>
      </div>

      <div className="contact-cards">
        <a href={`mailto:${contact.email}`} className="contact-card glass-surface reveal-item">
          <div className="contact-card-top">
            <div className="contact-card-ico" aria-hidden="true">@</div>
            <span className="contact-card-lbl">Email</span>
          </div>
          <div className="contact-card-val">{contact.email}</div>
          <div className="contact-card-action">
            <span>Send a message</span>
            <span aria-hidden="true">↗</span>
          </div>
        </a>

        <a href="tel:+15404162983" className="contact-card glass-surface reveal-item">
          <div className="contact-card-top">
            <div className="contact-card-ico" aria-hidden="true">☎</div>
            <span className="contact-card-lbl">Phone</span>
          </div>
          <div className="contact-card-val">{contact.phone}</div>
          <div className="contact-card-action">
            <span>Give me a call</span>
            <span aria-hidden="true">↗</span>
          </div>
        </a>
      </div>

      <p className="section-tagline reveal-item">{contact.tagline}</p>
    </section>
  )
}
