/**
 * Aether flow particles (21st.dev dhileepkumargm/aether-flow-hero, adapted).
 * Transparent canvas, cream/brown palette, tuned for light hero backgrounds.
 */
import { useEffect, useRef } from 'react'
import './aether-particles.css'

function hexToRgb(hex) {
  const n = (hex || '#4f433b').replace('#', '')
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ]
}

export default function AetherParticles({ settings }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!settings.enabled) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const mouse = { x: null, y: null, radius: settings.mouseRadius }
    const rgb = hexToRgb(settings.color)
    let particles = []
    let raf = 0
    let W = 0
    let H = 0

    class Particle {
      constructor(x, y, directionX, directionY, size) {
        this.x = x
        this.y = y
        this.directionX = directionX
        this.directionY = directionY
        this.size = size
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${settings.dotOpacity})`
        ctx.fill()
      }

      update() {
        if (this.x > W || this.x < 0) this.directionX = -this.directionX
        if (this.y > H || this.y < 0) this.directionY = -this.directionY

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < mouse.radius + this.size) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (mouse.radius - distance) / mouse.radius
            this.x -= forceDirectionX * force * settings.mouseStrength
            this.y -= forceDirectionY * force * settings.mouseStrength
          }
        }

        this.x += this.directionX
        this.y += this.directionY
        this.draw()
      }
    }

    const init = () => {
      particles = []
      const isMobile = W < 768
      const density = isMobile ? settings.count * 0.6 : settings.count
      const numberOfParticles = Math.min(55, Math.max(20, Math.round(density)))

      for (let i = 0; i < numberOfParticles; i += 1) {
        const size = Math.random() * 1.6 + 0.8
        const x = Math.random() * (W - size * 4) + size * 2
        const y = Math.random() * (H - size * 4) + size * 2
        const directionX = (Math.random() * 0.4) - 0.2
        const directionY = (Math.random() * 0.4) - 0.2
        particles.push(new Particle(x, y, directionX, directionY, size))
      }
    }

    const connect = () => {
      const maxDist = settings.linkDistance
      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a; b < particles.length; b += 1) {
          const pa = particles[a]
          const pb = particles[b]
          const dx = pa.x - pb.x
          const dy = pa.y - pb.y
          const distance = dx * dx + dy * dy

          if (distance < maxDist * maxDist) {
            const dist = Math.sqrt(distance)
            const opacityValue = (1 - dist / maxDist) * settings.linkOpacity

            if (mouse.x !== null && mouse.y !== null) {
              const dxMouse = pa.x - mouse.x
              const dyMouse = pa.y - mouse.y
              const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
              if (distMouse < mouse.radius) {
                ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.min(1, opacityValue * 1.8)})`
              } else {
                ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacityValue})`
              }
            } else {
              ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacityValue})`
            }

            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(pa.x, pa.y)
            ctx.lineTo(pb.x, pb.y)
            ctx.stroke()
          }
        }
      }
    }

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      init()
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p) => p.update())
      connect()
      raf = requestAnimationFrame(animate)
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const onMouseOut = () => {
      mouse.x = null
      mouse.y = null
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseout', onMouseOut)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(raf)
      particles = []
    }
  }, [
    settings.enabled,
    settings.count,
    settings.linkDistance,
    settings.linkOpacity,
    settings.dotOpacity,
    settings.mouseRadius,
    settings.mouseStrength,
    settings.color,
  ])

  if (!settings.enabled) return null

  return <canvas ref={canvasRef} className="aether-particles-canvas" aria-hidden="true" />
}
