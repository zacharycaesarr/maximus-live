import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'
import { defaultParallaxTuner } from '../lib/parallaxDefaults'
import {
  getParallaxTilt,
  setParallaxSmoothing,
  startParallaxInput,
  subscribeParallax,
} from '../lib/parallaxEngine'

const ParallaxContext = createContext(null)

export function ParallaxProvider({ children, settings = defaultParallaxTuner }) {
  useEffect(() => {
    setParallaxSmoothing(settings.smoothing)
  }, [settings.smoothing])

  useEffect(() => {
    if (!settings.enabled) return undefined
    return startParallaxInput({ gyroEnabled: settings.gyroEnabled })
  }, [settings.enabled, settings.gyroEnabled])

  return (
    <ParallaxContext.Provider value={{ settings }}>
      {children}
    </ParallaxContext.Provider>
  )
}

export function useParallax() {
  const ctx = useContext(ParallaxContext)
  const settings = ctx?.settings ?? defaultParallaxTuner
  const tilt = useSyncExternalStore(subscribeParallax, getParallaxTilt, getParallaxTilt)
  return { tilt, settings }
}
