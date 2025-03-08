import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface NavButtonProps {
  href: string
  icon: LucideIcon
  label: string
  className?: string
}

export function NavButton({ href, icon: Icon, label, className }: NavButtonProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 rounded-md",
        "bg-black/20 border border-white/5 text-white hover:bg-blue-500/10 hover:text-blue-400",
        "text-xs md:text-sm",
        className
      )}
    >
      <Icon className="h-3 w-3 md:h-4 md:w-4" />
      <span>{label}</span>
    </Link>
  )
}

