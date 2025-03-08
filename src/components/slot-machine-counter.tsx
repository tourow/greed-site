"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"

interface SlotMachineCounterProps {
  value: number
  className?: string
}

export function SlotMachineCounter({ value, className = "" }: SlotMachineCounterProps) {
  const prevValue = useRef(value);
  const isIncreasing = value > prevValue.current;
  const controls = useAnimationControls();
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (value === prevValue.current) return;
    
    setIsAnimating(true);
    
    // Generate intermediate values for the slot effect
    const diff = value - prevValue.current;
    const steps = 8; // Number of intermediate steps
    const stepSize = diff / steps;
    
    // Animate through intermediate values
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= steps) {
        const intermediateValue = Math.round(prevValue.current + (stepSize * step));
        setDisplayValue(intermediateValue);
      } else {
        clearInterval(interval);
        
        // Final value with bounce effect
        setDisplayValue(value);
        controls.start({
          y: [isIncreasing ? 2 : -2, 0],
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 10,
            duration: 0.3
          }
        });
        
        setTimeout(() => {
          setIsAnimating(false);
          prevValue.current = value;
        }, 300);
      }
    }, 50); // Speed of slot machine effect
    
    return () => clearInterval(interval);
  }, [value, controls, isIncreasing]);
  
  return (
    <motion.span
      className={`${className} inline-block`}
      animate={controls}
      style={{ 
        display: "inline-block", 
        transformOrigin: "center"
      }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
} 