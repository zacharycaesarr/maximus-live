import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useQuality } from '../../context/QualityContext'
import { getDprForTier } from '../../lib/tiers'
import Lighting from '../../scene/Lighting'
import ServiceObjects from '../../scene/ServiceObjects'

function SceneContent() {
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.02
    gl.outputColorSpace = THREE.SRGBColorSpace
  }, [gl])

  return (
    <>
      <Lighting />
      <ServiceObjects />
    </>
  )
}

export default function HeroScene() {
  const { tier, settings } = useQuality()
  const canvasRef = useRef(null)

  if (!settings.webgl) return null

  const dpr = Math.min(getDprForTier(tier), 1.35)

  return (
    <div className="hero-scene" ref={canvasRef}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6.8], fov: 40, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
