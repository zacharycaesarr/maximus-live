export default function ScrollConnector({ settings, bottomPad = 20 }) {
  const thickness = settings.connectorDividerThickness ?? 2
  const offsetY = settings.connectorDividerOffsetY ?? 0
  const visible = settings.connectorDividerVisible !== false
  const tone = settings.connectorDividerTone ?? 'black'
  const toneColor =
    tone === 'white' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(10, 12, 16, 0.92)'
  const dividerColor = settings.connectorDividerColor || toneColor

  return (
    <div
      className="scroll-connector"
      style={{
        '--connector-bottom-pad': `${bottomPad}px`,
        '--connector-divider-h': `${thickness}px`,
        '--connector-divider-y': `${offsetY}px`,
        '--connector-divider-opacity': visible ? 1 : 0,
        '--connector-label-color': settings.connectorLabelColor ?? '#0a0c10',
        '--connector-line-from': settings.connectorLineFrom ?? 'rgba(10, 12, 16, 0.85)',
        '--connector-line-to': settings.connectorLineTo ?? 'rgba(10, 12, 16, 0.28)',
        '--connector-divider-color': dividerColor,
      }}
      aria-hidden="true"
    >
      <div className="scroll-connector-line" />
      <span className="scroll-connector-label">{settings.connectorLabel}</span>
      <div className="scroll-connector-divider" />
    </div>
  )
}
