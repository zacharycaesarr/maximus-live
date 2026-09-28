import { useEffect, useRef } from 'react'
import type { PageScrollBgTuner } from '@/lib/pageScrollBgDefaults'

type Props = Pick<PageScrollBgTuner, 'waveSpeed' | 'waveStrength' | 'waveAcidAmount'>

const TABLE_SIZE = 1024
const TWO_PI = Math.PI * 2
const SIN_TABLE = new Float32Array(TABLE_SIZE)
const COS_TABLE = new Float32Array(TABLE_SIZE)
for (let i = 0; i < TABLE_SIZE; i++) {
  const angle = (i / TABLE_SIZE) * TWO_PI
  SIN_TABLE[i] = Math.sin(angle)
  COS_TABLE[i] = Math.cos(angle)
}
const fastSin = (x: number) => SIN_TABLE[Math.floor(((x % TWO_PI) / TWO_PI) * TABLE_SIZE) & (TABLE_SIZE - 1)]
const fastCos = (x: number) => COS_TABLE[Math.floor(((x % TWO_PI) / TWO_PI) * TABLE_SIZE) & (TABLE_SIZE - 1)]
const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

/**
 * Adapted from Le Thanh's 21st.dev Dynamic Wave Canvas Background:
 * the original four-pass sine/cosine pixel field and lookup tables remain.
 * Color, sizing and the rendering lifecycle are tuned for this CTA.
 */
export default function DynamicWaveCanvas({ waveSpeed, waveStrength, waveAcidAmount }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !host || !context) return undefined

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const buffer = document.createElement('canvas')
    const bufferContext = buffer.getContext('2d', { alpha: false })
    if (!bufferContext) return undefined

    let imageData: ImageData
    let pixels: Uint8ClampedArray
    let width = 0
    let height = 0
    let raf = 0
    let visible = false
    let frames = 0
    let lastFrame = 0
    let renderMs = 0
    let sampleStart = 0
    const startTime = performance.now()

    const resize = () => {
      const box = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35)
      const cssWidth = Math.max(1, Math.round(box.width))
      const cssHeight = Math.max(1, Math.round(box.height))
      const nextWidth = Math.min(360, Math.max(1, Math.round(cssWidth * dpr / 4.5)))
      const nextHeight = Math.min(200, Math.max(1, Math.round(cssHeight * dpr / 4.5)))
      if (width === nextWidth && height === nextHeight &&
          canvas.width === Math.round(cssWidth * dpr) &&
          canvas.height === Math.round(cssHeight * dpr)) return
      width = nextWidth
      height = nextHeight
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      buffer.width = width
      buffer.height = height
      imageData = bufferContext.createImageData(width, height)
      pixels = imageData.data
      context.imageSmoothingEnabled = true
    }

    const draw = (now: number) => {
      raf = 0
      if (!visible || document.hidden || motion.matches) return
      if (now - lastFrame < 1000 / 32) {
        raf = requestAnimationFrame(draw)
        return
      }
      lastFrame = now
      resize()
      const renderStart = performance.now()
      const time = ((now - startTime) * 0.001) * waveSpeed
      const strength = waveStrength / 100
      const acidAmount = waveAcidAmount / 100

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const ux = (2 * x - width) / height
          const uy = (2 * y - height) / height
          let a = 0
          let d = 0
          for (let i = 0; i < 4; i++) {
            a += fastCos(i - d + time * 0.5 - a * ux)
            d += fastSin(i * uy + a)
          }

          const wave = (fastSin(a) + fastCos(d)) * 0.5
          const depth = clamp01((wave + 0.5) * strength)
          const cream = Math.pow(clamp01(wave), 5) * strength * 0.16
          const acid = Math.pow(clamp01(fastSin(a * 1.5 + time * 0.2) - 0.75) / 0.25, 3) *
            Math.pow(clamp01(wave), 4) * acidAmount * 0.22
          const index = (y * width + x) * 4
          pixels[index] = 8 + depth * 29 + cream * 206 + acid * 163
          pixels[index + 1] = 9 + depth * 31 + cream * 203 + acid * 246
          pixels[index + 2] = 9 + depth * 23 + cream * 196 + acid * 52
          pixels[index + 3] = 255
        }
      }
      bufferContext.putImageData(imageData, 0, 0)
      context.drawImage(buffer, 0, 0, canvas.width, canvas.height)
      frames += 1
      renderMs += performance.now() - renderStart
      if (frames % 15 === 0) {
        canvas.dataset.waveFrames = String(frames)
        canvas.dataset.waveRenderMs = (renderMs / 15).toFixed(2)
        canvas.dataset.waveFps = sampleStart ? (15000 / (now - sampleStart)).toFixed(1) : '0'
        renderMs = 0
        sampleStart = now
      }
      raf = requestAnimationFrame(draw)
    }

    const update = () => {
      const shouldRun = visible && !document.hidden && !motion.matches
      canvas.dataset.waveState = shouldRun ? 'running' : 'paused'
      if (shouldRun && !raf) raf = requestAnimationFrame(draw)
      if (!shouldRun && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { rootMargin: '100px 0px', threshold: 0.01 })
    const observer = new ResizeObserver(() => {
      if (visible) resize()
    })
    intersection.observe(host)
    observer.observe(host)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    canvas.dataset.waveState = 'paused'
    canvas.dataset.waveFrames = '0'

    return () => {
      intersection.disconnect()
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [waveSpeed, waveStrength, waveAcidAmount])

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      data-wave-host
      style={{ background: 'radial-gradient(ellipse at 50% 65%, #252820 0%, #11120E 38%, #080909 75%)' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
