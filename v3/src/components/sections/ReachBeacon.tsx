'use client'

/**
 * Reach Beacon — light champagne signal that travels on scroll.
 * Keep this cheap: one timeline, rebuild only on real resize (debounced).
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useControls, folder } from 'leva'
import type { LevaStore } from '@/lib/levaStore'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const ANCHOR_IDS = [
  'services',
  'work',
  'how-it-works',
  'why-maximus',
  'faq',
  'get-started',
] as const

const CHAMPAGNE = '#F5E6C8'
const IVORY = '#FFEDD5'

type Point = { x: number; y: number }

function cubicPath(a: Point, b: Point) {
  const dy = b.y - a.y
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy * 0.42}, ${b.x} ${b.y - dy * 0.42}, ${b.x} ${b.y}`
}

type Props = { store?: LevaStore }

export default function ReachBeacon({ store }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const beaconRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const pathsLayerRef = useRef<SVGGElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const isDev = import.meta.env.DEV
  const controls = useControls(
    {
      'Reach Beacon': folder(
        {
          enabled: true,
          markers: { value: false, label: 'ST markers (dev)' },
          scrub: { value: 0.7, min: 0.3, max: 1.2, step: 0.05 },
          glowOpacity: { value: 0.9, min: 0.2, max: 1, step: 0.05 },
        },
        { collapsed: true },
      ),
    },
    store ? { store } : undefined,
  )

  const enabled = Boolean((controls as { enabled?: boolean }).enabled ?? true)
  const markers = Boolean((controls as { markers?: boolean }).markers) && isDev
  const scrub = Number((controls as { scrub?: number }).scrub ?? 0.7)
  const glowOpacity = Number((controls as { glowOpacity?: number }).glowOpacity ?? 0.9)

  useEffect(() => {
    if (!enabled || isMobile) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const page = document.getElementById('page-sections')
    const svg = svgRef.current
    const beacon = beaconRef.current
    const ring = ringRef.current
    const trail = trailRef.current
    const pathsLayer = pathsLayerRef.current
    if (!page || !svg || !beacon || !ring || !trail || !pathsLayer) return undefined

    let cleanupExtra: (() => void) | undefined
    const ctx = gsap.context(() => {
    let tl: gsap.core.Timeline | null = null
    let breathe: gsap.core.Tween | null = null
    let enterSt: ScrollTrigger | null = null
    let creamTone: boolean | null = null

    const pulse = (final = false) => {
      gsap.fromTo(
        ring,
        { scale: 0.35, opacity: 0.5 },
        {
          scale: final ? 2.8 : 2,
          opacity: 0,
          duration: final ? 0.7 : 0.45,
          ease: 'power2.out',
          overwrite: true,
        },
      )
    }

    const readPts = (): Point[] => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const pageRect = page.getBoundingClientRect()
      const pageTop = pageRect.top + scrollY
      const pageLeft = pageRect.left
      const isMobile = window.innerWidth < 768
      const cx = page.clientWidth * 0.5

      return ANCHOR_IDS.map((id) => {
        const el = page.querySelector(`[data-beacon-anchor="${id}"]`) as HTMLElement | null
        if (!el) return { x: cx, y: 0 }
        const r = el.getBoundingClientRect()
        let x = r.left + r.width / 2 - pageLeft
        const y = r.top + scrollY + r.height / 2 - pageTop
        if (isMobile) x = gsap.utils.interpolate(x, cx, 0.55)
        return { x, y }
      })
    }

    const build = () => {
      tl?.scrollTrigger?.kill()
      tl?.kill()
      breathe?.kill()
      enterSt?.kill()
      pathsLayer.innerHTML = ''

      const pts = readPts()
      if (pts.length < 2) return

      const setTone = (y: number) => {
        const isCream = y >= pts[1].y - 120 && y <= pts[5].y + 130
        if (creamTone === isCream) return
        creamTone = isCream
        beacon.dataset.tone = isCream ? 'cream' : 'dark'
        beacon.style.setProperty('--beacon-core', isCream ? '#11120E' : IVORY)
        beacon.style.setProperty('--beacon-edge', isCream ? '#3A3E33' : CHAMPAGNE)
        beacon.style.setProperty('--beacon-shadow', isCream
          ? '0 0 13px 3px rgba(17,18,14,0.16), 0 0 4px 1px rgba(17,18,14,0.32)'
          : '0 0 20px 6px rgba(255,237,213,0.32), 0 0 5px 1px rgba(245,230,200,0.5)')
        beacon.style.setProperty('--beacon-ring', isCream ? 'rgba(17,18,14,0.3)' : 'rgba(255,237,213,0.45)')
        trail.setAttribute('stroke', isCream ? '#252820' : IVORY)
      }

      const h = Math.max(page.scrollHeight, page.offsetHeight)
      const w = Math.max(page.clientWidth, page.offsetWidth)
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.style.width = `${w}px`
      svg.style.height = `${h}px`

      gsap.set(beacon, {
        x: pts[0].x,
        y: pts[0].y,
        xPercent: -50,
        yPercent: -50,
        opacity: glowOpacity,
      })
      setTone(pts[0].y)
      gsap.set(ring, { scale: 0.4, opacity: 0 })
      gsap.set(trail, { opacity: 0 })

      if (reduce) return

      const paths: SVGPathElement[] = []
      for (let i = 0; i < pts.length - 1; i++) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        p.setAttribute('d', cubicPath(pts[i], pts[i + 1]))
        p.setAttribute('fill', 'none')
        p.setAttribute('stroke', CHAMPAGNE)
        p.setAttribute('stroke-width', '0.6')
        p.setAttribute('stroke-opacity', '0.04')
        pathsLayer.appendChild(p)
        paths.push(p)
      }

      breathe = gsap.to(beacon, {
        opacity: glowOpacity * 0.75,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'reach-beacon-master',
          trigger: page,
          start: 'top 60%',
          end: 'bottom 75%',
          scrub,
          markers,
          invalidateOnRefresh: false,
        },
      })

      paths.forEach((path, i) => {
        const len = path.getTotalLength()
        tl!.to(
          beacon,
          {
            duration: 1,
            motionPath: {
              path,
              align: path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            onStart: () => {
              breathe?.pause()
              gsap.set(trail, {
                attr: { d: path.getAttribute('d') || '' },
                strokeDasharray: `22 ${Math.max(36, len)}`,
                strokeDashoffset: 0,
                opacity: 0.28,
              })
            },
            onUpdate() {
              setTone(Number(gsap.getProperty(beacon, 'y')))
              gsap.set(trail, {
                strokeDashoffset: -this.progress() * len,
                opacity: 0.28 * (1 - this.progress() * 0.45),
              })
            },
            onComplete: () => {
              gsap.to(trail, { opacity: 0, duration: 0.2, overwrite: true })
              const last = i === paths.length - 1
              pulse(last)
              if (!last) breathe?.restart()
            },
          },
          i,
        )
      })

      enterSt = ScrollTrigger.create({
        id: 'reach-beacon-enter',
        trigger: page.querySelector('[data-beacon-anchor="services"]') || page,
        start: 'top 75%',
        once: true,
        onEnter: () => pulse(false),
      })
    }

    build()

    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        build()
        ScrollTrigger.refresh()
      }, 220)
    }
    window.addEventListener('resize', onResize)
    const boot = window.setTimeout(() => {
      build()
      ScrollTrigger.refresh()
    }, 400)

    cleanupExtra = () => {
      window.clearTimeout(boot)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      tl?.scrollTrigger?.kill()
      tl?.kill()
      breathe?.kill()
      enterSt?.kill()
      ScrollTrigger.getById('reach-beacon-master')?.kill()
      ScrollTrigger.getById('reach-beacon-enter')?.kill()
    }
    })

    return () => {
      cleanupExtra?.()
      ctx.revert()
    }
  }, [enabled, markers, scrub, glowOpacity, isMobile])

  if (!enabled || isMobile) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] overflow-visible"
      aria-hidden
      data-reach-beacon-root
    >
      <svg
        ref={svgRef}
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        aria-hidden
      >
        <g ref={pathsLayerRef} />
        <path
          ref={trailRef}
          fill="none"
          stroke={IVORY}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0}
        />
      </svg>

      <div
        ref={beaconRef}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
        style={{ width: 8, height: 8 }}
      >
        <span
          className="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, var(--beacon-core, ${IVORY}) 0%, var(--beacon-edge, ${CHAMPAGNE}) 45%, transparent 72%)`,
            boxShadow: 'var(--beacon-shadow, 0 0 20px 6px rgba(255,237,213,0.32))',
          }}
        />
        <span
          ref={ringRef}
          className="absolute left-1/2 top-1/2 block h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ opacity: 0, borderColor: 'var(--beacon-ring, rgba(255,237,213,0.45))' }}
        />
      </div>
    </div>
  )
}
