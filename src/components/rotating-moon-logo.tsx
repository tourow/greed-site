"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface RotatingMoonLogoProps {
  size?: number
  color?: string
  glowColor?: string
  animated?: boolean
  className?: string
}

export function RotatingMoonLogo({
  size = 24,
  color = "#ffffff",
  glowColor = "#0066cc",
  animated = true,
  className = "",
}: RotatingMoonLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState(0)

  // Slow continuous rotation
  useEffect(() => {
    if (!animated) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [animated])

  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        filter: isHovered ? `drop-shadow(0 0 ${size / 4}px ${glowColor})` : "none",
        transition: "filter 0.3s ease",
      }}
      animate={{ rotate: rotation }}
      transition={{ type: "tween", duration: 0.05, ease: "linear" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
          fill={color}
        />
        <path
          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
          fill={isHovered ? glowColor : color}
        />
        <motion.path
          d="M17 8.5C17 9.32843 16.3284 10 15.5 10C14.6716 10 14 9.32843 14 8.5C14 7.67157 14.6716 7 15.5 7C16.3284 7 17 7.67157 17 8.5Z"
          fill={isHovered ? glowColor : color}
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.div>
  )
} 