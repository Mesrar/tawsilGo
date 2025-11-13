"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Package, AlertCircle, ArrowRight, Lightbulb } from "lucide-react";
import { Trip } from "@/types/trip";
import { cn } from "@/lib/utils";

interface EarningsOptimizerProps {
  trips?: Trip[];
  className?: string;
}

interface OptimizationSuggestion {
  type: "capacity" | "route" | "pricing" | "timing";
  title: string;
  description: string;
  potentialEarnings: number;
  actionLabel: string;
  actionHref: string;
  urgency: "high" | "medium" | "low";
}

export function EarningsOptimizer({ trips = [], className }: EarningsOptimizerProps) {
  // Calculate current earnings and potential
  const calculateEarningsMetrics = () => {
    if (!trips || trips.length === 0) {
      return {
        currentEarnings: 0,
        potentialEarnings: 0,
        utilizationRate: 0,
        unfilledCapacity: 0,
      };
    }

    let currentEarnings = 0;
    let potentialEarnings = 0;
    let totalCapacity = 0;
    let usedCapacity = 0;

    trips.forEach((trip) => {
      const { price, totalCapacity: tripCapacity, remainingCapacity } = trip;
      const filledCapacity = tripCapacity - remainingCapacity;

      // Current earnings from filled capacity
      const tripEarnings = price.basePrice + (filledCapacity * price.pricePerKg);
      currentEarnings += Math.max(tripEarnings * (1 + (price.premiumFactor || 0)), price.minimumPrice);

      // Potential earnings if fully booked
      const maxEarnings = price.basePrice + (tripCapacity * price.pricePerKg);
      potentialEarnings += Math.max(maxEarnings * (1 + (price.premiumFactor || 0)), price.minimumPrice);

      totalCapacity += tripCapacity;
      usedCapacity += filledCapacity;
    });

    return {
      currentEarnings: Math.round(currentEarnings * 100) / 100,
      potentialEarnings: Math.round(potentialEarnings * 100) / 100,
      utilizationRate: totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0,
      unfilledCapacity: totalCapacity - usedCapacity,
    };
  };

  // Generate optimization suggestions
  const generateSuggestions = (): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];
    const metrics = calculateEarningsMetrics();

    // Low capacity utilization
    if (metrics.utilizationRate < 70 && metrics.unfilledCapacity > 0) {
      suggestions.push({
        type: "capacity",
        title: `${metrics.unfilledCapacity}kg unfilled capacity`,
        description: `Accept 2-3 more bookings to fill ${metrics.unfilledCapacity}kg of available space`,
        potentialEarnings: metrics.potentialEarnings - metrics.currentEarnings,
        actionLabel: "Find Bookings",
        actionHref: "/drivers/dashboard/available-orders",
        urgency: "high",
      });
    }

    // Check for trips departing soon with low utilization
    const upcomingTrips = trips.filter((trip) => {
      const departureDate = new Date(trip.departureTime);
      const hoursUntilDeparture = (departureDate.getTime() - Date.now()) / (1000 * 60 * 60);
      const utilization = ((trip.totalCapacity - trip.remainingCapacity) / trip.totalCapacity) * 100;
      return hoursUntilDeparture < 24 && hoursUntilDeparture > 0 && utilization < 60;
    });

    if (upcomingTrips.length > 0) {
      const trip = upcomingTrips[0];
      const remainingValue = trip.price.pricePerKg * trip.remainingCapacity;
      suggestions.push({
        type: "timing",
        title: "Trip departing soon with space",
        description: `${trip.departureCity} → ${trip.destinationCity} leaves in <24h with ${trip.remainingCapacity}kg available`,
        potentialEarnings: remainingValue,
        actionLabel: "View Trip",
        actionHref: `/drivers/dashboard/trips/${trip.id}`,
        urgency: "high",
      });
    }

    // Return trip suggestion
    const completedTrips = trips.filter((t) => t.status === "COMPLETED");
    if (completedTrips.length > 0 && suggestions.length < 3) {
      suggestions.push({
        type: "route",
        title: "Create return trip",
        description: "Maximize earnings by offering return service on your routes",
        potentialEarnings: 0,
        actionLabel: "Create Trip",
        actionHref: "/drivers/dashboard/trips?action=create",
        urgency: "medium",
      });
    }

    return suggestions.slice(0, 3); // Max 3 suggestions
  };

  const metrics = calculateEarningsMetrics();
  const suggestions = generateSuggestions();
  const currency = trips[0]?.price?.currency || "EUR";

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Earnings Optimizer</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {metrics.utilizationRate}% utilized
          </Badge>
        </div>
        <CardDescription>Maximize your revenue potential</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earnings Potential */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Current Earnings</span>
            <span className="text-2xl font-bold">
              {currency} {metrics.currentEarnings.toFixed(2)}
            </span>
          </div>

          <Progress value={metrics.utilizationRate} className="h-2" />

          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Potential if Full</span>
            <span className="text-lg font-semibold text-primary">
              {currency} {metrics.potentialEarnings.toFixed(2)}
            </span>
          </div>

          {metrics.potentialEarnings > metrics.currentEarnings && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                +{currency} {(metrics.potentialEarnings - metrics.currentEarnings).toFixed(2)} available
              </span>
            </div>
          )}
        </div>

        {/* Optimization Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <h4 className="text-sm font-semibold">Suggestions</h4>
            </div>

            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-medium">{suggestion.title}</h5>
                        <Badge variant={getUrgencyColor(suggestion.urgency) as any} className="text-xs">
                          {suggestion.urgency}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      {suggestion.potentialEarnings > 0 && (
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                          +{currency} {suggestion.potentialEarnings.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <a href={suggestion.actionHref}>
                      {suggestion.actionLabel}
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No upcoming trips</p>
            <Button size="sm" variant="link" asChild className="mt-2">
              <a href="/drivers/dashboard/trips?action=create">Create your first trip</a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
