import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches
    if (isTouch) return undefined

    document.body.classList.add('has-custom-cursor')

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let raf = 0

    const onMove = (event) => {
      mx = event.clientX
      my = event.clientY
      gsap.to(dotRef.current, { x: mx, y: my, duration: 0.06, ease: 'none' })
    }

    const tick = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      gsap.set(ringRef.current, { x: rx, y: ry })
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} id="cursor-dot" />
      <div className="cursor-ring" ref={ringRef} id="cursor-ring" />
    </>
  )
}
