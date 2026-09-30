import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useHomeColors, useHomeColorsStyle } from '@/context/HomeColorsTunerContext'

/**
 * Highest shared homepage wrapper.
 * All homepage theme CSS variables live here and inherit downward.
 * Also mirrors Dark Background onto html so body/#root match the floor
 * without theming the whole site permanently.
 */
export default function HomePageShell({ children }: { children: ReactNode }) {
  const style = useHomeColorsStyle()
  const colors = useHomeColors()

  useEffect(() => {
    const html = document.documentElement
    html.style.setProperty('--home-bg-dark', colors.bgDark)
    return () => {
      html.style.removeProperty('--home-bg-dark')
    }
  }, [colors.bgDark])

  return (
    <main
      id="home-page"
      className="relative min-h-screen bg-home-bg-dark text-home-on-dark"
      style={style}
    >
      {children}
    </main>
  )
}
