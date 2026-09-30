import { useLayoutEffect, useEffect, useRef, useState, type RefObject } from 'react'
import type { PageScrollBgTuner } from '@/lib/pageScrollBgDefaults'

type Props = { settings: PageScrollBgTuner; targetRef: RefObject<HTMLElement | null> }

/** One static watermark spanning the shared cream environment. */
export default function CreamNodeLayer({ settings, targetRef }: Props) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const sync = () => setActive(visible && !document.hidden && !reduced.matches)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(layer)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync) }
  }, [])

  useLayoutEffect(() => {
    const page = targetRef.current
    const layer = layerRef.current
    const proof = page?.querySelector<HTMLElement>('#work')
    const faq = page?.querySelector<HTMLElement>('#faq')
    if (!page || !layer || !proof || !faq) return undefined

    const sync = () => {
      const pageTop = page.getBoundingClientRect().top
      const top = proof.getBoundingClientRect().top - pageTop + 80
      const bottom = faq.getBoundingClientRect().bottom - pageTop
      layer.style.top = `${top}px`
      layer.style.height = `${Math.max(0, bottom - top)}px`
    }
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(page)
    observer.observe(proof)
    observer.observe(faq)
    window.addEventListener('resize', sync)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [targetRef])

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-x-0 z-[2] overflow-hidden"
      style={{
        opacity: settings.nodeOpacity / 100,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 85%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <svg
        className="mr-cream-nodes absolute left-1/2 top-0 h-full w-[120%] min-w-[900px] max-w-none"
        style={{ transform: `translateX(-50%) scale(${settings.nodeScale})`, animationPlayState: active && settings.nodeMotion > 0 ? 'running' : 'paused', animationDuration: `${Math.round(180 / Math.max(.1, settings.nodeMotion))}s` }}
        viewBox="0 0 1200 1800"
        preserveAspectRatio="none"
        fill="none"
      >
        <g stroke={settings.nodeLineColor} strokeWidth="1.25">
          <path d="M-40 350 L186 270 L338 338 L506 238" />
          <path d="M870 530 L1014 442 L1230 510" />
          {settings.nodeDensity >= 2 && <path d="M-50 1110 L180 1040 L296 1148 L460 1080" />}
          {settings.nodeDensity >= 3 && <path d="M760 1430 L910 1320 L1054 1390 L1240 1280" />}
        </g>
        <g fill={settings.nodeDotColor}>
          <circle cx="186" cy="270" r="3.5" /><circle cx="338" cy="338" r="2.4" />
          <circle cx="506" cy="238" r="4" /><circle cx="1014" cy="442" r="3" />
          <circle cx="870" cy="530" r="2" />
          {settings.nodeDensity >= 2 && <><circle cx="180" cy="1040" r="3.8" /><circle cx="296" cy="1148" r="2.5" /><circle cx="460" cy="1080" r="3" /></>}
          {settings.nodeDensity >= 3 && <><circle cx="910" cy="1320" r="3.5" /><circle cx="1054" cy="1390" r="2.5" /></>}
        </g>
      </svg>
    </div>
  )
}
