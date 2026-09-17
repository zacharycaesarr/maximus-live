'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Smartphone, Globe, Rocket, Target, Zap } from 'lucide-react'

function TypeTester() {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.5 : 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex h-full items-center justify-center">
      <motion.span
        className="font-nhg text-6xl font-medium text-espresso md:text-8xl"
        animate={{ scale }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        Aa
      </motion.span>
    </div>
  )
}

function LayoutAnimation() {
  const [layout, setLayout] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])
  const layouts = ['grid-cols-2', 'grid-cols-3', 'grid-cols-1']
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        className={`grid ${layouts[layout]} h-full w-full max-w-[140px] gap-1.5`}
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-5 w-full rounded-md bg-espresso/15"
            layout
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function SpeedIndicator() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="relative flex h-10 w-full items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="h-8 w-24 rounded bg-espresso/10"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              exit={{ opacity: 0, y: -20, position: 'absolute' }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <motion.span
              key="text"
              initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              className="font-nhg text-3xl font-medium text-espresso md:text-4xl"
            >
              Ship
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="font-nhg text-sm text-espresso/45">Build to live</span>
      <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-espresso/10">
        <motion.div
          className="h-full rounded-full bg-espresso"
          initial={{ width: 0 }}
          animate={{ width: loading ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, mass: 1 }}
        />
      </div>
    </div>
  )
}

function SecurityBadge() {
  const [shields, setShields] = useState([
    { id: 1, active: false },
    { id: 2, active: false },
    { id: 3, active: false },
  ])
  useEffect(() => {
    const interval = setInterval(() => {
      setShields((prev) => {
        const nextIndex = prev.findIndex((s) => !s.active)
        if (nextIndex === -1) {
          return prev.map(() => ({ id: Math.random(), active: false }))
        }
        return prev.map((s, i) => (i === nextIndex ? { ...s, active: true } : s))
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex h-full items-center justify-center gap-2">
      {shields.map((shield) => (
        <motion.div
          key={shield.id}
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            shield.active ? 'bg-espresso/15' : 'bg-espresso/5'
          }`}
          animate={{ scale: shield.active ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Lock className={`h-5 w-5 ${shield.active ? 'text-espresso' : 'text-espresso/35'}`} />
        </motion.div>
      ))}
    </div>
  )
}

function GlobalNetwork() {
  // Three staggered rings — start invisible so we never flash a huge opaque ring
  const pulses = [0, 1, 2]
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <Globe className="relative z-10 h-16 w-16 text-espresso/80" />
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          className="pointer-events-none absolute h-16 w-16 rounded-full border border-espresso/20"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: [0.85, 2.4], opacity: [0.45, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: pulse * 0.95,
            ease: 'easeOut',
            times: [0, 1],
            repeatDelay: 0.05,
          }}
        />
      ))}
    </div>
  )
}

/**
 * 21st bento-grid-01 adapted for Why Maximus Reach (cream/mocha).
 */
export default function WhyMaximusBento() {
  const tile =
    'rounded-xl border border-espresso/10 bg-[#efeae2]/70 p-6 transition-colors hover:border-espresso/25 md:p-8'

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid auto-rows-[180px] grid-cols-1 gap-4 md:auto-rows-[200px] md:grid-cols-6">
        <motion.div
          className={`${tile} flex cursor-pointer flex-col overflow-hidden md:col-span-2 md:row-span-2`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex-1">
            <TypeTester />
          </div>
          <div className="mt-4">
            <h3 className="font-nhg text-xl font-medium text-espresso">Design that sells</h3>
            <p className="mt-1 font-nhg text-sm text-espresso/50">
              Sites and pages that look premium and convert, not template fluff.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={`${tile} flex cursor-pointer flex-col overflow-hidden md:col-span-2`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 0.98 }}
        >
          <div className="flex-1">
            <LayoutAnimation />
          </div>
          <div className="mt-4">
            <h3 className="flex items-center gap-2 font-nhg text-xl font-medium text-espresso">
              <Target className="h-5 w-5" />
              Clear systems
            </h3>
            <p className="mt-1 font-nhg text-sm text-espresso/50">Funnels, CRM, and follow-up that actually stick.</p>
          </div>
        </motion.div>

        <motion.div
          className={`${tile} flex cursor-pointer flex-col overflow-hidden md:col-span-2 md:row-span-2`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex flex-1 items-center justify-center">
            <GlobalNetwork />
          </div>
          <div className="relative z-20 mt-auto rounded-lg bg-[#efeae2]/80 p-2 backdrop-blur-sm">
            <h3 className="flex items-center gap-2 font-nhg text-xl font-medium text-espresso">
              <Globe className="h-5 w-5" />
              Ads that reach
            </h3>
            <p className="mt-1 font-nhg text-sm text-espresso/50">
              Meta and Google setups aimed at paying leads, not vanity clicks.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={`${tile} flex cursor-pointer flex-col overflow-hidden md:col-span-2`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 0.98 }}
        >
          <div className="flex-1">
            <SpeedIndicator />
          </div>
          <div className="mt-4">
            <h3 className="flex items-center gap-2 font-nhg text-xl font-medium text-espresso">
              <Zap className="h-5 w-5" />
              Fast delivery
            </h3>
            <p className="mt-1 font-nhg text-sm text-espresso/50">Scoped sprints. You see progress every week.</p>
          </div>
        </motion.div>

        <motion.div
          className={`${tile} flex cursor-pointer flex-col overflow-hidden md:col-span-3`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 0.98 }}
        >
          <div className="flex-1">
            <SecurityBadge />
          </div>
          <div className="mt-4">
            <h3 className="flex items-center gap-2 font-nhg text-xl font-medium text-espresso">
              <Lock className="h-5 w-5" />
              One partner
            </h3>
            <p className="mt-1 font-nhg text-sm text-espresso/50">
              Web, ads, and automation under one roof. No agency handoff chaos.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={`${tile} flex cursor-pointer flex-col overflow-hidden md:col-span-3`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 0.98 }}
        >
          <div className="flex flex-1 items-center justify-center gap-6">
            <Rocket className="h-14 w-14 text-espresso" />
            <Smartphone className="h-14 w-14 text-espresso/70" />
          </div>
          <div className="mt-4">
            <h3 className="font-nhg text-xl font-medium text-espresso">Built for real use</h3>
            <p className="mt-1 font-nhg text-sm text-espresso/50">
              Mobile-first pages and flows your customers can actually use.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
