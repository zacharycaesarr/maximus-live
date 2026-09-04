import ShaderBackground from './ShaderBackground'
import { WAVES_CLEAR, WAVES_FRAG } from './wavesFrag'

export default function WavesBackground({ uniforms, className = '' }) {
  return (
    <ShaderBackground
      uniforms={uniforms}
      className={className}
      fragmentSource={WAVES_FRAG}
      clearColor={WAVES_CLEAR}
    />
  )
}
