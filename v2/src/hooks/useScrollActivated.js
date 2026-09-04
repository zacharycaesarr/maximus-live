import { useEffect, useState } from 'react'

/** Fires once when the user first scrolls or scrolls the wheel down. */
export function useScrollActivated(threshold = 4) {
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    if (activated) return undefined

    const activate = () => setActivated(true)

    const onScroll = () => {
      if (window.scrollY > threshold) activate()
    }

    const onWheel = (e) => {
      if (e.deltaY > 0) activate()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
    }
  }, [activated, threshold])

  return activated
}
