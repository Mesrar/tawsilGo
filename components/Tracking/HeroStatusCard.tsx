"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Share2,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ParcelStatus } from "@/types/booking";
import type { EnhancedTrackingData } from "@/types/booking";

interface HeroStatusCardProps {
  trackingData: EnhancedTrackingData;
  onContactDriver?: () => void;
  onShareTracking?: () => void;
}

export function HeroStatusCard({
  trackingData,
  onContactDriver,
  onShareTracking,
}: HeroStatusCardProps) {
  const {
    currentStatus,
    statusText,
    currentLocation,
    estimatedDelivery,
    progress,
    lastUpdated,
    contactEnabled,
    driver,
  } = trackingData;

  // Determine status color and icon
  const getStatusConfig = (status: ParcelStatus) => {
    if (status === ParcelStatus.DELIVERED) {
      return {
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle2,
        pulse: false,
      };
    }
    if (
      status === ParcelStatus.CUSTOMS_HELD_EU ||
      status === ParcelStatus.CUSTOMS_HELD_MA ||
      status === ParcelStatus.DUTY_PAYMENT_PENDING ||
      status === ParcelStatus.DELIVERY_ATTEMPTED
    ) {
      return {
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        icon: AlertCircle,
        pulse: true,
      };
    }
    if (
      status === ParcelStatus.LOST ||
      status === ParcelStatus.DAMAGED ||
      status === ParcelStatus.CANCELLED
    ) {
      return {
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: AlertCircle,
        pulse: false,
      };
    }
    // In transit or normal states
    return {
      color: "bg-moroccan-mint/10 text-moroccan-mint-700 dark:bg-moroccan-mint/20 dark:text-moroccan-mint-300",
      icon: Truck,
      pulse: true,
    };
  };

  const statusConfig = getStatusConfig(currentStatus);
  const StatusIcon = statusConfig.icon;

  // Calculate time since last update
  const getTimeSinceUpdate = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  // Get next checkpoint hint
  const getNextCheckpoint = () => {
    if (currentStatus === ParcelStatus.DELIVERED) return null;

    if (currentStatus === ParcelStatus.OUT_FOR_DELIVERY) {
      return "Delivering to your address";
    }

    if (currentStatus === ParcelStatus.DUTY_PAYMENT_PENDING) {
      return "Awaiting duty payment";
    }

    if (
      currentStatus === ParcelStatus.CUSTOMS_SUBMITTED_MA ||
      currentStatus === ParcelStatus.CUSTOMS_INSPECTION_MA
    ) {
      return "Clearing Morocco customs";
    }

    if (currentStatus === ParcelStatus.IN_TRANSIT_BUS) {
      return driver?.vehicleInfo?.busNumber
        ? `On Bus #${driver.vehicleInfo.busNumber}`
        : "En route to destination";
    }

    return "Processing at facility";
  };

  const nextCheckpoint = getNextCheckpoint();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 shadow-lg">
        <CardContent className="p-6">
          {/* Status Badge with Live Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("rounded-full p-2", statusConfig.color)}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{statusText}</h3>
                  {statusConfig.pulse && (
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moroccan-mint opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-moroccan-mint"></span>
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Live
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Updated {getTimeSinceUpdate(lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Current Location - Most Prominent */}
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-1">
              <MapPin className="h-5 w-5 text-moroccan-mint mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Currently at
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {currentLocation}
                </p>
              </div>
            </div>

            {nextCheckpoint && (
              <div className="mt-2 pl-7">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Next: <span className="font-medium">{nextCheckpoint}</span>
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Delivery Progress
              </span>
              <span className="text-xs font-bold text-moroccan-mint">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-moroccan-mint to-chefchaouen-blue rounded-full"
              />
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <Clock className="h-5 w-5 text-moroccan-mint" />
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Estimated Delivery
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {contactEnabled && driver && (
              <Button
                onClick={onContactDriver}
                variant="default"
                className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Driver
              </Button>
            )}
            <Button
              onClick={onShareTracking}
              variant="outline"
              className={cn(
                "border-moroccan-mint text-moroccan-mint hover:bg-moroccan-mint/10",
                !contactEnabled && "flex-1"
              )}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Driver Info Preview (if available) */}
          {driver && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                {driver.photo ? (
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-moroccan-mint/20 flex items-center justify-center">
                    <Package className="h-5 w-5 text-moroccan-mint" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {driver.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>★ {driver.rating.toFixed(1)}</span>
                    {driver.isVerified && (
                      <Badge
                        variant="secondary"
                        className="h-4 px-1.5 text-[10px]"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
