import type { ReactNode } from 'react'
import * as m from 'framer-motion/m'
import { creativeEntrance, type CreativeMotionSettings } from './scenes/creativeMotion'
import './styles/services.css'

type ServiceCardProps = {
  number: string
  title: string
  description: ReactNode
  cta: string
  ctaHref?: string
  icon: ReactNode
  children: ReactNode
  creativeMotion?: CreativeMotionSettings
}

function ArrowNe() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3.5 8.5L8.5 3.5M8.5 3.5H4.2M8.5 3.5V7.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ServiceCard({
  number,
  title,
  description,
  cta,
  ctaHref = '#',
  icon,
  children,
  creativeMotion,
}: ServiceCardProps) {
  const header = <>
    <div className="service-card__num">
      <span>{number}</span>
      <span className="service-card__num-line" />
    </div>
    <div className="service-card__icon" aria-hidden>{icon}</div>
  </>
  const footer = <>
    <h2 className="service-card__title">{title}</h2>
    <p className="service-card__desc">{description}</p>
    <a className="service-card__cta" href={ctaHref}>{cta}<ArrowNe /></a>
  </>
  return (
    <article className="service-card">
      {creativeMotion?.enabled ? <header className="service-card__header">
        <m.div className="service-card__num" initial="hidden" animate={creativeMotion.entered ? 'visible' : 'hidden'} variants={creativeEntrance(creativeMotion.introDuration, 0, -8)}>
          <span>{number}</span><span className="service-card__num-line" />
        </m.div>
        <m.div className="service-card__icon" aria-hidden initial="hidden" animate={creativeMotion.entered ? 'visible' : 'hidden'} variants={creativeEntrance(creativeMotion.introDuration, creativeMotion.introStagger * .6, -8)}>{icon}</m.div>
      </header> : <header className="service-card__header">{header}</header>}

      <div className="service-card__scene">{children}</div>

      {creativeMotion?.enabled ? <footer className="service-card__footer">
        <m.h2 className="service-card__title" initial="hidden" animate={creativeMotion.entered ? 'visible' : 'hidden'} variants={creativeEntrance(creativeMotion.introDuration, creativeMotion.introStagger * 2.2, 12)}>{title}</m.h2>
        <m.p className="service-card__desc" initial="hidden" animate={creativeMotion.entered ? 'visible' : 'hidden'} variants={creativeEntrance(creativeMotion.introDuration, creativeMotion.introStagger * 3.1, 10)}>{description}</m.p>
        <m.a className="service-card__cta" href={ctaHref} initial="hidden" animate={creativeMotion.entered ? 'visible' : 'hidden'} variants={creativeEntrance(creativeMotion.introDuration, creativeMotion.introStagger * 4, 9)}>{cta}<ArrowNe /></m.a>
      </footer> : <footer className="service-card__footer">{footer}</footer>}
    </article>
  )
}

export function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M8 20h8M12 17v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 9h3l9-4v14l-9-4H8V9ZM8 8H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3V8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 9.5c1 .6 1.5 1.5 1.5 2.5s-.5 1.9-1.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="m6 16 2 5h3l-2-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c-4.7 0-8.5 3.4-8.5 7.6 0 3.2 2.1 5.9 5.1 7 .6.2 1.2-.2 1.2-.8v-1.3c0-1.3 1-2.3 2.3-2.3h2.7c3.1 0 5.7-2.5 5.7-5.6C20.5 5.5 16.7 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7.8" cy="9.2" r="1.1" fill="currentColor" />
      <circle cx="11.2" cy="7.2" r="1.1" fill="currentColor" />
      <circle cx="14.8" cy="7.4" r="1.1" fill="currentColor" />
      <circle cx="16.8" cy="10.4" r="1.1" fill="currentColor" />
    </svg>
  )
}
