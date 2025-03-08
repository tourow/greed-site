"use client"

import Link from "next/link"
import React, { useEffect, useState, useCallback, useMemo } from "react"
import {
  Command,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Smile,
  Zap,
  Heart,
  Music,
  Info,
  User,
  Database,
  Bell,
  Lock,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PageTransition } from "@/components/page-transition"
import { CommandCard } from "@/components/command-card"
import commandsData from "@/data/commands.json"
import { RotatingMoonLogo } from "@/components/rotating-moon-logo"
import { MobileMenu } from "@/components/mobile-menu"
import { usePathname } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"

// Type definitions
interface Command {
  name: string
  description: string
  usage: string
  examples: string[]
  cooldown: string
}

interface Category {
  id: string
  name: string
  icon: string
  description: string
  commands: Command[]
}

interface SearchResult {
  category: string
  commands: Command[]
}

// Constants
const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Settings,
  Smile,
  MessageSquare,
  Command,
  Heart,
  Music,
  Info,
  User,
  Database,
  Bell,
  Lock,
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  Moderation: "Shield",
  Automod: "Shield",
  Information: "Info",
  Fun: "Smile",
  Economy: "Database",
  Servers: "Settings",
  MusicCommands: "Music",
  Roleplay: "Heart",
  LastFM: "Music",
  Tickets: "MessageSquare",
  Antinuke: "Lock",
  Voicemaster: "MessageSquare",
  Usernames: "User",
  Confessions: "MessageSquare",
  Giveaway: "Gift",
  Starboard: "Star",
  Miscellaneous: "Command",
}

// Custom scrollbar styles
const SCROLLBAR_STYLES = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }
`

export default function CommandsPage() {
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>("Moderation")
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
  
  const pathname = usePathname()

  // Process command data
  const processCommandData = useCallback(() => {
    try {
      setIsLoading(true)
      
      const categoryArray = Object.entries(commandsData).map(([key, cmds]) => ({
          id: key,
          name: key,
          icon: CATEGORY_ICON_MAP[key] || "Command",
          description: `${key} commands for the Greed bot`,
          commands: cmds.map((cmd: any) => ({
            name: cmd.name,
            description: cmd.brief || "No description available",
            usage: cmd.name,
            examples: cmd.example ? [cmd.example] : ["No example available"],
            cooldown: "None",
          })),
      }));
      
      setCategories(categoryArray);
      setError(null);
    } catch (err) {
      setError('Failed to load commands data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle window resize for mobile view detection
  const handleResize = useCallback(() => {
    setIsMobileView(window.innerWidth < 768);
  }, []);

  // Initialize data and set up event listeners
  useEffect(() => {
    processCommandData();
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [processCommandData, handleResize]);

  // Filter commands by search term
  const filterCommandsBySearch = useCallback(
    (commands: Command[], term: string): Command[] => {
      if (!term.trim()) return commands;
      
      const lowercaseTerm = term.toLowerCase();
      return commands.filter(cmd => 
        cmd.name.toLowerCase().includes(lowercaseTerm) ||
        cmd.description.toLowerCase().includes(lowercaseTerm)
      );
    },
    []
  );

  // Memoized values
  const totalCommands = useMemo(() => 
    categories.reduce((acc, category) => acc + category.commands.length, 0), 
    [categories]
  );
  
  const currentCategory = useMemo(() => 
    categories.find(cat => cat.id === selectedCategory) || null,
    [categories, selectedCategory]
  );
  
  const filteredCommands = useMemo(() => 
    currentCategory ? filterCommandsBySearch(currentCategory.commands, searchTerm) : [],
    [currentCategory, searchTerm, filterCommandsBySearch]
  );
  
  const globalSearchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    
    const results: SearchResult[] = [];
    
    categories.forEach(category => {
      const matchingCommands = filterCommandsBySearch(category.commands, searchTerm);
      if (matchingCommands.length > 0) {
        results.push({
          category: category.name,
          commands: matchingCommands,
        });
      }
    });
    
    return results;
  }, [categories, searchTerm, filterCommandsBySearch]);

  // Event handlers
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchTerm("");
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Navigation items
  const navItems = useMemo(() => [
    { href: "/", label: "Home" },
    { href: "/commands", label: "Commands", isActive: true },
    { href: "/docs", label: "Documentation" },
    { href: "/status", label: "Status" },
  ], []);

  // Render components
  const renderCategorySelector = () => (
    <div className="mb-4 bg-black/20 rounded-md p-4 border border-white/5">
      <label htmlFor="category-select" className="block text-sm font-medium mb-2">
        Select Category:
      </label>
      <select
        id="category-select"
        className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white"
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name} ({category.commands.length})
          </option>
        ))}
      </select>
    </div>
  );

  const renderCategorySidebar = () => (
    <div className="hidden md:block md:col-span-1 space-y-4">
      <div className="bg-black/20 rounded-md p-4 sticky top-28 border border-white/5">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Command className="h-5 w-5" /> Categories
        </h2>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-full h-10 bg-white/5 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((category) => {
              const IconComponent = ICON_MAP[category.icon] || Command;
              return (
                <button
                  key={category.id}
                  className={`w-full text-left py-2 px-3 rounded-md flex items-center justify-between transition-colors ${
                    selectedCategory === category.id ? "bg-blue-500/10 text-blue-400" : "hover:bg-white/5"
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                  aria-pressed={selectedCategory === category.id}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span className="truncate">{category.name}</span>
                  </div>
                  <span className="text-xs text-white/50">{category.commands.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderSearchResults = () => {
    if (!globalSearchResults) return null;
    
    if (globalSearchResults.length === 0) {
      return (
        <div className="bg-black/20 rounded-md p-6 text-center border border-white/5">
          <h2 className="text-xl font-bold mb-2">No results found</h2>
          <p className="text-white/60">No commands match your search for "{searchTerm}"</p>
        </div>
      );
    }
    
    return (
      <div className="bg-black/20 rounded-md p-4 md:p-6 border border-white/5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Command className="h-5 w-5" /> Search Results for "{searchTerm}"
        </h2>

        <div className="space-y-6">
          {globalSearchResults.map((result, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-3 border-b border-white/10 pb-2">
                {result.category} ({result.commands.length})
              </h3>
              <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {result.commands.map((command, cmdIndex) => (
                  <CommandCard key={cmdIndex} command={command} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategoryContent = () => {
    if (!currentCategory) return null;
    
    const IconComponent = ICON_MAP[currentCategory.icon] || Command;
    
    return (
      <div className="bg-black/20 rounded-md p-4 md:p-6 border border-white/5">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {currentCategory.name} Commands
          </h2>
          <p className="text-white/70 mb-4 md:mb-6 text-sm md:text-base">
            {currentCategory.description}
            {searchTerm && <span> • Filtered by: "{searchTerm}"</span>}
          </p>

          {filteredCommands.length > 0 ? (
            <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCommands.map((command, index) => (
                <CommandCard key={index} command={command} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/50">
                No commands found{searchTerm ? ` matching "${searchTerm}"` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="bg-black/20 rounded-md p-4 md:p-6 space-y-4 border border-white/5">
      <div className="h-8 w-48 bg-white/5 rounded-md animate-pulse"></div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-b border-white/10 last:border-0 py-4 space-y-2">
          <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse"></div>
          <div className="h-4 w-full bg-white/5 rounded-md animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <style jsx global>{SCROLLBAR_STYLES}</style>
      
      {/* Simplified Animated Background */}
      <AnimatedBackground 
        particleCount={isMobileView ? 30 : 40}
        particleSize={[1, 2]}
        speed={0.2}
        connectParticles={true}
      />
      
      <header className="border-b border-white/10 p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <RotatingMoonLogo size={24} />
            <span className="font-bold text-xl">Greed</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <Link href="/commands" className="text-blue-400 hover:text-blue-300 transition-colors">
              Commands
            </Link>
            <Link href="/docs" className="hover:text-white/80 transition-colors">
              Documentation
            </Link>
            <Link href="/status" className="hover:text-white/80 transition-colors">
              Status
            </Link>
          </nav>
          <div className="hidden md:block">
            <Link href="/invite" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Add to Discord
            </Link>
          </div>
          <MobileMenu items={navItems} />
        </div>
      </header>

      <PageTransition>
        <main className="container mx-auto py-4 md:py-8 px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 md:mb-8">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <span className="text-white/60">/</span>
            <span>Commands</span>
          </div>

          {/* Header and search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Commands</h1>
              {!isLoading && (
                <p className="text-white/60 text-sm md:text-base">
                  Browse {totalCommands} commands across {categories.length} categories
                </p>
              )}
            </div>

            {/* Search bar */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search commands..."
                className="w-full p-2 md:p-3 bg-black/50 border border-white/10 rounded-md text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search commands"
              />
            </div>
          </div>

          {/* Mobile category selector */}
          {!isLoading && isMobileView && !globalSearchResults && renderCategorySelector()}

          {/* Error message */}
          {error && (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-4 border border-red-900/30">
              {error}
            </div>
          )}

          {/* Global search results or category content */}
          {globalSearchResults ? (
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSearchResults()}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Desktop category sidebar */}
              {renderCategorySidebar()}

              {/* Commands display */}
              <div className="md:col-span-2">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderLoadingSkeleton()}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={selectedCategory + searchTerm}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderCategoryContent()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}

