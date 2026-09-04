import { useEffect, useRef } from 'react'
import '../../styles/ambient.css'

const PCOUNT = 55

class Particle {
  constructor(W, H) {
    this.W = W
    this.H = H
    this.init()
  }

  init() {
    this.x = Math.random() * this.W
    this.y = Math.random() * this.H
    this.sz = Math.random() * 1.5 + 0.48
    this.vx = (Math.random() - 0.5) * 0.38
    this.vy = (Math.random() - 0.5) * 0.38
    this.alpha = Math.random() * 0.26 + 0.076
    this.life = Math.random() * 260 + 140
    this.maxLife = this.life
  }

  update(mouse, W, H) {
    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < 130 && d > 0) {
      const f = (130 - d) / 130
      this.vx -= (dx / d) * f
      this.vy -= (dy / d) * f
    }

    this.vx *= 0.976
    this.vy *= 0.976
    this.x += this.vx
    this.y += this.vy

    if (this.x < -5) this.x = W + 5
    if (this.x > W + 5) this.x = -5
    if (this.y < -5) this.y = H + 5
    if (this.y > H + 5) this.y = -5

    this.life -= 1
    if (this.life <= 0) this.init()
  }

  draw(ctx) {
    const a = this.alpha * Math.min(1, (this.maxLife - this.life) / 30, this.life / 30)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(44,37,32,${a})`
    ctx.fill()
  }
}

export default function ParticleField() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const particlesRef = useRef([])
  const sizeRef = useRef({ W: 0, H: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined

    const isMobile = window.innerWidth < 768
    const count = isMobile ? 32 : PCOUNT

    const resize = () => {
      sizeRef.current.W = canvas.width = window.innerWidth
      sizeRef.current.H = canvas.height = window.innerHeight
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from(
          { length: count },
          () => new Particle(sizeRef.current.W, sizeRef.current.H),
        )
      }
    }

    const onMove = (event) => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const loop = () => {
      const { W, H } = sizeRef.current
      ctx.clearRect(0, 0, W, H)

      particlesRef.current.forEach((p) => {
        p.update(mouseRef.current, W, H)
        p.draw(ctx)
      })

      for (let i = 0; i < particlesRef.current.length; i += 1) {
        for (let j = i + 1; j < particlesRef.current.length; j += 1) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(44,37,32,${(1 - d / 110) * 0.14})`
            ctx.lineWidth = 0.71
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      particlesRef.current = []
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />
}
