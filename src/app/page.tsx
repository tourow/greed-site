"use client"

import { NavButton } from "@/components/nav-button"
import { Command, FileText, MessageSquare, Radio, Share2, Shield, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { motion, useAnimationControls } from "framer-motion"
import { PageTransition } from "@/components/page-transition"
import { useEffect, useState, useRef } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { getShards, getTotalStats } from "@/lib/api/shards"
import { Button } from "@/components/ui/button"

// Testimonials section with Discord-style messages
const TestimonialSection = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const testimonialsPerPage = 6
  
  // When component mounts, set hasAnimated to true after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 1000) // Wait for initial animations to complete
    
    return () => clearTimeout(timer)
  }, [])
  
  const testimonials = [
    {
      username: "dupression",
      content: "super awesome bot great community, active updates & fixes, bugs are caught within 5 minutes of contacting any support member",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "aq.17d",
      content: "Greed is a very simple and easy to use bot especially its utilities and how those utilities doesn't need any sorts of documentations for their commands.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "voidlifter",
      content: "I love greed and wrath really good bots tbh",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "vwka",
      content: "10 out of 10 ngl ts is fire and free thx for this",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "74hk",
      content: "reed is an outstanding bot that has quickly become a favorite in our server. Its extensive range of commands covers everything from moderation to fun and utility, making it incredibly versatile and invaluable for server management.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "Yoru",
      content: "The best free bot for moderation",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "s6th",
      content: "I enjoy greed and I hope greed will last forever.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "Theo",
      content: "Its a good bot, I would recommend for users with a little experience in using bots",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      username: "rexduct",
      content: "Great bot I really like it, helps alot great support and easy to use. Im currently using it in 10 of my servers",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)
  const displayedTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  )

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section className="w-full py-16 relative z-10 bg-gradient-to-b from-transparent to-black/30 backdrop-blur-sm border-t border-white/5">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-center mb-10 text-white/90 drop-shadow-lg"
        >
          What Users Are Saying
        </motion.h2>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${currentPage}-${index}`}
                initial={!hasAnimated ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: hasAnimated ? 0 : 0.5, delay: hasAnimated ? 0 : index * 0.1 }}
                className="bg-zinc-900/80 backdrop-blur-sm rounded-lg p-5 flex flex-col gap-3 border border-white/10 hover:border-purple-500/30 transition-colors shadow-xl hover:shadow-purple-500/10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 border-2 border-purple-500 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-300 font-medium">@{testimonial.username}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={prevPage}
                size="icon"
                variant="ghost"
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full border border-white/10 hover:border-purple-500/30 transition-all shadow-lg hover:shadow-purple-500/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-white/70 text-sm">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                onClick={nextPage}
                size="icon"
                variant="ghost"
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full border border-white/10 hover:border-purple-500/30 transition-all shadow-lg hover:shadow-purple-500/20"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Custom animated counter component with slot machine effect
const SlotMachineCounter = ({ value, className }: { value: number; className?: string }) => {
  const prevValue = useRef(value)
  const isIncreasing = value > prevValue.current
  const controls = useAnimationControls()
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (value === prevValue.current) return

    setIsAnimating(true)

    // Generate intermediate values for the slot effect
    const diff = value - prevValue.current
    const steps = 8 // Number of intermediate steps
    const stepSize = diff / steps

    // Animate through intermediate values
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step <= steps) {
        const intermediateValue = Math.round(prevValue.current + stepSize * step)
        setDisplayValue(intermediateValue)
      } else {
        clearInterval(interval)

        // Final value with bounce effect
        setDisplayValue(value)
        controls.start({
          y: [isIncreasing ? 2 : -2, 0],
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
            duration: 0.3,
          },
        })

        setTimeout(() => {
          setIsAnimating(false)
          prevValue.current = value
        }, 300)
      }
    }, 50) // Speed of slot machine effect

    return () => clearInterval(interval)
  }, [value, controls, isIncreasing])

  return (
    <motion.span
      className={`${className} inline-block`}
      animate={controls}
      style={{
        display: "inline-block",
        transformOrigin: "center",
      }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [stats, setStats] = useState({ servers: 0, users: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    // Fetch shard data
    const fetchStats = async (skipCache = false) => {
      try {
        setError(null)
        const shards = await getShards(skipCache)
        const totalStats = getTotalStats(shards)
        setStats({
          servers: totalStats.servers,
          users: totalStats.users,
        })
      } catch (error) {
        setError("Failed to fetch stats")
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchStats()

    // Set up periodic refresh (every 10 seconds)
    const refreshInterval = setInterval(() => {
      fetchStats(true) // Skip cache on refresh
    }, 10000)

    // Check if we're in a mobile view
    const checkMobile = (): void => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
      clearInterval(refreshInterval)
    }
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const statsText = isLoading ? (
    <motion.span
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    >
      loading stats...
    </motion.span>
  ) : error ? (
    <motion.span className="text-red-400">{error}</motion.span>
  ) : (
    <>
      serving <SlotMachineCounter value={stats.users} className="text-white" /> users across{" "}
      <SlotMachineCounter value={stats.servers} className="text-white" /> servers
    </>
  )

  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center relative overflow-hidden">
        <AnimatedBackground
          particleCount={isMobileView ? 30 : 40}
          particleSize={[1, 2]}
          speed={0.2}
          connectParticles={true}
        />

        {/* Main hero section - centered vertically */}
        <div className="flex flex-col items-center justify-center z-10 px-4 py-8 w-full min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-6 md:mb-10 relative avatar-glow"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 relative rounded-full overflow-hidden border border-white/10">
              <Image src="/greed.png" alt="Greed Bot" width={176} height={176} className="object-cover" priority />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 md:mb-3 text-center tracking-tight"
          >
            Greed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/60 mb-8 md:mb-14 text-center text-base md:text-lg"
          >
            {statsText}
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-w-xl w-full px-2"
          >
            <motion.div variants={item}>
              <NavButton href="/commands" icon={Command} label="cmds" />
            </motion.div>
            <motion.div variants={item}>
              <NavButton href="https://discord.gg/seiko" icon={MessageSquare} label="discord" />
            </motion.div>
            <motion.div variants={item}>
              <NavButton 
                href="#" 
                icon={FileText} 
                label="docs (coming soon)" 
                className="opacity-50 pointer-events-none select-none border-white/[0.02] hover:translate-y-0"
              />
            </motion.div>
            <motion.div variants={item}>
              <NavButton href="/status" icon={Radio} label="status" />
            </motion.div>
            <motion.div variants={item}>
              <NavButton href="/invite" icon={Share2} label="invite" />
            </motion.div>
            <motion.div variants={item}>
              <NavButton href="/embed" icon={Shield} label="embed" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Testimonials section - separate full-width section below */}
        <TestimonialSection />
      </main>
    </PageTransition>
  )
}

