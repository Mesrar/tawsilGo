"use client";

import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatSafeDate } from "@/lib/utils";

interface TripRouteHeroProps {
  departureCity: string;
  departureCountry: string;
  destinationCity: string;
  destinationCountry: string;
  departureTime: string;
  arrivalTime: string;
  isMobile?: boolean;
}

const countryFlags: Record<string, string> = {
  Spain: "🇪🇸",
  Morocco: "🇲🇦",
  France: "🇫🇷",
  Portugal: "🇵🇹",
  Italy: "🇮🇹",
  Germany: "🇩🇪",
  Belgium: "🇧🇪",
  Netherlands: "🇳🇱",
  UK: "🇬🇧",
  "United Kingdom": "🇬🇧",
};

export function TripRouteHero({
  departureCity,
  departureCountry,
  destinationCity,
  destinationCountry,
  departureTime,
  arrivalTime,
  isMobile,
}: TripRouteHeroProps) {
  const departureFlag = countryFlags[departureCountry] || "📍";
  const destinationFlag = countryFlags[destinationCountry] || "📍";

  const departureDate = new Date(departureTime);
  const arrivalDate = new Date(arrivalTime);
  const now = new Date();

  // Calculate relative time
  const isUpcoming = departureDate > now;
  const relativeTime = isUpcoming
    ? `Departs ${formatDistanceToNow(departureDate, { addSuffix: true })}`
    : `Departed ${formatDistanceToNow(departureDate, { addSuffix: true })}`;

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-background border-b">
      <div className="container py-6 md:py-8">
        {/* Route Display */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
          <div className="text-center flex-1">
            <div className="text-3xl md:text-4xl mb-1">{departureFlag}</div>
            <div className="font-bold text-lg md:text-xl">{departureCity}</div>
            <div className="text-xs md:text-sm text-muted-foreground">
              {departureCountry}
            </div>
          </div>

          <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />

          <div className="text-center flex-1">
            <div className="text-3xl md:text-4xl mb-1">{destinationFlag}</div>
            <div className="font-bold text-lg md:text-xl">{destinationCity}</div>
            <div className="text-xs md:text-sm text-muted-foreground">
              {destinationCountry}
            </div>
          </div>
        </div>

        {/* Time Information */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatSafeDate(departureTime, "PPP")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatSafeDate(departureTime, "p")} - {formatSafeDate(arrivalTime, "p")}
            </span>
          </div>
        </div>

        {/* Relative Time Badge */}
        <div className="flex justify-center mt-3">
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              isUpcoming
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {relativeTime}
          </div>
        </div>
      </div>
    </div>
  );
}
