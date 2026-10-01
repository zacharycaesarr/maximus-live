/** Tiny FAQ hover cards — CSS only, no images / heavy deps. */

export function WebsiteHoverMock({ width = 200, height = 124 }: { width?: number; height?: number }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-home-line/50 bg-home-surface-light shadow-sm"
      style={{ width, height }}
    >
      <div className="flex items-center gap-1 border-b border-home-line/40 bg-home-bg-light px-1.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e07a6a]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#e0b84a]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#6bbf7a]" />
        <span className="ml-1 flex-1 truncate rounded bg-home-surface-light px-1 py-0.5 font-nhg text-[7px] text-home-muted">
          your-site
        </span>
      </div>
      <div className="space-y-1.5 p-2">
        <div className="h-1.5 w-[42%] rounded-sm bg-home-on-light/80" />
        <div className="h-1 w-[70%] rounded-sm bg-home-on-light/25" />
        <div className="mt-1 flex gap-1.5">
          <div className="h-8 flex-1 rounded-md bg-home-muted/40" />
          <div className="h-8 flex-1 rounded-md bg-home-acid/55" />
        </div>
        <div className="h-1.5 w-10 rounded-sm bg-home-muted" />
      </div>
    </div>
  )
}

/** Draws two lines one after the other via stroke-dashoffset. */
export function AdsLineHoverMock({ width = 200, height = 124 }: { width?: number; height?: number }) {
  return (
    <div
      className="overflow-hidden rounded-lg border border-home-line/50 bg-home-surface-light p-2 shadow-sm"
      style={{ width, height }}
    >
      <svg viewBox="0 0 180 100" className="h-full w-full" aria-hidden>
        <line x1="12" y1="12" x2="12" y2="88" stroke="var(--home-line)" strokeWidth="1" />
        <line x1="12" y1="88" x2="168" y2="88" stroke="var(--home-line)" strokeWidth="1" />
        <path
          className="faq-ads-line faq-ads-line-a"
          d="M16 72 C 40 68, 52 40, 78 46 S 118 70, 164 28"
          fill="none"
          stroke="#0081FB"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          className="faq-ads-line faq-ads-line-b"
          d="M16 78 C 44 74, 58 58, 86 62 S 124 48, 164 38"
          fill="none"
          stroke="#34A853"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
      <style>{`
        .faq-ads-line {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
        }
        .faq-ads-line-a {
          animation: faq-ads-draw 0.85s ease-out forwards;
        }
        .faq-ads-line-b {
          animation: faq-ads-draw 0.85s ease-out 0.35s forwards;
        }
        @keyframes faq-ads-draw {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-ads-line { stroke-dashoffset: 0; animation: none; }
        }
      `}</style>
    </div>
  )
}
