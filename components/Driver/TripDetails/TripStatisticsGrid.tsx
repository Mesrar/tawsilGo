"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, MapPin, Clock, DollarSign, Users, TrendingUp } from "lucide-react";

interface TripStatisticsGridProps {
  totalCapacity: number;
  remainingCapacity: number;
  totalBookings: number;
  totalDistanceKm: number;
  totalDurationMins: number;
  totalParcelWeight: number;
  currency?: string;
  basePrice?: number;
  isMobile?: boolean;
}

export function TripStatisticsGrid({
  totalCapacity,
  remainingCapacity,
  totalBookings,
  totalDistanceKm,
  totalDurationMins,
  totalParcelWeight,
  currency = "EUR",
  basePrice = 0,
  isMobile,
}: TripStatisticsGridProps) {
  const usedCapacity = totalCapacity - remainingCapacity;
  const capacityPercentage = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  // Calculate earnings (simplified - would use actual price calculation)
  const estimatedEarnings = basePrice || totalParcelWeight * 5; // Placeholder calculation

  const hours = Math.floor(totalDurationMins / 60);
  const minutes = totalDurationMins % 60;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* Capacity Card */}
      <Card className="col-span-2 md:col-span-1">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Capacity</p>
              <p className="text-xl md:text-2xl font-bold">
                {usedCapacity}/{totalCapacity}
              </p>
            </div>
          </div>
          <Progress value={capacityPercentage} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {capacityPercentage.toFixed(0)}% utilized • {remainingCapacity}kg available
          </p>
        </CardContent>
      </Card>

      {/* Bookings Card */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Bookings</p>
              <p className="text-xl md:text-2xl font-bold">{totalBookings}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{totalParcelWeight}kg total</p>
        </CardContent>
      </Card>

      {/* Distance Card */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Distance</p>
              <p className="text-xl md:text-2xl font-bold">
                {totalDistanceKm.toFixed(0)}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">kilometers</p>
        </CardContent>
      </Card>

      {/* Duration Card */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Duration</p>
              <p className="text-xl md:text-2xl font-bold">
                {hours}h {minutes}m
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">estimated time</p>
        </CardContent>
      </Card>

      {/* Earnings Card (conditional - show if has bookings or base price) */}
      {(totalBookings > 0 || basePrice > 0) && (
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Est. Earnings</p>
                <p className="text-xl md:text-2xl font-bold">
                  {currency === "EUR" ? "€" : "$"}
                  {estimatedEarnings.toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Based on current bookings</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
