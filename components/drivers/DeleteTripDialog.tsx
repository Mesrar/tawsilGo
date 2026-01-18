"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, MapPin, Calendar, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface TripData {
  id: string;
  departureCity: string;
  destinationCity: string;
  departureTime: string;
  status: string;
  statistics?: {
    totalBookings: number;
  };
}

interface DeleteTripDialogProps {
  trip: TripData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTripDeleted?: () => void;
}

export function DeleteTripDialog({
  trip,
  open,
  onOpenChange,
  onTripDeleted,
}: DeleteTripDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/driver/trips/${trip.id}/delete`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete trip");
      }

      toast({
        title: "Trip deleted",
        description: "Your trip has been successfully deleted.",
      });

      onOpenChange(false);
      if (onTripDeleted) onTripDeleted();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete trip.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if trip can be deleted
  const status = trip.status.toLowerCase();
  const hasBookings = (trip.statistics?.totalBookings || 0) > 0;
  const canDelete = status === "scheduled" && !hasBookings;

  const departureDate = trip.departureTime
    ? new Date(trip.departureTime)
    : null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Trip?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {!canDelete ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    This trip cannot be deleted
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {hasBookings
                      ? "This trip has active bookings. Please cancel all bookings first."
                      : "Only scheduled trips can be deleted."}
                  </p>
                </div>
              ) : (
                <>
                  <p>
                    Are you sure you want to delete this trip? This action cannot
                    be undone.
                  </p>

                  {/* Trip Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{trip.departureCity}</span>
                      </div>
                      <span className="text-slate-400">→</span>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{trip.destinationCity}</span>
                      </div>
                    </div>

                    {departureDate && (
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(departureDate, "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{format(departureDate, "p")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Trip"
              )}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
