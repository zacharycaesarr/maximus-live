import { cn } from '@/lib/utils'

type SafariProps = {
  url?: string
  className?: string
  /** 0 = bare canvas, 1 = full chrome */
  chromeStrength?: number
  children?: React.ReactNode
}

/**
 * Safari-style browser frame (inspired by 21st.dev/@dillionverma/safari).
 * Early steps use chromeStrength near 0 so it stays abstract, not finished.
 */
export function SafariFrame({
  url = 'maximusreach.com',
  className,
  chromeStrength = 1,
  children,
}: SafariProps) {
  const c = Math.max(0, Math.min(1, chromeStrength))

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[14px] border border-espresso/12 bg-[#eceae6] shadow-[0_18px_50px_-28px_rgba(44,37,32,0.45)]',
        className,
      )}
    >
      {/* chrome bar — fades/grows in with the build */}
      <div
        className="relative flex h-10 items-center gap-2 border-b border-black/[0.06] bg-[#f3f1ed] px-3 transition-opacity duration-500"
        style={{ opacity: 0.15 + c * 0.85 }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#e5a0a0]" style={{ opacity: 0.35 + c * 0.65 }} />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e5d08a]" style={{ opacity: 0.35 + c * 0.65 }} />
        <span className="h-2.5 w-2.5 rounded-full bg-[#a8d4a0]" style={{ opacity: 0.35 + c * 0.65 }} />
        <div
          className="ml-2 flex h-6 flex-1 items-center justify-center rounded-md bg-white/70 px-3 font-nhg text-[10px] tracking-wide text-espresso/40"
          style={{ opacity: c * 0.95, transform: `scaleX(${0.55 + c * 0.45})`, transformOrigin: 'center' }}
        >
          {url}
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f7f5f1]">{children}</div>
    </div>
  )
}
