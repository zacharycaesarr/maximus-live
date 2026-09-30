export type CreativePose = {
  x: number; y: number; width: number; height: number
  rx: number; ry: number; rz: number; z: number; scale: number
}

export const CREATIVE_POSES = {
  video: { x: 33, y: 38, width: 204, height: 144, rx: -6, ry: -10, rz: -12, z: 0, scale: 1 },
  social: { x: 217, y: 42, width: 125, height: 164, rx: -7, ry: -12, rz: 14, z: 28, scale: 1 },
  brand: { x: 120, y: 184, width: 176, height: 120, rx: -6, ry: -12, rz: 11, z: 40, scale: 1 },
} satisfies Record<string, CreativePose>

export function creativePose(t: Record<string, number | string>, key: keyof typeof CREATIVE_POSES): CreativePose {
  const n = (suffix: string) => Number(t[`${key}${suffix}`])
  return { x: n('X'), y: n('Y'), width: n('Width'), height: n('Height'), rx: n('Rx'), ry: n('Ry'), rz: n('Rz'), z: n('Z'), scale: n('Scale') }
}

export function creativeTransform(p: CreativePose) {
  return `translateZ(${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.scale})`
}
