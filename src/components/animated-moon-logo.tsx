"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useCallback } from "react"

interface AnimatedMoonLogoProps {
  className?: string
  size?: number
  color?: string
  onAnimationComplete?: () => void
}

export function AnimatedMoonLogo({
  className = "",
  size = 40,
  color = "#ffffff",
  onAnimationComplete,
}: AnimatedMoonLogoProps) {
  const [animationState, setAnimationState] = useState<"initial" | "rotating" | "splitting" | "fullMoon">("initial")
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (animationComplete && onAnimationComplete) {
      onAnimationComplete()
    }
  }, [animationComplete, onAnimationComplete])

  const startAnimation = useCallback(() => {
    if (animationState === "initial") {
      setAnimationState("rotating")
    }
  }, [animationState])

  useEffect(() => {
    const timer = setTimeout(() => {
      startAnimation()
    }, 500)

    return () => clearTimeout(timer)
  }, [startAnimation])

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {animationState === "initial" && (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
            fill={color}
          />
          <path
            d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C12.01 18 12.01 18 12.02 18C10.44 15.97 10.44 12.03 12.02 10C13.38 8.28 15.88 8.05 17.5 9.5C17.82 8.76 18 7.91 18 7C18 6.99 18 6.99 18 6.98C16.97 6.35 15.55 6 14 6C13.35 6 12.7 6.07 12.06 6.21C12.04 6.14 12.02 6.07 12 6Z"
            fill={color}
          />
        </motion.svg>
      )}

      {animationState === "rotating" && (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0 }}
          animate={{ rotate: 720 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
          onAnimationComplete={() => setAnimationState("splitting")}
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
            fill={color}
          />
          <path
            d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C12.01 18 12.01 18 12.02 18C10.44 15.97 10.44 12.03 12.02 10C13.38 8.28 15.88 8.05 17.5 9.5C17.82 8.76 18 7.91 18 7C18 6.99 18 6.99 18 6.98C16.97 6.35 15.55 6 14 6C13.35 6 12.7 6.07 12.06 6.21C12.04 6.14 12.02 6.07 12 6Z"
            fill={color}
          />
        </motion.svg>
      )}

      {animationState === "splitting" && (
        <div className="relative" style={{ width: size, height: size }}>
          <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ x: 0 }}
            animate={{ x: -size / 4 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            style={{ position: "absolute", left: 0, top: 0, clipPath: "inset(0 50% 0 0)" }}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
              fill={color}
            />
            <path
              d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C12.01 18 12.01 18 12.02 18C10.44 15.97 10.44 12.03 12.02 10C13.38 8.28 15.88 8.05 17.5 9.5C17.82 8.76 18 7.91 18 7C18 6.99 18 6.99 18 6.98C16.97 6.35 15.55 6 14 6C13.35 6 12.7 6.07 12.06 6.21C12.04 6.14 12.02 6.07 12 6Z"
              fill={color}
            />
          </motion.svg>

          <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ x: 0 }}
            animate={{ x: size / 4 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            onAnimationComplete={() => setAnimationState("fullMoon")}
            style={{ position: "absolute", left: 0, top: 0, clipPath: "inset(0 0 0 50%)" }}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
              fill={color}
            />
            <path
              d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C12.01 18 12.01 18 12.02 18C10.44 15.97 10.44 12.03 12.02 10C13.38 8.28 15.88 8.05 17.5 9.5C17.82 8.76 18 7.91 18 7C18 6.99 18 6.99 18 6.98C16.97 6.35 15.55 6 14 6C13.35 6 12.7 6.07 12.06 6.21C12.04 6.14 12.02 6.07 12 6Z"
              fill={color}
            />
          </motion.svg>
        </div>
      )}

      {animationState === "fullMoon" && (
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          onAnimationComplete={() => setAnimationComplete(true)}
        >
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            fill={color}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.svg>
      )}
    </div>
  )
}

