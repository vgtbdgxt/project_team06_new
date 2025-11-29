import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import NeuralCanvas from './NeuralCanvas'
import './HeroSection.css'

const HeroSection = () => {
  const containerRef = useRef(null)

  const taglineVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(242, 224, 220, 0.1)",
      borderColor: "#ffffff",
      color: "#ffffff",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95
    }
  }

  const handleGetStarted = (e) => {
    e.preventDefault()
    const element = document.querySelector('#map')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const words = "Find support. Find your safe path.".split(' ')

  return (
    <section id="home" className="hero-section" ref={containerRef}>
      <div id="canvas-container">
        <NeuralCanvas />
      </div>
      <motion.div 
        className="hero-content"
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="hero-tagline"
          variants={taglineVariants}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              style={{ display: 'inline-block', marginRight: '0.3em' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <motion.a
          href="#map"
          className="get-started-btn"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleGetStarted}
        >
          Get Started
        </motion.a>
      </motion.div>
    </section>
  )
}

export default HeroSection

