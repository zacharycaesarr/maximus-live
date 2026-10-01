import { useEffect } from 'react'
import { brickworkResults } from '@/lib/brickworkProof'
import { MicroBars, PaidMediaMark } from './brickwork-symbols'
import './brickwork-preview.css'

export function BrickworkPreview({ sizeClass, onReady, filter, opacity }: {
  sizeClass: string; onReady?: () => void; filter?: string; opacity?: number
}) {
  useEffect(() => { onReady?.() }, [onReady])
  return (
    <div className={`brickwork-preview ${sizeClass}`} style={{ filter, opacity }}>
      <div className="brickwork-preview-content">
        <div className="brickwork-preview-heading"><span>BRICKWORK</span><span>PAID MEDIA</span></div>
        <div className="brickwork-preview-result"><strong>{brickworkResults.roas.after}</strong><span>ROAS</span></div>
        <div className="brickwork-preview-bottom">
          <div><span>CPL</span><p>{brickworkResults.cpl.before} <span>→</span> <strong>{brickworkResults.cpl.after}</strong></p></div>
          <div className="brickwork-preview-marks"><PaidMediaMark channel="Meta" /><PaidMediaMark channel="Google" /></div>
        </div>
        <MicroBars className="brickwork-preview-bars" />
      </div>
    </div>
  )
}
