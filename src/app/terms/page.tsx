"use client"

import { PageTransition } from "@/components/page-transition"
import { AnimatedBackground } from "@/components/animated-background"
import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ChevronUp } from "lucide-react"

// Section interface for type safety
interface TermsSection {
  id: string
  title: string
  content: React.ReactNode
}

export default function TermsPage() {
  const [isMobileView, setIsMobileView] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>("introduction")
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
  const sections: TermsSection[] = [
    {
      id: "introduction",
      title: "Introduction",
      content: (
        <p className="text-white/80">
          By using our services, including inviting our bot to your Discord server or accessing our website, 
          you agree to comply with the following terms and conditions. Please read them carefully.
        </p>
      )
    },
    {
      id: "disclaimer",
      title: "1. Disclaimer",
      content: (
        <p className="text-white/80">
          You may not use our services to violate any applicable laws or regulations, as well as Discord's 
          Terms of Service and Community Guidelines. If you encounter individuals or communities doing so, 
          please contact us immediately.
        </p>
      )
    },
    {
      id: "website-usage",
      title: "2. Website Usage",
      content: (
        <>
          <p className="text-white/80 mb-3">When accessing our website, you agree not to:</p>
          <ul className="list-disc list-inside ml-4 text-white/80 space-y-1">
            <li>Engage in malicious attempts to exploit the website.</li>
            <li>Use the website for malicious purposes.</li>
            <li>Scrape content from the website for malicious use.</li>
            <li>Frame any portion of the website.</li>
            <li>Copy our website and claim it as your own work.</li>
          </ul>
        </>
      )
    },
    {
      id: "bot-usage",
      title: "3. Bot Usage",
      content: (
        <>
          <p className="text-white/80 mb-3">When using our bot, you agree not to:</p>
          <ul className="list-disc list-inside ml-4 text-white/80 space-y-1">
            <li>Violate Discord's Terms of Service.</li>
            <li>Copy our services or features.</li>
            <li>Assist others in copying our services or features.</li>
            <li>Abuse or exploit our services.</li>
            <li>Operate a Discord server that has been terminated repeatedly.</li>
            <li>Use multiple accounts for the economic system.</li>
          </ul>
        </>
      )
    },
    {
      id: "termination",
      title: "4. Termination",
      content: (
        <p className="text-white/80">
          We reserve the right to terminate your access to our services immediately, without prior notice 
          or liability, for any reason, including but not limited to a breach of these terms.
        </p>
      )
    },
    {
      id: "indemnity",
      title: "5. Indemnity",
      content: (
        <p className="text-white/80">
          You agree to indemnify us against all liabilities, costs, expenses, damages, and losses 
          arising out of or in connection with your use of the service or a breach of these terms.
        </p>
      )
    },
    {
      id: "changes",
      title: "6. Changes to the Terms of Service",
      content: (
        <p className="text-white/80">
          We may update these terms at any time without notice. Continuing to use our services after 
          any changes indicates your agreement to the updated terms. Violations could result in a 
          permanent ban from all of our services.
        </p>
      )
    },
    {
      id: "contact",
      title: "7. Contact Us",
      content: (
        <>
          <p className="text-white/80 mb-3">
            If you have any questions or concerns regarding these Terms of Service, please contact us:
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
  const StaticSection = ({ section }: { section: TermsSection }) => {
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
              Terms of Service
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
