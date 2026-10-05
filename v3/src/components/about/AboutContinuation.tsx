import { useEffect, useRef } from 'react'
import AboutShaderStory from './AboutShaderStory'
import AboutDisciplines from './AboutDisciplines'
import { gsap, ScrollTrigger } from './aboutMotionRuntime'
import { aboutMotionConfig as config } from './aboutMotionConfig'
import { buildServiceSequence } from './aboutServiceSequence'
import { installReadingResize } from './aboutReadingResize'
import './about-continuation.css'

export default function AboutContinuation() {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let cancelled = false, context: gsap.Context | undefined
    let resumeServiceIndex: number | undefined
    let currentServices: ReturnType<typeof buildServiceSequence> | undefined
    let previousServiceState: { active: boolean; index: number } | undefined
    let disposeResize: (() => void) | undefined
    let setupFrame: number | undefined
    void document.fonts.ready.then(() => {
      if (cancelled) return
      // One setup frame after the existing route reset/Lenis effects, not an animation loop.
      setupFrame = window.requestAnimationFrame(() => {
        setupFrame = undefined
        if (cancelled) return
        context = gsap.context(() => {
          const media = gsap.matchMedia()
          media.add({
            desktop: `(min-width: ${config.breakpoint}px)`,
            mobile: `(max-width: ${config.breakpoint - 1}px)`,
            reduced: '(prefers-reduced-motion: reduce)',
          }, conditions => {
            const { desktop, reduced } = conditions.conditions!
            root.dataset.motionMode = reduced ? 'reduced' : desktop ? 'desktop' : 'mobile'
            const services = reduced ? undefined : buildServiceSequence(root)
            currentServices = services
            ScrollTrigger.refresh()
            if (resumeServiceIndex !== undefined && services) {
              services.restore(resumeServiceIndex)
              resumeServiceIndex = undefined
            }
            return () => {
              const state = services?.state()
              previousServiceState = state
              resumeServiceIndex = state?.active ? state.index : undefined
              services?.dispose()
            }
          }, root)
          return () => media.revert()
        }, root)
        disposeResize = installReadingResize(root, () => currentServices, () => {
          const state = previousServiceState
          previousServiceState = undefined
          return state
        })
      })
    })
    return () => {
      cancelled = true
      if (setupFrame !== undefined) window.cancelAnimationFrame(setupFrame)
      disposeResize?.(); context?.revert()
    }
  }, [])
  return (
    <div ref={rootRef} className="about-continuation">
      {/* Future AboutPaperCrumple belongs here. Today the portrait flows directly into Story. */}
      <AboutShaderStory />
      <AboutDisciplines />
    </div>
  )
}
