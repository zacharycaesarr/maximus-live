import { useEffect, useState } from 'react'

/**
 * Reversible scroll gate: active when scrollY passes threshold,
 * inactive again when user scrolls back to the top.
 */
export function useScrollPhraseActive(threshold = 48) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setActive(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return active
}
