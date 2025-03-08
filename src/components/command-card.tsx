"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp, Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CommandCardProps {
  command: {
    name: string
    description: string
    usage: string
    examples: string[]
    cooldown: string
  }
}

export function CommandCard({ command }: CommandCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="border-b border-white/10 last:border-0 py-3">
      <div 
        className="flex items-start justify-between cursor-pointer group"
        onClick={toggleExpand}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <h3 className="font-medium text-base group-hover:text-blue-400 transition-colors">
              {command.name}
            </h3>
          </div>
          <p className="text-white/70 mt-1 text-sm">{command.description}</p>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-white/5 transition-colors"
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-white/70" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white/70" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/5 space-y-3 text-sm">
              <div>
                <h4 className="text-white/50 text-xs uppercase mb-1">Usage</h4>
                <div className="bg-black/20 p-2 rounded-md font-mono text-blue-300 text-sm">
                  {command.usage}
                </div>
              </div>

              {command.examples.length > 0 && (
                <div>
                  <h4 className="text-white/50 text-xs uppercase mb-1">Examples</h4>
                  <div className="space-y-2">
                    {command.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="bg-black/20 p-2 rounded-md font-mono text-green-300 text-sm"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {command.cooldown && (
                <div>
                  <h4 className="text-white/50 text-xs uppercase mb-1">Cooldown</h4>
                  <div className="text-white/70">{command.cooldown}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

