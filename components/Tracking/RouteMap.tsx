"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, CheckCircle, Clock, Ship, Bus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RouteCheckpoint {
  id: string;
  name: string;
  city: string;
  country: string;
  completed: boolean;
  active?: boolean;
  estimatedTime?: string;
  actualTime?: string;
  type: "hub" | "border" | "ferry" | "delivery";
}

interface RouteMapProps {
  origin: string;
  destination: string;
  currentLocation: string;
  checkpoints: RouteCheckpoint[];
}

export function RouteMap({
  origin,
  destination,
  currentLocation,
  checkpoints,
}: RouteMapProps) {
  // Get checkpoint icon
  const getCheckpointIcon = (type: RouteCheckpoint["type"]) => {
    switch (type) {
      case "ferry":
        return Ship;
      case "border":
        return Navigation;
      case "hub":
        return Bus;
      case "delivery":
        return MapPin;
      default:
        return MapPin;
    }
  };

  // Calculate progress percentage
  const completedCount = checkpoints.filter((c) => c.completed).length;
  const progressPercentage = (completedCount / checkpoints.length) * 100;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Route Progress
          </h3>
          <Badge className="bg-moroccan-mint/10 text-moroccan-mint">
            {completedCount} of {checkpoints.length} stops
          </Badge>
        </div>

        {/* Route Visualization */}
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {/* Progress Line Active */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-moroccan-mint to-chefchaouen-blue"
            style={{ maxHeight: `calc(100% - 4rem)` }}
          />

          {/* Checkpoints */}
          <div className="space-y-6 relative">
            {checkpoints.map((checkpoint, index) => {
              const Icon = getCheckpointIcon(checkpoint.type);
              const isLast = index === checkpoints.length - 1;

              return (
                <motion.div
                  key={checkpoint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Checkpoint Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-all",
                        checkpoint.completed
                          ? checkpoint.active
                            ? "bg-moroccan-mint shadow-lg shadow-moroccan-mint/30"
                            : "bg-moroccan-mint/20"
                          : "bg-slate-100 dark:bg-slate-800"
                      )}
                    >
                      {checkpoint.completed ? (
                        checkpoint.active ? (
                          <Icon className="h-5 w-5 text-white" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-moroccan-mint" />
                        )
                      ) : (
                        <Clock className="h-5 w-5 text-slate-400" />
                      )}
                    </div>

                    {/* Active Pulse */}
                    {checkpoint.active && (
                      <span className="absolute top-0 left-0 flex h-full w-full">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moroccan-mint opacity-75"></span>
                      </span>
                    )}
                  </div>

                  {/* Checkpoint Info */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4
                          className={cn(
                            "text-base font-semibold",
                            checkpoint.completed
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {checkpoint.name}
                        </h4>
                        <p
                          className={cn(
                            "text-sm",
                            checkpoint.completed
                              ? "text-slate-600 dark:text-slate-400"
                              : "text-slate-400 dark:text-slate-500"
                          )}
                        >
                          {checkpoint.city}, {checkpoint.country}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          checkpoint.type === "border" &&
                            "border-amber-300 text-amber-700 dark:text-amber-400",
                          checkpoint.type === "ferry" &&
                            "border-blue-300 text-blue-700 dark:text-blue-400"
                        )}
                      >
                        {checkpoint.type === "border"
                          ? "Customs"
                          : checkpoint.type === "ferry"
                          ? "Ferry"
                          : checkpoint.type === "hub"
                          ? "Hub"
                          : "Delivery"}
                      </Badge>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center gap-3 text-xs">
                      {checkpoint.actualTime ? (
                        <span className="text-moroccan-mint font-medium">
                          ✓ {checkpoint.actualTime}
                        </span>
                      ) : checkpoint.estimatedTime ? (
                        <span className="text-slate-500 dark:text-slate-400">
                          Est. {checkpoint.estimatedTime}
                        </span>
                      ) : null}
                    </div>

                    {/* Active Checkpoint Details */}
                    {checkpoint.active && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 p-3 bg-moroccan-mint/10 rounded-lg border border-moroccan-mint/20"
                      >
                        <p className="text-sm font-medium text-moroccan-mint mb-1">
                          📍 Current Location
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Your package is being processed at this checkpoint.
                          Next update expected in ~30 minutes.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Route Summary */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-1">Origin</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {origin}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-600 dark:text-slate-400 mb-1">
                Destination
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {destination}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Bus-Based Delivery:</strong> Your package travels via our
              secure coach network, reducing costs by 70% vs traditional air
              freight while maintaining reliable delivery times.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
