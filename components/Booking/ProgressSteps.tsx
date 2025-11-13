"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, CheckCircle2, Package, Search, CreditCard, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

// Define the step type with icon support
type Step = {
  id: string;
  title: string;
  icon?: keyof typeof stepIcons;
};

// Step icons mapping
const stepIcons = {
  search: Search,
  select: Package,
  details: MapPin,
  review: CreditCard
};

// Progress Steps Component
export function ProgressSteps({
  steps,
  activeStep,
}: {
  steps: Step[];
  activeStep: string;
}) {
  const t = useTranslations("booking.progress");

  // Track viewport size for responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  
  // Update mobile state based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find the active step index
  const activeIndex = steps.findIndex(s => s.id === activeStep);
  
  // Calculate progress percentage
  const progressPercentage = Math.max(
    ((activeIndex) / (steps.length - 1)) * 100,
    0 // Ensure non-negative value
  );

  return (
    <>
      {/* MOBILE VERSION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden mb-6"
      >
        {/* Mobile top progress bar with shadcn Progress */}
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Mobile step indicator with current/total */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center">
            <Badge className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mr-3 p-0">
              {activeIndex + 1}
            </Badge>
            <div>
              <p className="font-medium text-sm">{steps[activeIndex]?.title}</p>
              <p className="text-xs text-slate-500">
                {t("step", { current: activeIndex + 1, total: steps.length })}
              </p>
            </div>
          </div>

          {/* Current step icon for visual reinforcement */}
          {steps[activeIndex]?.icon && (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {(() => {
                const IconComponent = steps[activeIndex].icon
                  ? stepIcons[steps[activeIndex].icon as keyof typeof stepIcons]
                  : null;
                return IconComponent ? <IconComponent className="h-4 w-4 text-primary" /> : null;
              })()}
            </div>
          )}
        </div>
        
        {/* Optional: Step pills for compact representation */}
        <div className="flex items-center justify-center mt-4 gap-1.5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index < activeIndex 
                  ? "bg-green-500 w-6" 
                  : index === activeIndex 
                    ? "bg-primary w-8" 
                    : "bg-slate-200 w-3"
              )}
            />
          ))}
        </div>
      </motion.div>

      {/* DESKTOP VERSION - Enhanced with better visuals */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="hidden md:block mb-8 relative mt-4"
      >
        {/* Progress bar spanning the width */}
        <div className="absolute top-5 left-0 right-0 -z-10">
          <div className="h-0.5 bg-slate-200 rounded-full">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Steps with connectors */}
        <div className="flex items-center justify-between px-2">
          {steps.map((step, index) => {
            // Select the appropriate icon
            const IconComponent = step.icon 
              ? stepIcons[step.icon as keyof typeof stepIcons] 
              : null;
              
            // Determine if step is active, completed, or pending
            const isActive = activeStep === step.id;
            const isCompleted = index < activeIndex;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex flex-col items-center relative",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              >
                {/* Step circle with number or check */}
                <motion.div
                  whileHover={!isCompleted ? { scale: 1.05 } : {}}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                    isCompleted
                      ? "bg-green-600 text-white" 
                      : isActive
                        ? "bg-primary text-slate-900 shadow-md" 
                        : "bg-slate-200 text-slate-600"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : IconComponent ? (
                    <IconComponent className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                
                {/* Step title */}
                <motion.span 
                  className={cn(
                    "text-sm font-medium text-center",
                    isActive 
                      ? "text-primary font-semibold" 
                      : isCompleted
                        ? "text-green-700"
                        : "text-slate-500"
                  )}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.title}
                </motion.span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

