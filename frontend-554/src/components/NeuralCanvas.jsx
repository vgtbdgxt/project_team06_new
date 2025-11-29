import React, { useEffect, useRef } from 'react'

const NeuralCanvas = () => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width, height
    let particles = []
    let backgroundStars = []
    const PARTICLE_COUNT = 165
    const STAR_COUNT = 150
    const CONNECTION_DISTANCE = 130
    const MOUSE_RADIUS = 200

    const mouse = { x: -1000, y: -1000 }

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
      }
    })

    function random(min, max) {
      return Math.random() * (max - min) + min
    }

    class Star {
      constructor() {
        this.reset()
        this.y = random(0, height)
      }

      reset() {
        this.x = random(0, width)
        this.y = random(0, height)
        this.size = random(0.5, 1.5)
        this.blinkSpeed = random(0.02, 0.05)
        this.alpha = random(0.1, 0.5)
        this.angle = random(0, Math.PI * 2)
      }

      update() {
        this.y -= 0.1
        this.angle += this.blinkSpeed
        this.currentAlpha = this.alpha + Math.sin(this.angle) * 0.1
        if (this.y < 0) this.y = height
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(242, 224, 220, ${this.currentAlpha})`
        ctx.fill()
      }
    }

    class Particle {
      constructor() {
        this.init()
      }

      init() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = Math.random() * 0.6 - 0.3
        this.vy = Math.random() * 0.6 - 0.3
        this.baseSize = (Math.random() * 2 + 1.5) * 0.5
        this.size = this.baseSize
        this.angle = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.03 + Math.random() * 0.03
        const colors = ['#5D6C8C', '#D9BACB']
        const colorIndex = Math.floor(Math.random() * colors.length)
        this.color = colors[colorIndex]
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
        this.angle += this.pulseSpeed
        this.size = this.baseSize + Math.sin(this.angle) * this.baseSize * 0.3
        if (this.size < 0.1) this.size = 0.1

        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < MOUSE_RADIUS) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS
          const repulsionStrength = 2
          this.vx -= forceDirectionX * force * 0.05 * repulsionStrength
          this.vy -= forceDirectionY * force * 0.05 * repulsionStrength
          this.size += this.baseSize * 0.8 * force
        }
      }

      draw() {
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let isActivated = distance < MOUSE_RADIUS

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size > 0 ? this.size : 0, 0, Math.PI * 2)
        const r = parseInt(this.color.slice(1, 3), 16)
        const g = parseInt(this.color.slice(3, 5), 16)
        const b = parseInt(this.color.slice(5, 7), 16)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.fill()

        if (isActivated) {
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * force})`
          ctx.fill()
        }
      }
    }

    function initWorld() {
      particles = []
      backgroundStars = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle())
      }
      for (let i = 0; i < STAR_COUNT; i++) {
        backgroundStars.push(new Star())
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let p1 = particles[i]
          let p2 = particles[j]
          let dx = p1.x - p2.x
          let dy = p1.y - p2.y
          let distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < CONNECTION_DISTANCE) {
            let opacity = 1 - (distance / CONNECTION_DISTANCE)
            let mouseDist = Math.sqrt(Math.pow(mouse.x - p1.x, 2) + Math.pow(mouse.y - p1.y, 2))
            let isActivated = mouseDist < MOUSE_RADIUS

            if (isActivated) {
              opacity = Math.min(opacity + 0.3, 1)
              ctx.strokeStyle = `rgba(93, 108, 140, ${opacity})`
            } else {
              ctx.strokeStyle = `rgba(217, 186, 203, ${opacity * 0.6})`
            }

            let perpX = -dy / distance
            let perpY = dx / distance
            let midX = (p1.x + p2.x) / 2
            let midY = (p1.y + p2.y) / 2

            if (isActivated) {
              ctx.lineWidth = 0.25
            } else {
              ctx.lineWidth = 0.1
            }

            for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
              let angle = (lineIndex / 3) * Math.PI * 2 + (i + j) * 0.1
              let curveOffset = Math.sin(angle) * (distance * 0.08)
              let controlX = midX + perpX * curveOffset
              let controlY = midY + perpY * curveOffset
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.quadraticCurveTo(controlX, controlY, p2.x, p2.y)
              ctx.stroke()
            }

            if (isActivated) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`
              ctx.lineWidth = 0.15
              for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
                let angle = (lineIndex / 3) * Math.PI * 2 + (i + j) * 0.1
                let curveOffset = Math.sin(angle) * (distance * 0.08)
                let controlX = midX + perpX * curveOffset
                let controlY = midY + perpY * curveOffset
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.quadraticCurveTo(controlX, controlY, p2.x, p2.y)
                ctx.stroke()
              }
            }
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
      backgroundStars.forEach(star => {
        star.update()
        star.draw()
      })
      ctx.globalCompositeOperation = 'lighter'
      drawConnections()
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    initWorld()
    animate()

    window.addEventListener('mousedown', (e) => {
      for (let i = 0; i < 5; i++) {
        let p = new Particle()
        p.x = e.clientX
        p.y = e.clientY
        particles.push(p)
        if (particles.length > 200) particles.shift()
      }
    })

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      id="neuralCanvas"
      ref={canvasRef}
      style={{
        display: 'block',
        filter: 'contrast(1.1) brightness(1.1)'
      }}
    />
  )
}

export default NeuralCanvas

