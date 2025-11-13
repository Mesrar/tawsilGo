import { format } from "date-fns";
import { MapPin, Clock, Package, Navigation, AlertCircle, Info } from "lucide-react";
import { TripStop } from "@/types/trip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TripStopsDetailsProps {
  stops: TripStop[];
  departureCity: string;
  destinationCity: string;
  departureAddress: string;
  destinationAddress: string;
  departureTime: string;
  arrivalTime: string;
  totalDistanceKm?: number;
  className?: string;
}

export function TripStopsDetails({
  stops,
  departureCity,
  destinationCity,
  departureAddress,
  destinationAddress,
  departureTime,
  arrivalTime,
  totalDistanceKm,
  className
}: TripStopsDetailsProps) {
  // Sort stops by order
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);

  // Get stop type color and label
  const getStopTypeBadge = (stopType: string) => {
    switch (stopType.toLowerCase()) {
      case 'pickup':
        return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Pickup Available', icon: Package };
      case 'dropoff':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Dropoff Available', icon: MapPin };
      case 'both':
        return { color: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Pickup & Dropoff', icon: Package };
      default:
        return { color: 'bg-slate-100 text-slate-700 border-slate-200', label: stopType, icon: MapPin };
    }
  };

  // Get stop status badge
  const getStopStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-green-50 text-green-700 border-green-200', label: 'Confirmed' };
      case 'conditional':
        return { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Conditional' };
      case 'optional':
        return { color: 'bg-slate-50 text-slate-700 border-slate-200', label: 'Optional' };
      default:
        return null;
    }
  };

  return (
    <div className={cn("bg-slate-50 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-900">Route with Stops</p>
        {totalDistanceKm && totalDistanceKm > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Navigation className="h-3.5 w-3.5" />
            <span>{Math.round(totalDistanceKm)} km total</span>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical gradient line */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-amber-400 to-red-400 rounded-full" />

        {/* Departure */}
        <div className="relative flex gap-4 mb-6 pb-6 border-b border-slate-200">
          <div className="relative z-10 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="font-medium text-slate-900">{departureCity}</p>
                <p className="text-sm text-slate-600 mt-0.5">{departureAddress}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-medium text-slate-900">
                  {format(new Date(departureTime), "HH:mm")}
                </p>
                <p className="text-xs text-slate-500">
                  {format(new Date(departureTime), "MMM d")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stops */}
        {sortedStops.map((stop, index) => {
          const typeBadge = getStopTypeBadge(stop.stopType);
          const statusBadge = getStopStatusBadge(stop.stopStatus);
          const TypeIcon = typeBadge.icon;

          return (
            <div key={stop.id} className="relative flex gap-4 mb-6">
              {/* Stop marker */}
              <div className="relative z-10 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 border-3 border-white shadow-lg">
                <span className="text-sm font-bold text-white">{index + 1}</span>
              </div>

              {/* Stop content */}
              <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-slate-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-slate-900">{stop.location}</p>
                      {stop.stopStatus === 'conditional' || stop.stopStatus === 'optional' ? (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      ) : null}
                    </div>
                    {stop.fullAddress && (
                      <p className="text-sm text-slate-600">{stop.fullAddress}</p>
                    )}
                    {stop.facilityType && (
                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        {stop.facilityType.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-slate-900">
                      {format(new Date(stop.arrivalTime), "HH:mm")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(stop.arrivalTime), "MMM d")}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="outline" className={cn("text-xs px-2 py-0.5", typeBadge.color)}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {typeBadge.label}
                  </Badge>
                  {statusBadge && (
                    <Badge variant="outline" className={cn("text-xs px-2 py-0.5", statusBadge.color)}>
                      {statusBadge.label}
                    </Badge>
                  )}
                </div>

                {/* Travel info from previous point */}
                {(stop.durationFromPreviousMins || stop.distanceFromPreviousKm) && (
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {stop.durationFromPreviousMins && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {Math.floor(stop.durationFromPreviousMins / 60)}h{' '}
                          {stop.durationFromPreviousMins % 60}m from {index === 0 ? departureCity : sortedStops[index - 1]?.location}
                        </span>
                      </div>
                    )}
                    {stop.distanceFromPreviousKm && (
                      <div className="flex items-center gap-1">
                        <Navigation className="h-3.5 w-3.5" />
                        <span>{Math.round(stop.distanceFromPreviousKm)} km</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional info */}
                {(stop.operatingHours || stop.remainingCapacityAfterStop !== undefined) && (
                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-xs">
                    {stop.operatingHours && (
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="h-3 w-3" />
                        <span>Hours: {stop.operatingHours}</span>
                      </div>
                    )}
                    {stop.remainingCapacityAfterStop !== undefined && (
                      <div className="flex items-center gap-1 text-slate-600">
                        <Package className="h-3 w-3" />
                        <span>Capacity after stop: {stop.remainingCapacityAfterStop} kg</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Conditional stop warning */}
                {(stop.stopStatus === 'conditional' || stop.stopStatus === 'optional') && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                      <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <p>
                        This is a {stop.stopStatus} stop. The driver may skip this location depending on capacity and schedule.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Destination */}
        <div className="relative flex gap-4">
          <div className="relative z-10 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-slate-900">{destinationCity}</p>
                <p className="text-sm text-slate-600 mt-0.5">{destinationAddress}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-medium text-slate-900">
                  {format(new Date(arrivalTime), "HH:mm")}
                </p>
                <p className="text-xs text-slate-500">
                  {format(new Date(arrivalTime), "MMM d")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
