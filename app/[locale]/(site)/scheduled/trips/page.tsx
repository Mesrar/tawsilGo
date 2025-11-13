"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addDays, endOfWeek, format, startOfDay } from "date-fns";
import { Calendar, Clock, Filter, MapPin, Package, Search, Truck, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Point {
    lat: number;
    lng: number;
  }
  
  interface Stop {
    id: string;
    location: string;
    locationPoint: Point;
    arrivalTime: string;
    stopType: string;
    order: number;
  }
  
  interface Statistics {
    totalBookings: number;
    capacityUtilized: number;
    totalParcelWeight: number;
    pendingBookings: number;
    completedBookings: number;
    totalDistanceKm: number;
    totalDuration: number;
    averageSpeed: number;
  }
  
  interface Route {
    totalDistanceKm: number;
    totalDurationMins: number;
    routePolyline: string;
    directionSteps: any[] | null;
    hasStops: boolean;
  }
  
  interface Driver {
    id: string;
  }
  
  interface Trip {
    vehicleType: string;
    id: string;
    departureLocation: string;
    arrivalLocation: string;
    departureTime: string;
    arrivalTime: string;
    dapartPoint: Point; // Note: API has a typo here
    arrivalPoint: Point;
    totalCapacityKg: number;
    remainingCapacityKg: number;
    status: string;
    driver: Driver;
    stops?: Stop[];
    estimatedDistance: number;
    estimatedDuration: number;
    statistics: Statistics;
    route: Route;
  }
  
  interface Pagination {
    page: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    lastPage: number;
  }
  
  interface TripsResponse {
    trips: Trip[];
    pagination: Pagination;
  }
  
  interface PaginatedResponse {
    trips: TripsResponse;
  }



// Updated fetch function to match the API
async function fetchTrips(params: Record<string, any>): Promise<PaginatedResponse> {
    // Convert params to query string
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, String(value));
      }
    });
    
    const response = await fetch(`/api/user/available/trips?${queryString.toString()}`, { 
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch trips");
    }
    
    const data = await response.json();
    return data;
  }


export default function ScheduledTripsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  
  // Form state (these don't trigger API calls directly)
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [minCapacity, setMinCapacity] = useState<string>("");
  
  // Applied filters state (for actual API calls)
  const [appliedFilters, setAppliedFilters] = useState({
    origin: undefined as string | undefined,
    destination: undefined as string | undefined,
    timeRange: undefined as string | undefined,  // Added timeRange
    date: undefined as string | undefined,
    minCapacity: undefined as number | undefined,
    page: 1,
    limit: 10
  });
  
  // Generate date filters for tabs
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const endOfCurrentWeek = endOfWeek(today);
  
  // Handle tab changes
  useEffect(() => {
    let tabFilters = {...appliedFilters};
    
    switch(activeTab) {
        case "today":
          tabFilters.timeRange = "today";
          tabFilters.date = undefined; // Clear date when using timeRange
          break;
        case "tomorrow":
          tabFilters.timeRange = "tomorrow";
          tabFilters.date = undefined; // Clear date when using timeRange
          break;
        case "week":
          tabFilters.timeRange = "this_week";
          tabFilters.date = undefined; // Clear date when using timeRange
          break;
        default:
          // "all" tab - clear both filters
          tabFilters.timeRange = undefined;
          tabFilters.date = undefined;
      }
    
    // Reset page when changing tabs
    tabFilters.page = 1;
    setAppliedFilters(tabFilters);
    
  }, [activeTab]);

  // Apply filter changes when button is clicked
  const applyFilters = () => {
    setAppliedFilters({
      origin: origin || undefined,
      destination: destination || undefined,
      date: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
      timeRange: dateFilter ? undefined : appliedFilters.timeRange, // Clear timeRange if date is selected
      minCapacity: minCapacity ? parseFloat(minCapacity) : undefined,
      page: 1, // Reset to first page when applying new filters
      limit: appliedFilters.limit
    });
  };
  
  // Update page only in applied filters
  const updatePage = (newPage: number) => {
    setAppliedFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // API query using the applied filters
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<PaginatedResponse, Error>({
    queryKey: ["available-trips", appliedFilters],
    queryFn: () => fetchTrips(appliedFilters),
    placeholderData: (previousData) => previousData
  });

  // Keep all other utility functions
  function formatDate(dateString: string | number | Date) {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return "N/A";
    }
  }

  function formatTime(dateString: string | number | Date) {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "N/A";
    }
  }

  const getCapacityPercentage = (totalCapacity: number, remainingCapacity: number) => {
    if (!totalCapacity) return 0;
    const used = totalCapacity - remainingCapacity;
    return (used / totalCapacity) * 100;
  };

  const handleBookTrip = (tripId: string) => {
    router.push(`/scheduled/trips/${tripId}/book`);
  };

  // Update pagination handlers
  const handlePrevPage = () => {
    updatePage(Math.max(appliedFilters.page - 1, 1));
  };

  const handleNextPage = () => {
    if (data?.trips?.pagination) {
      updatePage(Math.min(appliedFilters.page + 1, data.trips.pagination.totalPages));
    }
  };

  // Render trip list (reused across tabs)
  const renderTripList = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Failed to load trips: {error.message}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      );
    }

    if (!data?.trips?.trips?.length) {
      return (
        <div className="text-center py-10">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No trips found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filters to find available trips.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {data.trips.trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Trip #{trip.id.substring(0, 8)}</h3>
                      <p className="text-gray-500 text-sm">
                        <Calendar className="inline mr-1 h-4 w-4" />
                        {formatDate(trip.departureTime)}
                      </p>
                    </div>
                    <Badge variant={trip.remainingCapacityKg > 5 ? "default" : "destructive"}>
                      {trip.remainingCapacityKg}kg Available
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="bg-green-100 p-1.5 rounded-full">
                            <MapPin className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">From</div>
                          <div>{trip.departureLocation}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {formatTime(trip.departureTime)}
                          </div>
                        </div>
                      </div>

                      {/* Display stops if available */}
                      {trip.stops && trip.stops.length > 0 && (
                        <div className="pl-7 border-l border-dashed border-gray-300 ml-[0.6rem]">
                          {trip.stops.map((stop) => (
                            <div key={stop.id} className="mb-3 relative">
                              <div className="absolute -left-[1.45rem] w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">{stop.order}</span>
                              </div>
                              <div>
                                <div className="text-sm font-medium">{stop.stopType === 'pickup' ? 'Pickup' : 'Dropoff'}</div>
                                <div className="text-sm">{stop.location}</div>
                                <div className="text-xs text-gray-500">
                                  <Clock className="inline mr-1 h-3 w-3" />
                                  {formatTime(stop.arrivalTime)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="bg-red-100 p-1.5 rounded-full">
                            <MapPin className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">To</div>
                          <div>{trip.arrivalLocation}</div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            {formatTime(trip.arrivalTime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Vehicle</span>
                          <span className="font-medium">{trip?.vehicleType || "Standard"}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span>Distance</span>
                          <span className="font-medium">{trip.route?.totalDistanceKm || trip.estimatedDistance || 'N/A'} km</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span>Duration</span>
                          <span className="font-medium">
                            {Math.floor((trip.route?.totalDurationMins || trip.estimatedDuration || 0) / 60)} hrs {(trip.route?.totalDurationMins || trip.estimatedDuration || 0) % 60} mins
                          </span>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Capacity</span>
                            <span className="font-medium">
                              {trip.remainingCapacityKg} / {trip.totalCapacityKg} kg
                            </span>
                          </div>
                          <Progress
                            value={getCapacityPercentage(trip.totalCapacityKg, trip.remainingCapacityKg)}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-end">
                <Button onClick={() => handleBookTrip(trip.id)}>
                  <Package className="mr-2 h-4 w-4" />
                  Book Parcel
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination controls */}
        {data.trips.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={appliedFilters.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {data.trips.pagination.currentPage} of {data.trips.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={appliedFilters.page >= data.trips.pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="pb-20 pt-40">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Available Trips</h1>
          <Link href="/parcels/create">
            <Button>Create New Parcel</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Trips</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-10">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Origin</h4>
                          <Input
                            placeholder="From..."
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Destination</h4>
                          <Input
                            placeholder="To..."
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Date</h4>
                          <DatePicker
                            selected={dateFilter}
                            onChange={(date) => setDateFilter(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select date..."
                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Minimum Capacity (kg)</h4>
                          <Input
                            type="number"
                            placeholder="Min capacity in kg"
                            value={minCapacity}
                            onChange={(e) => setMinCapacity(e.target.value)}
                            min="0"
                          />
                        </div>
                        <Button onClick={applyFilters}>Apply Filters</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <TabsContent value="all" className="m-0">
                {renderTripList()}
              </TabsContent>

              <TabsContent value="today" className="m-0">
                {renderTripList()}
              </TabsContent>

              <TabsContent value="tomorrow" className="m-0">
                {renderTripList()}
              </TabsContent>

              <TabsContent value="week" className="m-0">
                {renderTripList()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}