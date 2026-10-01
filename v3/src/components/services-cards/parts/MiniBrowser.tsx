import { MiniLandscape } from './MiniLandscape'
import { webText, type WebValues } from '../scenes/webDetails'
import type { CSSProperties } from 'react'
import * as m from 'framer-motion/m'
import { fade } from '../scenes/webMotion'

export function MiniBrowser({ values = {}, animated = false, introStagger = .17 }: { values?: WebValues; animated?: boolean; introStagger?: number }) {
  return (
      <div className="browser3d" aria-hidden>
        <div className="browser-back browser-back--2" />
        <div className="browser-back browser-back--1" />
        <div className="browser-face">
          <m.div className="mini-browser__chrome" variants={animated ? fade(introStagger * .7, .42) : undefined}>
            <span className="mini-browser__logo">{webText(values, 'webLogo')}</span>
            <div className="mini-browser__nav">
              <span>{webText(values, 'webNavHome')}</span>
              <span>{webText(values, 'webNavAbout')}</span>
              <span>{webText(values, 'webNavWork')}</span>
            </div>
            <span className="mini-browser__cta">{webText(values, 'webGetStarted')}</span>
          </m.div>

          <div className="mini-browser__body">
            <div className="mini-browser__copy">
              <m.h3 className="mini-browser__headline" variants={animated ? fade(introStagger * 1.5, .55) : undefined}>
                {webText(values, 'webHeadline1')}
                <br />
                {webText(values, 'webHeadline2')}
              </m.h3>
              <m.p className="mini-browser__sub" variants={animated ? fade(introStagger * 2.1, .5) : undefined}>{webText(values, 'webSubcopy')}</m.p>
              <m.div className="mini-browser__arrow" variants={animated ? fade(introStagger * 2.8, .48) : undefined}>
                <svg viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6h7M6.5 3.5L9.5 6 6.5 8.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </m.div>
            </div>
            <m.div className="mini-browser__media" variants={animated ? fade(introStagger * 1.9, .58) : undefined}>{webText(values, 'webImage') ? <img src={webText(values, 'webImage')} alt="" draggable={false} style={{ display: 'block', width: '100%', height: '100%', objectFit: webText(values, 'webImageFit') as CSSProperties['objectFit'], objectPosition: `${values.webImageX ?? 50}% ${values.webImageY ?? 50}%`, transform: `scale(${values.webImageScale ?? 1})` }} /> : <MiniLandscape />}</m.div>
          </div>
        </div>
      </div>
  )
}
