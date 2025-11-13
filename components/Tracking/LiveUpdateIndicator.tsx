"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveUpdateIndicatorProps {
  lastUpdate: Date;
  isPolling?: boolean;
  pollingInterval?: number; // in seconds
  onRefresh?: () => void;
  className?: string;
}

/**
 * LiveUpdateIndicator Component
 *
 * Shows:
 * - Last update timestamp with relative time
 * - Pulsing dot when actively polling
 * - Connection status (online/offline)
 * - Manual refresh button
 *
 * Features:
 * - Auto-updates relative time every 10 seconds
 * - Pulsing animation when polling
 * - Offline detection with visual feedback
 * - Smooth transitions
 */
export function LiveUpdateIndicator({
  lastUpdate,
  isPolling = false,
  pollingInterval = 30,
  onRefresh,
  className,
}: LiveUpdateIndicatorProps) {
  const [relativeTime, setRelativeTime] = useState<string>("");
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update relative time
  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      if (diffSeconds < 10) {
        setRelativeTime("Just now");
      } else if (diffSeconds < 60) {
        setRelativeTime(`${diffSeconds}s ago`);
      } else if (diffMinutes < 60) {
        setRelativeTime(`${diffMinutes}m ago`);
      } else if (diffHours < 24) {
        setRelativeTime(`${diffHours}h ago`);
      } else {
        setRelativeTime(lastUpdate.toLocaleDateString());
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      // Keep refreshing state for at least 1 second for visual feedback
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-between gap-3 p-3 rounded-lg border bg-white dark:bg-slate-900",
        !isOnline && "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10",
        className
      )}
    >
      {/* Left: Status Indicator */}
      <div className="flex items-center gap-2">
        {/* Pulsing Dot */}
        <div className="relative flex items-center justify-center">
          {isPolling && isOnline ? (
            <>
              {/* Pulsing background */}
              <span className="absolute inline-flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moroccan-mint opacity-75"></span>
              </span>
              {/* Solid dot */}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-moroccan-mint"></span>
            </>
          ) : (
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                isOnline ? "bg-slate-400" : "bg-red-500"
              )}
            ></span>
          )}
        </div>

        {/* Status Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <Wifi className="h-3.5 w-3.5 text-moroccan-mint" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isOnline
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-red-700 dark:text-red-400"
              )}
            >
              {isOnline
                ? isPolling
                  ? "Live Updates"
                  : "Connected"
                : "Offline"}
            </span>
          </div>

          {/* Last Update Time */}
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>{relativeTime}</span>
          </div>
        </div>
      </div>

      {/* Right: Polling Info & Refresh Button */}
      <div className="flex items-center gap-3">
        {/* Polling Interval (when active) */}
        <AnimatePresence>
          {isPolling && isOnline && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-moroccan-mint/10 border border-moroccan-mint/20"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-moroccan-mint animate-pulse"></div>
              <span className="text-xs font-medium text-moroccan-mint">
                {pollingInterval}s
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual Refresh Button */}
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || !isOnline}
            className={cn(
              "p-2 rounded-lg border transition-all",
              isOnline
                ? "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-moroccan-mint"
                : "border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
            )}
            aria-label="Refresh tracking data"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 transition-transform",
                isRefreshing && "animate-spin"
              )}
            />
          </button>
        )}
      </div>

      {/* Offline Warning Toast */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute -bottom-14 right-0 p-3 bg-red-500 text-white text-sm rounded-lg shadow-lg"
          >
            <p className="font-medium">You're offline</p>
            <p className="text-xs opacity-90">
              Showing last known status. Reconnect to get live updates.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Compact version for mobile/minimal displays
 */
export function CompactLiveUpdateIndicator({
  lastUpdate,
  isPolling = false,
  onRefresh,
}: LiveUpdateIndicatorProps) {
  const [relativeTime, setRelativeTime] = useState<string>("");
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update relative time
  useEffect(() => {
    const updateRelativeTime = () => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdate.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);

      if (diffSeconds < 60) {
        setRelativeTime("Now");
      } else if (diffMinutes < 60) {
        setRelativeTime(`${diffMinutes}m`);
      } else {
        setRelativeTime(`${Math.floor(diffMinutes / 60)}h`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 10000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Status Dot */}
      <div className="relative">
        {isPolling && isOnline ? (
          <>
            <span className="absolute inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moroccan-mint opacity-75"></span>
            </span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-moroccan-mint"></span>
          </>
        ) : (
          <span
            className={cn(
              "inline-flex rounded-full h-1.5 w-1.5",
              isOnline ? "bg-slate-400" : "bg-red-500"
            )}
          ></span>
        )}
      </div>

      {/* Time */}
      <span className="text-slate-500 dark:text-slate-400">{relativeTime}</span>

      {/* Refresh */}
      {onRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || !isOnline}
          className={cn(
            "p-1 rounded transition-colors",
            isOnline
              ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              : "text-slate-300 cursor-not-allowed"
          )}
        >
          <RefreshCw
            className={cn("h-3 w-3", isRefreshing && "animate-spin")}
          />
        </button>
      )}
    </div>
  );
}
