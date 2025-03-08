"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { RotatingMoonLogo } from "@/components/rotating-moon-logo"
import { MobileMenu } from "@/components/mobile-menu"
import { usePathname } from "next/navigation"

export default function InvitePage() {
  const pathname = usePathname()
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands" },
    { href: "/docs", label: "Documentation" },
    { href: "/status", label: "Status" },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-white/10 p-4 sticky top-0 bg-black/90 backdrop-blur-sm z-10">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <RotatingMoonLogo size={24} />
              <span className="font-bold text-xl">Greed</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-white/80 transition-colors">
                Home
              </Link>
              <Link href="/commands" className="hover:text-white/80 transition-colors">
                Commands
              </Link>
              <Link href="/docs" className="hover:text-white/80 transition-colors">
                Documentation
              </Link>
              <Link href="/status" className="hover:text-white/80 transition-colors">
                Status
              </Link>
            </nav>
            <MobileMenu items={navItems} />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-secondary/10 rounded-lg p-4 md:p-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl font-bold mb-4 md:mb-6"
            >
              Add Greed to your server
            </motion.h1>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-left"
            >
              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm md:text-base">Powerful moderation</h3>
                  <p className="text-xs md:text-sm text-white/70">
                    Keep your server safe with advanced moderation tools
                  </p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm md:text-base">Utility commands</h3>
                  <p className="text-xs md:text-sm text-white/70">Enhance your server with useful utility commands</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 bg-primary/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm md:text-base">Customizable</h3>
                  <p className="text-xs md:text-sm text-white/70">Configure Greed to fit your server's needs</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Button className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white">Add to Discord</Button>

              <p className="mt-4 text-xs md:text-sm text-white/60">
                By adding Greed, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}

