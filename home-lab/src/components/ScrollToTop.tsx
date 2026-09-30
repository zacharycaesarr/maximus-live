import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scroll to top on route change.
 * Flip SCROLL_TO_TOP_ON_NAV to false if you want the old "resume where you left off" feel.
 */
export const SCROLL_TO_TOP_ON_NAV = true

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!SCROLL_TO_TOP_ON_NAV) {
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto'
      return
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    if (!SCROLL_TO_TOP_ON_NAV) return

    const jump = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: object) => void } })
        .__lenis
      lenis?.scrollTo(0, { immediate: true })
    }
    jump()
    const id = window.requestAnimationFrame(jump)
    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return null
}
