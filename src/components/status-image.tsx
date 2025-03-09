"use client";

import { useState, useEffect, useRef } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Format the API URL properly
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.greed.rocks";
  const formattedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  const imageUrl = `${formattedApiUrl}/status/image?t=${timestamp}`;
  
  // Function to force reload the image
  const reloadImage = () => {
    setIsLoading(true);
    setHasError(false);
    setTimestamp(Date.now());
    
    // Force browser to reload the image by clearing cache
    if (imgRef.current) {
      const img = imgRef.current;
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Blank image
      setTimeout(() => {
        img.src = `${formattedApiUrl}/status/image?t=${Date.now()}`;
      }, 50);
    }
  };
  
  useEffect(() => {
    // Set up the refresh interval
    const interval = setInterval(() => {
      reloadImage();
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
              onClick={reloadImage}
              className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <motion.img
        ref={imgRef}
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
          console.error("Failed to load status image:", imageUrl);
        }}
        crossOrigin="anonymous"
      />
      
      <div className="absolute bottom-2 right-2 bg-black/70 text-xs text-white/70 px-2 py-1 rounded">
        Auto-refreshes every {refreshInterval / 1000}s
      </div>
    </div>
  );
} 