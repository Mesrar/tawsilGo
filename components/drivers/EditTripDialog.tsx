"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { vehicleService } from "@/app/services/vehicleService";
import { Vehicle } from "@/types/vehicle";
import { useToast } from "@/components/ui/use-toast";

interface TripData {
  id: string;
  departureCity: string;
  destinationCity: string;
  departureAddress?: string;
  destinationAddress?: string;
  departureTime: string;
  totalCapacity: number;
  price: {
    basePrice: number;
    pricePerKg: number;
    currency: string;
  };
  vehicleId?: string;
  status: string;
}

interface EditTripDialogProps {
  trip: TripData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTripUpdated?: () => void;
}

export function EditTripDialog({
  trip,
  open,
  onOpenChange,
  onTripUpdated,
}: EditTripDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();

  // Form state
  const [from, setFrom] = useState(trip.departureCity || "");
  const [to, setTo] = useState(trip.destinationCity || "");
  const [date, setDate] = useState<Date | undefined>(
    trip.departureTime ? new Date(trip.departureTime) : undefined
  );
  const [time, setTime] = useState(
    trip.departureTime
      ? format(new Date(trip.departureTime), "HH:mm")
      : ""
  );
  const [capacity, setCapacity] = useState(trip.totalCapacity?.toString() || "500");
  const [pricePerKg, setPricePerKg] = useState(
    trip.price?.pricePerKg?.toString() || "10"
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState(trip.vehicleId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when trip changes
  useEffect(() => {
    if (trip) {
      setFrom(trip.departureCity || trip.departureAddress || "");
      setTo(trip.destinationCity || trip.destinationAddress || "");
      setDate(trip.departureTime ? new Date(trip.departureTime) : undefined);
      setTime(
        trip.departureTime
          ? format(new Date(trip.departureTime), "HH:mm")
          : ""
      );
      setCapacity(trip.totalCapacity?.toString() || "500");
      setPricePerKg(trip.price?.pricePerKg?.toString() || "10");
      setSelectedVehicleId(trip.vehicleId || "");
    }
  }, [trip]);

  // Fetch driver vehicles
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["driver-vehicles"],
    queryFn: () => vehicleService.getCurrentUserVehicles(),
    enabled: !!session?.user?.id && open,
    retry: false,
  });

  const vehicles: Vehicle[] = vehiclesData?.data?.vehicles || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a departure date.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Combine date and time
      const departureDateTime = new Date(date);
      const [hours, minutes] = time.split(":").map(Number);
      departureDateTime.setHours(hours, minutes);

      const updateData = {
        origin: from,
        destination: to,
        departureTime: departureDateTime.toISOString(),
        capacity: Number(capacity),
        vehicleId: selectedVehicleId || undefined,
        price: {
          pricePerKg: Number(pricePerKg),
          currency: "MAD",
        },
      };

      const response = await fetch(`/api/driver/trips/${trip.id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update trip");
      }

      toast({
        title: "Trip updated",
        description: "Your trip has been successfully updated.",
      });

      onOpenChange(false);
      if (onTripUpdated) onTripUpdated();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update trip.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if trip can be edited (only scheduled trips)
  const canEdit = trip.status.toLowerCase() === "scheduled";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>
            {canEdit
              ? "Update the details for your trip."
              : "This trip cannot be edited because it's already in progress or completed."}
          </DialogDescription>
        </DialogHeader>

        {!canEdit ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              Only scheduled trips can be edited.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : vehiclesLoading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="City"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="City"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal pl-3",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {vehicles.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select
                  value={selectedVehicleId}
                  onValueChange={setSelectedVehicleId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v: Vehicle) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Kg)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Kg (MAD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  placeholder="10"
                  step="0.5"
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
