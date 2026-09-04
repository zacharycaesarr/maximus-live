import { Environment } from '@react-three/drei'

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} color="#fffaf2" />
      <directionalLight position={[4, 6, 5]} intensity={0.85} color="#fff8ee" />
      <directionalLight position={[-3, 2, 3]} intensity={0.35} color="#d9c3b0" />
      <pointLight position={[2, 1, 4]} intensity={0.25} color="#c8d4bc" />
      <Environment preset="city" environmentIntensity={0.75} />
    </>
  )
}
