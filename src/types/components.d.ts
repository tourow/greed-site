import { ReactNode } from "react"

// Animated Background Component
declare module "@/components/animated-background" {
  export interface AnimatedBackgroundProps {
    color?: string
    particleCount?: number
    particleSize?: [number, number]
    speed?: number
    connectParticles?: boolean
    className?: string
  }

  export function AnimatedBackground(props: AnimatedBackgroundProps): JSX.Element
}

// Gradient Overlay Component
declare module "@/components/gradient-overlay" {
  export interface GradientOverlayProps {
    className?: string
    opacity?: number
    variant?: "dark" | "light" | "blue"
  }

  export function GradientOverlay(props: GradientOverlayProps): JSX.Element
}

// Other components that might be missing type declarations
declare module "@/components/page-transition" {
  export interface PageTransitionProps {
    children: ReactNode
  }

  export function PageTransition(props: PageTransitionProps): JSX.Element
}

declare module "@/components/command-card" {
  export interface CommandCardProps {
    command: {
      name: string
      description: string
      usage: string
      examples: string[]
      cooldown: string
    }
  }

  export function CommandCard(props: CommandCardProps): JSX.Element
}

declare module "@/components/rotating-moon-logo" {
  export interface RotatingMoonLogoProps {
    size?: number
  }

  export function RotatingMoonLogo(props: RotatingMoonLogoProps): JSX.Element
}

declare module "@/components/mobile-menu" {
  export interface MobileMenuProps {
    items: {
      href: string
      label: string
      isActive?: boolean
    }[]
  }

  export function MobileMenu(props: MobileMenuProps): JSX.Element
} 