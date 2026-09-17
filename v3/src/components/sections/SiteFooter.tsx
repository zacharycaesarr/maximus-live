'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { buildFooterColumns } from '@/lib/footerDefaults'
import { useFooterTuner } from '@/context/FooterTunerContext'
import { cn } from '@/lib/utils'

function useIsNarrow(query = '(max-width: 768px)') {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const apply = () => setMatch(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [query])
  return match
}

/** Simplified flickering grid text (from 21st flickering-footer, no color-bits). */
function FlickeringGrid({
  text,
  className,
  squareSize = 2,
  gridGap = 3,
  maxOpacity = 0.28,
  flickerChance = 0.12,
  fontSize = 90,
}: {
  text: string
  className?: string
  squareSize?: number
  gridGap?: number
  maxOpacity?: number
  flickerChance?: number
  fontSize?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#6b5a4a'
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i + j * cols] ?? 0
          ctx.globalAlpha = opacity
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          )
        }
      }
      ctx.globalAlpha = 1
      ctx.font = `600 ${fontSize * dpr}px "Neue Haas Grotesk Display", Helvetica, Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = '#000'
      ctx.fillText(text, w / 2, h / 2)
      ctx.globalCompositeOperation = 'source-over'
    },
    [fontSize, gridGap, squareSize, text],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let raf = 0
    let last = 0
    let squares = new Float32Array(0)
    let cols = 0
    let rows = 0
    let dpr = 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      const width = container.clientWidth
      const height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      cols = Math.ceil(width / (squareSize + gridGap))
      rows = Math.ceil(height / (squareSize + gridGap))
      squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 })
    io.observe(canvas)

    const tick = (time: number) => {
      if (!inView) {
        raf = requestAnimationFrame(tick)
        return
      }
      const dt = (time - last) / 1000
      last = time
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * dt) squares[i] = Math.random() * maxOpacity
      }
      draw(ctx, canvas.width, canvas.height, cols, rows, squares, dpr)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [draw, flickerChance, gridGap, inView, maxOpacity, squareSize])

  return (
    <div ref={containerRef} className={cn('h-full w-full', className)}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  )
}

/**
 * 21st flickering-footer cherry-pick: brand + link columns with arrow hover,
 * flickering wordmark. No SOC badges / product filler columns.
 */
export default function SiteFooter() {
  const t = useFooterTuner()
  const narrow = useIsNarrow()
  const columns = useMemo(() => buildFooterColumns(t), [t])

  if (!t.enabled) return null

  return (
    <footer id="site-footer" className="w-full border-t border-espresso/10 bg-[#f7f7f5] pb-0">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between md:px-8 md:py-16">
        <div className="flex max-w-xs flex-col items-start gap-4">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <img src="/assets/mm-logo.svg" alt="" className="h-8 w-8 brightness-0" width={32} height={32} />
            <span className="font-nhg text-xl font-semibold text-espresso">{t.brandName}</span>
          </Link>
          <p className="m-0 font-nhg text-sm leading-relaxed text-espresso/55">{t.brandBlurb}</p>
          <p className="m-0 font-nhg text-[11px] uppercase tracking-[0.12em] text-espresso/35">{t.copyright}</p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 md:max-w-xl">
          {columns.map((col) => (
            <ul key={col.title} className="m-0 flex list-none flex-col gap-2 p-0">
              <li className="mb-1 font-nhg text-sm font-semibold text-espresso">{col.title}</li>
              {col.links.map((link) => (
                <li
                  key={`${col.title}-${link.label}`}
                  className="group inline-flex items-center gap-1 font-nhg text-[15px] text-espresso/55"
                >
                  {link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                    <Link to={link.href} className="no-underline text-inherit hover:text-espresso">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="no-underline text-inherit hover:text-espresso">
                      {link.label}
                    </a>
                  )}
                  <span className="flex size-4 translate-x-0 items-center justify-center rounded border border-espresso/15 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                    <ChevronRight className="h-3 w-3" aria-hidden />
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="relative z-0 mt-8 h-40 w-full md:mt-12 md:h-56">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent from-40% to-[#f7f7f5]" />
        <div className="absolute inset-0 mx-4 md:mx-8">
          <FlickeringGrid
            text={narrow ? t.flickerTextMobile : t.flickerText}
            fontSize={narrow ? 64 : 88}
            squareSize={2}
            gridGap={narrow ? 2 : 3}
            maxOpacity={0.3}
            flickerChance={0.1}
            className="h-full w-full"
          />
        </div>
      </div>
    </footer>
  )
}
