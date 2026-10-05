import { gsap, ScrollTrigger, Observer, SplitText } from './aboutMotionRuntime'
import { aboutMotionConfig as config } from './aboutMotionConfig'

type LenisHandle = {
  stop: () => void; start: () => void; resize: () => void
  scrollTo: (target: number, options: { immediate: boolean; force: boolean }) => void
}
const lenis = () => (window as unknown as { __lenis?: LenisHandle }).__lenis

/** A finite version of GreenSock XWzRraJ. The reference's wrap() is deliberately absent. */
export function buildServiceSequence(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('.about-services')!
  const stage = section.querySelector<HTMLElement>('.about-services__viewport')!
  const slides = [...section.querySelectorAll<HTMLElement>('.about-service')]
  const outer = slides.map(s => s.querySelector('.about-service__outer')!)
  const inner = slides.map(s => s.querySelector('.about-service__inner')!)
  const visuals = slides.map(s => s.querySelector('.about-service__environment')!)
  const headings = slides.map(s => s.querySelector<HTMLElement>('.about-service__title')!)
  const announcement = section.querySelector<HTMLElement>('[role="status"]')!
  const counter = section.querySelector<HTMLElement>('[data-service-counter]')!
  const splits = headings.map(h => SplitText.create(h, { type: 'chars,words', charsClass: 'about-split-char', wordsClass: 'about-split-word', tag: 'span', aria: 'auto' }))
  const originalAttributes = slides.map(s => ({ hidden: s.getAttribute('aria-hidden'), inert: s.inert }))
  let currentIndex = 0, active = false, animating = false, disposed = false
  let gestureArmed = true, lastInputAt = 0, releasing = false, lastDirection = 1
  let observer: Observer, trigger: ScrollTrigger, timeline: gsap.core.Timeline
  const context = gsap.context(() => {}, root)
  const stamp = () => {
    section.dataset.serviceIndex = String(currentIndex)
    section.dataset.serviceActive = String(active)
    section.dataset.serviceAnimating = String(animating)
  }
  const expose = (index: number) => slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', String(i !== index))
    slide.inert = i !== index
  })
  const anchor = () => currentIndex === 2 ? trigger.end - 1 : trigger.start + 1
  const scrollTo = (top: number) => {
    const smoother = lenis()
    smoother?.resize()
    if (smoother) smoother.scrollTo(top, { immediate: true, force: true })
    else window.scrollTo({ top, behavior: 'instant' })
    ScrollTrigger.update()
  }
  const settle = (index: number) => {
    timeline.pause().clear()
    gsap.set(slides, { autoAlpha: 0, zIndex: 0 })
    gsap.set(slides[index], { autoAlpha: 1, zIndex: 1 })
    gsap.set([outer[index], inner[index]], { yPercent: 0 })
    gsap.set(visuals[index], { yPercent: 0 })
    gsap.set(splits[index].chars, { autoAlpha: 1, yPercent: 0 })
    currentIndex = index; animating = false
    expose(index); counter.textContent = `0${index + 1} / 03`; stamp()
  }
  const release = (direction: number) => {
    if (!active) return
    releasing = true
    active = false; observer.disable(); stage.classList.remove('is-active')
    settle(currentIndex)
    lenis()?.start()
    scrollTo(direction > 0 ? trigger.end + 1 : Math.max(0, trigger.start - 1))
    releasing = false
    stamp()
  }
  const releaseTo = (top: number, index = currentIndex) => {
    releasing = true
    active = false; observer.disable(); stage.classList.remove('is-active')
    settle(index); lenis()?.start(); scrollTo(top)
    releasing = false; stamp()
  }
  const go = (index: number, direction: number) => {
    if (disposed || animating || index < 0 || index >= slides.length) return
    animating = true; gestureArmed = false; lastDirection = direction
    const previous = currentIndex
    timeline.pause().clear()
    expose(index)
    if (slides[previous].contains(document.activeElement)) stage.focus({ preventScroll: true })
    gsap.set(slides, { zIndex: 0 })
    if (previous !== index) {
      timeline.to(visuals[previous], { yPercent: -config.services.visualTravel * direction }, 0)
      timeline.set(slides[previous], { autoAlpha: 0 }, config.services.transitionDuration)
    }
    gsap.set(slides[index], { autoAlpha: 1, zIndex: 1 })
    timeline.fromTo([outer[index], inner[index]], {
      yPercent: i => (i ? -1 : 1) * config.services.wrapperTravel * direction,
    }, { yPercent: 0 }, 0)
      .fromTo(visuals[index], { yPercent: config.services.visualTravel * direction }, { yPercent: 0 }, 0)
      .fromTo(splits[index].chars, { autoAlpha: 0, yPercent: config.services.characterTravel * direction }, {
        autoAlpha: 1, yPercent: 0, duration: config.services.characterDuration, ease: config.services.characterEase,
        stagger: { each: config.services.characterStagger, from: 'random' },
      }, config.services.characterDelay)
    currentIndex = index
    counter.textContent = `0${index + 1} / 03`
    announcement.textContent = headings[index].getAttribute('aria-label') ?? headings[index].textContent
    stamp(); timeline.play(0)
  }
  const enter = (direction: number, restoreIndex?: number) => {
    if (disposed || active || releasing) return
    active = true; lastInputAt = performance.now()
    currentIndex = restoreIndex ?? (direction > 0 ? 0 : 2)
    lenis()?.stop(); stage.classList.add('is-active')
    scrollTo(anchor())
    observer.enable()
    if (restoreIndex === undefined) go(currentIndex, direction)
    else { settle(currentIndex); gestureArmed = true }
    stamp()
  }
  const step = (direction: number) => {
    if (!active || animating || !gestureArmed) return
    gestureArmed = false; lastInputAt = performance.now()
    const next = currentIndex + direction
    if (next < 0 || next >= slides.length) release(direction)
    else go(next, direction)
  }
  context.add(() => {
    gsap.set(slides, { autoAlpha: 0 })
    gsap.set(slides[0], { autoAlpha: 1 })
    gsap.set(outer, { yPercent: 0 }); gsap.set(inner, { yPercent: 0 })
    gsap.set(visuals, { yPercent: 0 })
    gsap.set(splits.flatMap(s => s.chars), { yPercent: 0, autoAlpha: 1 })
    timeline = gsap.timeline({ paused: true, defaults: { duration: config.services.transitionDuration, ease: config.services.transitionEase },
      onComplete: () => { animating = false; gestureArmed = performance.now() - lastInputAt > config.services.gestureQuietMs; stamp() },
    })
    observer = Observer.create({
      id: 'about-services-input', target: stage, type: 'wheel,touch,pointer', tolerance: config.services.tolerance,
      wheelSpeed: config.services.wheelSpeed, preventDefault: true, allowClicks: true,
      ignore: '[data-service-link], a, button',
      onUp: () => step(1), onDown: () => step(-1),
      onChange: () => { lastInputAt = performance.now() },
      onStopDelay: config.services.gestureQuietMs / 1000,
      onStop: () => { if (!animating) gestureArmed = true },
      onPress: () => { if (!animating) gestureArmed = true },
    })
    observer.disable()
    trigger = ScrollTrigger.create({
      id: 'about-service-stage', trigger: section, start: 'top top',
      end: () => `+=${Math.max(80, innerHeight * config.services.pinTravelVh / 100)}`,
      pin: stage, anticipatePin: 1, invalidateOnRefresh: true,
      onEnter: self => { trigger = self; enter(1) }, onEnterBack: self => { trigger = self; enter(-1) },
      onRefresh: self => { trigger = self; if (active && !disposed) scrollTo(anchor()) },
    })
    expose(0); stamp()
  })
  const keyboard = (event: KeyboardEvent) => {
    if (!active || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'Escape') { event.preventDefault(); release(currentIndex === 0 ? -1 : lastDirection); return }
    const direction = event.key === 'ArrowDown' || event.key === 'PageDown' ? 1 : event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 0
    if (direction) {
      event.preventDefault()
      if (!event.repeat && !animating) { gestureArmed = true; step(direction) }
    }
  }
  document.addEventListener('keydown', keyboard)
  return {
    state: () => ({ active, index: currentIndex }),
    restore: (index: number) => {
      if (active) { settle(index); scrollTo(anchor()); gestureArmed = true }
      else enter(index === 2 ? -1 : 1, index)
    },
    restoreReading: (index: number, wasActive: boolean) => {
      if (wasActive) {
        if (active) { settle(index); scrollTo(anchor()); gestureArmed = true }
        else enter(index === 2 ? -1 : 1, index)
      } else releaseTo(trigger.end + 1, index)
    },
    releaseTo,
    dispose: () => {
      disposed = true
      const wasActive = active
      active = false
      document.removeEventListener('keydown', keyboard)
      observer.kill(); timeline.kill(); trigger.kill(true); context.revert()
      stage.classList.remove('is-active')
      originalAttributes.forEach((attributes, i) => {
        slides[i].inert = attributes.inert
        if (attributes.hidden === null) slides[i].removeAttribute('aria-hidden')
        else slides[i].setAttribute('aria-hidden', attributes.hidden)
      })
      splits.forEach(split => split.revert())
      if (wasActive) lenis()?.start()
      delete section.dataset.serviceIndex; delete section.dataset.serviceActive; delete section.dataset.serviceAnimating
    },
  }
}
