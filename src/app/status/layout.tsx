import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { RotatingMoonLogo } from "@/components/rotating-moon-logo";

// Generate metadata with a timestamp to prevent caching
export async function generateMetadata(): Promise<Metadata> {
  const timestamp = Date.now();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.greed.rocks";
  
  // Ensure the API URL doesn't have a trailing slash
  const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  
  // Create an absolute URL for the image
  const imageUrl = `${formattedApiUrl}/status/image?t=${timestamp}`;
  
  return {
    title: "System Status - Greed",
    description: "Check the current status of Greed's services and systems",
    openGraph: {
      title: "Greed - System Status",
      description: "Check the current status of Greed's services and systems",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 400,
          alt: "Greed System Status",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Greed - System Status",
      description: "Check the current status of Greed's services and systems",
      images: [imageUrl],
    },
    // Add refresh metadata to prevent caching
    other: {
      "refresh": "30",
    },
  };
}

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <RotatingMoonLogo size={20} />
              <span className="text-sm text-white/70">
                Greed Status Page
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/commands" className="hover:text-white transition-colors">
                Commands
              </Link>
              <Link href="/docs" className="hover:text-white transition-colors">
                Documentation
              </Link>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-white/50">
          </div>
        </div>
      </footer>
    </div>
  );
} 