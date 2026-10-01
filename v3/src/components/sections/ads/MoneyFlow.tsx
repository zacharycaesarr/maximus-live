'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  eyebrow: string
  title: string
  body: string
  /** Visual tuners (defaults match the original look) */
  chartH?: number
  chartPad?: number
  lineBase?: number
  lineShareMul?: number
  outLineBase?: number
  outLineMul?: number
  budgetR?: number
  outcomeR?: number
  logoCardW?: number
  logoImg?: number
  sectionPy?: number
}

const PLATFORMS = [
  {
    id: 'meta',
    label: 'Meta',
    logo: '/brand/meta.svg',
    share: 0.45,
    out: [0.5, 0.35, 0.15],
    nudgeY: 0,
  },
  {
    id: 'google',
    label: 'Google',
    logo: '/brand/google.svg',
    share: 0.4,
    out: [0.6, 0.2, 0.2],
    nudgeY: 0,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    logo: '/brand/tiktok.svg',
    share: 0.15,
    out: [0.2, 0.3, 0.5],
    // Soft box sits a hair low vs the bezier — lift to center on the path
    nudgeY: -10,
  },
]
const OUTCOMES = ['Calls', 'Forms', 'Bookings']

const W = 640
const X0 = 40
const X1 = 320
const X2 = 600

function yAt(i: number, n: number, H: number, pad: number) {
  return pad + (i / (n - 1)) * (H - pad * 2)
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const cx = (x1 + x2) / 2
  return `M${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
}

/**
 * Budget → platforms → outcomes. Logos in soft boxes (not name pills).
 */
export default function MoneyFlow({
  eyebrow,
  title,
  body,
  chartH = 360,
  chartPad = 48,
  lineBase = 2,
  lineShareMul = 18,
  outLineBase = 1.5,
  outLineMul = 26,
  budgetR = 14,
  outcomeR = 6,
  logoCardW = 100,
  logoImg = 28,
  sectionPy = 112,
}: Props) {
  const [hot, setHot] = useState<string | null>(null)
  const H = chartH
  const y = (i: number, n: number) => yAt(i, n, H, chartPad)

  return (
    <section className="px-6" style={{ paddingTop: sectionPy, paddingBottom: sectionPy }}>
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-nhg text-[11px] font-medium uppercase tracking-[0.18em] text-espresso/40">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-tiempos text-[clamp(1.85rem,3.5vw,2.75rem)] font-light tracking-tight text-espresso">
            {title}
          </h2>
          <p className="mt-4 max-w-md font-nhg text-[15px] leading-relaxed text-espresso">{body}</p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[24px] border border-espresso/10 bg-white/60 p-3 md:p-6">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label="Budget flowing to platforms and outcomes"
          >
            <defs>
              <linearGradient id="mf-g" x1="0" x2="1">
                <stop offset="0" stopColor="#2C2520" />
                <stop offset="1" stopColor="#c4a574" />
              </linearGradient>
            </defs>

            {PLATFORMS.map((p, i) => {
              const active = hot === null || hot === p.id
              return (
                <motion.path
                  key={`b-${p.id}`}
                  d={curve(X0 + 8, H / 2, X1 - 8, y(i, PLATFORMS.length))}
                  fill="none"
                  stroke="#2C2520"
                  strokeLinecap="round"
                  animate={{
                    opacity: active ? 0.85 : 0.12,
                    strokeWidth: lineBase + p.share * lineShareMul,
                  }}
                  transition={{ duration: 0.4 }}
                  strokeDasharray="6 10"
                  className="mf-dash"
                />
              )
            })}

            {PLATFORMS.map((p, i) =>
              p.out.map((share, j) => {
                const active = hot === null || hot === p.id
                return (
                  <motion.path
                    key={`o-${p.id}-${j}`}
                    d={curve(X1 + 8, y(i, PLATFORMS.length), X2 - 8, y(j, OUTCOMES.length))}
                    fill="none"
                    stroke="url(#mf-g)"
                    strokeLinecap="round"
                    animate={{
                      opacity: active ? 0.7 : 0.08,
                      strokeWidth: outLineBase + share * p.share * outLineMul,
                    }}
                    transition={{ duration: 0.4 }}
                    strokeDasharray="6 10"
                    className="mf-dash"
                  />
                )
              }),
            )}

            <g>
              <circle cx={X0} cy={H / 2} r={budgetR} fill="#2C2520" />
              <text
                x={X0}
                y={H / 2 + budgetR + 20}
                textAnchor="middle"
                className="fill-espresso/60 font-nhg"
                fontSize="15"
              >
                Budget
              </text>
            </g>

            {/* Hit targets only — real logo cards are HTML overlays */}
            {PLATFORMS.map((p, i) => (
              <rect
                key={`hit-${p.id}`}
                x={X1 - 48}
                y={y(i, PLATFORMS.length) - 36}
                width="96"
                height="72"
                fill="transparent"
                className="cursor-pointer"
                onPointerEnter={() => setHot(p.id)}
                onPointerLeave={() => setHot(null)}
                onClick={() => setHot((h) => (h === p.id ? null : p.id))}
              />
            ))}

            {OUTCOMES.map((o, j) => (
              <g key={o}>
                <circle cx={X2} cy={y(j, OUTCOMES.length)} r={outcomeR} fill="#c4a574" />
                <text
                  x={X2 - 14}
                  y={y(j, OUTCOMES.length) + 4}
                  textAnchor="end"
                  fontSize="16"
                  className="fill-espresso font-nhg"
                >
                  {o}
                </text>
              </g>
            ))}
          </svg>

          {/* Soft-edge logo cards over the SVG platform column */}
          <div className="pointer-events-none absolute inset-0">
            {PLATFORMS.map((p, i) => {
              const topPct = ((y(i, PLATFORMS.length) + (p.nudgeY || 0)) / H) * 100
              const leftPct = (X1 / W) * 100
              const active = hot === null || hot === p.id
              const lit = hot === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-1.5 py-1.5 shadow-[0_6px_18px_rgba(44,37,32,0.08)] transition-[opacity,background-color,border-color] md:gap-1 md:rounded-2xl md:px-2.5 md:py-2.5"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: logoCardW,
                    opacity: active ? 1 : 0.35,
                    background: lit ? '#2C2520' : 'rgba(252,250,247,0.96)',
                    borderColor: lit ? '#2C2520' : 'rgba(44,37,32,0.12)',
                  }}
                  onPointerEnter={() => setHot(p.id)}
                  onPointerLeave={() => setHot(null)}
                  onClick={() => setHot((h) => (h === p.id ? null : p.id))}
                  aria-pressed={lit}
                  aria-label={p.label}
                >
                  <img
                    src={p.logo}
                    alt=""
                    width={logoImg}
                    height={logoImg}
                    className="object-contain"
                    style={{
                      width: logoImg,
                      height: logoImg,
                      filter: lit ? 'brightness(0) invert(1)' : undefined,
                    }}
                    draggable={false}
                  />
                  <span
                    className="font-nhg text-[9px] font-medium leading-none md:text-[12px]"
                    style={{ color: lit ? '#FCFAF2' : '#2C2520' }}
                  >
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-2 px-2 font-nhg text-[11px] text-espresso/35 md:px-0">
            {hot
              ? `Showing ${PLATFORMS.find((p) => p.id === hot)?.label}. Tap again to clear.`
              : 'Tap a platform to follow its money.'}
          </p>
        </div>
      </div>
      <style>{`
        .mf-dash { animation: mf-flow 2.4s linear infinite; }
        @keyframes mf-flow { to { stroke-dashoffset: -32; } }
        @media (prefers-reduced-motion: reduce) { .mf-dash { animation: none; } }
      `}</style>
    </section>
  )
}
