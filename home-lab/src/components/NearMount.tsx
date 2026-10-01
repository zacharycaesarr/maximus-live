import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Mount heavy below-fold UI only when it approaches the viewport.
 * Keeps first paint lighter without changing how the block looks once shown.
 */
export function NearMount({
  children,
  rootMargin = '35% 0px',
  minHeight = 320,
  placeholder,
}: {
  children: ReactNode
  rootMargin?: string
  minHeight?: number
  placeholder?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShow(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : placeholder ?? null}
    </div>
  )
}
