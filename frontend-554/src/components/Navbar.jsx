import React from 'react'
import { motion } from 'framer-motion'
import './Navbar.css'

const Navbar = () => {
  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'How to Use', href: '#how-to-use' },
    { name: 'Map', href: '#map' },
    { name: 'Voronoi', href: '#voronoi' }
  ]

  const handleClick = (e, href) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="logo"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        PATH
      </motion.div>
      <ul className="nav-links">
        {navItems.map((item, index) => (
          <motion.li
            key={item.name}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          >
            <motion.a
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              whileHover={{ opacity: 0.6, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {item.name}
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}

export default Navbar

