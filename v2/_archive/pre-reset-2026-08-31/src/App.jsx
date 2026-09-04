import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from './components/Cursor/CustomCursor'
import PillNav from './components/Nav/PillNav'
import ScrollWindowExperience from './components/Sections/ScrollWindowExperience'
import ContactSection from './components/Sections/ContactSection'
import WorkTeaserSection from './components/Sections/WorkTeaserSection'
import { MouseProvider } from './context/MouseContext'
import { QualityProvider } from './context/QualityContext'
import { DesignTunerProvider } from './context/DesignTunerContext'
import { destroyLenis, initLenis } from './lib/lenis'
import './styles/glass.css'
import './styles/tokens.css'
import './styles/cursor.css'
import './styles/hero.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const navRef = useRef(null)

  useEffect(() => {
    initLenis()

    return () => {
      destroyLenis()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <QualityProvider>
      <DesignTunerProvider>
        <MouseProvider>
          <CustomCursor />
          <PillNav navRef={navRef} />
          <main className="page-content">
            <ScrollWindowExperience navRef={navRef} />
            <WorkTeaserSection />
            <ContactSection />
          </main>
        </MouseProvider>
      </DesignTunerProvider>
    </QualityProvider>
  )
}
