"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, MapPin, Route, Package as PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { decodePolyline, formatSafeDate } from "@/lib/utils";
import DynamicTripMap from "@/components/Map/DynamicTripMap";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  TripDetailsHeader,
  TripRouteHero,
  TripStatisticsGrid,
  TripActions,
  TripParcelsList,
} from "@/components/Driver/TripDetails";
import { CustomsStatusTracker } from "@/components/Driver/CustomsStatusTracker";
import { CustomsDocumentLibrary } from "@/components/Driver/CustomsDocumentLibrary";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TripStatistics {
  totalBookings: number;
  capacityUtilized: number;
  totalParcelWeight: number;
  pendingBookings: number;
  completedBookings: number;
  totalDistanceKm: number;
  totalDuration: number;
  averageSpeed: number;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

interface Price {
  basePrice: number;
  pricePerKg: number;
  pricePerKm: number;
  minimumPrice: number;
  currency: string;
  weightThreshold: number;
  premiumFactor: number;
}

interface TripDetails {
  id: string;
  departureCountry: string;
  destinationCountry: string;
  departureCity: string;
  destinationCity: string;
  departureAddress: string;
  destinationAddress: string;
  departureTime: string;
  arrivalTime: string;
  price: Price;
  dapartPoint: GeoPoint;
  arrivalPoint: GeoPoint;
  totalCapacity: number;
  remainingCapacity: number;
  status: string;
  estimatedDistance: number;
  estimatedDuration: number;
  statistics: TripStatistics;
  route: {
    totalDistanceKm: number;
    totalDurationMins: number;
    routePolyline: string;
    directionSteps: any;
    hasStops: boolean;
  };
  ownerType: string;
  createdByUserId: string;
}

async function getTripDetails(id: string): Promise<TripDetails> {
  const response = await fetch(`/api/driver/trips/${id}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch trip details");

  const data = await response.json();

  // Extract the trip from the nested structure
  if (data.trip) {
    return data.trip;
  }

  return data;
}

export default function TripDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Get query parameters
  const actionParam = searchParams?.get("action");
  const tabParam = searchParams?.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "stats");

  const {
    data: trip,
    isLoading,
    error,
    isRefetching,
  } = useQuery<TripDetails, Error>({
    queryKey: ["trip-details", id],
    queryFn: () => getTripDetails(id),
    staleTime: 60_000,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading trip",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle action parameter (e.g., ?action=start)
  useEffect(() => {
    if (actionParam === "start" && trip && trip.status === "SCHEDULED") {
      // Could trigger start trip dialog automatically
    }
  }, [actionParam, trip]);

  // Decode polyline for map
  const decodedPolylinePoints = trip?.route?.routePolyline
    ? decodePolyline(trip.route.routePolyline)
    : ([] as [number, number][]);

  const hasValidDeparturePoint =
    trip?.dapartPoint &&
    typeof trip.dapartPoint.lat === "number" &&
    typeof trip.dapartPoint.lng === "number" &&
    trip.dapartPoint.lat !== 0 &&
    trip.dapartPoint.lng !== 0;

  const hasValidArrivalPoint =
    trip?.arrivalPoint &&
    typeof trip.arrivalPoint.lat === "number" &&
    typeof trip.arrivalPoint.lng === "number" &&
    trip.arrivalPoint.lat !== 0 &&
    trip.arrivalPoint.lng !== 0;

  const hasMapPoints = hasValidDeparturePoint || hasValidArrivalPoint;

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Trip</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button asChild>
          <Link href="/drivers/dashboard/trips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Link>
        </Button>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
        <p className="text-gray-600 mb-4">
          The requested trip could not be found
        </p>
        <Button asChild>
          <Link href="/drivers/dashboard/trips">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <TripDetailsHeader tripId={trip.id} status={trip.status} isMobile={isMobile} />

      {/* Route Hero */}
      <TripRouteHero
        departureCity={trip.departureCity}
        departureCountry={trip.departureCountry}
        destinationCity={trip.destinationCity}
        destinationCountry={trip.destinationCountry}
        departureTime={trip.departureTime}
        arrivalTime={trip.arrivalTime}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="container py-6">
        {/* Statistics Grid - Always visible on desktop */}
        {!isMobile && (
          <div className="mb-6">
            <TripStatisticsGrid
              totalCapacity={trip.totalCapacity}
              remainingCapacity={trip.remainingCapacity}
              totalBookings={trip.statistics.totalBookings}
              totalDistanceKm={trip.route.totalDistanceKm}
              totalDurationMins={trip.route.totalDurationMins}
              totalParcelWeight={trip.statistics.totalParcelWeight}
              currency={trip.price.currency}
              basePrice={trip.price.basePrice}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Mobile: Tabs | Desktop: 2-column layout */}
        {isMobile ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="route">Route</TabsTrigger>
              <TabsTrigger value="parcels">
                Parcels ({trip.statistics.totalBookings})
              </TabsTrigger>
              <TabsTrigger value="customs">Customs</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-4">
              <TripStatisticsGrid
                totalCapacity={trip.totalCapacity}
                remainingCapacity={trip.remainingCapacity}
                totalBookings={trip.statistics.totalBookings}
                totalDistanceKm={trip.route.totalDistanceKm}
                totalDurationMins={trip.route.totalDurationMins}
                totalParcelWeight={trip.statistics.totalParcelWeight}
                currency={trip.price.currency}
                basePrice={trip.price.basePrice}
                isMobile={isMobile}
              />
            </TabsContent>

            <TabsContent value="route" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Route className="h-5 w-5" />
                    Route Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasMapPoints ? (
                    <DynamicTripMap
                      routePolyline={decodedPolylinePoints}
                      departurePoint={
                        hasValidDeparturePoint
                          ? {
                              id: "departure",
                              point: trip.dapartPoint,
                              label: trip.departureAddress,
                              type: "departure" as const,
                            }
                          : undefined
                      }
                      arrivalPoint={
                        hasValidArrivalPoint
                          ? {
                              id: "arrival",
                              point: trip.arrivalPoint,
                              label: trip.destinationAddress,
                              type: "arrival" as const,
                            }
                          : undefined
                      }
                      height="400px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Map coordinates not available</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium">
                        {trip.route.totalDistanceKm.toFixed(1)} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {Math.floor(trip.route.totalDurationMins / 60)}h{" "}
                        {trip.route.totalDurationMins % 60}m
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parcels" className="mt-4">
              <TripParcelsList parcels={[]} />
            </TabsContent>

            <TabsContent value="customs" className="mt-4 space-y-4">
              <CustomsStatusTracker parcels={[]} tripId={trip.id} />
              <CustomsDocumentLibrary documents={[]} />
            </TabsContent>
          </Tabs>
        ) : (
          /* Desktop: 2-column layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Route Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasMapPoints ? (
                  <DynamicTripMap
                    routePolyline={decodedPolylinePoints}
                    departurePoint={
                      hasValidDeparturePoint
                        ? {
                            id: "departure",
                            point: trip.dapartPoint,
                            label: trip.departureAddress,
                            type: "departure" as const,
                          }
                        : undefined
                    }
                    arrivalPoint={
                      hasValidArrivalPoint
                        ? {
                            id: "arrival",
                            point: trip.arrivalPoint,
                            label: trip.destinationAddress,
                            type: "arrival" as const,
                          }
                        : undefined
                    }
                    height="500px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Map coordinates not available</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Distance:</span>
                    <span className="font-medium">
                      {trip.route.totalDistanceKm.toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Duration:</span>
                    <span className="font-medium">
                      {Math.floor(trip.route.totalDurationMins / 60)}h{" "}
                      {trip.route.totalDurationMins % 60}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Speed:</span>
                    <span className="font-medium">
                      {trip.statistics.averageSpeed || 0} km/h
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column: Parcels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon className="h-5 w-5" />
                  Parcels ({trip.statistics.totalBookings})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TripParcelsList parcels={[]} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customs & Documents Section - Desktop Only */}
        {!isMobile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <CustomsStatusTracker parcels={[]} tripId={trip.id} />
            <CustomsDocumentLibrary documents={[]} />
          </div>
        )}

        {/* Actions - Desktop: inline, Mobile: sticky */}
        <div className={isMobile ? "" : "mt-6"}>
          <TripActions
            status={trip.status}
            departureAddress={trip.departureAddress}
            destinationAddress={trip.destinationAddress}
            dapartPoint={trip.dapartPoint}
            arrivalPoint={trip.arrivalPoint}
            isMobile={isMobile}
            isSticky={isMobile}
            onStartTrip={() => {
              toast({
                title: "Trip Started",
                description: "Your trip has been started successfully.",
              });
              // In real implementation, call API to update status
            }}
          />
        </div>
      </div>
    </div>
  );
}
