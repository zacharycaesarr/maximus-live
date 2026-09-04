import { motion } from 'framer-motion'
import './scroll-hint.css'

export default function ScrollHint({ style }) {
  return (
    <motion.div className="scroll-hint" style={style} aria-hidden="true">
      <div className="scroll-hint-line" />
      <div className="scroll-hint-tick" />
    </motion.div>
  )
}
