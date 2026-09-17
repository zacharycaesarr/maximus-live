import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Apple-style emoji tile (CDN sheet with native fallback). */
export function AppleEmojiImg({
  emoji,
  size,
  className,
}: {
  emoji: string
  size: number
  className?: string
}) {
  const cps = [...emoji]
    .map((c) => c.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join('-')
  const src = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/${cps}.png`
  return (
    <>
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={cn('object-contain', className)}
        draggable={false}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fb = e.currentTarget.nextElementSibling as HTMLElement | null
          if (fb) fb.hidden = false
        }}
      />
      <span
        className={cn('leading-none', className)}
        style={{ fontSize: size * 0.72 }}
        hidden
        aria-hidden
      >
        {emoji}
      </span>
    </>
  )
}

type Props = {
  emoji: string
  size: number
  radius: number
  bg: string
  border: string
  slideMs: number
  className?: string
}

/** Centered rounded square badge — slides up when emoji changes. */
export default function PhraseServiceBadge({
  emoji,
  size,
  radius,
  bg,
  border,
  slideMs,
  className,
}: Props) {
  const icon = Math.round(size * 0.55)
  return (
    <div
      className={cn('relative mx-auto flex items-center justify-center overflow-hidden', className)}
      style={{ width: size, height: size, borderRadius: radius, background: bg, border: `1px solid ${border}` }}
      aria-hidden
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={emoji}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: slideMs / 1000, ease: [0.22, 1, 0.36, 1] }}
        >
          <AppleEmojiImg emoji={emoji} size={icon} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
