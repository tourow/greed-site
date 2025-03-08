"use client"

import React from "react"

interface GradientOverlayProps {
  className?: string
  opacity?: number
  variant?: "dark" | "light" | "blue"
}

export function GradientOverlay({
  className = "",
  opacity = 0.7,
  variant = "dark",
}: GradientOverlayProps) {
  const getGradient = () => {
    switch (variant) {
      case "light":
        return `linear-gradient(to bottom, rgba(0, 0, 0, ${opacity}) 0%, rgba(0, 0, 0, ${opacity * 0.8}) 100%)`
      case "blue":
        return `radial-gradient(circle at 50% 50%, rgba(0, 20, 40, ${opacity * 0.5}) 0%, rgba(0, 10, 30, ${opacity}) 100%)`
      case "dark":
      default:
        return `linear-gradient(to bottom, rgba(0, 0, 0, ${opacity}) 0%, rgba(0, 0, 0, ${opacity * 0.9}) 100%)`
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full -z-5 pointer-events-none ${className}`}
      style={{ background: getGradient() }}
    />
  )
} 