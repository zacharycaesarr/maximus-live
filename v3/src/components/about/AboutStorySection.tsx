import { aboutStoryContent as copy } from './aboutStoryContent'
import AboutStoryVisual from './AboutStoryVisual'

export default function AboutStorySection() {
  return (
    <section className="about-story" id="about-story" aria-label="My story">
      {copy.beats.map((beat, index) => (
        <article className="about-story__moment" data-story-beat={index} key={beat.number} aria-labelledby={`about-story-title-${index}`}>
          <div className="about-story__spread">
            <div className="about-story__meta"><span>{index === 0 ? '03 / MY STORY' : 'MY STORY'}</span><span>{beat.number} / 03</span></div>
            <div className="about-story__copy">
              <h2 className="about-story__headline" data-codrops-effect={[17, 20, 27][index]} id={`about-story-title-${index}`}>
                {beat.title.map((line, lineIndex) => <span className="about-story__line" key={line}>{line}{lineIndex === 0 ? ' ' : ''}</span>)}
              </h2>
              <p className="about-story__paragraph">{beat.paragraph}</p>
            </div>
            <div className="about-story__visual"><AboutStoryVisual kind={beat.visual} /></div>
          </div>
        </article>
      ))}
    </section>
  )
}
