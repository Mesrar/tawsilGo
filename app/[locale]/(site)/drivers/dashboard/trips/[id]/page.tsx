"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Package,
  Banknote,
  Navigation,
  Play,
  CheckCircle,
  AlertTriangle,
  Truck,
  Weight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTripDialog } from "@/components/drivers/EditTripDialog";
import { DeleteTripDialog } from "@/components/drivers/DeleteTripDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Trip data interface matching backend response
interface TripData {
  id: string;
  departureCity: string;
  destinationCity: string;
  departureCountry: string;
  destinationCountry: string;
  departureAddress: string;
  destinationAddress: string;
  departureTime: string;
  arrivalTime: string;
  totalCapacity: number;
  remainingCapacity: number;
  status: string;
  price: {
    basePrice: number;
    pricePerKg: number;
    pricePerKm: number;
    minimumPrice: number;
    currency: string;
  };
  statistics: {
    totalBookings: number;
    capacityUtilized: number;
  };
}

// Country flags mapping
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

const getStatusBadge = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400">
          Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400">
          Cancelled
        </Badge>
      );
    case "active":
    case "in_progress":
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400">
          In Progress
        </Badge>
      );
    case "scheduled":
    default:
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
          Scheduled
        </Badge>
      );
  }
};

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
}

function formatTime(dateString: string): string {
  try {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
}

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const tripId = params?.id as string;
  const locale = (params?.locale as string) || "en";

  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch trip data
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        // Fetch from the trips list API and find the specific trip
        const response = await fetch("/api/driver/trips?limit=100");
        const data = await response.json();

        if (!data.success || !data.trips) {
          throw new Error("Failed to load trips");
        }

        // Find the trip in the list
        const foundTrip = data.trips.find((t: any) => t.id === tripId);
        if (!foundTrip) {
          throw new Error("Trip not found");
        }

        // Map API response to our interface
        setTrip({
          id: foundTrip.id,
          departureCity: foundTrip.departure_city || foundTrip.origin?.split(",")[0] || "Unknown",
          destinationCity: foundTrip.destination_city || foundTrip.destination?.split(",")[0] || "Unknown",
          departureCountry: foundTrip.departure_country || "",
          destinationCountry: foundTrip.destination_country || "",
          departureAddress: foundTrip.departure_address || foundTrip.origin || "",
          destinationAddress: foundTrip.destination_address || foundTrip.destination || "",
          departureTime: foundTrip.departure_time,
          arrivalTime: foundTrip.arrival_time || "",
          totalCapacity: foundTrip.total_capacity || 0,
          remainingCapacity: foundTrip.remaining_capacity || 0,
          status: foundTrip.status,
          price: foundTrip.price_details || {
            basePrice: foundTrip.price || 0,
            pricePerKg: 0,
            pricePerKm: 0,
            minimumPrice: 0,
            currency: "MAD",
          },
          statistics: foundTrip.statistics || {
            totalBookings: 0,
            capacityUtilized: 0,
          },
        });
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
        setError(err instanceof Error ? err.message : "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleStartTrip = async () => {
    setShowStartDialog(false);
    setActionLoading(true);
    try {
      const response = await fetch(`/api/driver/trips/${tripId}/start`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to start trip");

      toast({ title: "Trip Started", description: "Your trip is now in progress." });
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
      // Refresh trip data
      setTrip((prev) => prev ? { ...prev, status: "in_progress" } : null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to start trip",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    setShowCompleteDialog(false);
    setActionLoading(true);
    try {
      const response = await fetch(`/api/driver/trips/${tripId}/complete`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to complete trip");

      toast({ title: "Trip Completed", description: "Your trip has been completed successfully." });
      queryClient.invalidateQueries({ queryKey: ["driver-trips"] });
      setTrip((prev) => prev ? { ...prev, status: "completed" } : null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to complete trip",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleNavigate = () => {
    const origin = encodeURIComponent(trip?.departureAddress || trip?.departureCity || "");
    const destination = encodeURIComponent(trip?.destinationAddress || trip?.destinationCity || "");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, "_blank");
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Trip Not Found</h2>
        <p className="text-slate-500 text-center mb-6">{error || "The requested trip could not be found"}</p>
        <Button asChild>
          <Link href={`/${locale}/drivers/dashboard/trips`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trips
          </Link>
        </Button>
      </div>
    );
  }

  const departureFlag = countryFlags[trip.departureCountry] || "📍";
  const destinationFlag = countryFlags[trip.destinationCountry] || "📍";
  const usedCapacity = trip.totalCapacity - trip.remainingCapacity;
  const capacityPercentage = trip.totalCapacity > 0 ? (usedCapacity / trip.totalCapacity) * 100 : 0;
  const normalizedStatus = trip.status.toLowerCase();
  const isScheduled = normalizedStatus === "scheduled";
  const isInProgress = normalizedStatus === "active" || normalizedStatus === "in_progress";
  const isCompleted = normalizedStatus === "completed";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/${locale}/drivers/dashboard/trips`}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold text-lg">Trip Details</h1>
                <p className="text-xs text-slate-500 font-mono">#{trip.id.substring(0, 8)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(trip.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowEditDialog(true)}
                    disabled={!isScheduled}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Trip
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                    disabled={!isScheduled}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Trip
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Route Hero */}
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container py-8">
          {/* Route Display */}
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
            <div className="text-center flex-1">
              <div className="text-4xl md:text-5xl mb-2">{departureFlag}</div>
              <div className="font-bold text-lg md:text-xl">{trip.departureCity}</div>
              {trip.departureCountry && (
                <div className="text-sm text-slate-500">{trip.departureCountry}</div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <Truck className="h-5 w-5 text-slate-400 mb-1" />
              <ArrowRight className="h-8 w-8 text-blue-500" />
            </div>

            <div className="text-center flex-1">
              <div className="text-4xl md:text-5xl mb-2">{destinationFlag}</div>
              <div className="font-bold text-lg md:text-xl">{trip.destinationCity}</div>
              {trip.destinationCountry && (
                <div className="text-sm text-slate-500">{trip.destinationCountry}</div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{formatDate(trip.departureTime)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>
                {formatTime(trip.departureTime)}
                {trip.arrivalTime && ` → ${formatTime(trip.arrivalTime)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6 space-y-4">
        {/* Info Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Capacity Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Weight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Capacity</p>
                  <p className="text-xl font-bold">{trip.totalCapacity} kg</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${capacityPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {trip.remainingCapacity} kg available
              </p>
            </CardContent>
          </Card>

          {/* Bookings Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Bookings</p>
                  <p className="text-xl font-bold">{trip.statistics.totalBookings}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {usedCapacity > 0 ? `${usedCapacity} kg booked` : "No bookings yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Pricing</p>
                <p className="text-xl font-bold">
                  {trip.price.basePrice} {trip.price.currency}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Per kg:</span>
                <span className="font-medium">{trip.price.pricePerKg} {trip.price.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minimum:</span>
                <span className="font-medium">{trip.price.minimumPrice} {trip.price.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="w-0.5 h-12 bg-slate-200 dark:bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Departure</p>
                  <p className="font-medium">{trip.departureAddress || trip.departureCity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Destination</p>
                  <p className="font-medium">{trip.destinationAddress || trip.destinationCity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Actions */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="container py-4">
          <div className="flex gap-3">
            {isScheduled && (
              <Button
                className="flex-1"
                size="lg"
                onClick={() => setShowStartDialog(true)}
                disabled={actionLoading}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Trip
              </Button>
            )}

            {isInProgress && (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={() => setShowCompleteDialog(true)}
                disabled={actionLoading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Trip
              </Button>
            )}

            {!isCompleted && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleNavigate}
                className={isCompleted ? "flex-1" : ""}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
            )}

            {isCompleted && (
              <Button variant="outline" size="lg" className="flex-1" asChild>
                <Link href={`/${locale}/drivers/dashboard/trips`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Trips
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Start Trip Dialog */}
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you ready to start this trip from {trip.departureCity} to {trip.destinationCity}?
              This will notify customers with bookings on this route.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartTrip}>Start Trip</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Trip Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              Have you arrived at {trip.destinationCity} and delivered all parcels?
              This will mark the trip as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCompleteTrip}>Complete Trip</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Trip Dialog */}
      <EditTripDialog
        trip={{
          id: trip.id,
          departureCity: trip.departureCity,
          destinationCity: trip.destinationCity,
          departureAddress: trip.departureAddress,
          destinationAddress: trip.destinationAddress,
          departureTime: trip.departureTime,
          totalCapacity: trip.totalCapacity,
          price: trip.price,
          status: trip.status,
        }}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onTripUpdated={() => {
          setShowEditDialog(false);
          // Refresh trip data
          window.location.reload();
        }}
      />

      {/* Delete Trip Dialog */}
      <DeleteTripDialog
        trip={{
          id: trip.id,
          departureCity: trip.departureCity,
          destinationCity: trip.destinationCity,
          departureTime: trip.departureTime,
          status: trip.status,
          statistics: trip.statistics,
        }}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onTripDeleted={() => {
          setShowDeleteDialog(false);
          router.push(`/${locale}/drivers/dashboard/trips`);
        }}
      />
    </div>
  );
}
