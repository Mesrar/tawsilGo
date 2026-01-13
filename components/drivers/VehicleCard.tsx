"use client";

import { Vehicle, VehicleStatus } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Car,
    Truck,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Weight,
    Calendar,
    FileCheck,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleCardProps {
    vehicle: Vehicle;
    onView?: (vehicle: Vehicle) => void;
    onEdit?: (vehicle: Vehicle) => void;
    onDelete?: (vehicle: Vehicle) => void;
}

const getVehicleIcon = (type: string) => {
    switch (type) {
        case "motorcycle":
        case "car":
            return <Car className="w-8 h-8" />;
        case "van":
        case "truck":
        case "bus":
            return <Truck className="w-8 h-8" />;
        default:
            return <Car className="w-8 h-8" />;
    }
};

const getStatusBadge = (status: VehicleStatus, verificationStatus: string) => {
    // First check verification status
    if (verificationStatus === "pending") {
        return (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30">
                Pending Verification
            </Badge>
        );
    }
    if (verificationStatus === "rejected") {
        return (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
                Verification Rejected
            </Badge>
        );
    }

    // Then check vehicle status
    switch (status) {
        case "active":
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
                    Active
                </Badge>
            );
        case "inactive":
            return (
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900/30">
                    Inactive
                </Badge>
            );
        case "maintenance":
            return (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30">
                    In Maintenance
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
                    {status}
                </Badge>
            );
    }
};

export function VehicleCard({ vehicle, onView, onEdit, onDelete }: VehicleCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
                <div className="flex items-start gap-4 p-4">
                    {/* Vehicle Icon */}
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        {getVehicleIcon(vehicle.type)}
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                                    {vehicle.licensePlate}
                                </p>
                            </div>
                            {getStatusBadge(vehicle.status, vehicle.verificationStatus)}
                        </div>

                        {/* Details Row */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{vehicle.year}</span>
                            </div>
                            {vehicle.capacity?.weight?.max && (
                                <div className="flex items-center gap-1">
                                    <Weight className="w-3.5 h-3.5" />
                                    <span>{vehicle.capacity.weight.max} kg</span>
                                </div>
                            )}
                            {vehicle.color && (
                                <div className="flex items-center gap-1">
                                    <div
                                        className="w-3 h-3 rounded-full border border-slate-300"
                                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                                    />
                                    <span className="capitalize">{vehicle.color}</span>
                                </div>
                            )}
                            {vehicle.documents?.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    <span>{vehicle.documents.length} docs</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onView && (
                                <DropdownMenuItem onClick={() => onView(vehicle)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </DropdownMenuItem>
                            )}
                            {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {onDelete && (
                                <DropdownMenuItem
                                    onClick={() => onDelete(vehicle)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );
}
