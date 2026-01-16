"use client";

import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Car, Truck } from "lucide-react";

interface DeleteVehicleDialogProps {
    vehicle: Vehicle | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (vehicle: Vehicle, reason: string) => Promise<void>;
}

const getVehicleIcon = (type: string) => {
    switch (type) {
        case "motorcycle":
        case "car":
            return <Car className="w-6 h-6" />;
        default:
            return <Truck className="w-6 h-6" />;
    }
};

export function DeleteVehicleDialog({
    vehicle,
    open,
    onOpenChange,
    onConfirm,
}: DeleteVehicleDialogProps) {
    const [reason, setReason] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    if (!vehicle) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(vehicle, reason || "User requested deletion");
            setReason("");
            onOpenChange(false);
        } catch (error) {
            // Error handling is done in the parent component
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setReason("");
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Vehicle
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <p>
                                Are you sure you want to delete this vehicle? This action cannot be undone.
                            </p>

                            {/* Vehicle Info */}
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400">
                                    {getVehicleIcon(vehicle.type)}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {vehicle.brand} {vehicle.model}
                                    </div>
                                    <div className="text-sm text-slate-500 font-mono">
                                        {vehicle.licensePlate}
                                    </div>
                                </div>
                            </div>

                            {/* Reason Input */}
                            <div className="space-y-2">
                                <Label htmlFor="delete-reason" className="text-slate-700 dark:text-slate-300">
                                    Reason for deletion (optional)
                                </Label>
                                <Input
                                    id="delete-reason"
                                    placeholder="e.g., Sold the vehicle, No longer in use..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    disabled={isDeleting}
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Vehicle"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
