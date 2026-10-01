import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import type { WhyTestimonial } from '@/lib/whyTestimonial'
import WhyFloatLayer from '@/components/sections/WhyFloatLayer'
import { useWhyVisuals, type Position } from '@/components/sections/WhyVisualTuner'

type Slot = 'left' | 'center' | 'right' | 'hidden-left' | 'hidden-right'

function placed(position: Position, slot: Slot): React.CSSProperties {
  const scale = slot === 'center' ? 1 : slot.startsWith('hidden') ? .84 : .94
  return {
    left: `${position.x}%`, top: `${position.y}%`,
    transform: `translate(-50%, -50%) rotate(${position.rotation}deg) scale(${scale})`,
    opacity: slot.startsWith('hidden') ? 0 : 1,
  }
}

function Card({ item, itemIndex, slot, position }: { item: WhyTestimonial; itemIndex: number; slot: Slot; position: Position }) {
  return <div className={`why-testimonial-slot why-testimonial-slot--${slot}`} style={placed(position, slot)} aria-hidden={slot !== 'center'}>
    <WhyFloatLayer panel={4} object={itemIndex} weight={.72 + itemIndex % 3 * .07}>
      <div className={`why-testimonial-card why-testimonial-card--${slot}`}>
    <div className="why-testimonial-person"><span className="why-testimonial-avatar">{item.client ? item.client[0] : '•'}</span><div><strong>{item.client || 'Client name pending'}</strong><small>{[item.role, item.company].filter(Boolean).join(' · ') || 'Client details pending'}</small></div><Ellipsis aria-hidden="true" /></div>
    <blockquote className={item.quote ? undefined : 'is-placeholder'}>{item.quote ? `“${item.quote}”` : <>Client story coming soon<small>Awaiting approved quote · 0{itemIndex + 1}</small></>}</blockquote>
      </div>
    </WhyFloatLayer>
  </div>
}

export default function WhyTestimonialsVisual({ playing }: { playing: boolean }) {
  const [index, setIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const initialized = useRef(false)
  const [tabVisible, setTabVisible] = useState(!document.hidden)
  const { global, motion, five, testimonials } = useWhyVisuals()
  const count = testimonials.length
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])
  useEffect(() => {
    if (!playing || !tabVisible || count < 2) return undefined
    const timer = window.setInterval(() => setIndex(current => (current + 1) % count), five.interval * 1000)
    return () => window.clearInterval(timer)
  }, [playing, tabVisible, count, five.interval])
  useEffect(() => {
    if (!initialized.current) { initialized.current = true; return undefined }
    setTransitioning(true)
    const timer = window.setTimeout(() => setTransitioning(false), motion.carouselTransition * 1000)
    return () => window.clearTimeout(timer)
  }, [index, motion.carouselTransition])
  const move = (direction: number) => setIndex(current => (current + direction + count) % count)
  const slotFor = (itemIndex: number): Slot => {
    const delta = (itemIndex - index + count) % count
    if (delta === 0) return 'center'
    if (delta === 1) return 'right'
    if (delta === count - 1) return 'left'
    return delta < count / 2 ? 'hidden-right' : 'hidden-left'
  }
  const positionFor = (slot: Slot): Position => {
    if (slot === 'center') return five.center
    if (slot === 'left' || slot === 'right') {
      const position = slot === 'left' ? five.left : five.right
      return { ...position, x: five.center.x + (position.x - five.center.x) * five.spread }
    }
    const side = slot === 'hidden-left' ? five.left : five.right
    const sideX = five.center.x + (side.x - five.center.x) * five.spread
    return {
      x: slot === 'hidden-left' ? Math.max(12, sideX - 10) : Math.min(88, sideX + 10),
      y: side.y,
      rotation: slot === 'hidden-left' ? -12 : 12,
    }
  }
  const style = { '--why-testimonial-surface': five.cardSurface, '--why-indicator-active': five.activeColor, '--why-indicator-inactive': five.inactiveColor, '--why-carousel-shadow': five.shadow } as React.CSSProperties
  return <div className={`why-testimonial-art${transitioning ? ' is-transitioning' : ''}`} style={{ ...style, transform: `scale(${global.globalScale * five.scale})` }} aria-label="Client testimonial carousel">
    {testimonials.map((item, itemIndex) => {
      const slot = slotFor(itemIndex)
      return <Card key={itemIndex} item={item} itemIndex={itemIndex} slot={slot} position={positionFor(slot)} />
    })}
    <div className="why-testimonial-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous testimonial"><ChevronLeft /></button><div className="why-testimonial-dots" aria-label={`Testimonial ${index + 1} of ${count}`}>{testimonials.map((_, dot) => <button key={dot} type="button" onClick={() => setIndex(dot)} className={dot === index ? 'is-active' : ''} aria-label={`Show testimonial ${dot + 1}`} aria-current={dot === index ? 'true' : undefined} />)}</div><button type="button" onClick={() => move(1)} aria-label="Next testimonial"><ChevronRight /></button></div>
  </div>
}
