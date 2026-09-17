'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type LinkPreviewProps = {
  children: ReactNode
  className?: string
  width?: number
  height?: number
  imageSrc: string
  href?: string
}

/**
 * 21st link-preview adapted for Vite. Preview portals to body so FAQ overflow can't clip it.
 */
export function LinkPreview({
  children,
  className,
  width = 220,
  height = 132,
  imageSrc,
  href,
}: LinkPreviewProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const x = useMotionValue(0)
  const translateX = useSpring(x, { stiffness: 100, damping: 15 })

  useEffect(() => setMounted(true), [])

  const place = () => {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      top: r.top - 12,
      left: r.left + r.width / 2,
    })
  }

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const offset = (e.clientX - r.left - r.width / 2) / 2
    x.set(offset)
  }

  const openPreview = () => {
    place()
    setOpen(true)
  }

  const trigger = (
    <span
      ref={wrapRef}
      className={cn(
        'inline cursor-default border-b border-dotted border-[#c4a574]/70 font-medium text-espresso transition-colors hover:border-[#8b6950]',
        className,
      )}
      onMouseEnter={openPreview}
      onMouseLeave={() => setOpen(false)}
      onFocus={openPreview}
      onBlur={() => setOpen(false)}
      onMouseMove={onMove}
      tabIndex={0}
    >
      {children}
    </span>
  )

  const card =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            className="pointer-events-none fixed z-[200]"
            style={{
              top: pos.top,
              left: pos.left,
              x: translateX,
              translateX: '-50%',
              translateY: '-100%',
            }}
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <div className="overflow-hidden rounded-xl border border-espresso/10 bg-white p-1 shadow-[0_20px_50px_rgba(26,22,18,0.28)]">
              <img
                src={imageSrc}
                alt=""
                width={width}
                height={height}
                className="block rounded-lg object-cover"
                style={{ width, height }}
                draggable={false}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    )

  if (href) {
    return (
      <a href={href} className="inline no-underline" onClick={(e) => e.stopPropagation()}>
        {trigger}
        {card}
      </a>
    )
  }

  return (
    <>
      {trigger}
      {card}
    </>
  )
}
