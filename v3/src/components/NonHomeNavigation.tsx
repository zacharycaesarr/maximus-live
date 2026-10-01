import { useEffect } from 'react'
import TubelightNav from './nav/TubelightNav'

/** Keep the existing service-page chrome and fonts outside the homepage startup path. */
export default function NonHomeNavigation() {
  useEffect(() => {
    if (document.getElementById('v3-page-fonts')) return
    const link = document.createElement('link')
    link.id = 'v3-page-fonts'
    link.rel = 'stylesheet'
    link.href = "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Oswald:wght@500;600;700&family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&family=Rubik:wght@400;500;600;700&display=swap"
    document.head.appendChild(link)
  }, [])
  return <TubelightNav />
}
