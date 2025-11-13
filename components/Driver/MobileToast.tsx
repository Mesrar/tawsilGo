"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export interface MobileToastProps {
  open?: boolean;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function MobileToast({
  open = true,
  title,
  description,
  variant = "info",
  duration = 3000,
  onClose,
}: MobileToastProps) {
  const [isVisible, setIsVisible] = useState(open);

  // Handle auto-dismiss
  useEffect(() => {
    setIsVisible(open);
    
    if (open && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  // Determine icon based on variant
  const IconComponent = 
    variant === "success" ? CheckCircle :
    variant === "error" ? XCircle : 
    AlertCircle;

  // Determine background color based on variant
  const bgColor = 
    variant === "success" ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" :
    variant === "error" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" :
    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";

  // Determine icon color based on variant
  const iconColor = 
    variant === "success" ? "text-green-500 dark:text-green-400" :
    variant === "error" ? "text-red-500 dark:text-red-400" :
    "text-blue-500 dark:text-blue-400";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className={`rounded-lg border ${bgColor} shadow-sm px-4 py-3 flex items-start`}>
            <div className={`${iconColor} shrink-0 mt-0.5`}>
              <IconComponent className="h-5 w-5" />
            </div>
            
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
              {description && (
                <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{description}</p>
              )}
            </div>
            
            <button 
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="ml-3 flex-shrink-0 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}