import { Link } from 'react-router-dom'
import { aboutStoryContent as copy } from './aboutStoryContent'
import AboutServiceVisual from './AboutServiceVisual'

export default function AboutDisciplines() {
  return (
    <section className="about-services" id="about-services" aria-label="Web, advertising and creative services">
      <div className="about-services__viewport" tabIndex={-1}>
        <div className="about-services__meta" aria-hidden="true"><span>05 / THE DISCIPLINES</span><span data-service-counter>01 / 03</span></div>
        {copy.disciplines.map((service, index) => (
          <article className="about-service" data-service={service.kind} key={service.kind} aria-labelledby={`about-service-title-${service.kind}`}>
            <div className="about-service__outer"><div className="about-service__inner">
              <div className="about-service__environment"><AboutServiceVisual kind={service.kind} />
              <div className="about-service__content">
                <span className="about-service__number">{service.number} / 03</span>
                <h2 id={`about-service-title-${service.kind}`} className="about-service__title">
                  {service.title.map((line, lineIndex) => <span className="about-service__line" key={line}>{line}{lineIndex === 0 ? ' ' : ''}</span>)}
                </h2>
                <p>{service.description}</p>
                <Link className="about-service__cta" data-service-link to={service.href}>{service.cta}<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10L10 2M2 2H10V10" stroke="currentColor" strokeWidth="1.3" /></svg></Link>
              </div>
              </div>
              <span className="about-service__footer" aria-hidden="true">MAXIMUS REACH / {String(index + 1).padStart(2, '0')}</span>
            </div></div>
          </article>
        ))}
        <span className="about-services__announcement ab-sr-only" role="status" aria-live="polite" />
      </div>
    </section>
  )
}
