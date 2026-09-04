import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { useControls, button, folder, Leva } from 'leva'
import { DESIGN_TUNER_STORAGE_KEY, designTunerDefaults } from '../lib/designTunerDefaults'

const DesignTunerContext = createContext(null)
const isDev = import.meta.env.DEV

function loadSaved() {
  try {
    const raw = localStorage.getItem(DESIGN_TUNER_STORAGE_KEY)
    if (!raw) return designTunerDefaults
    return { ...designTunerDefaults, ...JSON.parse(raw) }
  } catch {
    return designTunerDefaults
  }
}

function DesignTunerProviderInner({ children }) {
  const scrollProgress = useRef(0)
  const initial = useMemo(() => loadSaved(), [])

  const settings = useControls({
    'Scroll window': folder({
      stageHeight: { value: initial.scrollWindow.stageHeight, min: 150, max: 400, step: 10 },
      targetScale: { value: initial.scrollWindow.targetScale, min: 0.5, max: 1, step: 0.01 },
      targetScaleMobile: { value: initial.scrollWindow.targetScaleMobile, min: 0.5, max: 1, step: 0.01 },
      borderRadius: { value: initial.scrollWindow.borderRadius, min: 0, max: 40, step: 1 },
      windowTop: { value: initial.scrollWindow.windowTop, min: -80, max: 120, step: 1 },
      mouseTilt: { value: initial.scrollWindow.mouseTilt, min: 0, max: 4, step: 0.1 },
      mouseTiltWhenScaled: { value: initial.scrollWindow.mouseTiltWhenScaled, min: 0, max: 4, step: 0.1 },
    }),
    Headline: folder({
      top: { value: initial.headline.top, min: 40, max: 200, step: 1 },
      topMobile: { value: initial.headline.topMobile, min: 40, max: 160, step: 1 },
      fontSize: { value: initial.headline.fontSize, min: 16, max: 56, step: 1 },
      fadeStart: { value: initial.headline.fadeStart, min: 0, max: 1, step: 0.01 },
    }),
    'Hero in window': folder({
      opacity: { value: initial.heroInWindow.opacity, min: 0, max: 1, step: 0.01 },
      paddingLeft: { value: initial.heroInWindow.paddingLeft, min: -80, max: 120, step: 1 },
      paddingBottom: { value: initial.heroInWindow.paddingBottom, min: 40, max: 200, step: 1 },
      parallaxX: { value: initial.heroInWindow.parallaxX, min: 0, max: 20, step: 0.5 },
      parallaxY: { value: initial.heroInWindow.parallaxY, min: 0, max: 20, step: 0.5 },
    }),
    Nav: folder({
      dockRight: { value: initial.nav.dockRight, min: 0, max: 1, step: 0.01 },
      dockTop: { value: initial.nav.dockTop, min: 40, max: 300, step: 1 },
      dockScale: { value: initial.nav.dockScale, min: 0.6, max: 1.2, step: 0.01 },
      dockStart: { value: initial.nav.dockStart, min: 0, max: 1, step: 0.01 },
    }),
    Dock: folder({
      bottom: { value: initial.dock.bottom, min: 20, max: 220, step: 1 },
      bottomMobile: { value: initial.dock.bottomMobile, min: 40, max: 260, step: 1 },
    }),
    Panel: folder({
      bottom: { value: initial.panel.bottom, min: 0, max: 160, step: 1 },
      statSize: { value: initial.panel.statSize, min: 24, max: 72, step: 1 },
    }),
    '3D scene': folder({
      clusterX: { value: initial.scene3d.clusterX, min: 0, max: 3, step: 0.1 },
      mouseFollow: { value: initial.scene3d.mouseFollow, min: 0, max: 0.5, step: 0.01 },
      floatSpeed: { value: initial.scene3d.floatSpeed, min: 0, max: 3, step: 0.1 },
    }),
    Actions: folder({
      'Reset all': button(() => {
        localStorage.removeItem(DESIGN_TUNER_STORAGE_KEY)
        window.location.reload()
      }),
      'Copy JSON': button((get) => {
        const payload = {
          scrollWindow: {
            stageHeight: get('Scroll window.stageHeight'),
            targetScale: get('Scroll window.targetScale'),
            targetScaleMobile: get('Scroll window.targetScaleMobile'),
            borderRadius: get('Scroll window.borderRadius'),
            windowTop: get('Scroll window.windowTop'),
            mouseTilt: get('Scroll window.mouseTilt'),
            mouseTiltWhenScaled: get('Scroll window.mouseTiltWhenScaled'),
          },
          headline: {
            top: get('Headline.top'),
            topMobile: get('Headline.topMobile'),
            fontSize: get('Headline.fontSize'),
            fadeStart: get('Headline.fadeStart'),
          },
          heroInWindow: {
            opacity: get('Hero in window.opacity'),
            paddingLeft: get('Hero in window.paddingLeft'),
            paddingBottom: get('Hero in window.paddingBottom'),
            parallaxX: get('Hero in window.parallaxX'),
            parallaxY: get('Hero in window.parallaxY'),
          },
          nav: {
            dockRight: get('Nav.dockRight'),
            dockTop: get('Nav.dockTop'),
            dockScale: get('Nav.dockScale'),
            dockStart: get('Nav.dockStart'),
          },
          dock: {
            bottom: get('Dock.bottom'),
            bottomMobile: get('Dock.bottomMobile'),
          },
          panel: {
            bottom: get('Panel.bottom'),
            statSize: get('Panel.statSize'),
          },
          scene3d: {
            clusterX: get('3D scene.clusterX'),
            mouseFollow: get('3D scene.mouseFollow'),
            floatSpeed: get('3D scene.floatSpeed'),
          },
        }
        navigator.clipboard?.writeText(JSON.stringify(payload, null, 2))
      }),
    }),
  })

  useEffect(() => {
    const nested = {
      scrollWindow: {
        stageHeight: settings['Scroll window.stageHeight'],
        targetScale: settings['Scroll window.targetScale'],
        targetScaleMobile: settings['Scroll window.targetScaleMobile'],
        borderRadius: settings['Scroll window.borderRadius'],
        windowTop: settings['Scroll window.windowTop'],
        mouseTilt: settings['Scroll window.mouseTilt'],
        mouseTiltWhenScaled: settings['Scroll window.mouseTiltWhenScaled'],
      },
      headline: {
        top: settings['Headline.top'],
        topMobile: settings['Headline.topMobile'],
        fontSize: settings['Headline.fontSize'],
        fadeStart: settings['Headline.fadeStart'],
      },
      heroInWindow: {
        opacity: settings['Hero in window.opacity'],
        paddingLeft: settings['Hero in window.paddingLeft'],
        paddingBottom: settings['Hero in window.paddingBottom'],
        parallaxX: settings['Hero in window.parallaxX'],
        parallaxY: settings['Hero in window.parallaxY'],
      },
      nav: {
        dockRight: settings['Nav.dockRight'],
        dockTop: settings['Nav.dockTop'],
        dockScale: settings['Nav.dockScale'],
        dockStart: settings['Nav.dockStart'],
      },
      dock: {
        bottom: settings['Dock.bottom'],
        bottomMobile: settings['Dock.bottomMobile'],
      },
      panel: {
        bottom: settings['Panel.bottom'],
        statSize: settings['Panel.statSize'],
      },
      scene3d: {
        clusterX: settings['3D scene.clusterX'],
        mouseFollow: settings['3D scene.mouseFollow'],
        floatSpeed: settings['3D scene.floatSpeed'],
      },
    }
    localStorage.setItem(DESIGN_TUNER_STORAGE_KEY, JSON.stringify(nested))
  }, [settings])

  const nestedSettings = useMemo(() => ({
    scrollWindow: {
      stageHeight: settings['Scroll window.stageHeight'],
      targetScale: settings['Scroll window.targetScale'],
      targetScaleMobile: settings['Scroll window.targetScaleMobile'],
      borderRadius: settings['Scroll window.borderRadius'],
      windowTop: settings['Scroll window.windowTop'],
      mouseTilt: settings['Scroll window.mouseTilt'],
      mouseTiltWhenScaled: settings['Scroll window.mouseTiltWhenScaled'],
    },
    headline: {
      top: settings['Headline.top'],
      topMobile: settings['Headline.topMobile'],
      fontSize: settings['Headline.fontSize'],
      fadeStart: settings['Headline.fadeStart'],
    },
    heroInWindow: {
      opacity: settings['Hero in window.opacity'],
      paddingLeft: settings['Hero in window.paddingLeft'],
      paddingBottom: settings['Hero in window.paddingBottom'],
      parallaxX: settings['Hero in window.parallaxX'],
      parallaxY: settings['Hero in window.parallaxY'],
    },
    nav: {
      dockRight: settings['Nav.dockRight'],
      dockTop: settings['Nav.dockTop'],
      dockScale: settings['Nav.dockScale'],
      dockStart: settings['Nav.dockStart'],
    },
    dock: {
      bottom: settings['Dock.bottom'],
      bottomMobile: settings['Dock.bottomMobile'],
    },
    panel: {
      bottom: settings['Panel.bottom'],
      statSize: settings['Panel.statSize'],
    },
    scene3d: {
      clusterX: settings['3D scene.clusterX'],
      mouseFollow: settings['3D scene.mouseFollow'],
      floatSpeed: settings['3D scene.floatSpeed'],
    },
  }), [settings])

  return (
    <DesignTunerContext.Provider value={{ settings: nestedSettings, scrollProgress }}>
      <Leva collapsed={false} titleBar={{ title: 'Design tuner', drag: true }} />
      {children}
    </DesignTunerContext.Provider>
  )
}

export function DesignTunerProvider({ children }) {
  if (!isDev) {
    return (
      <DesignTunerContext.Provider
        value={{ settings: designTunerDefaults, scrollProgress: { current: 0 } }}
      >
        {children}
      </DesignTunerContext.Provider>
    )
  }

  return <DesignTunerProviderInner>{children}</DesignTunerProviderInner>
}

export function useDesignTuner() {
  const ctx = useContext(DesignTunerContext)
  if (!ctx) {
    return { settings: designTunerDefaults, scrollProgress: { current: 0 } }
  }
  return ctx
}
