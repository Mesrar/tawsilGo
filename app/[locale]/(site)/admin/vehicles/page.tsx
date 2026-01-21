"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { adminService, Vehicle } from "@/lib/api/admin-service";
import { useToast } from "@/components/ui/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Truck,
    Search,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    FileText,
    Loader2,
    Filter
} from "lucide-react";
import { format } from "date-fns";

export default function AdminVehiclesPage() {
    const { toast } = useToast();
    const t = useTranslations("admin");

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Verification state
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [verifyAction, setVerifyAction] = useState<'verified' | 'rejected'>('verified');
    const [verifyNotes, setVerifyNotes] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchVehicles = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getVehicles();
            setVehicles(data);
        } catch (err) {
            console.error(err);
            toast({
                title: "Error",
                description: "Failed to load vehicles",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleVerifyClick = (vehicle: Vehicle, action: 'verified' | 'rejected') => {
        setSelectedVehicle(vehicle);
        setVerifyAction(action);
        setVerifyNotes("");
        setIsVerifyDialogOpen(true);
    };

    const handleConfirmVerify = async () => {
        if (!selectedVehicle) return;

        try {
            setIsProcessing(true);
            await adminService.verifyVehicle(selectedVehicle.id, {
                status: verifyAction,
                notes: verifyNotes
            });

            toast({
                title: verifyAction === 'verified' ? "Vehicle Verified" : "Vehicle Rejected",
                description: `Vehicle ${selectedVehicle.plateNumber} has been ${verifyAction}.`
            });

            setIsVerifyDialogOpen(false);
            fetchVehicles();
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update vehicle status",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch =
            vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>;
            case "verification_pending":
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending Review</Badge>;
            case "pending":
                return <Badge variant="outline" className="text-slate-500">Incomplete</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
                    <p className="text-muted-foreground">Manage fleet vehicles and verifications</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Management</CardTitle>
                    <CardDescription>
                        View and verify driver vehicles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search plate, model, or driver..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={statusFilter === "all" ? "default" : "outline"}
                                onClick={() => setStatusFilter("all")}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                variant={statusFilter === "verification_pending" ? "default" : "outline"}
                                onClick={() => setStatusFilter("verification_pending")}
                                size="sm"
                                className={statusFilter === "verification_pending" ? "bg-amber-600 hover:bg-amber-700" : ""}
                            >
                                Pending Review
                            </Button>
                            <Button
                                variant={statusFilter === "verified" ? "default" : "outline"}
                                onClick={() => setStatusFilter("verified")}
                                size="sm"
                                className={statusFilter === "verified" ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                Verified
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vehicle Info</TableHead>
                                    <TableHead>Plate Number</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Registered</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <div className="flex justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredVehicles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No vehicles found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg">
                                                        <Truck className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                                                        <div className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.type}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono">{vehicle.plateNumber}</TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{vehicle.driverName}</div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(vehicle.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => window.location.href = `/admin/drivers/${vehicle.driverId}`}>
                                                            View Driver Profile
                                                        </DropdownMenuItem>
                                                        {vehicle.status !== 'verified' && (
                                                            <DropdownMenuItem
                                                                className="text-green-600"
                                                                onClick={() => handleVerifyClick(vehicle, 'verified')}
                                                            >
                                                                Verify Vehicle
                                                            </DropdownMenuItem>
                                                        )}
                                                        {vehicle.status !== 'rejected' && (
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleVerifyClick(vehicle, 'rejected')}
                                                            >
                                                                Reject Vehicle
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {verifyAction === 'verified' ? 'Verify Vehicle' : 'Reject Vehicle'}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {verifyAction} the vehicle <span className="font-semibold">{selectedVehicle?.plateNumber}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="notes" className="mb-2 block">
                            Notes (Optional)
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder={verifyAction === 'verified' ? "Vehicle inspected and approved..." : "Reason for rejection..."}
                            value={verifyNotes}
                            onChange={(e) => setVerifyNotes(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsVerifyDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmVerify}
                            disabled={isProcessing}
                            variant={verifyAction === 'verified' ? 'default' : 'destructive'}
                            className={verifyAction === 'verified' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {isProcessing && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm {verifyAction === 'verified' ? 'Verification' : 'Rejection'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
