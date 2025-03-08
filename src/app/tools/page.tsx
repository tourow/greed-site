"use client"

import { PageTransition } from "@/components/page-transition"
import { RotatingMoonLogo } from "@/components/rotating-moon-logo"
import { MobileMenu } from "@/components/mobile-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Code, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function ToolsPage() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands" },
    { href: "/docs", label: "Documentation" },
    { href: "/tools", label: "Tools", isActive: pathname === "/tools" },
  ]

  const tools = [
    {
      title: "Embed Builder",
      description: "Create custom Discord embeds with a visual editor",
      icon: Code,
      href: "/tools/embed",
      color: "bg-blue-500/20",
      textColor: "text-blue-400",
    },
    // Add more tools here as needed
  ]

  return (
    <div className="min-h-screen bg-black text-white">
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
            <Link href="/tools" className="text-primary hover:text-white/80 transition-colors">
              Tools
            </Link>
          </nav>
          <div className="hidden md:block">
            <Link href="/invite" className="nav-button">
              Add to Discord
            </Link>
          </div>
          <MobileMenu items={navItems} />
        </div>
      </header>

      <PageTransition>
        <main className="container mx-auto py-4 md:py-8 px-4">
          <div className="flex items-center gap-2 mb-4 md:mb-8">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <span className="text-white/60">/</span>
            <span>Tools</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Tools</h1>
            <p className="text-white/70">Useful tools to help you get the most out of Greed bot</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-secondary/10 rounded-lg p-4 md:p-6 hover:bg-secondary/20 transition-colors"
              >
                <div className={`${tool.color} w-12 h-12 rounded-md flex items-center justify-center mb-4`}>
                  <tool.icon className={`h-6 w-6 ${tool.textColor}`} />
                </div>
                <h2 className="text-lg font-semibold mb-2">{tool.title}</h2>
                <p className="text-white/70 text-sm mb-4">{tool.description}</p>
                <Link
                  href={tool.href}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Open Tool <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </main>
      </PageTransition>
    </div>
  )
}

