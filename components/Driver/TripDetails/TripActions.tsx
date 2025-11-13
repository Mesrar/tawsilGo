"use client";

import { Button } from "@/components/ui/button";
import { Navigation, Play, CheckCircle, FileText } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TripActionsProps {
  status: string;
  departureAddress: string;
  destinationAddress: string;
  dapartPoint?: { lat: number; lng: number };
  arrivalPoint?: { lat: number; lng: number };
  onStartTrip?: () => void;
  isMobile?: boolean;
  isSticky?: boolean;
}

export function TripActions({
  status,
  departureAddress,
  destinationAddress,
  dapartPoint,
  arrivalPoint,
  onStartTrip,
  isMobile,
  isSticky,
}: TripActionsProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);

  const handleNavigate = () => {
    if (dapartPoint && arrivalPoint) {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/?api=1&origin=${dapartPoint.lat},${dapartPoint.lng}&destination=${arrivalPoint.lat},${arrivalPoint.lng}&travelmode=driving`;
      window.open(url, "_blank");
    } else {
      // Fallback to address-based navigation
      const origin = encodeURIComponent(departureAddress);
      const destination = encodeURIComponent(destinationAddress);
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const handleStartTrip = () => {
    setShowStartDialog(true);
  };

  const confirmStartTrip = () => {
    setShowStartDialog(false);
    onStartTrip?.();
    // Here you would typically call an API to update trip status
  };

  // Determine primary action based on status
  const getPrimaryAction = () => {
    switch (status.toUpperCase()) {
      case "SCHEDULED":
        return {
          label: "Start Trip",
          icon: Play,
          onClick: handleStartTrip,
          variant: "default" as const,
        };
      case "IN_PROGRESS":
      case "ACTIVE":
        return {
          label: "Continue Trip",
          icon: Navigation,
          onClick: handleNavigate,
          variant: "default" as const,
        };
      case "COMPLETED":
        return {
          label: "View Summary",
          icon: FileText,
          onClick: () => {
            /* Navigate to summary */
          },
          variant: "secondary" as const,
        };
      default:
        return null;
    }
  };

  const primaryAction = getPrimaryAction();
  const showNavigateButton = status.toUpperCase() !== "COMPLETED";

  const containerClass = isSticky
    ? "sticky bottom-0 z-10 bg-background border-t shadow-lg"
    : "";

  return (
    <>
      <div className={containerClass}>
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {primaryAction && (
              <Button
                size={isMobile ? "lg" : "default"}
                className="flex-1 sm:flex-none sm:min-w-[200px]"
                variant={primaryAction.variant}
                onClick={primaryAction.onClick}
              >
                <primaryAction.icon className="mr-2 h-4 w-4" />
                {primaryAction.label}
              </Button>
            )}

            {showNavigateButton && (
              <Button
                size={isMobile ? "lg" : "default"}
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={handleNavigate}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Start Trip Confirmation Dialog */}
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you ready to start this trip? This will notify all customers with
              bookings on this route and begin real-time tracking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStartTrip}>
              Start Trip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
