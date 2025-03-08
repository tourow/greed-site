"use client"

import { PageTransition } from "@/components/page-transition"
import { AnimatedBackground } from "@/components/animated-background"
import { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ChevronUp } from "lucide-react"

// Section interface for type safety
interface PrivacySection {
  id: string
  title: string
  content: React.ReactNode
}

export default function PrivacyPage() {
  const [isMobileView, setIsMobileView] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Use window scroll for progress bar only
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    // Only run once on mount
    if (!mounted) {
      setMounted(true)
      
      // Check if we're in a mobile view
      const checkMobile = () => {
        setIsMobileView(window.innerWidth < 768)
      }
      
      // Simple scroll detection for scroll-to-top button only
      const handleBasicScroll = () => {
        setShowScrollTop(window.scrollY > 300)
      }
      
      // Initial check
      checkMobile()
      
      // Add event listeners with passive option for better performance
      window.addEventListener("resize", checkMobile, { passive: true })
      window.addEventListener("scroll", handleBasicScroll, { passive: true })
      
      // Cleanup
      return () => {
        window.removeEventListener("resize", checkMobile)
        window.removeEventListener("scroll", handleBasicScroll)
      }
    }
  }, [mounted])

  // Define sections
  const sections: PrivacySection[] = [
    {
      id: "introduction",
      title: "Introduction",
      content: (
        <p className="text-white/80">
          Thank you for using our bot! We are committed to protecting your privacy and ensuring that 
          your experience with our services is safe and secure. This Privacy Policy outlines how we 
          collect, use, and protect your information.
        </p>
      )
    },
    {
      id: "information-collection",
      title: "1. Information We Collect",
      content: (
        <>
          <ul className="list-disc list-inside ml-4 text-white/80 space-y-2">
            <li>
              <span className="font-semibold">Personal Information:</span> When you interact with our bot, 
              we may ask for personal details such as your name, email address, or any other information 
              you provide voluntarily.
            </li>
            <li>
              <span className="font-semibold">Usage Data:</span> We collect information about your 
              interactions with the bot, including timestamps, queries, and your preferences.
            </li>
            <li>
              <span className="font-semibold">Cookies and Tracking Technologies:</span> Our bot may use 
              cookies to improve your experience, such as remembering your settings or preferences. You 
              can disable cookies in your browser settings.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "information-usage",
      title: "2. How We Use Your Information",
      content: (
        <>
          <ul className="list-disc list-inside ml-4 text-white/80 space-y-2">
            <li>Improve the functionality and performance of the bot.</li>
            <li>Provide you with personalized responses and better services.</li>
            <li>Enhance user experience by analyzing usage patterns and preferences.</li>
          </ul>
        </>
      )
    },
    {
      id: "data-security",
      title: "3. Data Security",
      content: (
        <p className="text-white/80">
          We take appropriate measures to protect your data from unauthorized access, alteration, or 
          disclosure. However, please note that no method of electronic transmission is completely secure, 
          and we cannot guarantee the absolute security of your information.
        </p>
      )
    },
    {
      id: "data-sharing",
      title: "4. Data Sharing",
      content: (
        <p className="text-white/80">
          We do not sell, trade, or otherwise transfer your personal information to outside parties. 
          This does not include trusted third parties who assist us in operating our bot, conducting 
          our business, or servicing you, so long as those parties agree to keep this information 
          confidential.
        </p>
      )
    },
    {
      id: "user-rights",
      title: "5. Your Rights",
      content: (
        <>
          <p className="text-white/80 mb-3">You have the right to:</p>
          <ul className="list-disc list-inside ml-4 text-white/80 space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of your personal information</li>
            <li>Request deletion of your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing your personal information</li>
          </ul>
        </>
      )
    },
    {
      id: "contact",
      title: "6. Contact Us",
      content: (
        <>
          <p className="text-white/80 mb-3">
            If you have any questions or concerns about our Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside ml-4 text-white/80">
            <li>
              <span className="font-semibold">Support Server: </span>
              <a 
                href="https://discord.gg/greedbot" 
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                discord.gg/greedbot
              </a>
            </li>
          </ul>
        </>
      )
    }
  ]

  // Simple scroll to top function
  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  // Static section component without animations
  const StaticSection = ({ section }: { section: PrivacySection }) => {
    return (
      <section
        id={section.id}
        className="py-6 border-b border-white/10 last:border-b-0"
      >
        <h2 className="text-2xl font-semibold mb-4 group flex items-center">
          <span>{section.title}</span>
          <span className="ml-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            #
          </span>
        </h2>
        {section.content}
      </section>
    )
  }

  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center justify-start relative overflow-x-hidden">
        <AnimatedBackground 
          particleCount={isMobileView ? 30 : 40}
          particleSize={[1, 2]}
          speed={0.2}
          connectParticles={true}
        />

        {/* Progress bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
          style={{ scaleX }}
        />

        <div className="z-10 w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Header - no animation */}
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Privacy Policy
            </h1>
            <p className="text-white/60">Effective Date: March 7 2025</p>
          </div>

          {/* Table of contents for larger screens - using standard anchor links */}
          {!isMobileView && mounted && (
            <div className="hidden md:block mb-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Table of Contents</h3>
              <div className="grid grid-cols-2 gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm py-1 px-2 rounded hover:bg-white/5 transition-colors text-white/70 hover:text-blue-400"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Content container - no animation */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8">
            {sections.map((section) => (
              <StaticSection key={section.id} section={section} />
            ))}
          </div>

          {/* Footer - no animation */}
          <div className="mt-8 text-center text-white/40 text-sm">
            &copy; 2024 Greed. All Rights Reserved.
          </div>
        </div>

        {/* Scroll to top button - simplified */}
        {showScrollTop && (
          <button
            className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-500/80 backdrop-blur-sm text-white shadow-lg z-50"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </main>
    </PageTransition>
  )
}
