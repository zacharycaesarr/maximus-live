import { gsap, SplitText } from './aboutMotionRuntime'

/*
 * Selected effects ported from the supplied OnScrollTypographyAnimations-main/src/js/index2.js.
 * Copyright (c) 2009 - 2022 Codrops. MIT license: ./codrops-LICENSE.txt.
 * SplitText provides the original .word > .char grouping without the demo's global Splitting().
 * Source values/ranges are retained on desktop; only effect27's mobile pin/depth are shortened.
 */
const SOURCE_DURATION = .5 // The original GSAP default, rather than the rejected custom 1s tween.

function perspective(elements: Element[]) {
  elements.forEach(element => gsap.set(element.parentNode, { perspective: 1000 }))
}

function effect17(title: HTMLElement, chars: Element[], depth: number) {
  perspective(chars)
  return gsap.fromTo(chars, {
    willChange: 'opacity, transform', opacity: 0,
    rotateX: () => gsap.utils.random(-120, 120),
    z: () => gsap.utils.random(-200 * depth, 200 * depth),
  }, {
    duration: SOURCE_DURATION, ease: 'none', opacity: 1, rotateX: 0, z: 0, stagger: .02,
    scrollTrigger: { id: 'about-story-effect17', trigger: title, start: 'top bottom', end: 'bottom top', scrub: true },
  })
}

function effect20(title: HTMLElement, chars: Element[]) {
  perspective(chars)
  return gsap.fromTo(chars, {
    willChange: 'opacity, transform', transformOrigin: '50% 100%', opacity: 0, rotationX: 90,
  }, {
    duration: SOURCE_DURATION, ease: 'power4', opacity: 1,
    stagger: { each: .03, from: 'random' }, rotationX: 0,
    scrollTrigger: { id: 'about-story-effect20', trigger: title, start: 'center bottom', end: 'bottom top+=20%', scrub: true },
  })
}

function effect27(title: HTMLElement, words: Element[], scene: HTMLElement, mobile: boolean) {
  perspective(words)
  const depth = mobile ? .65 : 1
  return gsap.fromTo(words, {
    willChange: 'opacity, transform', z: () => gsap.utils.random(500 * depth, 950 * depth),
    opacity: 0, xPercent: () => gsap.utils.random(-100, 100), yPercent: () => gsap.utils.random(-10, 10),
    rotationX: () => gsap.utils.random(-90, 90),
  }, {
    duration: SOURCE_DURATION, ease: 'expo', opacity: 1, rotationX: 0, rotationY: 0,
    xPercent: 0, yPercent: 0, z: 0,
    scrollTrigger: {
      id: 'about-story-effect27', trigger: title, start: 'center center', end: mobile ? '+=75%' : '+=300%',
      scrub: true, pin: scene,
    },
    stagger: { each: .006, from: 'random' },
  })
}

/** The exact center-distance calculation used by the source's effect28, including odd lengths. */
function centerFactor(position: number, total: number) {
  return position < Math.ceil(total / 2) ? position : Math.ceil(total / 2) - Math.abs(Math.floor(total / 2) - position) - 1
}

function effect28(title: HTMLElement, words: Element[]) {
  words.forEach((word, wordIndex) => {
    const chars = [...word.querySelectorAll('.about-split-char')]
    const total = chars.length
    gsap.fromTo(chars, {
      willChange: 'transform, filter', transformOrigin: '50% 100%',
      scale: position => gsap.utils.mapRange(0, Math.ceil(total / 2), .5, 2.1, centerFactor(position, total)),
      y: position => gsap.utils.mapRange(0, Math.ceil(total / 2), 0, 60, centerFactor(position, total)),
      rotation: position => position < total / 2
        ? gsap.utils.mapRange(0, Math.ceil(total / 2), -4, 0, centerFactor(position, total))
        : gsap.utils.mapRange(0, Math.ceil(total / 2), 0, 4, centerFactor(position, total)),
      filter: 'blur(12px) opacity(0)',
    }, {
      duration: SOURCE_DURATION, ease: 'power2.inOut', y: 0, rotation: 0, scale: 1, filter: 'blur(0px) opacity(1)',
      scrollTrigger: { id: `about-bridge-effect28-${wordIndex}`, trigger: word, start: 'top bottom+=40%', end: 'top top+=15%', scrub: true },
      stagger: { amount: .15, from: 'center' },
    })
  })
  title.dataset.codropsEffect = '28'
}

function effect16(paragraph: HTMLElement, words: Element[], index: number, scene: HTMLElement) {
  gsap.fromTo(paragraph, { transformOrigin: '0% 50%', rotate: 3 }, {
    duration: SOURCE_DURATION, ease: 'none', rotate: 0,
    scrollTrigger: { id: `about-story-block-${index}`, trigger: paragraph, start: 'top bottom', end: 'top top', scrub: true, pinnedContainer: index === 2 ? scene : undefined },
  })
  gsap.fromTo(words, { willChange: 'opacity', opacity: .1 }, {
    duration: SOURCE_DURATION, ease: 'none', opacity: 1, stagger: .05,
    scrollTrigger: { id: `about-story-words-${index}`, trigger: paragraph, start: 'top bottom-=20%', end: 'center top+=20%', scrub: true, pinnedContainer: index === 2 ? scene : undefined },
  })
}

function visualFor(moment: HTMLElement, index: number, headline: gsap.core.Tween) {
  const visual = gsap.timeline({ paused: true })
  if (index === 0) visual.fromTo(moment.querySelectorAll('[data-paper]'), {
    x: i => (i - 1) * 28, y: i => (i - 1) * 20, rotation: i => (i - 1) * 8, transformOrigin: '50% 50%',
  }, { x: 0, y: 0, rotation: 0, duration: 1, ease: 'none' }, 0)
  if (index === 1) visual.fromTo(moment.querySelector('[data-playhead]'), { x: 0 }, { x: 190, duration: 1, ease: 'none' }, 0)
  if (index === 2) {
    moment.querySelectorAll<SVGPathElement>('[data-connect-path]').forEach(path => {
      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length })
      visual.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0)
    })
    visual.fromTo(moment.querySelector('[data-connect-point]'), { opacity: .2, scale: .5, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 1, ease: 'none' }, 0)
  }
  // Adds no layout reads, animation clock or changes to the source headline tween's duration.
  headline.eventCallback('onUpdate', () => visual.progress(headline.totalProgress()))
  visual.progress(headline.totalProgress())
}

export function buildCodropsSet2Motion(root: HTMLElement, mobile: boolean, reduced: boolean) {
  const splits: SplitText[] = []
  const context = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('.about-story__moment').forEach((moment, index) => {
      const title = moment.querySelector<HTMLElement>('.about-story__headline')!
      const paragraph = moment.querySelector<HTMLElement>('.about-story__paragraph')!
      if (reduced) {
        gsap.fromTo([title, paragraph], { opacity: .7, y: 12 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { id: `about-story-reduced-${index}`, trigger: moment, start: 'top 90%', end: 'top 55%', scrub: true },
        })
        return
      }
      const headline = SplitText.create(title, { type: index === 2 ? 'words' : 'chars,words', charsClass: 'about-split-char', wordsClass: 'about-split-word', aria: 'auto', tag: 'span' })
      const body = SplitText.create(paragraph, { type: 'words', wordsClass: 'about-split-word', aria: 'auto', tag: 'span' })
      splits.push(headline, body)
      const tween = index === 0 ? effect17(title, headline.chars, mobile ? .65 : 1)
        : index === 1 ? effect20(title, headline.chars)
          : effect27(title, headline.words, moment, mobile)
      effect16(paragraph, body.words, index, moment)
      visualFor(moment, index, tween)
    })
    const bridge = root.querySelector<HTMLElement>('.about-story-bridge__headline')!
    if (reduced) return
    const split = SplitText.create(bridge, { type: 'chars,words', charsClass: 'about-split-char', wordsClass: 'about-split-word', aria: 'auto', tag: 'span' })
    splits.push(split)
    effect28(bridge, split.words)
  }, root)
  return () => { context.revert(); splits.reverse().forEach(split => split.revert()) }
}
