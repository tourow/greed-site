"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { Book, Home, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { RotatingMoonLogo } from "@/components/rotating-moon-logo"
import { MobileMenu } from "@/components/mobile-menu"
import { useState } from "react"

// Sidebar links component to avoid duplication
const DocSidebarLinks = ({ pathname }: { pathname: string }) => (
  <>
    <div className="space-y-1 mb-6">
      <h3 className="text-sm font-medium text-white/70 mb-2">OVERVIEW</h3>
      <Link href="/docs" className={`doc-sidebar-link ${pathname === "/docs" ? "active" : ""}`}>
        Introduction
      </Link>
      <Link
        href="/docs/getting-started"
        className={`doc-sidebar-link ${pathname === "/docs/getting-started" ? "active" : ""}`}
      >
        Getting Started
      </Link>
      <Link
        href="/docs/features"
        className={`doc-sidebar-link ${pathname === "/docs/features" ? "active" : ""}`}
      >
        Features
      </Link>
    </div>

    <div className="space-y-1 mb-6">
      <h3 className="text-sm font-medium text-white/70 mb-2">GUIDES</h3>
      <Link
        href="/docs/guides/setup"
        className={`doc-sidebar-link ${pathname === "/docs/guides/setup" ? "active" : ""}`}
      >
        Setup Guide
      </Link>
      <Link
        href="/docs/guides/commands"
        className={`doc-sidebar-link ${pathname === "/docs/guides/commands" ? "active" : ""}`}
      >
        Using Commands
      </Link>
      <Link
        href="/docs/guides/permissions"
        className={`doc-sidebar-link ${pathname === "/docs/guides/permissions" ? "active" : ""}`}
      >
        Permissions
      </Link>
    </div>

    <div className="space-y-1">
      <h3 className="text-sm font-medium text-white/70 mb-2">REFERENCE</h3>
      <Link
        href="/docs/reference/commands"
        className={`doc-sidebar-link ${pathname === "/docs/reference/commands" ? "active" : ""}`}
      >
        Command Reference
      </Link>
      <Link
        href="/docs/reference/api"
        className={`doc-sidebar-link ${pathname === "/docs/reference/api" ? "active" : ""}`}
      >
        API Reference
      </Link>
      <Link
        href="/docs/reference/faq"
        className={`doc-sidebar-link ${pathname === "/docs/reference/faq" ? "active" : ""}`}
      >
        FAQ
      </Link>
    </div>
  </>
)

export default function DocsLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const pathname = usePathname()
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands" },
    { href: "/docs", label: "Documentation", isActive: pathname.startsWith("/docs") },
    { href: "/status", label: "Status" },
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
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`${item.isActive ? 'text-primary' : ''} hover:text-white/80 transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Link href="/invite" className="nav-button">
              Add to Discord
            </Link>
          </div>
          <MobileMenu items={navItems} />
        </div>
      </header>

      <div className="container mx-auto py-4 md:py-8 px-4">
        <div className="flex items-center gap-2 mb-4 md:mb-8">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <span className="text-white/60">/</span>
          <Link href="/docs" className="text-white/60 hover:text-white transition-colors">
            Docs
          </Link>
          <span className="text-white/60">/</span>
          <span>Overview</span>
        </div>

        {/* Mobile sidebar toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="w-full flex items-center justify-between bg-secondary/10 rounded-lg p-3"
          >
            <span className="font-medium flex items-center gap-2">
              <Book className="h-5 w-5" /> Documentation
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showMobileSidebar ? "rotate-180" : ""}`} />
          </button>

          {showMobileSidebar && (
            <div className="mt-2 bg-secondary/10 rounded-lg p-4">
              <DocSidebarLinks pathname={pathname} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-28">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" /> Documentation
              </h2>
              <DocSidebarLinks pathname={pathname} />
            </div>
          </div>

          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

