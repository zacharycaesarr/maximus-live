'use client'

import {
  useRef,
  useEffect,
  useState,
  type FC,
  type ReactNode,
  type CSSProperties,
} from 'react'
import gsap from 'gsap'
import { vec2, type Vec2 } from 'vecteur'

type MagneticCursorProps = {
  children: ReactNode
  magneticFactor?: number
  lerpAmount?: number
  hoverPadding?: number
  hoverAttribute?: string
  cursorSize?: number
  cursorColor?: string
  /** filled = old exclusion blob; outline = espresso stroke only (default) */
  hoverStyle?: 'filled' | 'outline'
  outlineColor?: string
  blendMode?: 'difference' | 'exclusion' | 'normal' | 'screen' | 'overlay'
  cursorClassName?: string
  shape?: 'circle' | 'square' | 'rounded-square'
  disableOnTouch?: boolean
  speedMultiplier?: number
  maxScaleX?: number
  maxScaleY?: number
  contrastBoost?: number
  /** when false, hovered elements do not translate (stops text shift) */
  pullElements?: boolean
}

type CursorState = {
  el: HTMLDivElement | null
  pos: { current: Vec2; target: Vec2; previous: Vec2 }
  hover: { isHovered: boolean; targetEl: HTMLElement | null }
  isDetaching: boolean
}

/**
 * Fluid magnetic cursor — outline hover by default so labels stay put.
 * Put data-magnetic on the thing that should catch the cursor.
 */
export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.15,
  hoverPadding = 8,
  hoverAttribute = 'data-magnetic',
  cursorSize = 22,
  cursorColor = '#2C2520',
  hoverStyle = 'outline',
  outlineColor = '#2C2520',
  blendMode = 'normal',
  cursorClassName = '',
  shape = 'circle',
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 0.6,
  maxScaleY = 0.2,
  contrastBoost = 1,
  pullElements = false,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorStateRef = useRef<CursorState | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const configRef = useRef({
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
    hoverStyle,
    outlineColor,
    cursorColor,
    pullElements,
  })

  useEffect(() => {
    configRef.current = {
      magneticFactor,
      speedMultiplier,
      maxScaleX,
      maxScaleY,
      cursorSize,
      lerpAmount,
      hoverPadding,
      hoverStyle,
      outlineColor,
      cursorColor,
      pullElements,
    }
  }, [
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
    hoverStyle,
    outlineColor,
    cursorColor,
    pullElements,
  ])

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return
    const cursorEl = cursorRef.current
    if (!cursorEl) return

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50 })

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const detachDuration = prefersReducedMotion ? 0.08 : 0.28

    if (!cursorStateRef.current) {
      cursorStateRef.current = {
        el: cursorEl,
        pos: {
          current: vec2(-100, -100),
          target: vec2(-100, -100),
          previous: vec2(-100, -100),
        },
        hover: { isHovered: false, targetEl: null },
        isDetaching: false,
      }
    }

    const applyOutlineIdle = () => {
      const { cursorSize: cs, cursorColor: cc } = configRef.current
      const shapeBorderRadius = shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px'
      gsap.set(cursorEl, {
        width: cs,
        height: cs,
        borderRadius: shapeBorderRadius,
        backgroundColor: cc,
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: 'transparent',
        boxShadow: 'none',
      })
    }

    const update = () => {
      const state = cursorStateRef.current
      if (!state) return

      // keep outline locked to element center while hovering (no drift)
      if (state.hover.isHovered && state.hover.targetEl) {
        const b = state.hover.targetEl.getBoundingClientRect()
        const cx = b.left + b.width / 2
        const cy = b.top + b.height / 2
        gsap.set(state.el, { x: cx, y: cy, scaleX: 1, scaleY: 1, rotate: 0 })
        return
      }

      if (state.hover.isHovered) return

      const { speedMultiplier: sm, maxScaleX: msx, maxScaleY: msy, lerpAmount: la } =
        configRef.current
      const effectiveLerp = prefersReducedMotion ? 1 : la

      state.pos.current.lerp(state.pos.target, effectiveLerp)
      const delta = state.pos.current.clone().sub(state.pos.previous)
      state.pos.previous.copy(state.pos.current)

      if (state.isDetaching) {
        gsap.set(state.el, {
          x: state.pos.current.x,
          y: state.pos.current.y,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          overwrite: 'auto',
        })
      } else {
        const speed = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * sm
        gsap.set(state.el, {
          x: state.pos.current.x,
          y: state.pos.current.y,
          rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
          scaleX: 1 + Math.min(speed, msx),
          scaleY: 1 - Math.min(speed, msy),
          overwrite: 'auto',
        })
      }
    }

    const initializePosition = (event: MouseEvent) => {
      const state = cursorStateRef.current
      if (!state) return
      const x = event.clientX
      const y = event.clientY
      state.pos.current.x = x
      state.pos.current.y = y
      state.pos.target.x = x
      state.pos.target.y = y
      state.pos.previous.x = x
      state.pos.previous.y = y
      gsap.set(cursorEl, { x, y, opacity: 1 })
    }

    const onMouseMove = (event: PointerEvent) => {
      const state = cursorStateRef.current
      if (!state) return
      state.pos.target.x = event.clientX
      state.pos.target.y = event.clientY

      const isInViewport =
        event.clientX >= 0 &&
        event.clientX <= window.innerWidth &&
        event.clientY >= 0 &&
        event.clientY <= window.innerHeight

      gsap.to(cursorEl, { opacity: isInViewport ? 1 : 0, duration: 0.2, overwrite: 'auto' })
    }

    const handleMouseLeave = () => gsap.to(cursorEl, { opacity: 0, duration: 0.3 })
    const handleMouseEnter = () => gsap.to(cursorEl, { opacity: 1, duration: 0.3 })

    gsap.ticker.add(update)
    window.addEventListener('pointermove', onMouseMove)
    window.addEventListener('pointermove', initializePosition, { once: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    const cleanupFunctions: (() => void)[] = []

    const magneticElements = gsap.utils.toArray<HTMLElement>(`[${hoverAttribute}]`)
    magneticElements.forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })

      const handlePointerEnter = () => {
        const state = cursorStateRef.current
        if (!state) return
        const { hoverPadding: hp, hoverStyle: hs, outlineColor: oc, cursorColor: cc } =
          configRef.current

        state.hover.isHovered = true
        state.hover.targetEl = el
        state.isDetaching = false

        const bounds = el.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(el)
        const radius = computedStyle.borderRadius || '10px'
        const centerX = bounds.left + bounds.width / 2
        const centerY = bounds.top + bounds.height / 2
        const pad = hp

        gsap.killTweensOf(cursorEl)
        if (hs === 'outline') {
          gsap.to(cursorEl, {
            x: centerX,
            y: centerY,
            width: bounds.width + pad * 2,
            height: bounds.height + pad * 2,
            borderRadius: radius,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderStyle: 'solid',
            borderColor: oc,
            boxShadow: 'none',
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
            duration: 0.25,
            ease: 'power3.out',
            overwrite: 'all',
          })
        } else {
          gsap.to(cursorEl, {
            x: centerX,
            y: centerY,
            width: bounds.width + pad * 2,
            height: bounds.height + pad * 2,
            borderRadius: radius,
            backgroundColor: cc,
            borderWidth: 0,
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
            duration: 0.25,
            ease: 'power3.out',
            overwrite: 'all',
          })
        }
      }

      const handlePointerLeave = () => {
        const state = cursorStateRef.current
        if (!state) return
        const currentX = gsap.getProperty(cursorEl, 'x') as number
        const currentY = gsap.getProperty(cursorEl, 'y') as number

        state.pos.current.x = currentX
        state.pos.current.y = currentY
        state.pos.previous.x = currentX
        state.pos.previous.y = currentY
        state.hover.isHovered = false
        state.hover.targetEl = null
        state.isDetaching = true

        const { cursorSize: cs, cursorColor: cc } = configRef.current
        const shapeBorderRadius = shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px'

        gsap.killTweensOf(cursorEl)
        gsap.to(cursorEl, {
          width: cs,
          height: cs,
          borderRadius: shapeBorderRadius,
          backgroundColor: cc,
          borderWidth: 0,
          borderColor: 'transparent',
          boxShadow: 'none',
          scaleX: 1,
          scaleY: 1,
          duration: detachDuration,
          ease: 'power3.out',
          overwrite: 'all',
          onComplete: () => {
            state.isDetaching = false
            applyOutlineIdle()
          },
        })
      }

      let rafId: number | null = null
      const handlePointerMove = (event: PointerEvent) => {
        if (!configRef.current.pullElements) return
        if (rafId) return
        rafId = requestAnimationFrame(() => {
          const { clientX, clientY } = event
          const { height, width, left, top } = el.getBoundingClientRect()
          const { magneticFactor: mf } = configRef.current
          xTo((clientX - (left + width / 2)) * mf)
          yTo((clientY - (top + height / 2)) * mf)
          rafId = null
        })
      }

      const handlePointerOut = () => {
        if (!configRef.current.pullElements) return
        xTo(0)
        yTo(0)
      }

      el.addEventListener('pointerenter', handlePointerEnter)
      el.addEventListener('pointerleave', handlePointerLeave)
      el.addEventListener('pointermove', handlePointerMove)
      el.addEventListener('pointerout', handlePointerOut)

      cleanupFunctions.push(() => {
        el.removeEventListener('pointerenter', handlePointerEnter)
        el.removeEventListener('pointerleave', handlePointerLeave)
        el.removeEventListener('pointermove', handlePointerMove)
        el.removeEventListener('pointerout', handlePointerOut)
        gsap.set(el, { x: 0, y: 0 })
      })
    })

    applyOutlineIdle()

    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('pointermove', onMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [
    disableOnTouch,
    isTouchDevice,
    hoverPadding,
    hoverAttribute,
    cursorColor,
    shape,
    hoverStyle,
    outlineColor,
    pullElements,
  ])

  if (disableOnTouch && isTouchDevice) return <>{children}</>

  const styles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    willChange: 'transform, width, height, border-radius',
    backgroundColor: cursorColor,
    mixBlendMode: blendMode,
    width: cursorSize,
    height: cursorSize,
    borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '0' : '8px',
    border: '0 solid transparent',
    boxSizing: 'border-box',
    backdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
    WebkitBackdropFilter: contrastBoost !== 1 ? `contrast(${contrastBoost})` : 'none',
  }

  return (
    <>
      <div ref={cursorRef} className={`magnetic-cursor ${cursorClassName}`} style={styles} />
      {children}
    </>
  )
}
