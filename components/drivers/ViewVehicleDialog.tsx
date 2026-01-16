"use client";

import { Vehicle } from "@/types/vehicle";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Car,
    Truck,
    Calendar,
    Weight,
    Palette,
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
} from "lucide-react";

interface ViewVehicleDialogProps {
    vehicle: Vehicle | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const getVehicleIcon = (type: string) => {
    switch (type) {
        case "motorcycle":
        case "car":
            return <Car className="w-12 h-12" />;
        case "van":
        case "truck":
        case "bus":
            return <Truck className="w-12 h-12" />;
        default:
            return <Car className="w-12 h-12" />;
    }
};

const getStatusBadge = (status: string, verificationStatus: string) => {
    if (verificationStatus === "pending") {
        return (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Clock className="w-3 h-3 mr-1" />
                Pending Verification
            </Badge>
        );
    }
    if (verificationStatus === "rejected") {
        return (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                <XCircle className="w-3 h-3 mr-1" />
                Rejected
            </Badge>
        );
    }
    if (status === "active") {
        return (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Active
            </Badge>
        );
    }
    if (status === "maintenance") {
        return (
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Maintenance
            </Badge>
        );
    }
    return (
        <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400">
            {status}
        </Badge>
    );
};

export function ViewVehicleDialog({ vehicle, open, onOpenChange }: ViewVehicleDialogProps) {
    if (!vehicle) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Vehicle Details</DialogTitle>
                    <DialogDescription>
                        Complete information about your registered vehicle.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header with icon and status */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                            {getVehicleIcon(vehicle.type)}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                {vehicle.brand} {vehicle.model}
                            </h3>
                            <p className="text-lg font-mono text-slate-600 dark:text-slate-400">
                                {vehicle.licensePlate}
                            </p>
                            <div className="mt-2">
                                {getStatusBadge(vehicle.status, vehicle.verificationStatus)}
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                <Car className="w-3.5 h-3.5" />
                                Vehicle Type
                            </div>
                            <div className="font-medium text-slate-900 dark:text-white capitalize">
                                {vehicle.type}
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Year
                            </div>
                            <div className="font-medium text-slate-900 dark:text-white">
                                {vehicle.year}
                            </div>
                        </div>

                        {vehicle.color && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                    <Palette className="w-3.5 h-3.5" />
                                    Color
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border border-slate-300"
                                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                                    />
                                    <span className="font-medium text-slate-900 dark:text-white capitalize">
                                        {vehicle.color}
                                    </span>
                                </div>
                            </div>
                        )}

                        {vehicle.capacity?.weight?.max && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                    <Weight className="w-3.5 h-3.5" />
                                    Max Capacity
                                </div>
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {vehicle.capacity.weight.max} kg
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Documents Section */}
                    {vehicle.documents && vehicle.documents.length > 0 && (
                        <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Documents ({vehicle.documents.length})
                            </h4>
                            <div className="space-y-2">
                                {vehicle.documents.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2"
                                    >
                                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                                            {doc.type?.replace(/_/g, ' ') || 'Document'}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {doc.status || 'uploaded'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="border-t pt-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex justify-between">
                            <span>Registered</span>
                            <span>{new Date(vehicle.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span>Last Updated</span>
                            <span>{new Date(vehicle.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
