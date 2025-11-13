import { format } from "date-fns";
import { MapPin, Clock, Package, AlertCircle } from "lucide-react";
import { TripStop } from "@/types/trip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TripStopsPreviewProps {
  stops: TripStop[];
  departureCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  userSearchLocation?: string; // To highlight relevant stops
  maxStopsToShow?: number;
  onViewAllClick?: () => void;
  className?: string;
}

export function TripStopsPreview({
  stops,
  departureCity,
  destinationCity,
  departureTime,
  arrivalTime,
  userSearchLocation,
  maxStopsToShow = 2,
  onViewAllClick,
  className
}: TripStopsPreviewProps) {
  if (!stops || stops.length === 0) {
    return null;
  }

  // Sort stops by order
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  // Get stops to display
  const stopsToShow = sortedStops.slice(0, maxStopsToShow);
  const remainingStops = sortedStops.length - stopsToShow.length;

  // Check if a stop matches user's search location
  const isRelevantStop = (stop: TripStop): boolean => {
    if (!userSearchLocation) return false;
    const searchLower = userSearchLocation.toLowerCase();
    return (
      stop.location.toLowerCase().includes(searchLower) ||
      stop.fullAddress?.toLowerCase().includes(searchLower) ||
      false
    );
  };

  // Get stop type color and label
  const getStopTypeBadge = (stopType: string) => {
    switch (stopType.toLowerCase()) {
      case 'pickup':
        return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Pickup' };
      case 'dropoff':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Dropoff' };
      case 'both':
        return { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Both' };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', label: stopType };
    }
  };

  return (
    <div className={cn("mt-2 mb-3", className)}>
      {/* Timeline container */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-amber-300 to-red-300" />

        {/* Departure point */}
        <div className="relative flex items-start gap-3 mb-2">
          <div className="relative z-10 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-xs font-medium text-slate-900">{departureCity}</p>
            <p className="text-xs text-slate-500">{format(new Date(departureTime), "HH:mm")}</p>
          </div>
        </div>

        {/* Stops */}
        {stopsToShow.map((stop, index) => {
          const isRelevant = isRelevantStop(stop);
          const typeBadge = getStopTypeBadge(stop.stopType);
          const hasConditionalStatus = stop.stopStatus === 'conditional' || stop.stopStatus === 'optional';

          return (
            <div
              key={stop.id}
              className={cn(
                "relative flex items-start gap-3 mb-2 py-1.5 px-2 -ml-1 rounded-md transition-colors",
                isRelevant && "bg-amber-50 border border-amber-200"
              )}
            >
              {/* Stop marker */}
              <div className="relative z-10 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                <span className="text-xs font-bold text-white">{index + 1}</span>
              </div>

              {/* Stop details */}
              <div className="flex-1 pt-0.5 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {stop.location}
                      </p>
                      {isRelevant && (
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300 px-1.5 py-0">
                          Match
                        </Badge>
                      )}
                      {hasConditionalStatus && (
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" title="Conditional stop" />
                      )}
                    </div>
                    {stop.fullAddress && (
                      <p className="text-xs text-slate-500 truncate">{stop.fullAddress}</p>
                    )}
                  </div>

                  {/* Stop type badge */}
                  <Badge variant="outline" className={cn("text-xs px-1.5 py-0 flex-shrink-0", typeBadge.color)}>
                    {typeBadge.label}
                  </Badge>
                </div>

                {/* Time and distance info */}
                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(stop.arrivalTime), "HH:mm")}</span>
                  </div>

                  {stop.durationFromPreviousMins && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <span>•</span>
                      <span>{Math.floor(stop.durationFromPreviousMins / 60)}h {stop.durationFromPreviousMins % 60}m from previous</span>
                    </div>
                  )}

                  {stop.distanceFromPreviousKm && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <span>•</span>
                      <span>{Math.round(stop.distanceFromPreviousKm)} km</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* More stops indicator */}
        {remainingStops > 0 && (
          <div className="relative flex items-start gap-3 mb-2">
            <div className="relative z-10 w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-slate-400 transition-colors"
              onClick={onViewAllClick}
            >
              <span className="text-xs font-bold text-white">+{remainingStops}</span>
            </div>
            <div className="flex-1 pt-0.5">
              <button
                onClick={onViewAllClick}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                {remainingStops} more stop{remainingStops > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Destination point */}
        <div className="relative flex items-start gap-3">
          <div className="relative z-10 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-xs font-medium text-slate-900">{destinationCity}</p>
            <p className="text-xs text-slate-500">{format(new Date(arrivalTime), "HH:mm")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
