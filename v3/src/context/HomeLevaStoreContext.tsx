import { createContext, useContext, type ReactNode } from 'react'
import type { LevaStore } from '@/home/lib/levaStore'

const Ctx = createContext<LevaStore | null>(null)

export function HomeLevaStoreProvider({
  store,
  children,
}: {
  store: LevaStore
  children: ReactNode
}) {
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useHomeLevaStore() {
  return useContext(Ctx)
}
