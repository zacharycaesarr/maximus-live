import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import '@/components/ui/dogguard-comparison.css'

export default function DogGuardComparison() {
  const stageRef = useRef<HTMLDivElement>(null)
  const beforeRef = useRef<HTMLVideoElement>(null)
  const afterRef = useRef<HTMLVideoElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<number | null>(null)
  const revealRef = useRef(50)
  const frameRef = useRef(0)
  const startRef = useRef<() => void>(() => {})
  const [hasFrames, setHasFrames] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)

  useEffect(() => {
    const stage = stageRef.current!
    const before = beforeRef.current!
    const after = afterRef.current!
    const videos = [before, after]
    let disposed = false
    let visible = false
    let starting = false
    let generation = 0
    let syncTimer: number | undefined

    const allowed = () => !disposed && visible && document.visibilityState === 'visible'
    const stop = () => {
      generation++
      starting = false
      videos.forEach(video => video.pause())
      window.clearInterval(syncTimer)
      syncTimer = undefined
    }
    const correctDrift = () => {
      if (before.readyState >= 2 && Math.abs(before.currentTime - after.currentTime) > 0.075) {
        before.currentTime = after.currentTime
      }
    }
    const start = async () => {
      if (!allowed() || starting || videos.some(video => video.readyState < 3)) return
      if (videos.every(video => !video.paused)) return
      starting = true
      const attempt = ++generation
      correctDrift()
      const results = await Promise.allSettled(videos.map(video => video.play()))
      if (disposed || attempt !== generation) return
      starting = false
      if (!allowed()) { stop(); return }
      if (results.some(result => result.status === 'rejected')) {
        stop()
        setNeedsPlay(true)
        return
      }
      setNeedsPlay(false)
      window.clearInterval(syncTimer)
      syncTimer = window.setInterval(correctDrift, 250)
    }
    startRef.current = () => { void start() }
    const onReady = () => { void start() }
    const onPlaying = () => {
      if (!allowed()) { stop(); return }
      if (videos.every(video => !video.paused && video.readyState >= 2)) setHasFrames(true)
    }
    // Buffering either layer pauses the pair until both can resume together.
    const onWaiting = () => { stop() }
    const onError = () => { stop(); setNeedsPlay(true) }
    const onVisibility = () => { if (allowed()) void start(); else stop() }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.1
      if (allowed()) void start()
      else stop()
    }, { threshold: [0, 0.1] })
    observer.observe(stage)
    document.addEventListener('visibilitychange', onVisibility)
    videos.forEach(video => {
      video.muted = true
      video.addEventListener('canplay', onReady)
      video.addEventListener('playing', onPlaying)
      video.addEventListener('waiting', onWaiting)
      video.addEventListener('error', onError)
    })
    // URLs are attached only after this active-project-only component mounts.
    before.src = '/proof/dogguard-before.mp4'
    after.src = '/proof/dogguard-after.mp4'
    videos.forEach(video => video.load())

    return () => {
      disposed = true
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      startRef.current = () => {}
      cancelAnimationFrame(frameRef.current)
      dragRef.current = null
      videos.forEach(video => {
        video.removeEventListener('canplay', onReady)
        video.removeEventListener('playing', onPlaying)
        video.removeEventListener('waiting', onWaiting)
        video.removeEventListener('error', onError)
        video.removeAttribute('src')
        video.load()
      })
    }
  }, [])

  const updateReveal = (value: number) => {
    revealRef.current = Math.max(0, Math.min(100, value))
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      stageRef.current?.style.setProperty('--reveal', `${revealRef.current}%`)
      sliderRef.current?.setAttribute('aria-valuenow', `${Math.round(revealRef.current)}`)
    })
  }
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current !== event.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    updateReveal((event.clientX - rect.left) / rect.width * 100)
  }
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    dragRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    move(event)
  }
  const up = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const value = event.key === 'ArrowLeft' ? revealRef.current - 5
      : event.key === 'ArrowRight' ? revealRef.current + 5
      : event.key === 'Home' ? 0 : event.key === 'End' ? 100 : null
    if (value === null) return
    event.preventDefault()
    event.stopPropagation()
    updateReveal(value)
  }

  return (
    <figure className="dogguard-comparison">
      <div ref={stageRef} className="dogguard-stage" onPointerDown={down} onPointerMove={move}
        onPointerUp={up} onPointerCancel={up} onLostPointerCapture={() => { dragRef.current = null }}>
        <video ref={beforeRef} className="dogguard-video" muted loop playsInline preload="none" aria-label="Raw Dog Guard footage" />
        <video ref={afterRef} className="dogguard-video dogguard-final" muted loop playsInline preload="none" aria-label="Finished Dog Guard creative" />
        <img className={`dogguard-poster${hasFrames ? ' dogguard-poster-ready' : ''}`}
          src="/proof/dogguard-poster.webp" alt="Dog Guard of the Valley short-form creative" draggable={false} />
        <span className="dogguard-label dogguard-raw-label">RAW</span>
        <span className="dogguard-label dogguard-final-label">FINAL</span>
        <div ref={sliderRef} className="dogguard-divider" role="slider" tabIndex={0}
          aria-label="Raw and final video comparison" aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={50} aria-orientation="horizontal" onKeyDown={keyDown}>
          <span className="dogguard-handle" aria-hidden="true">‹ ›</span>
        </div>
        {needsPlay && <button className="dogguard-play" type="button" onPointerDown={event => event.stopPropagation()}
          onClick={() => startRef.current()}>Play comparison</button>}
      </div>
      <figcaption className="font-nhg text-home-muted">
        <span className="dogguard-desktop-hint">Drag to see the difference</span>
        <span className="dogguard-mobile-hint">Swipe to see the difference</span>
        <span className="dogguard-caption">Raw footage → finished short-form creative</span>
      </figcaption>
    </figure>
  )
}
