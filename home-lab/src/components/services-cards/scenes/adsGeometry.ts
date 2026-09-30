export type PanelPose = {
  x: number; y: number; width: number; height: number
  rx: number; ry: number; rz: number; z: number; scale: number
}

export const ADS_ARTBOARD = { width: 378, height: 340 }

export const ADS_POSES = {
  ad: { x: 23, y: 81, width: 78, height: 116, rx: -23, ry: -25, rz: 2, z: 12, scale: 1 },
  landing: { x: 136, y: 64, width: 112, height: 156, rx: -26, ry: -28, rz: 1, z: 24, scale: 1 },
  lead: { x: 286, y: 99, width: 70, height: 122, rx: -23, ry: -25, rz: 2, z: 18, scale: 1 },
} satisfies Record<string, PanelPose>

export function adsPanelPose(t: Record<string, number | string>, key: keyof typeof ADS_POSES): PanelPose {
  const n = (suffix: string) => Number(t[`${key}${suffix}`])
  return { x: n('X'), y: n('Y'), width: n('Width'), height: n('Height'), rx: n('Rx'), ry: n('Ry'), rz: n('Rz'), z: n('Z'), scale: n('Scale') }
}

export function panelTransform(p: PanelPose) {
  return `translateZ(${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.scale})`
}

/** Project the same local edge used by the CSS panel into the 2D connector layer.
 * This keeps the wire attached when any panel pose or camera setting changes. */
export function projectSocket(p: PanelPose, side: 'left' | 'right', perspective: number, originX: number, originY: number) {
  const matrix = new DOMMatrix()
    .translate(0, 0, p.z)
    .rotateAxisAngle(1, 0, 0, p.rx)
    .rotateAxisAngle(0, 1, 0, p.ry)
    .rotateAxisAngle(0, 0, 1, p.rz)
    .scale(p.scale)
  const point = new DOMPoint(side === 'left' ? -p.width / 2 : p.width / 2, 0, 0).matrixTransform(matrix)
  const cameraX = ADS_ARTBOARD.width * originX / 100
  const cameraY = ADS_ARTBOARD.height * originY / 100
  const projection = perspective / (perspective - point.z)
  return {
    x: cameraX + (p.x + p.width / 2 + point.x - cameraX) * projection,
    y: cameraY + (p.y + p.height / 2 + point.y - cameraY) * projection,
  }
}

type Point = { x: number; y: number }
export function connectorPath(start: Point, end: Point, bend: number) {
  const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - bend }
  const distance = (end.x - start.x) / 4
  return {
    d: `M${start.x},${start.y} C${start.x + distance},${start.y} ${middle.x - distance / 2},${middle.y} ${middle.x},${middle.y} S${end.x - distance},${end.y} ${end.x},${end.y}`,
    middle,
  }
}
