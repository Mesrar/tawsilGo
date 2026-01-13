"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, MapPin, Truck, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { driverService, CreateTripRequest } from "@/lib/api/driver-service";
import { vehicleService } from "@/app/services/vehicleService";
import { Vehicle } from "@/types/vehicle";
import { useToast } from "@/components/ui/use-toast";

interface CreateTripDialogProps {
    onTripCreated?: () => void;
}

export function CreateTripDialog({ onTripCreated }: CreateTripDialogProps) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Fetch driver vehicles using vehicle service
    const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
        queryKey: ['driver-vehicles'],
        queryFn: () => vehicleService.getCurrentUserVehicles(),
        enabled: !!session?.user?.id,
        retry: false
    });

    const vehicles: Vehicle[] = vehiclesData?.data?.vehicles || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        if (!date) {
            toast({
                title: "Date required",
                description: "Please select a departure date.",
                variant: "destructive"
            });
            return;
        }

        // Validate vehicle selection (required)
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!selectedVehicleId || !uuidPattern.test(selectedVehicleId)) {
            toast({
                title: "Vehicle required",
                description: "Please select a vehicle for this trip.",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const time = formData.get("time") as string;
            // Combine date and time to ISO string
            const departureDateTime = new Date(date);
            const [hours, minutes] = time.split(":").map(Number);
            departureDateTime.setHours(hours, minutes);

            const tripData: CreateTripRequest = {
                origin: formData.get("from") as string,
                destination: formData.get("to") as string,
                departureTime: departureDateTime.toISOString(),
                capacity: Number(formData.get("capacity") || 500),
                vehicleId: selectedVehicleId,
                price: {
                    pricePerKg: Number(formData.get("price") || 10),
                    currency: "MAD"
                }
            };

            await driverService.createTrip(tripData);

            toast({
                title: "Trip created",
                description: "Your trip has been successfully scheduled."
            });

            setOpen(false);
            if (onTripCreated) onTripCreated();

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create trip. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset form state when dialog closes
            setSelectedVehicleId("");
            setDate(undefined);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    New Trip
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Trip</DialogTitle>
                    <DialogDescription>
                        Enter the details for your upcoming trip.
                    </DialogDescription>
                </DialogHeader>

                {vehiclesLoading ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm text-muted-foreground">Loading vehicles...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                        <div className="p-3 bg-yellow-50 rounded-full text-yellow-600">
                            <Truck className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">No Vehicle Found</h3>
                            <p className="text-sm text-muted-foreground">
                                You need to register a vehicle before creating a trip.
                            </p>
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => window.location.href = '/drivers/dashboard/vehicle'}
                        >
                            Add Vehicle
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from">From</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input id="from" name="from" placeholder="City" className="pl-9" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="to">To</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input id="to" name="to" placeholder="City" className="pl-9" required />
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
                                <Input id="time" name="time" type="time" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="vehicle">Vehicle</Label>
                            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity (Kg)</Label>
                                <Input id="capacity" name="capacity" type="number" placeholder="500" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price per Kg (MAD)</Label>
                                <Input id="price" name="price" type="number" placeholder="10" step="0.5" required />
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Trip"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
