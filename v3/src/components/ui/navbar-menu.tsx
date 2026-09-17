"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const transition = {
  type: 'spring' as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  children?: React.ReactNode
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-espresso hover:opacity-[0.9] font-nhg text-sm font-medium"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute left-1/2 top-[calc(100%_+_1.2rem)] origin-top -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="overflow-hidden rounded-2xl border border-black/[0.12] bg-white/95 shadow-xl backdrop-blur-sm"
              >
                <motion.div layout className="h-full w-max p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export const Menu = ({
  setActive,
  children,
  className,
  style,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      style={style}
      className={cn(
        'relative flex justify-center space-x-6 rounded-full border border-black/[0.08] bg-white/90 px-8 py-4 shadow-[0_8px_30px_rgba(44,37,32,0.12)] backdrop-blur-md',
        className,
      )}
    >
      {children}
    </nav>
  )
}

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string
  description: string
  href: string
  src: string
}) => {
  return (
    <a href={href} className="flex space-x-2 no-underline">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="h-[70px] w-[140px] shrink-0 rounded-md object-cover shadow-lg"
      />
      <div>
        <h4 className="mb-1 font-nhg text-lg font-bold text-espresso">{title}</h4>
        <p className="max-w-[10rem] font-nhg text-sm text-espresso/70">{description}</p>
      </div>
    </a>
  )
}

export const HoveredLink = ({
  children,
  className,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a {...rest} className={cn('font-nhg text-espresso/70 no-underline hover:text-espresso', className)}>
      {children}
    </a>
  )
}
