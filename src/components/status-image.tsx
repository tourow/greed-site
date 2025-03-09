"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StatusImageProps {
  className?: string;
  refreshInterval?: number; // in milliseconds
}

export function StatusImage({ 
  className = "", 
  refreshInterval = 10000 
}: StatusImageProps) {
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.greed.rocks";
  const imageUrl = `${apiUrl}/status/image?t=${timestamp}`;
  
  useEffect(() => {
    // Set up the refresh interval
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, refreshInterval);
    
    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [refreshInterval]);
  
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="animate-pulse text-white/70">Loading status...</div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
          <div className="text-red-400 text-center p-4">
            <p>Failed to load status image</p>
            <button 
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                setTimestamp(Date.now());
              }}
              className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <motion.img
        key={timestamp}
        src={imageUrl}
        alt="Current System Status"
        className="w-full h-auto rounded-lg shadow-lg"
        style={{ maxHeight: '400px', objectFit: 'contain' }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      
      <div className="absolute bottom-2 right-2 bg-black/70 text-xs text-white/70 px-2 py-1 rounded">
        Auto-refreshes every {refreshInterval / 1000}s
      </div>
    </div>
  );
} 