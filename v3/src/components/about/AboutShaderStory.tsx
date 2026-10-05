import { useEffect, useRef, type MouseEvent } from 'react'
import { gsap, ScrollTrigger } from './aboutMotionRuntime'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'
import './about-shader-story.css'

// Source: Faboolea/shaders-on-scroll. Original GLSL and MIT license are in ./shaders/.
const SETTINGS = {
  uFrequency: [0, 4], uAmplitude: [4, 4], uDensity: [1, 1],
  uStrength: [0, 1.1], uDeepPurple: [1, 0], uOpacity: [.1, .66],
} as const
const stages = [
  { title: 'Logma', copy: "The fireball that we rode was moving. But now we've got a new machine. They got music in the solar system." },
  { title: 'Naos', copy: "Let me take you on a little trip. We're gonna travel faster than light. And you'll go anywhere you want to decide." },
  { title: 'Chara', copy: "Close your eyes now. And give in to the night. Soar above the stars. Forget what's behind." },
]

export default function AboutShaderStory() {
  const rootRef = useRef<HTMLElement>(null)
  const discover = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const root = rootRef.current!
    if (root.dataset.shaderState !== 'webgl') return
    event.preventDefault()
    const content = root.querySelector<HTMLElement>('.about-shader-story__content')!
    const destination = index < 2
      ? root.getBoundingClientRect().top + scrollY + Math.min(content.clientHeight - innerHeight, root.querySelector<HTMLElement>(`#about-shader-stage-${index + 2}`)!.offsetTop)
      : document.querySelector<HTMLElement>('#about-services')!.getBoundingClientRect().top + scrollY
    const smoother = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis
    if (smoother) smoother.scrollTo(destination)
    else window.scrollTo({ top: destination, behavior: 'smooth' })
  }
  useEffect(() => {
    const root = rootRef.current!
    const viewport = root.querySelector<HTMLElement>('.about-shader-story__viewport')!
    const content = root.querySelector<HTMLElement>('.about-shader-story__content')!
    const canvasHost = root.querySelector<HTMLElement>('.about-shader-story__canvas')!
    const line = root.querySelector<HTMLElement>('.about-shader-story__line')!
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let cancelled = false, disposeScene: (() => void) | undefined, fallbackFrame: number | undefined
    let generation = 0
    const initialize = async () => {
      const token = ++generation
      disposeScene?.(); disposeScene = undefined
      root.dataset.shaderState = 'static'
      if (media.matches) return
      const THREE = await import('three')
      await document.fonts.ready
      if (cancelled || token !== generation) return
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
      catch {
        root.dataset.shaderState = 'unsupported'
        fallbackFrame = requestAnimationFrame(() => { fallbackFrame = undefined; ScrollTrigger.refresh() })
        return
      }
      const geometry = new THREE.IcosahedronGeometry(1, 64)
      const uniforms = Object.fromEntries(Object.entries(SETTINGS).map(([key, [start]]) => [key, { value: start as number }]))
      const material = new THREE.ShaderMaterial({
        wireframe: true, transparent: true, blending: THREE.AdditiveBlending,
        vertexShader, fragmentShader, uniforms,
      })
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, .1, 10)
      camera.position.set(0, 0, 2.5)
      scene.add(camera)
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      renderer.domElement.setAttribute('aria-hidden', 'true')
      canvasHost.append(renderer.domElement)
      root.dataset.shaderState = 'webgl'
      let top = 0, limit = 1, hard = 0, soft = 0, visible = false, entered = false
      let frame: number | undefined, layoutFrame: number | undefined, priorTime = 0, elapsed = 0, measuredHeight = 0
      const first = root.querySelector<HTMLElement>('.about-shader-story__section')!
      const context = gsap.context(() => {
        gsap.set(camera.position, { z: 4 })
        gsap.set(first.querySelectorAll('[data-shader-enter]'), { y: -100, autoAlpha: 0 })
      }, root)
      const enter = () => {
        if (entered) return
        entered = true
        context.add(() => {
          gsap.timeline({ defaults: { ease: 'expo' } })
            .to(camera.position, { z: 2.5, duration: 3 })
            .to(first.querySelectorAll('[data-shader-enter]'), { y: 0, autoAlpha: 1, stagger: .2, duration: 1.6 }, '<.3')
        })
      }
      const readScroll = () => { hard = gsap.utils.clamp(0, limit, scrollY - top) }
      const resize = () => {
        const width = viewport.clientWidth, height = innerHeight
        const contentHeight = content.clientHeight
        root.style.height = `${contentHeight}px`
        top = root.getBoundingClientRect().top + scrollY
        limit = Math.max(1, content.clientHeight - height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        const scale = width < height ? .75 : 1
        mesh.scale.set(scale, scale, scale)
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
        readScroll(); soft = gsap.utils.clamp(0, limit, soft)
        if (contentHeight !== measuredHeight) {
          measuredHeight = contentHeight
          if (layoutFrame !== undefined) cancelAnimationFrame(layoutFrame)
          layoutFrame = requestAnimationFrame(() => { layoutFrame = undefined; ScrollTrigger.refresh() })
        }
      }
      const update = (time: number) => {
        frame = undefined
        if (!visible || document.hidden) return
        elapsed += priorTime ? (time - priorTime) / 1000 : 0
        priorTime = time
        // Same section-local interpolation as SmoothScroll.update(), without moving body or replacing Lenis.
        soft = gsap.utils.interpolate(soft, hard, .05)
        if (soft < .01) soft = 0
        content.style.transform = `translateY(${-soft}px)`
        const normalized = gsap.utils.clamp(0, 1, soft / limit)
        mesh.rotation.x = normalized * Math.PI
        mesh.rotation.y = elapsed * .05
        for (const [key, [start, end]] of Object.entries(SETTINGS)) uniforms[key].value = start + normalized * (end - start)
        line.style.transform = `scaleX(${normalized})`
        renderer.render(scene, camera)
        frame = requestAnimationFrame(update)
      }
      const resume = () => {
        if (visible && !document.hidden && frame === undefined) { priorTime = 0; frame = requestAnimationFrame(update) }
      }
      const stop = () => { if (frame !== undefined) cancelAnimationFrame(frame); frame = undefined; priorTime = 0 }
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) { enter(); readScroll(); resume() } else stop()
      })
      const visibility = () => { if (document.hidden) stop(); else resume() }
      const resizeObserver = new ResizeObserver(resize)
      const lost = (event: Event) => { event.preventDefault(); stop(); context.revert(); root.dataset.shaderState = 'unsupported'; root.style.removeProperty('height'); content.style.removeProperty('transform') }
      resize()
      observer.observe(root); resizeObserver.observe(content)
      window.addEventListener('scroll', readScroll, { passive: true })
      window.addEventListener('resize', resize)
      document.addEventListener('visibilitychange', visibility)
      renderer.domElement.addEventListener('webglcontextlost', lost)
      disposeScene = () => {
        if (layoutFrame !== undefined) cancelAnimationFrame(layoutFrame)
        stop(); observer.disconnect(); resizeObserver.disconnect(); context.revert()
        window.removeEventListener('scroll', readScroll); window.removeEventListener('resize', resize)
        document.removeEventListener('visibilitychange', visibility)
        renderer.domElement.removeEventListener('webglcontextlost', lost)
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove()
        root.style.removeProperty('height'); content.style.removeProperty('transform'); line.style.removeProperty('transform')
      }
    }
    void initialize()
    const preference = () => { void initialize() }
    media.addEventListener('change', preference)
    return () => {
      cancelled = true; generation++
      if (fallbackFrame !== undefined) cancelAnimationFrame(fallbackFrame)
      media.removeEventListener('change', preference); disposeScene?.()
    }
  }, [])
  return (
    <section ref={rootRef} id="about-shader-story" className="about-shader-story" aria-label="Shaders on Scroll reference experiment" data-shader-state="static">
      <div className="about-shader-story__viewport">
        <div className="about-shader-story__content">
          {stages.map((stage, index) => (
            <article className="about-shader-story__section" id={`about-shader-stage-${index + 1}`} key={stage.title}>
              <div className="about-shader-story__title">
                <span className="about-shader-story__number" data-shader-enter>{String(index + 1).padStart(2, '0')}</span>
                <h2 className="about-shader-story__name" data-shader-enter>{stage.title}</h2>
                {index === 0 && <p className="about-shader-story__arrows" aria-hidden="true"><span data-shader-enter>➤</span><br /><span data-shader-enter>➤</span></p>}
              </div>
              <p className="about-shader-story__paragraph" data-shader-enter>{stage.copy}<br />
                <a className="about-shader-story__button" data-shader-enter onClick={event => discover(event, index)} href={index < 2 ? `#about-shader-stage-${index + 2}` : '#about-services'}>Discover</a>
              </p>
            </article>
          ))}
        </div>
        <div className="about-shader-story__canvas" />
        <div className="about-shader-story__line" aria-hidden="true" />
      </div>
    </section>
  )
}
