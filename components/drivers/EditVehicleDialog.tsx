"use client";

import { useState, useEffect } from "react";
import { Vehicle, VehicleType } from "@/types/vehicle";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Loader2, Car, Truck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditVehicleDialogProps {
    vehicle: Vehicle | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (vehicle: Vehicle, data: EditVehicleData) => Promise<void>;
}

export interface EditVehicleData {
    type: VehicleType;
    brand: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    maxWeight: number;
}

const VEHICLE_TYPES: { value: VehicleType; label: string; icon: React.ReactNode }[] = [
    { value: "motorcycle", label: "Motorcycle", icon: <Car className="w-4 h-4" /> },
    { value: "car", label: "Car", icon: <Car className="w-4 h-4" /> },
    { value: "van", label: "Van", icon: <Truck className="w-4 h-4" /> },
    { value: "truck", label: "Truck", icon: <Truck className="w-4 h-4" /> },
    { value: "bus", label: "Bus", icon: <Truck className="w-4 h-4" /> },
];

export function EditVehicleDialog({
    vehicle,
    open,
    onOpenChange,
    onSave,
}: EditVehicleDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [vehicleType, setVehicleType] = useState<VehicleType>("car");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [color, setColor] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [maxWeight, setMaxWeight] = useState<number>(500);

    // Populate form when vehicle changes
    useEffect(() => {
        if (vehicle) {
            setVehicleType(vehicle.type as VehicleType);
            setBrand(vehicle.brand || "");
            setModel(vehicle.model || "");
            setYear(vehicle.year || new Date().getFullYear());
            setColor(vehicle.color || "");
            setLicensePlate(vehicle.licensePlate || "");
            setMaxWeight(vehicle.capacity?.weight?.max || 500);
            setError(null);
        }
    }, [vehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!vehicle) return;

        // Validation
        if (!brand.trim()) {
            setError("Brand is required");
            return;
        }
        if (!model.trim()) {
            setError("Model is required");
            return;
        }
        if (!licensePlate.trim()) {
            setError("License plate is required");
            return;
        }

        try {
            setIsSubmitting(true);
            await onSave(vehicle, {
                type: vehicleType,
                brand: brand.trim(),
                model: model.trim(),
                year,
                color: color.trim(),
                licensePlate: licensePlate.trim().toUpperCase(),
                maxWeight,
            });
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update vehicle");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!vehicle) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Vehicle</DialogTitle>
                    <DialogDescription>
                        Update your vehicle information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-type">Vehicle Type</Label>
                            <Select value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)}>
                                <SelectTrigger id="edit-type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {VEHICLE_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            <div className="flex items-center gap-2">
                                                {type.icon}
                                                {type.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-brand">Brand *</Label>
                            <Input
                                id="edit-brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="e.g., Toyota"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-model">Model *</Label>
                            <Input
                                id="edit-model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="e.g., Hiace"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-year">Year</Label>
                            <Input
                                id="edit-year"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                                min={1990}
                                max={new Date().getFullYear() + 1}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-color">Color</Label>
                            <Input
                                id="edit-color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                placeholder="e.g., White"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-licensePlate">License Plate *</Label>
                            <Input
                                id="edit-licensePlate"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                                placeholder="e.g., 12345-A-67"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-maxWeight">Max Capacity (kg)</Label>
                        <Input
                            id="edit-maxWeight"
                            type="number"
                            value={maxWeight}
                            onChange={(e) => setMaxWeight(parseInt(e.target.value) || 500)}
                            min={50}
                            max={50000}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
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
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
