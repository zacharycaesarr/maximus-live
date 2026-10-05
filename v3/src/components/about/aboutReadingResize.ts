import { ScrollTrigger } from './aboutMotionRuntime'
import type { buildServiceSequence } from './aboutServiceSequence'

type Controller = ReturnType<typeof buildServiceSequence>
type ServiceState = ReturnType<Controller['state']>
type Span = { element: HTMLElement; top: number; height: number }
const readingBox = (element: HTMLElement) => element.parentElement?.classList.contains('pin-spacer') ? element.parentElement : element

/** Cache reading anchors on refresh only. A breakpoint rebuild must not jump Story into services. */
export function installReadingResize(root: HTMLElement, controller: () => Controller | undefined, previousState: () => ServiceState | undefined) {
  let width = innerWidth, height = innerHeight, lastY = scrollY, spans: Span[] = []
  let pending: { span: Span; progress: number; services?: ServiceState } | undefined
  let timer: number | undefined, disposed = false
  const measure = () => {
    if (pending || disposed || width !== innerWidth || height !== innerHeight) return
    const signal = root.parentElement?.querySelector<HTMLElement>('.ab-sequence')
    const items = [signal, root.querySelector<HTMLElement>('.about-shader-story'), root.querySelector<HTMLElement>('.about-services')]
    spans = items.flatMap(element => {
      if (!element) return []
      const box = readingBox(element)
      return [{ element, top: box.getBoundingClientRect().top + scrollY, height: box.offsetHeight }]
    })
    lastY = scrollY
  }
  const remember = () => { if (!pending && width === innerWidth && height === innerHeight) lastY = scrollY }
  const resize = () => {
    if (width === innerWidth && height === innerHeight) return
    if (width === innerWidth && innerWidth < 769 && !pending) { height = innerHeight; measure(); return }
    const priorServices = previousState()
    if (!pending) {
      const focus = lastY + height * .4
      const span = spans.find(s => focus >= s.top && focus < s.top + s.height) ?? spans[0]
      if (span) {
        const signal = span.element.classList.contains('ab-sequence')
        const service = span.element.classList.contains('about-services')
        pending = { span, progress: Math.max(0, Math.min(1, signal ? (lastY - span.top) / Math.max(1, span.height - height) : (focus - span.top) / span.height)), services: service ? priorServices ?? controller()?.state() : undefined }
      }
    }
    width = innerWidth; height = innerHeight
    if (timer !== undefined) clearTimeout(timer)
    timer = window.setTimeout(() => {
      timer = undefined
      if (!pending || disposed) return
      ScrollTrigger.refresh()
      const { span, progress, services } = pending
      if (services && controller()) controller()!.restoreReading(services.index, services.active)
      else {
        const box = readingBox(span.element)
        const top = box.getBoundingClientRect().top + scrollY
        const target = span.element.classList.contains('ab-sequence') ? top + progress * Math.max(0, box.offsetHeight - innerHeight) : top + progress * box.offsetHeight - innerHeight * .4
        if (controller()) controller()!.releaseTo(Math.max(0, target))
        else window.scrollTo({ top: Math.max(0, target), behavior: 'instant' })
      }
      pending = undefined; measure()
    }, 180)
  }
  measure()
  window.addEventListener('scroll', remember, { passive: true })
  window.addEventListener('resize', resize)
  ScrollTrigger.addEventListener('refresh', measure)
  return () => {
    disposed = true
    if (timer !== undefined) clearTimeout(timer)
    window.removeEventListener('scroll', remember); window.removeEventListener('resize', resize)
    ScrollTrigger.removeEventListener('refresh', measure)
  }
}
