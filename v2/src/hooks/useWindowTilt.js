import { useCallback, useEffect, useRef, useState } from 'react'

export function useWindowTilt({
  enabled,
  maxRotate = 10,
  perspective = 900,
  leavePad = 8,
}) {
  const wrapRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const reset = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 })
  }, [])

  useEffect(() => {
    if (!enabled) {
      reset()
      return undefined
    }

    const onMove = (e) => {
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) return

      const pad = leavePad
      const inside =
        e.clientX >= r.left - pad &&
        e.clientX <= r.right + pad &&
        e.clientY >= r.top - pad &&
        e.clientY <= r.bottom + pad

      if (!inside) {
        reset()
        return
      }

      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const ry = ((e.clientX - cx) / (r.width / 2)) * maxRotate
      const rx = -((e.clientY - cy) / (r.height / 2)) * maxRotate
      setTilt({ rotateX: rx, rotateY: ry })
    }

    const onLeave = () => reset()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [enabled, maxRotate, leavePad, reset])

  useEffect(() => {
    if (!enabled) reset()
  }, [enabled, reset])

  const style = enabled
    ? {
        transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }
    : {
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`,
        transformStyle: 'preserve-3d',
      }

  return { wrapRef, style, reset }
}
