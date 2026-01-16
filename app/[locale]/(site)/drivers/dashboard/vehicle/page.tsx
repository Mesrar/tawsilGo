"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "@/app/services/vehicleService";
import { Vehicle } from "@/types/vehicle";
import { RegisterVehicleDialog } from "@/components/drivers/RegisterVehicleDialog";
import { ViewVehicleDialog } from "@/components/drivers/ViewVehicleDialog";
import { EditVehicleDialog, EditVehicleData } from "@/components/drivers/EditVehicleDialog";
import { DeleteVehicleDialog } from "@/components/drivers/DeleteVehicleDialog";
import { VehicleCard } from "@/components/drivers/VehicleCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    RefreshCw,
    Truck,
    Plus,
    Car,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DriverVehiclePage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Dialog states
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        data: vehiclesData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["driver-vehicles"],
        queryFn: () => vehicleService.getCurrentUserVehicles(),
        enabled: !!session?.user,
        retry: false,
    });

    const vehicles: Vehicle[] = vehiclesData?.data?.vehicles || [];

    const handleVehicleRegistered = () => {
        refetch();
    };

    const handleViewVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setViewDialogOpen(true);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setEditDialogOpen(true);
    };

    const handleDeleteVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async (vehicle: Vehicle, reason: string) => {
        try {
            const response = await vehicleService.deleteVehicle(vehicle.id, reason);
            if (response.success) {
                toast({
                    title: "Vehicle deleted",
                    description: `${vehicle.brand} ${vehicle.model} has been removed.`,
                });
                queryClient.invalidateQueries({ queryKey: ["driver-vehicles"] });
            } else {
                throw new Error(response.error?.message || "Failed to delete vehicle");
            }
        } catch (err) {
            console.error("Failed to delete vehicle:", err);
            toast({
                title: "Delete failed",
                description: err instanceof Error ? err.message : "Failed to delete vehicle.",
                variant: "destructive",
            });
            throw err;
        }
    };

    const handleSaveEdit = async (vehicle: Vehicle, data: EditVehicleData) => {
        try {
            const response = await vehicleService.updateVehicle(vehicle.id, {
                type: data.type,
                brand: data.brand,
                model: data.model,
                year: data.year,
                color: data.color,
                licensePlate: data.licensePlate,
                capacity: {
                    weight: { min: 0, max: data.maxWeight },
                    volume: { min: 0, max: 10 },
                    dimensions: { length: 200, width: 150, height: 150 },
                },
            });
            if (response.success) {
                toast({
                    title: "Vehicle updated",
                    description: `${data.brand} ${data.model} has been updated.`,
                });
                queryClient.invalidateQueries({ queryKey: ["driver-vehicles"] });
            } else {
                throw new Error(response.error?.message || "Failed to update vehicle");
            }
        } catch (err) {
            console.error("Failed to update vehicle:", err);
            toast({
                title: "Update failed",
                description: err instanceof Error ? err.message : "Failed to update vehicle.",
                variant: "destructive",
            });
            throw err;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Vehicles</h1>
                        <p className="text-slate-500">Manage your registered vehicles.</p>
                    </div>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="flex justify-between items-center">
                        Failed to load vehicles. Please try again.
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="bg-white/10 hover:bg-white/20 border-white/20 text-white ml-2"
                        >
                            <RefreshCw className="h-3 w-3 mr-1" /> Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Empty state
    if (vehicles.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Vehicles</h1>
                        <p className="text-slate-500">Manage your registered vehicles.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                        <Truck className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No Vehicles Registered
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
                        You need to register at least one vehicle before you can create trips and accept delivery orders.
                    </p>
                    <RegisterVehicleDialog
                        onVehicleRegistered={handleVehicleRegistered}
                        trigger={
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                <Plus className="w-5 h-5" />
                                Register Your First Vehicle
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    // Vehicles list
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Vehicles</h1>
                    <p className="text-slate-500">
                        Manage your registered vehicles. You have {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => refetch()} title="Refresh">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <RegisterVehicleDialog onVehicleRegistered={handleVehicleRegistered} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {vehicles.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onView={handleViewVehicle}
                        onEdit={handleEditVehicle}
                        onDelete={handleDeleteVehicle}
                    />
                ))}
            </div>

            {/* Quick Stats */}
            <DashboardCard title="Vehicle Summary">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
                            <Car className="w-4 h-4" />
                            Total Vehicles
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            {vehicles.length}
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mb-1">
                            Active
                        </div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            {vehicles.filter((v) => v.status === "active" && v.verificationStatus === "verified").length}
                        </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm mb-1">
                            Pending
                        </div>
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                            {vehicles.filter((v) => v.verificationStatus === "pending").length}
                        </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm mb-1">
                            Maintenance
                        </div>
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                            {vehicles.filter((v) => v.status === "maintenance").length}
                        </div>
                    </div>
                </div>
            </DashboardCard>

            {/* Dialogs */}
            <ViewVehicleDialog
                vehicle={selectedVehicle}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
            />

            <EditVehicleDialog
                vehicle={selectedVehicle}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSave={handleSaveEdit}
            />

            <DeleteVehicleDialog
                vehicle={selectedVehicle}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
