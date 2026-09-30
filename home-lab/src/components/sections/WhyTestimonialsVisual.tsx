import { useEffect, useRef, useState } from 'react'
import { whyTestimonials, type WhyTestimonial } from '@/lib/whyTestimonial'

function TestimonialCard({ item, index }: { item: WhyTestimonial; index: number }) {
  return <div className="mr-testimonial-card">
    <span className="mr-testimonial-card-mark" aria-hidden="true">✳</span>
    {item.quote ? <>
      <blockquote>“{item.quote}”</blockquote>
      <div className="mr-testimonial-credit">
        {(item.logo || item.photo) && <img src={item.logo || item.photo} alt="" />}
        <span>{item.client}<small>{[item.role, item.company].filter(Boolean).join(' · ')}</small></span>
      </div>
    </> : <>
      <strong>REAL TESTIMONIAL NEEDED</strong>
      <small>Awaiting approved client words · {String(index + 1).padStart(2, '0')}</small>
    </>}
  </div>
}

export default function WhyTestimonialsVisual({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [tabVisible, setTabVisible] = useState(!document.hidden)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    const onVisibility = () => setTabVisible(!document.hidden)
    observer.observe(node)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])
  const run = playing && visible && tabVisible
  return <div ref={ref} className={`mr-testimonials-visual${run ? ' is-playing' : ''}`} aria-label="Client testimonial space">
    {[0, 1, 2].map(column => {
      const items = whyTestimonials.slice(column * 2, column * 2 + 2)
      return <div className={`mr-testimonial-column mr-testimonial-column--${column + 1}`} key={column}>
        <div className="mr-testimonial-column-inner">
          {[...items, ...items].map((item, index) => <TestimonialCard key={`${column}-${index}`} item={item} index={column * 2 + index % 2} />)}
        </div>
      </div>
    })}
  </div>
}
