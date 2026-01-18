"use client";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  MapPin,
  Search,
  Calendar,
  ChevronRight,
  Clock,
  Truck,
  RefreshCw,
  AlertCircle,
  Navigation,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateTripDialog } from "@/components/drivers/CreateTripDialog";
import { EditTripDialog } from "@/components/drivers/EditTripDialog";
import { DeleteTripDialog } from "@/components/drivers/DeleteTripDialog";
import { useEffect, useState } from "react";
import { driverService, Trip } from "@/lib/api/driver-service";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Extended trip data for dialogs
interface TripWithDetails extends Trip {
  departureCity?: string;
  destinationCity?: string;
  departureAddress?: string;
  destinationAddress?: string;
  totalCapacity?: number;
  remainingCapacity?: number;
  vehicleId?: string;
  priceDetails?: {
    basePrice: number;
    pricePerKg: number;
    currency: string;
  };
  statistics?: {
    totalBookings: number;
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
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

// Mobile Trip Card Component
function TripCard({
  trip,
  locale,
  onEdit,
  onDelete,
}: {
  trip: TripWithDetails;
  locale: string;
  onEdit: (trip: TripWithDetails) => void;
  onDelete: (trip: TripWithDetails) => void;
}) {
  const departureDate = new Date(trip.departureTime);
  const router = useRouter();
  const isScheduled = trip.status === "scheduled";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Header with Status and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push(`/${locale}/drivers/dashboard/trips/${trip.id}`)}
        >
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            #{trip.id.substring(0, 8)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(trip.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/${locale}/drivers/dashboard/trips/${trip.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(trip)}
                disabled={!isScheduled}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Trip
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(trip)}
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

      {/* Route - Clickable */}
      <div
        className="space-y-2 mb-4 cursor-pointer"
        onClick={() => router.push(`/${locale}/drivers/dashboard/trips/${trip.id}`)}
      >
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {trip.fromLocation || "Origin not set"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-4">
              {trip.toLocation || "Destination not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div
        className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700 cursor-pointer"
        onClick={() => router.push(`/${locale}/drivers/dashboard/trips/${trip.id}`)}
      >
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{departureDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {departureDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}

// Desktop Table Row Component
function TripTableRow({
  trip,
  locale,
  onEdit,
  onDelete,
}: {
  trip: TripWithDetails;
  locale: string;
  onEdit: (trip: TripWithDetails) => void;
  onDelete: (trip: TripWithDetails) => void;
}) {
  const departureDate = new Date(trip.departureTime);
  const isScheduled = trip.status === "scheduled";

  return (
    <tr className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
            <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            <span className="truncate max-w-[150px]">
              {trip.fromLocation || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
            <Navigation className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="truncate max-w-[150px]">
              {trip.toLocation || "N/A"}
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1">
            #{trip.id.substring(0, 8)}
          </span>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4">
        <div className="flex flex-col text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{departureDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {departureDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-4 text-slate-600 dark:text-slate-400">
        {trip.duration || "--"}
      </td>
      <td className="px-4 lg:px-6 py-4">{getStatusBadge(trip.status)}</td>
      <td className="px-4 lg:px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/drivers/dashboard/trips/${trip.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(trip)}
              disabled={!isScheduled}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Trip
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(trip)}
              className="text-red-600 focus:text-red-600"
              disabled={!isScheduled}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Trip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default function DriverTripsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [trips, setTrips] = useState<TripWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit/Delete dialog state
  const [editTrip, setEditTrip] = useState<TripWithDetails | null>(null);
  const [deleteTrip, setDeleteTrip] = useState<TripWithDetails | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      // Fetch trips with extended data
      const response = await fetch("/api/driver/trips?limit=100");
      const data = await response.json();

      if (data.success && data.trips) {
        // Map API response to our interface
        const mappedTrips: TripWithDetails[] = data.trips.map((t: any) => ({
          id: t.id,
          fromLocation: t.origin,
          toLocation: t.destination,
          departureTime: t.departure_time,
          arrivalTime: t.arrival_time,
          status: t.status,
          price: t.price,
          stops: t.stops || [],
          departureCity: t.departure_city,
          destinationCity: t.destination_city,
          departureAddress: t.departure_address,
          destinationAddress: t.destination_address,
          totalCapacity: t.total_capacity,
          remainingCapacity: t.remaining_capacity,
          vehicleId: t.vehicle_id,
          priceDetails: t.price_details,
          statistics: t.statistics,
        }));
        setTrips(mappedTrips);
      } else {
        setTrips([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch trips", err);
      setError("Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchTrips();
    }
  }, [session]);

  const handleTripCreated = () => {
    fetchTrips();
  };

  const handleTripUpdated = () => {
    fetchTrips();
    setEditTrip(null);
  };

  const handleTripDeleted = () => {
    fetchTrips();
    setDeleteTrip(null);
  };

  const handleEdit = (trip: TripWithDetails) => {
    setEditTrip(trip);
  };

  const handleDelete = (trip: TripWithDetails) => {
    setDeleteTrip(trip);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Trips
            </h1>
            <p className="text-slate-500">
              View and manage your scheduled deliveries.
            </p>
          </div>
          <CreateTripDialog onTripCreated={handleTripCreated} />
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTrips}
              className="ml-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Trips
          </h1>
          <p className="text-slate-500 text-sm">
            {trips.length > 0
              ? `You have ${trips.length} trip${trips.length !== 1 ? "s" : ""}`
              : "View and manage your scheduled deliveries."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchTrips} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <CreateTripDialog onTripCreated={handleTripCreated} />
        </div>
      </div>

      {/* Search & Filters - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search trips..." className="pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Calendar className="w-4 h-4 mr-2" /> Date
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <Truck className="w-4 h-4 mr-2" /> Status
          </Button>
        </div>
      </div>

      {/* Trips List */}
      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Truck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Trips Yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-sm">
            Create your first trip to start accepting delivery bookings from
            customers.
          </p>
          <CreateTripDialog onTripCreated={handleTripCreated} />
        </div>
      ) : (
        <>
          {/* Mobile: Card Layout */}
          <div className="md:hidden space-y-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Desktop: Table Layout */}
          <DashboardCard
            title="Upcoming & Past Trips"
            className="hidden md:block p-0 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-4 lg:px-6 py-4">Route</th>
                    <th className="px-4 lg:px-6 py-4">Date & Time</th>
                    <th className="px-4 lg:px-6 py-4">Duration</th>
                    <th className="px-4 lg:px-6 py-4">Status</th>
                    <th className="px-4 lg:px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <TripTableRow
                      key={trip.id}
                      trip={trip}
                      locale={locale}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </>
      )}

      {/* Edit Trip Dialog */}
      {editTrip && (
        <EditTripDialog
          trip={{
            id: editTrip.id,
            departureCity: editTrip.departureCity || editTrip.fromLocation?.split(",")[0] || "",
            destinationCity: editTrip.destinationCity || editTrip.toLocation?.split(",")[0] || "",
            departureAddress: editTrip.departureAddress,
            destinationAddress: editTrip.destinationAddress,
            departureTime: editTrip.departureTime,
            totalCapacity: editTrip.totalCapacity || 500,
            price: editTrip.priceDetails || {
              basePrice: editTrip.price || 0,
              pricePerKg: 10,
              currency: "MAD",
            },
            vehicleId: editTrip.vehicleId,
            status: editTrip.status,
          }}
          open={!!editTrip}
          onOpenChange={(open) => !open && setEditTrip(null)}
          onTripUpdated={handleTripUpdated}
        />
      )}

      {/* Delete Trip Dialog */}
      {deleteTrip && (
        <DeleteTripDialog
          trip={{
            id: deleteTrip.id,
            departureCity: deleteTrip.departureCity || deleteTrip.fromLocation?.split(",")[0] || "",
            destinationCity: deleteTrip.destinationCity || deleteTrip.toLocation?.split(",")[0] || "",
            departureTime: deleteTrip.departureTime,
            status: deleteTrip.status,
            statistics: deleteTrip.statistics,
          }}
          open={!!deleteTrip}
          onOpenChange={(open) => !open && setDeleteTrip(null)}
          onTripDeleted={handleTripDeleted}
        />
      )}
    </div>
  );
}
