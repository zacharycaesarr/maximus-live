import { createContext, useContext, useMemo, useState } from 'react'
import { getTierSettings, resolveQualityTier } from '../lib/tiers'

const QualityContext = createContext({
  tier: 0,
  settings: getTierSettings(0),
})

export function QualityProvider({ children }) {
  const [tier] = useState(() => resolveQualityTier())
  const settings = useMemo(() => getTierSettings(tier), [tier])

  return (
    <QualityContext.Provider value={{ tier, settings }}>
      {children}
    </QualityContext.Provider>
  )
}

export function useQuality() {
  return useContext(QualityContext)
}
