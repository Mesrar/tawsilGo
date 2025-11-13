"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  Calendar,
  Clock,
  Package,
  Truck,
  Shield,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TrackingEvent } from "@/types/booking";

interface CondensedTimelineProps {
  timeline: TrackingEvent[];
}

export function CondensedTimeline({ timeline }: CondensedTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    new Set(timeline.filter((event) => event.active).map((event) => event.id))
  );

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  // Get icon based on event status/type
  const getEventIcon = (event: TrackingEvent) => {
    const title = event.title.toLowerCase();

    if (title.includes("picked")) return Package;
    if (title.includes("transit") || title.includes("route")) return Truck;
    if (title.includes("customs") || title.includes("cleared")) return Shield;
    if (title.includes("delivery") || title.includes("delivered")) return MapPin;

    return Circle;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Shipment Timeline
        </h2>

        <div className="space-y-0">
          {timeline.map((event, index) => {
            const isExpanded = expandedSteps.has(event.id);
            const isLast = index === timeline.length - 1;
            const EventIcon = getEventIcon(event);

            return (
              <div key={event.id} className="relative">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[19px] top-[40px] bottom-0 w-0.5 -mb-1",
                      event.completed
                        ? "bg-moroccan-mint"
                        : "bg-slate-200 dark:bg-slate-700"
                    )}
                  />
                )}

                {/* Timeline Item */}
                <button
                  onClick={() => toggleStep(event.id)}
                  className={cn(
                    "w-full text-left flex gap-4 py-3 px-2 rounded-lg transition-colors",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    "focus:outline-none focus:ring-2 focus:ring-moroccan-mint/20",
                    isExpanded && "bg-slate-50 dark:bg-slate-800/50"
                  )}
                >
                  {/* Status Indicator */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    {event.completed ? (
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          event.active
                            ? "bg-moroccan-mint text-white"
                            : "bg-moroccan-mint/20 text-moroccan-mint"
                        )}
                      >
                        {event.active ? (
                          <EventIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}

                    {/* Active Pulse */}
                    {event.active && (
                      <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moroccan-mint opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-moroccan-mint border-2 border-white dark:border-slate-900"></span>
                      </span>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={cn(
                          "text-base font-medium",
                          event.completed
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        {event.title}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-slate-400 transition-transform flex-shrink-0",
                          isExpanded && "transform rotate-180"
                        )}
                      />
                    </div>

                    <p
                      className={cn(
                        "text-sm mb-1",
                        event.completed
                          ? "text-slate-600 dark:text-slate-400"
                          : "text-slate-400 dark:text-slate-500"
                      )}
                    >
                      {event.location}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {isExpanded && event.details && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {event.details}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-moroccan-mint">
              {timeline.filter((e) => e.completed).length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Completed
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chefchaouen-blue">
              {timeline.filter((e) => e.active).length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              In Progress
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-400">
              {timeline.filter((e) => !e.completed).length}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pending
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
