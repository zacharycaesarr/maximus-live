import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type GetStartedHoverCtx = {
  active: boolean
  setActive: (v: boolean) => void
  activate: () => void
  deactivate: () => void
}

const Ctx = createContext<GetStartedHoverCtx>({
  active: false,
  setActive: () => {},
  activate: () => {},
  deactivate: () => {},
})

export function GetStartedHoverProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false)
  const activate = useCallback(() => setActive(true), [])
  const deactivate = useCallback(() => setActive(false), [])
  const value = useMemo(
    () => ({ active, setActive, activate, deactivate }),
    [active, activate, deactivate],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useGetStartedHover() {
  return useContext(Ctx)
}
