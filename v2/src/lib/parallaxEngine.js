const listeners = new Set()
let target = { x: 0, y: 0 }
let current = { x: 0, y: 0 }
let smoothing = 0.1
let rafId = 0

function lerp(a, b, t) {
  return a + (b - a) * t
}

function tick() {
  const x = lerp(current.x, target.x, smoothing)
  const y = lerp(current.y, target.y, smoothing)
  if (x !== current.x || y !== current.y) {
    current = { x, y }
    listeners.forEach((fn) => fn())
  }
  rafId = requestAnimationFrame(tick)
}

function ensureLoop() {
  if (rafId) return
  rafId = requestAnimationFrame(tick)
}

export function subscribeParallax(listener) {
  listeners.add(listener)
  ensureLoop()
  return () => {
    listeners.delete(listener)
    if (!listeners.size && rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }
}

export function getParallaxTilt() {
  return current
}

export function setParallaxTarget(x, y) {
  target.x = x
  target.y = y
}

export function setParallaxSmoothing(value) {
  smoothing = Math.max(0.02, Math.min(0.4, value))
}

export function startParallaxInput({ gyroEnabled = true } = {}) {
  const setFromPointer = (clientX, clientY) => {
    target.x = (clientX / window.innerWidth - 0.5) * 2
    target.y = (clientY / window.innerHeight - 0.5) * 2
  }

  const onMouseMove = (e) => setFromPointer(e.clientX, e.clientY)
  const onTouchMove = (e) => {
    const touch = e.touches[0]
    if (touch) setFromPointer(touch.clientX, touch.clientY)
  }

  const onOrientation = (e) => {
    if (!gyroEnabled) return
    const gamma = e.gamma ?? 0
    const beta = e.beta ?? 45
    target.x = Math.max(-1, Math.min(1, gamma / 40))
    target.y = Math.max(-1, Math.min(1, (beta - 45) / 40))
  }

  const attachOrientation = () => {
    window.addEventListener('deviceorientation', onOrientation)
  }

  const requestGyro = async () => {
    if (!gyroEnabled) return
    const req = window.DeviceOrientationEvent?.requestPermission
    if (typeof req === 'function') {
      try {
        const result = await req()
        if (result === 'granted') attachOrientation()
      } catch {
        /* permission denied */
      }
    } else {
      attachOrientation()
    }
  }

  const onFirstTouch = () => {
    requestGyro()
    window.removeEventListener('touchstart', onFirstTouch)
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchstart', onFirstTouch, { passive: true })

  if (!('ontouchstart' in window) && gyroEnabled) {
    attachOrientation()
  }

  ensureLoop()

  return () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchstart', onFirstTouch)
    window.removeEventListener('deviceorientation', onOrientation)
    target = { x: 0, y: 0 }
  }
}
