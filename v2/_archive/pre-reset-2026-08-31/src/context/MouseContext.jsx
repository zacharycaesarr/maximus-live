import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const MouseContext = createContext({
  x: 0,
  y: 0,
  nx: 0,
  ny: 0,
})

export function MouseProvider({ children }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0, nx: 0, ny: 0 })
  const frame = useRef(0)
  const latest = useRef({ x: 0, y: 0 })

  const onMove = useCallback((event) => {
    const nx = (event.clientX / window.innerWidth) * 2 - 1
    const ny = (event.clientY / window.innerHeight) * 2 - 1
    latest.current = { x: nx, y: ny }

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      setMouse({
        x: latest.current.x,
        y: latest.current.y,
        nx: latest.current.x,
        ny: latest.current.y,
      })
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame.current)
    }
  }, [onMove])

  return <MouseContext.Provider value={mouse}>{children}</MouseContext.Provider>
}

export function useMouse() {
  return useContext(MouseContext)
}
