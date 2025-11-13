"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SegmentedTabsOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  options: SegmentedTabsOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export function SegmentedTabs({
  options,
  value,
  onValueChange,
  className,
  ...props
}: SegmentedTabsProps) {
  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div className="flex w-full justify-between border-b border-slate-200 dark:border-slate-800">
        {options.map((option) => {
          const isActive = option.value === value;
          
          return (
            <button
              key={option.value}
              onClick={() => onValueChange(option.value)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 py-2.5 px-3 text-sm font-medium transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground/80"
              )}
              type="button"
            >
              {option.icon}
              <span>{option.label}</span>
              
              {isActive && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}