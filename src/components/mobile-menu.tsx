"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  items: {
    href: string
    label: string
    isActive?: boolean
  }[]
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 w-48 bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-lg overflow-hidden z-50"
          >
            <nav className="flex flex-col">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`px-4 py-3 hover:bg-white/10 transition-colors ${
                    item.isActive ? "text-blue-400" : "text-white"
                  }`}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/invite"
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                onClick={toggleMenu}
              >
                Add to Discord
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

