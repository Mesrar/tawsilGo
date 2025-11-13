"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  TrendingUp,
  Ship,
  AlertTriangle,
  CheckCircle2,
  Info,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BorderStatus = "OPEN" | "BUSY" | "VERY_BUSY" | "CLOSED" | "DELAYED";
type FerryStatus = "ON_TIME" | "DELAYED" | "CANCELLED" | "FULL";

interface BorderCrossing {
  id: string;
  name: string;
  location: string;
  country1: string;
  country2: string;
  flag1: string;
  flag2: string;
  status: BorderStatus;
  currentWaitTime: number; // in minutes
  averageWaitTime: number; // in minutes
  peakHours: string[];
  lastUpdated: string;
  operatingHours: string;
}

interface FerryRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  flag1: string;
  flag2: string;
  status: FerryStatus;
  nextDeparture: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  availability: number; // percentage
}

interface BorderIntelligenceProps {
  className?: string;
}

const borderCrossings: BorderCrossing[] = [
  {
    id: "algeciras-tangier",
    name: "Algeciras - Tangier Med",
    location: "Spain/Morocco Border",
    country1: "Spain",
    country2: "Morocco",
    flag1: "🇪🇸",
    flag2: "🇲🇦",
    status: "BUSY",
    currentWaitTime: 45,
    averageWaitTime: 30,
    peakHours: ["08:00-10:00", "18:00-20:00"],
    lastUpdated: new Date().toISOString(),
    operatingHours: "24/7",
  },
  {
    id: "tarifa-tangier",
    name: "Tarifa - Tangier Ville",
    location: "Spain/Morocco Border",
    country1: "Spain",
    country2: "Morocco",
    flag1: "🇪🇸",
    flag2: "🇲🇦",
    status: "OPEN",
    currentWaitTime: 20,
    averageWaitTime: 25,
    peakHours: ["07:00-09:00", "17:00-19:00"],
    lastUpdated: new Date().toISOString(),
    operatingHours: "06:00-22:00",
  },
  {
    id: "ceuta-morocco",
    name: "Ceuta - Fnideq",
    location: "Ceuta/Morocco Border",
    country1: "Spain",
    country2: "Morocco",
    flag1: "🇪🇸",
    flag2: "🇲🇦",
    status: "VERY_BUSY",
    currentWaitTime: 90,
    averageWaitTime: 60,
    peakHours: ["06:00-12:00"],
    lastUpdated: new Date().toISOString(),
    operatingHours: "24/7",
  },
];

const ferryRoutes: FerryRoute[] = [
  {
    id: "ferry-1",
    name: "Algeciras - Tangier Med",
    from: "Algeciras",
    to: "Tangier Med",
    flag1: "🇪🇸",
    flag2: "🇲🇦",
    status: "ON_TIME",
    nextDeparture: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 90,
    price: 45,
    currency: "EUR",
    availability: 65,
  },
  {
    id: "ferry-2",
    name: "Tarifa - Tangier Ville",
    from: "Tarifa",
    to: "Tangier Ville",
    flag1: "🇪🇸",
    flag2: "🇲🇦",
    status: "DELAYED",
    nextDeparture: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    duration: 60,
    price: 38,
    currency: "EUR",
    availability: 30,
  },
];

const statusConfig: Record<BorderStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  OPEN: {
    label: "Open - Low Traffic",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  BUSY: {
    label: "Busy",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
  },
  VERY_BUSY: {
    label: "Very Busy",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  CLOSED: {
    label: "Closed",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
  DELAYED: {
    label: "Delayed",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
};

export function BorderIntelligence({ className }: BorderIntelligenceProps) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours < 24) {
      return `in ${diffHours}h ${diffMins}m`;
    }
    return date.toLocaleDateString();
  };

  const getWaitTimeColor = (current: number, average: number) => {
    const ratio = current / average;
    if (ratio < 0.8) return "text-green-600";
    if (ratio < 1.2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Border Intelligence</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            Live Data
          </Badge>
        </div>
        <CardDescription>Real-time border crossing and ferry information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Border Crossings */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Border Crossings</h4>
          <div className="space-y-2">
            {borderCrossings.map((border) => {
              const config = statusConfig[border.status];
              const waitTimeColor = getWaitTimeColor(
                border.currentWaitTime,
                border.averageWaitTime
              );

              return (
                <div
                  key={border.id}
                  className="rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{border.flag1}{border.flag2}</span>
                        <h5 className="font-semibold text-sm">{border.name}</h5>
                      </div>
                      <p className="text-xs text-muted-foreground">{border.location}</p>
                    </div>
                    <Badge className={cn("text-xs", config.bgColor, config.color)}>
                      {config.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-xs">
                        <p className="text-muted-foreground">Current Wait</p>
                        <p className={cn("font-semibold", waitTimeColor)}>
                          {border.currentWaitTime} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div className="text-xs">
                        <p className="text-muted-foreground">Average</p>
                        <p className="font-semibold">{border.averageWaitTime} min</p>
                      </div>
                    </div>
                  </div>

                  {border.peakHours.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      ⚠️ Peak hours: {border.peakHours.join(", ")}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Navigation className="h-3 w-3 mr-1" />
                      Navigate
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1">
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Ferry Routes */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Ship className="h-4 w-4" />
            Ferry Schedules
          </h4>
          <div className="space-y-2">
            {ferryRoutes.map((ferry) => {
              const isLowAvailability = ferry.availability < 40;
              const isDelayed = ferry.status === "DELAYED";

              return (
                <div
                  key={ferry.id}
                  className="rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{ferry.flag1}→{ferry.flag2}</span>
                        <h5 className="font-semibold text-sm">{ferry.name}</h5>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {ferry.from} → {ferry.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        €{ferry.price}
                      </p>
                      <p className="text-xs text-muted-foreground">{ferry.duration} min</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Next Departure</span>
                      <span className="font-semibold">
                        {formatTime(ferry.nextDeparture)} ({formatDate(ferry.nextDeparture)})
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Availability</span>
                        <span className={cn(
                          "font-semibold",
                          isLowAvailability ? "text-orange-600" : "text-green-600"
                        )}>
                          {ferry.availability}%
                        </span>
                      </div>
                      <Progress value={ferry.availability} className="h-1" />
                    </div>
                  </div>

                  {isDelayed && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Ferry delayed - check schedule</span>
                    </div>
                  )}

                  {isLowAvailability && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Limited availability - book soon</span>
                    </div>
                  )}

                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Book Ferry
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">Recommended Route</h4>
              <p className="text-xs text-muted-foreground">
                Based on current conditions, we recommend taking the{" "}
                <span className="font-semibold">Tarifa - Tangier Ville</span> route.
                Lower wait times (20 min) and better ferry availability.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
