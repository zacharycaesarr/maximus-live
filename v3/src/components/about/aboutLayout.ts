export type AboutStageSize = { width: number; height: number; mobile: boolean }

/** Shared final geometry keeps the portrait, signal and original stat row aligned. */
export function portraitPanel({ width, height }: AboutStageSize) {
  const top = Math.min(112, Math.max(86, height * .12))
  const panelHeight = Math.max(0, height - top - 24)
  const panelWidth = Math.min(width * .78, panelHeight * .88)
  return { top, height: panelHeight, width: panelWidth, left: (width - panelWidth) / 2 }
}

export function metricLayout(size: AboutStageSize) {
  const { width, height, mobile } = size
  const panel = portraitPanel(size)
  const cardWidth = (width * (mobile ? .88 : .84) - (mobile ? 18 : 36)) / 4
  const cardHeight = mobile ? Math.min(132, Math.max(116, height * .15)) : Math.min(280, Math.max(170, cardWidth * .8), height * .32)
  // Retain the approved card footprint independently of the slightly wider frame.
  const railSpan = Math.min(width * .78, panel.height * .75) * .94
  const railWidth = mobile ? cardWidth : (railSpan - 18) / 4
  const railHeight = mobile ? Math.min(116, Math.max(98, height * .128)) : 98
  // Numeral ink occupies 67.7% of each existing cell; horizontal fitting is separate.
  const cardFont = cardHeight * .94
  const railFont = railHeight * .94
  const railLeft = mobile ? width * .06 : (width - railSpan) / 2
  const railTop = mobile ? height - railHeight - 58 : panel.top + panel.height - railHeight - 20
  return { cardWidth, cardHeight, cardFont, railWidth, railHeight, railFont, railLeft, railTop }
}
