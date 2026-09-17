import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  title: string
  /** Z-pattern: left | right | center */
  align?: 'left' | 'right' | 'center'
  children?: ReactNode
  className?: string
  titleClassName?: string
  eyebrow?: string
}

/**
 * Lightweight section shell for page map / future bricks.
 * Titles only until Zachary fills content brick by brick.
 */
export default function SectionShell({
  id,
  title,
  align = 'left',
  children,
  className,
  titleClassName,
  eyebrow,
}: Props) {
  const alignCls =
    align === 'right'
      ? 'items-end text-right'
      : align === 'center'
        ? 'items-center text-center'
        : 'items-start text-left'

  return (
    <section
      id={id}
      className={cn(
        'relative mx-auto flex w-full max-w-[1200px] flex-col px-5 py-24 md:px-10 md:py-32',
        alignCls,
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'm-0 font-nhg text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-espresso',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {children ? (
        <div className="mt-8 w-full">{children}</div>
      ) : (
        <p className="mt-4 max-w-md font-nhg text-sm text-espresso/35">Section mapped. Content next.</p>
      )}
    </section>
  )
}
