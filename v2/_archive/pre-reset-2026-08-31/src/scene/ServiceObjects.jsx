import { useRef } from 'react'
import { Float, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDesignTuner } from '../context/DesignTunerContext'
import { useMouse } from '../context/MouseContext'

function GlossMaterial({ color = '#f5f0e8', envIntensity = 1.05 }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.12}
      roughness={0.08}
      clearcoat={1}
      clearcoatRoughness={0.06}
      envMapIntensity={envIntensity}
      reflectivity={0.9}
    />
  )
}

function ChromeMaterial() {
  return (
    <meshPhysicalMaterial
      color="#ece7de"
      metalness={0.78}
      roughness={0.14}
      clearcoat={1}
      clearcoatRoughness={0.04}
      envMapIntensity={1.2}
    />
  )
}

function BrowserWindow() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.04
  })

  return (
    <group ref={ref} position={[0.7, 0.15, 0]}>
      <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.35}>
        <RoundedBox args={[2, 1.3, 0.07]} radius={0.06} smoothness={5}>
          <GlossMaterial />
        </RoundedBox>
        <mesh position={[0, 0.52, 0.04]}>
          <boxGeometry args={[1.88, 0.11, 0.015]} />
          <ChromeMaterial />
        </mesh>
        {[-0.74, -0.62, -0.5].map((x, i) => (
          <mesh key={x} position={[x, 0.52, 0.05]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial
              color={['#d9c3b0', '#8a9a7b', '#b8a898'][i]}
              emissive={['#d9c3b0', '#8a9a7b', '#b8a898'][i]}
              emissiveIntensity={0.15}
              metalness={0.35}
              roughness={0.25}
            />
          </mesh>
        ))}
      </Float>
    </group>
  )
}

function PhoneBubble() {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.45 + 1) * 0.06
  })

  return (
    <group ref={ref} position={[-0.95, -0.25, 0.35]} rotation={[0, 0.4, 0]}>
      <Float speed={1.6} rotationIntensity={0.28} floatIntensity={0.42}>
        <RoundedBox args={[0.5, 0.95, 0.06]} radius={0.08} smoothness={5}>
          <GlossMaterial color="#faf6ef" />
        </RoundedBox>
        <mesh position={[0.42, 0.32, 0.1]}>
          <sphereGeometry args={[0.17, 24, 24]} />
          <GlossMaterial color="#ffffff" envIntensity={1.25} />
        </mesh>
      </Float>
    </group>
  )
}

function GrowthBars() {
  const ref = useRef()
  const mat = useRef(
    new THREE.MeshStandardMaterial({
      color: '#8a9a7b',
      emissive: '#a8b898',
      emissiveIntensity: 0.35,
      metalness: 0.28,
      roughness: 0.18,
    }),
  )

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1
  })

  return (
    <group ref={ref} position={[-0.15, -0.55, 0.5]}>
      <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.3}>
        {[
          [-0.28, 0.18, 0.32],
          [0, 0.28, 0.48],
          [0.28, 0.38, 0.62],
        ].map(([x, y, h]) => (
          <mesh key={x} position={[x, y, 0]} material={mat.current}>
            <boxGeometry args={[0.14, h, 0.14]} />
          </mesh>
        ))}
      </Float>
    </group>
  )
}

export default function ServiceObjects() {
  const cluster = useRef()
  const mouse = useMouse()
  const { settings, scrollProgress } = useDesignTuner()

  useFrame((_, delta) => {
    if (!cluster.current) return
    const scrollDamp = scrollProgress.current > 0.15 ? 0.15 : 1
    const follow = settings.scene3d.mouseFollow * scrollDamp

    cluster.current.rotation.y = THREE.MathUtils.damp(
      cluster.current.rotation.y,
      mouse.nx * follow,
      2.8,
      delta,
    )
    cluster.current.rotation.x = THREE.MathUtils.damp(
      cluster.current.rotation.x,
      -mouse.ny * (follow * 0.55),
      2.8,
      delta,
    )
    cluster.current.position.x = THREE.MathUtils.damp(
      cluster.current.position.x,
      settings.scene3d.clusterX + mouse.nx * (follow * 0.55),
      2.5,
      delta,
    )
  })

  return (
    <group ref={cluster} position={[0, 0, 0]}>
      <BrowserWindow />
      <PhoneBubble />
      <GrowthBars />
    </group>
  )
}
