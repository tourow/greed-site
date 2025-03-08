"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  rotation: number
  rotationSpeed: number
  acceleration: number
  maxSpeed: number
}

interface AnimatedBackgroundProps {
  particleCount?: number
  particleSize?: [number, number]
  speed?: number
  connectParticles?: boolean
  className?: string
}

export function AnimatedBackground({
  particleCount = 100,
  particleSize = [1, 2],
  speed = 1.6,
  connectParticles = true,
  className = "",
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    active: false,
    lastX: 0,
    lastY: 0,
    movementX: 0,
    movementY: 0,
    isMoving: false,
    lastMoveTime: 0
  })

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (particleSize[1] - particleSize[0]) + particleSize[0],
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        acceleration: 0.04 + Math.random() * 0.04,
        maxSpeed: speed * (2 + Math.random())
      })
    }
    particlesRef.current = particles
  }

  // Update particles position with combined random and cursor-influenced movement
  const updateParticles = (width: number, height: number) => {
    const now = Date.now()
    const isMouseMoving = mouseRef.current.isMoving && (now - mouseRef.current.lastMoveTime) < 100

    particlesRef.current.forEach((particle) => {
      if (isMouseMoving) {
        // Influence particle direction based on mouse movement
        const mouseInfluence = 0.25 + Math.random() * 0.15
        particle.speedX += mouseRef.current.movementX * mouseInfluence * particle.acceleration
        particle.speedY += mouseRef.current.movementY * mouseInfluence * particle.acceleration
      } else {
        // Random movement when mouse is still
        particle.speedX += (Math.random() - 0.5) * 0.02
        particle.speedY += (Math.random() - 0.5) * 0.02
      }

      // Apply speed limits
      const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
      if (currentSpeed > particle.maxSpeed) {
        const ratio = particle.maxSpeed / currentSpeed
        particle.speedX *= ratio
        particle.speedY *= ratio
      }

      // Update position
      particle.x += particle.speedX
      particle.y += particle.speedY
      
      // Reduced drag for faster movement
      particle.speedX *= 0.995
      particle.speedY *= 0.995

      // Update rotation based on movement
      particle.rotation = Math.atan2(particle.speedY, particle.speedX)

      // Bounce off edges with damping
      if (particle.x < 0 || particle.x > width) {
        particle.speedX = -particle.speedX * 0.8
        particle.x = particle.x < 0 ? 0 : width
      }
      if (particle.y < 0 || particle.y > height) {
        particle.speedY = -particle.speedY * 0.8
        particle.y = particle.y < 0 ? 0 : height
      }
    })
  }

  // Draw scene with improved visuals
  const drawScene = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#0a0a0a")
    gradient.addColorStop(1, "#000000")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    if (connectParticles) {
      const connectionDistance = width * 0.06
      ctx.lineWidth = 0.2

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]

          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const speed = Math.sqrt(
              (p1.speedX + p2.speedX) * (p1.speedX + p2.speedX) +
              (p1.speedY + p2.speedY) * (p1.speedY + p2.speedY)
            )
            const opacity = (1 - distance / connectionDistance) * 0.15 * (1 + speed * 0.5)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(100, 100, 255, ${opacity})`
            ctx.stroke()
          }
        }
      }
    }

    particlesRef.current.forEach((particle) => {
      const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)
      
      ctx.beginPath()
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(150, 150, 255, ${particle.opacity * (1 + speed)})`
      ctx.shadowColor = 'rgba(150, 150, 255, 0.5)'
      ctx.shadowBlur = 5
      ctx.fill()
      
      ctx.restore()
    })
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = dimensions

    updateParticles(width, height)
    drawScene(ctx, width, height)

    animationRef.current = requestAnimationFrame(animate)
  }

  // Handle resize
  const handleResize = () => {
    if (canvasRef.current) {
      const width = window.innerWidth
      const height = window.innerHeight

      canvasRef.current.width = width
      canvasRef.current.height = height

      setDimensions({ width, height })
      initParticles(width, height)
    }
  }

  // Initialize canvas and animation
  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Start animation when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate()
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions])

  // Add mouse interaction handlers with movement detection
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const x = e.clientX
      const y = e.clientY
      
      // Calculate real mouse movement
      const movementX = x - mouseRef.current.lastX
      const movementY = y - mouseRef.current.lastY
      
      mouseRef.current.x = x
      mouseRef.current.y = y
      mouseRef.current.lastX = x
      mouseRef.current.lastY = y
      mouseRef.current.movementX = movementX / window.innerWidth
      mouseRef.current.movementY = movementY / window.innerHeight
      mouseRef.current.isMoving = true
      mouseRef.current.lastMoveTime = now
    }

    const handleMouseEnter = () => {
      mouseRef.current.active = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
      mouseRef.current.isMoving = false
      mouseRef.current.movementX = 0
      mouseRef.current.movementY = 0
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}

