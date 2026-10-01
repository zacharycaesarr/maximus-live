import type { CSSProperties, ReactNode } from 'react'
import { useWhyVisuals } from './WhyVisualTuner'

type Props = { panel: number; object: number; weight?: number; children: ReactNode }

const variations = [
  { x: 1, y: 1, rotation: 1, duration: 1, phase: 0 },
  { x: -.85, y: .88, rotation: -.7, duration: 1.13, phase: -1.8 },
  { x: .75, y: 1.12, rotation: .65, duration: .91, phase: -3.2 },
  { x: -.65, y: .96, rotation: -.8, duration: 1.19, phase: -4.4 },
]

export default function WhyFloatLayer({ panel, object, weight = 1, children }: Props) {
  const { floating, motion } = useWhyVisuals()
  const tuning = floating.panels[panel]
  const variation = variations[object % variations.length]
  const amount = floating.intensity * motion.intensity * (motion.floatAmount / 3) * weight
  const style = {
    '--why-idle-x': `${tuning.x * variation.x * amount}px`,
    '--why-idle-y': `${tuning.y * variation.y * amount}px`,
    '--why-idle-rotation': `${tuning.rotation * variation.rotation * amount}deg`,
    '--why-idle-duration': `${tuning.duration * variation.duration / floating.speed}s`,
    '--why-idle-phase': `${tuning.phase + variation.phase}s`,
  } as CSSProperties

  return <div className="why-float-layer" style={style}>{children}</div>
}
