import { motion } from 'framer-motion'
import { useScrollTuner } from '../../context/ScrollTunerContext'
import { useWavesTuner } from '../../context/WavesTunerContext'
import { useBentoTuner } from '../../context/BentoTunerContext'
import { bentoLayoutMetrics } from '../../lib/bentoDefaults'
import RealityDotPattern from './RealityDotPattern'
import WavesBackground from '../background/WavesBackground'
import ServicesBento from '../sections/ServicesBento'
import './z-pattern.css'

const ease = [0.22, 1, 0.36, 1]

const blockVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}

export default function ZPatternSection() {
  const { settings } = useScrollTuner()
  const { explore } = useWavesTuner()
  const { settings: bento } = useBentoTuner()
  const waves = explore.settings
  const waveUniforms = explore.uniforms
  const layout = bentoLayoutMetrics(bento)

  return (
    <section className="z-pattern-section" id="services" aria-label="Maximus Reach services">
      {waves.enabled && (
        <div className="z-pattern-waves" aria-hidden="true">
          <WavesBackground uniforms={waveUniforms} className="z-pattern-waves__canvas" />
        </div>
      )}
      <div className="z-pattern-dots" aria-hidden="true">
        <RealityDotPattern settings={settings} scrollProgress={1} />
      </div>
      <div className="z-pattern-inner">
        <div className="z-pattern-stack" style={{ maxWidth: layout.maxWidth }}>
          <motion.article
            className={`z-pattern-block z-pattern-block--${settings.zSectionAlign}`}
            variants={blockVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35, margin: '0px 0px -12% 0px' }}
          >
            <motion.p className="z-pattern-eyebrow" variants={itemVariants}>
              Maximus Reach
            </motion.p>
            <motion.h2 className="z-pattern-title" variants={itemVariants}>
              {settings.zSectionTitle}
            </motion.h2>
            <motion.p className="z-pattern-body" variants={itemVariants}>
              {settings.zSectionBody}
            </motion.p>
          </motion.article>

          <ServicesBento />
        </div>

        <motion.article
          className="z-pattern-block z-pattern-block--right z-pattern-followup"
          id="process"
          variants={blockVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35, margin: '0px 0px -10% 0px' }}
        >
          <motion.p className="z-pattern-eyebrow" variants={itemVariants}>
            How it works
          </motion.p>
          <motion.h2 className="z-pattern-title" variants={itemVariants}>
            One partner. Four lanes. Clear next steps.
          </motion.h2>
          <motion.p className="z-pattern-body" variants={itemVariants}>
            Pick the lane you need most, or let Maximus connect them. We scope fast, ship in public milestones, and keep the stack simple enough to own.
          </motion.p>
        </motion.article>

        <motion.article
          className="z-pattern-block z-pattern-block--left z-pattern-followup"
          id="work"
          variants={blockVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35, margin: '0px 0px -10% 0px' }}
        >
          <motion.p className="z-pattern-eyebrow" variants={itemVariants}>
            Selected work
          </motion.p>
          <motion.h2 className="z-pattern-title" variants={itemVariants}>
            Proof comes next.
          </motion.h2>
          <motion.p className="z-pattern-body" variants={itemVariants}>
            Case studies for McClure Realty, DogGuard, and more land here. Until then, the bento above is the map of what we build.
          </motion.p>
        </motion.article>
      </div>
    </section>
  )
}
