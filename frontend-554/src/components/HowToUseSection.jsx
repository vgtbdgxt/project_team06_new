import React, { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import './Section.css'

const HowToUseSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="how-to-use" className="section" ref={ref}>
      <motion.h2 
        className="section-title"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={itemVariants}
      >
        How to Use
      </motion.h2>
      <motion.div 
        className="section-content"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Content to be added later */}
      </motion.div>
    </section>
  )
}

export default HowToUseSection

