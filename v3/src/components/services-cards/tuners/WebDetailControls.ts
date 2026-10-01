import { folder, LevaInputs } from 'leva'
import { WEB_COLORS, WEB_CONTENT, WEB_FIELDS, WEB_MOVERS } from '../scenes/webDetails'

const collapsed = { collapsed: true }
export function webDetailControls() {
  const groups = Object.fromEntries(Object.entries(WEB_FIELDS).map(([name, fields]) => [name,
    folder(Object.fromEntries(fields.map(({ key, label, value, min, max, step }) => [key, { label, value, min, max, step }])), collapsed),
  ]))
  const elements = Object.fromEntries(Object.keys(WEB_MOVERS).map(key => [key, folder({
    [key + 'OffsetX']: { value: 0, min: -80, max: 80, step: 1, label: 'Offset X' },
    [key + 'OffsetY']: { value: 0, min: -80, max: 80, step: 1, label: 'Offset Y' },
    [key + 'LocalScale']: { value: 1, min: .4, max: 2, step: .01, label: 'Scale' },
  }, collapsed)]))
  return {
    ...groups,
    Colors: folder(Object.fromEntries(Object.entries(WEB_COLORS).map(([key, { value }]) => [key, { value, label: key.replace(/^web/, '') }])), collapsed),
    'Element positions': folder(elements, collapsed),
    'Rear layers': folder({
      shell1X: { value: 3, min: -20, max: 20, step: 1 },
      shell1Y: { value: -4, min: -25, max: 25, step: 1 },
      shell1Z: { value: -6, min: -40, max: 0, step: 1 },
      shell2X: { value: 5, min: -20, max: 20, step: 1 },
      shell2Y: { value: -8, min: -25, max: 25, step: 1 },
      shell2Z: { value: -12, min: -40, max: 0, step: 1 },
    }, collapsed),
    'Text and image': folder({
      ...Object.fromEntries(Object.entries(WEB_CONTENT).map(([key, value]) => [key, { type: LevaInputs.STRING, value, label: key.replace(/^web/, '') }])),
      webImageFit: { value: WEB_CONTENT.webImageFit, options: ['cover', 'contain'], label: 'Image fit' },
      webImageX: { value: 50, min: 0, max: 100, step: 1, label: 'Image crop X' },
      webImageY: { value: 50, min: 0, max: 100, step: 1, label: 'Image crop Y' },
      webImageScale: { value: 1, min: .5, max: 2, step: .01, label: 'Image zoom' },
    }, collapsed),
  }
}
