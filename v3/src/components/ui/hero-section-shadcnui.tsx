/**
 * Reference copy of 21st @moumensoliman/hero-section-shadcnui (layout only).
 * Live hero uses DirectHero with Maximus copy — this file is the structural reference.
 */
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSectionShadcnui() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-[500px] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <motion.div variants={itemVariants} className="mb-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-espresso/15 bg-espresso/5 px-4 py-1.5 font-nhg text-sm font-medium text-espresso/70">
          <Sparkles className="h-4 w-4" />
          New Features Available
        </span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="mb-6 font-nhg text-5xl font-bold tracking-tight text-espresso md:text-7xl"
      >
        Build Amazing
        <br />
        <span className="text-espresso/60">User Experiences</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-8 max-w-2xl font-nhg text-lg text-espresso/70"
      >
        Create stunning, animated interfaces with our collection of production-ready components.
      </motion.p>

      <motion.div variants={itemVariants} className="flex gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#111] px-8 py-3 font-nhg text-sm text-[#FCFAF2]"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="rounded-[10px] border border-[#333]/40 px-8 py-3 font-nhg text-sm text-[#111]"
        >
          View Demo
        </button>
      </motion.div>
    </motion.div>
  )
}

export default HeroSectionShadcnui
