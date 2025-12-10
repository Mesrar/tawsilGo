"use client";

import { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";

interface CreateTripDialogProps {
    onTripCreated?: () => void;
}

export function CreateTripDialog({ onTripCreated }: CreateTripDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

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
                capacity: Number(formData.get("capacity") || 500), // Default 500kg if not set
                vehicleId: formData.get("vehicle") as string,
                price: {
                    pricePerKg: Number(formData.get("price") || 10), // Default 10 MAD/kg
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                        <Select name="vehicle">
                            <SelectTrigger>
                                <SelectValue placeholder="Select vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="v1">Volvo FH16 (WA-12345-AB)</SelectItem>
                                <SelectItem value="v2">Mercedes Actros (KA-98765-CB)</SelectItem>
                                <SelectItem value="v3">Scania R450 (RA-55555-XY)</SelectItem>
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
            </DialogContent>
        </Dialog>
    );
}
