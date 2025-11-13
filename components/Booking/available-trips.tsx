import { useEffect, useState } from "react";
import { format, parseISO, differenceInHours, differenceInMinutes } from "date-fns";
import { Clock, MapPin, TrendingUp, Shield, Users, Clock as ClockIcon, Info, Star, BadgeCheck } from "lucide-react";
import { Trip } from "./trip-selection-step";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { TripStopsPreview } from "./TripStopsPreview";
import { TripStopsDetails } from "./TripStopsDetails";


interface TripSelectionGridProps {
  departureFilter: string;
  destinationFilter: string;
  dateFilter?: Date;
  departureCountry?: string;
  destinationCountry?: string;
  onTripSelected: (trip: Trip) => void;
  onBookTrip: (trip: Trip) => void;
}

// Helper function to format duration
const formatDuration = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const hours = differenceInHours(endDate, startDate);
  const minutes = differenceInMinutes(endDate, startDate) % 60;
  
  return hours > 0 
    ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
    : `${minutes}m`;
};

export function TripSelectionGrid({
  departureFilter,
  destinationFilter,
  dateFilter,
  departureCountry,
  destinationCountry,
  onTripSelected,
  onBookTrip
}: TripSelectionGridProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripForDetails, setSelectedTripForDetails] = useState<Trip | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      
      try {
        const queryParams = new URLSearchParams();
        
        if (departureCountry) queryParams.append('departureCountry', departureCountry);
        if (destinationCountry) queryParams.append('destinationCountry', destinationCountry);
        if (departureFilter) queryParams.append('departureCity', departureFilter);
        if (destinationFilter) queryParams.append('destinationCity', destinationFilter);
        if (dateFilter) queryParams.append('date', dateFilter.toISOString().split('T')[0]);
        
        const response = await fetch(
          `/api/user/available/trips?${queryParams.toString()}`,
          { credentials: 'include' }
        );
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        if (data.success && Array.isArray(data.trips)) {
          setTrips(data.trips);
        } else {
          setTrips([]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load trips");
        console.error("Error fetching trips:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
  }, [departureFilter, destinationFilter, dateFilter, departureCountry, destinationCountry]);

  if (isLoading) {
    return (
      <div className="divide-y divide-slate-100">
        {[1, 2, 3].map((i) => (
          <TripCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-slate-500">No trips found matching your criteria.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-100">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={() => onTripSelected(trip)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-slate-900">
                  {trip.departureCity} to {trip.destinationCity}
                </h3>
                <p className="text-sm text-slate-500">
                  {format(new Date(trip.departureTime), "EEEE, MMM d")} •
                  {formatDuration(trip.departureTime, trip.arrivalTime)}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-sm text-slate-500">Estimate</div>
                <div className="font-semibold text-slate-900">
                  €{(trip.price.pricePerKg * 5).toFixed(0)}
                </div>
              </div>
            </div>

            {/* Driver Trust Signals */}
            {trip.driver && (
              <div className="mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-slate-200">
                    <AvatarImage
                      src={trip.driver.profileImage}
                      alt={trip.driver.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {trip.driver.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm text-slate-900 truncate">
                        {trip.driver.name}
                      </p>
                      {trip.driver.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Star rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium text-slate-700">
                          {trip.driver.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({trip.driver.ratingCount})
                        </span>
                      </div>

                      {/* Completed trips badge */}
                      {trip.driver.completedTrips !== undefined && trip.driver.completedTrips > 0 && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500">
                            {trip.driver.completedTrips} trip{trip.driver.completedTrips !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-slate-500">Departs</p>
                  <p className="text-sm font-medium">
                    {format(new Date(trip.departureTime), "h:mm a")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-slate-500">Arrives</p>
                  <p className="text-sm font-medium">
                    {format(new Date(trip.arrivalTime), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            {/* Inline Stops Preview */}
            {trip.stops && trip.stops.length > 0 && (
              <TripStopsPreview
                stops={trip.stops}
                departureCity={trip.departureCity}
                destinationCity={trip.destinationCity}
                departureTime={trip.departureTime}
                arrivalTime={trip.arrivalTime}
                userSearchLocation={departureFilter || destinationFilter}
                maxStopsToShow={2}
                onViewAllClick={() => setSelectedTripForDetails(trip)}
              />
            )}

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-slate-500">
                  Capacity: {trip.remainingCapacity}kg available
                </p>
                <p className="text-xs font-medium text-blue-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  {Math.round(trip.statistics.capacityUtilized)}% full
                </p>
              </div>
              <Progress 
                value={trip.statistics.capacityUtilized} 
                className="h-1.5 bg-slate-100" 
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {trip.stops && trip.stops.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {trip.stops.length} stop{trip.stops.length > 1 ? 's' : ''}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className="text-xs bg-green-50 text-green-700 border-green-100">
                  {trip.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTripForDetails(trip);
                  }}
                >
                  <Info className="h-4 w-4 mr-1" /> Details
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookTrip(trip);
                  }}
                  className="min-w-[100px]"
                >
                  <div className="flex items-center gap-2">
                    <span>Select</span>
                    <span className="text-sm">€{(trip.price.pricePerKg * 5).toFixed(0)}</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Details Dialog */}
      <Dialog open={!!selectedTripForDetails} onOpenChange={(open: any) => !open && setSelectedTripForDetails(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              View complete route and pricing information
            </DialogDescription>
          </DialogHeader>

          {selectedTripForDetails && (
            <div className="space-y-4 px-6 py-4 overflow-y-auto flex-1">
              {/* Driver Information */}
              {selectedTripForDetails.driver && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-3">Your Driver</p>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-slate-200">
                      <AvatarImage
                        src={selectedTripForDetails.driver.profileImage}
                        alt={selectedTripForDetails.driver.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                        {selectedTripForDetails.driver.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <p className="font-medium text-base text-slate-900">
                          {selectedTripForDetails.driver.name}
                        </p>
                        {selectedTripForDetails.driver.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-slate-700">
                            {selectedTripForDetails.driver.rating.toFixed(1)}
                          </span>
                          <span className="text-slate-500">
                            ({selectedTripForDetails.driver.ratingCount} reviews)
                          </span>
                        </div>

                        {selectedTripForDetails.driver.completedTrips !== undefined && (
                          <div className="flex items-center gap-1 text-slate-600">
                            <Shield className="h-4 w-4" />
                            <span>{selectedTripForDetails.driver.completedTrips} completed trips</span>
                          </div>
                        )}
                      </div>

                      {selectedTripForDetails.driver.isVerified && (
                        <Badge variant="outline" className="mt-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified Driver
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Route information with detailed stops */}
              {selectedTripForDetails.stops && selectedTripForDetails.stops.length > 0 ? (
                <TripStopsDetails
                  stops={selectedTripForDetails.stops}
                  departureCity={selectedTripForDetails.departureCity}
                  destinationCity={selectedTripForDetails.destinationCity}
                  departureAddress={selectedTripForDetails.departureAddress}
                  destinationAddress={selectedTripForDetails.destinationAddress}
                  departureTime={selectedTripForDetails.departureTime}
                  arrivalTime={selectedTripForDetails.arrivalTime}
                  totalDistanceKm={selectedTripForDetails.route?.totalDistanceKm}
                />
              ) : (
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex mb-2">
                    <div className="flex flex-col items-center mr-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-10 bg-slate-300 my-1"></div>
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-red-600" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="font-medium text-sm">{selectedTripForDetails.departureCity}</p>
                        <p className="text-xs text-slate-500">{selectedTripForDetails.departureCountry}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[260px]">
                          {selectedTripForDetails.departureAddress}
                        </p>
                      </div>
                      <div className="my-2"></div>
                      <div>
                        <p className="font-medium text-sm">{selectedTripForDetails.destinationCity}</p>
                        <p className="text-xs text-slate-500">{selectedTripForDetails.destinationCountry}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[260px]">
                          {selectedTripForDetails.destinationAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dates and times */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Departure</p>
                  <p className="text-sm font-medium">
                    {format(new Date(selectedTripForDetails.departureTime), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm">
                    {format(new Date(selectedTripForDetails.departureTime), "h:mm a")}
                  </p>
                </div>
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Arrival</p>
                  <p className="text-sm font-medium">
                    {format(new Date(selectedTripForDetails.arrivalTime), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm">
                    {format(new Date(selectedTripForDetails.arrivalTime), "h:mm a")}
                  </p>
                </div>
              </div>
              
              {/* Pricing details with estimate */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-medium mb-3">Pricing</p>

                {/* Base pricing info */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Base price:</span>
                    <span className="font-medium">{selectedTripForDetails.price.minimumPrice} {selectedTripForDetails.price.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per kg:</span>
                    <span className="font-medium">{selectedTripForDetails.price.pricePerKg} {selectedTripForDetails.price.currency}</span>
                  </div>
                </div>

                {/* Price estimate for 5kg */}
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Estimated price for typical parcel (5kg):</p>
                  <div className="text-xl font-bold text-primary">
                    €{(selectedTripForDetails.price.pricePerKg * 5).toFixed(0)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Final price may vary based on exact weight and dimensions</p>
                </div>
              </div>
              
              {/* Capacity information */}
              <div className="border border-slate-200 rounded-lg p-3">
                <p className="text-sm font-medium mb-2">Capacity</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total capacity:</span>
                    <span>{selectedTripForDetails.totalCapacity}kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Available capacity:</span>
                    <span>{selectedTripForDetails.remainingCapacity}kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Utilization:</span>
                    <span>{Math.round(selectedTripForDetails.statistics.capacityUtilized)}%</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Progress 
                    value={selectedTripForDetails.statistics.capacityUtilized} 
                    className="h-2 bg-slate-100" 
                  />
                </div>
              </div>
              
              {/* Route statistics if available */}
              {selectedTripForDetails.route && (
                <div className="border border-slate-200 rounded-lg p-3">
                  <p className="text-sm font-medium mb-2">Route Information</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Total distance:</span>
                      <span>{Math.round(selectedTripForDetails.route.totalDistanceKm)} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Journey time:</span>
                      <span>{Math.round(selectedTripForDetails.route.totalDurationMins / 60)} hours</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sticky footer with action button */}
          {selectedTripForDetails && (
            <div className="px-6 py-4 border-t border-slate-100 bg-white sticky bottom-0">
              <Button
                className="w-full h-12 rounded-lg"
                onClick={() => {
                  onBookTrip(selectedTripForDetails);
                  setSelectedTripForDetails(null);
                }}
              >
                Select This Trip
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Skeleton component for loading state
function TripCardSkeleton() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="text-right">
          <Skeleton className="h-5 w-16 mb-1" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      {/* Driver skeleton */}
      <div className="mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-1.5 w-full" />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}