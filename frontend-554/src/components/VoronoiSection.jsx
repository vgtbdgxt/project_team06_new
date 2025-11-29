import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Section.css'

const VoronoiSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section id="voronoi" className="section" ref={ref}>
      <motion.h2 
        className="section-title"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        Voronoi Diagram
      </motion.h2>
      <motion.div 
        className="voronoi-placeholder"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        Voronoi diagram will be displayed here
      </motion.div>
    </section>
  )
}

export default VoronoiSection

