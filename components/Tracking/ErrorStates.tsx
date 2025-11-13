"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  WifiOff,
  Search,
  RefreshCw,
  MessageCircle,
  Clock,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export type ErrorType =
  | "not-found"
  | "network"
  | "timeout"
  | "invalid-format"
  | "too-recent"
  | "server-error";

interface ErrorStatesProps {
  errorType: ErrorType;
  trackingId?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export function ErrorStates({
  errorType,
  trackingId,
  onRetry,
  onContactSupport,
}: ErrorStatesProps) {
  const errorConfigs = {
    "not-found": {
      icon: Search,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      title: "Tracking Number Not Found",
      message: `We couldn't find tracking information for "${trackingId}".`,
      suggestions: [
        "Check for typos in the tracking number",
        "Tracking may take 2-4 hours to appear after booking",
        "Ensure you're using the full tracking ID (e.g., TR-12345678)",
      ],
      actions: (
        <>
          <Button onClick={onRetry} variant="default" className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </>
      ),
    },
    network: {
      icon: WifiOff,
      iconColor: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      title: "Connection Issue",
      message:
        "We're having trouble loading tracking information. This might be due to:",
      suggestions: [
        "Slow or unstable internet connection",
        "Temporary server maintenance",
        "Network firewall restrictions",
      ],
      actions: (
        <>
          <Button onClick={onRetry} variant="default" className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Now
          </Button>
        </>
      ),
    },
    timeout: {
      icon: Clock,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      title: "Request Timed Out",
      message:
        "The request took too long to complete. The server might be experiencing high traffic.",
      suggestions: [
        "Try again in a few moments",
        "Check your internet connection speed",
        "Clear your browser cache if the problem persists",
      ],
      actions: (
        <>
          <Button onClick={onRetry} variant="default" className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </>
      ),
    },
    "invalid-format": {
      icon: AlertCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      title: "Invalid Tracking Number Format",
      message: `"${trackingId}" doesn't match our tracking number format.`,
      suggestions: [
        "TawsilGo tracking IDs follow this format: TR-12345678",
        "Check your booking confirmation email for the correct format",
        "Remove any extra spaces or special characters",
      ],
      actions: (
        <>
          <Button onClick={onRetry} variant="default" className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Different Number
          </Button>
          <Link href="/bookings" className="flex-1">
            <Button variant="outline" className="w-full">
              <Package className="h-4 w-4 mr-2" />
              View My Bookings
            </Button>
          </Link>
        </>
      ),
    },
    "too-recent": {
      icon: Clock,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      title: "Tracking Not Yet Available",
      message:
        "Your booking was just created. Tracking information typically appears within 2-4 hours.",
      suggestions: [
        "Wait 2-4 hours after booking confirmation",
        "You'll receive an SMS/email when tracking becomes available",
        "Tracking activates once your package is picked up",
      ],
      actions: (
        <>
          <Button onClick={onRetry} variant="default" className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Again
          </Button>
          <Link href="/bookings" className="flex-1">
            <Button variant="outline" className="w-full">
              View Booking Details
            </Button>
          </Link>
        </>
      ),
    },
    "server-error": {
      icon: AlertCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      title: "Server Error",
      message:
        "Something went wrong on our end. Our team has been notified and is working on a fix.",
      suggestions: [
        "Try again in a few minutes",
        "The issue is temporary and will be resolved soon",
        "Your tracking data is safe and will be available shortly",
      ],
      actions: (
        <>
          <Button onClick={onRetry} variant="default" className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button
            onClick={onContactSupport}
            variant="outline"
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </>
      ),
    },
  };

  const config = errorConfigs[errorType];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`h-20 w-20 rounded-full ${config.bgColor} flex items-center justify-center`}
            >
              <Icon className={`h-10 w-10 ${config.iconColor}`} />
            </div>
          </div>

          {/* Title & Message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {config.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {config.message}
            </p>
          </div>

          {/* Suggestions */}
          <Alert className="mb-6">
            <AlertDescription>
              <ul className="space-y-2 text-sm">
                {config.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-moroccan-mint mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-3">{config.actions}</div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Need more help?
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link
                href="/support"
                className="text-moroccan-mint hover:underline"
              >
                Visit Help Center
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                onClick={onContactSupport}
                className="text-moroccan-mint hover:underline"
              >
                Live Chat Support
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting Tips */}
      {(errorType === "network" || errorType === "timeout") && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Troubleshooting Tips
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-moroccan-mint font-bold">1.</span>
                <span>
                  <strong>Check Internet:</strong> Make sure you have a stable
                  connection
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moroccan-mint font-bold">2.</span>
                <span>
                  <strong>Disable VPN:</strong> Some VPNs may block our tracking
                  service
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moroccan-mint font-bold">3.</span>
                <span>
                  <strong>Clear Cache:</strong> Try clearing your browser cache
                  and cookies
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-moroccan-mint font-bold">4.</span>
                <span>
                  <strong>Try Different Browser:</strong> Test in incognito mode
                  or another browser
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
