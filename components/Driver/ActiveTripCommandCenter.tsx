"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Navigation,
  Package,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Camera,
  FileText,
} from "lucide-react";
import { Trip } from "@/types/trip";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ActiveTripCommandCenterProps {
  trip: Trip;
  className?: string;
  onNavigate?: () => void;
  onScanParcel?: () => void;
  onContactSupport?: () => void;
  onReportIssue?: () => void;
}

export function ActiveTripCommandCenter({
  trip,
  className,
  onNavigate,
  onScanParcel,
  onContactSupport,
  onReportIssue,
}: ActiveTripCommandCenterProps) {
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
      return;
    }

    // Default navigation behavior
    if (trip.dapartPoint && trip.arrivalPoint) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${trip.dapartPoint.lat},${trip.dapartPoint.lng}&destination=${trip.arrivalPoint.lat},${trip.arrivalPoint.lng}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const handleScanParcel = () => {
    if (onScanParcel) {
      onScanParcel();
    } else {
      window.location.href = "/drivers/dashboard/check-parcel";
    }
  };

  // Calculate progress
  const totalBookings = trip.statistics.totalBookings;
  const completedBookings = trip.statistics.completedBookings;
  const progressPercentage = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  // Time estimates
  const arrivalTime = new Date(trip.arrivalTime);
  const now = new Date();
  const isOverdue = arrivalTime < now;
  const timeRemaining = isOverdue
    ? `Overdue by ${formatDistanceToNow(arrivalTime)}`
    : `${formatDistanceToNow(arrivalTime, { addSuffix: true })}`;

  return (
    <Card className={cn("border-2 border-primary shadow-lg", className)}>
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Navigation className="h-5 w-5 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-lg">Active Trip</CardTitle>
              <CardDescription>
                {trip.departureCity} → {trip.destinationCity}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={isOverdue ? "destructive" : "default"}
            className="font-mono"
          >
            {trip.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Trip Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Trip Progress</span>
            <span className="font-semibold">
              {completedBookings} / {totalBookings} deliveries
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Started {formatDistanceToNow(new Date(trip.departureTime), { addSuffix: true })}</span>
            <span className={cn(isOverdue && "text-destructive font-semibold")}>
              ETA: {timeRemaining}
            </span>
          </div>
        </div>

        <Separator />

        {/* Route Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Route Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <div className="h-2 w-2 rounded-full bg-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{trip.departureAddress}</p>
                <p className="text-xs text-muted-foreground">{trip.departureCity}, {trip.departureCountry}</p>
              </div>
            </div>
            <div className="ml-3 h-8 w-0.5 bg-border" />
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <div className="h-2 w-2 rounded-full bg-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{trip.destinationAddress}</p>
                <p className="text-xs text-muted-foreground">{trip.destinationCity}, {trip.destinationCountry}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <Navigation className="h-3 w-3" />
              {trip.route.totalDistanceKm.toFixed(1)} km
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {Math.floor(trip.route.totalDurationMins / 60)}h {trip.route.totalDurationMins % 60}m
            </span>
          </div>
        </div>

        <Separator />

        {/* Parcels Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Parcels ({totalBookings})
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border p-2">
              <p className="text-2xl font-bold text-yellow-600">{trip.statistics.pendingBookings}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="text-2xl font-bold text-blue-600">{totalBookings - completedBookings - trip.statistics.pendingBookings}</p>
              <p className="text-xs text-muted-foreground">In Transit</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="text-2xl font-bold text-green-600">{completedBookings}</p>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="lg"
              className="w-full"
              onClick={handleNavigate}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Navigate
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleScanParcel}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Scan Parcel
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={onContactSupport}
            >
              <Phone className="mr-2 h-3 w-3" />
              Support
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={onReportIssue}
            >
              <AlertTriangle className="mr-2 h-3 w-3" />
              Report Issue
            </Button>
          </div>
        </div>

        {/* Current Earnings */}
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trip Earnings</p>
              <p className="text-2xl font-bold">
                {trip.price.currency} {(
                  trip.price.basePrice +
                  ((trip.totalCapacity - trip.remainingCapacity) * trip.price.pricePerKg)
                ).toFixed(2)}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
