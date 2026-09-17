import { cn } from '@/lib/utils'

type MochaHeroProps = {
  className?: string
  baseColor?: string
  accentColor?: string
  accentStop?: string
  ellipse?: string
}

/**
 * 21st ibelick radial, mocha remap.
 * IMPORTANT: do not put an opaque bg on the parent section and z-index:-10 here —
 * that paints the gradient behind the section fill (invisible). Stay at z-0 inside
 * a stacking context, under content via order / absolute fill.
 */
export function MochaBackgroundSnippet({
  className,
  baseColor = '#FCFAF2',
  accentColor = 'rgba(160, 120, 90, 0.55)',
  accentStop = '55%',
  ellipse = '80% 80% at 50% -20%',
}: MochaHeroProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
      aria-hidden
      style={{ backgroundColor: baseColor }}
    >
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          background: `radial-gradient(${ellipse}, ${accentColor} 0%, transparent ${accentStop})`,
        }}
      />
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          background: `radial-gradient(55% 45% at 85% 110%, ${accentColor} 0%, transparent 65%)`,
          opacity: 0.85,
        }}
      />
    </div>
  )
}

export const Hero = MochaBackgroundSnippet
