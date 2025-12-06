"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { adminService, Driver } from "@/lib/api/admin-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    Loader2,
    ArrowLeft,
    CheckCircle,
    XCircle,
    ShieldCheck,
    User,
    Car,
    FileText,
    AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function DriverDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const t = useTranslations("admin");

    const [driver, setDriver] = useState<Driver | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [verifyNotes, setVerifyNotes] = useState("");
    const [statusReason, setStatusReason] = useState("");
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    const driverId = params.id as string;

    useEffect(() => {
        if (driverId) {
            fetchDriver();
        }
    }, [driverId]);

    const fetchDriver = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getDriver(driverId);
            setDriver(data);
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to load driver details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setIsProcessing(true);
            await adminService.verifyDriver(driverId, {
                is_verified: true,
                notes: verifyNotes || "Verified by admin"
            });

            toast({
                title: "Success",
                description: "Driver verified successfully",
            });

            setIsVerifyDialogOpen(false);
            fetchDriver(); // Refresh data
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to verify driver",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleStatusChange = async (isActive: boolean) => {
        try {
            setIsProcessing(true);
            await adminService.setDriverStatus(driverId, {
                is_active: isActive,
                reason: statusReason || (isActive ? "Activated by admin" : "Deactivated by admin")
            });

            toast({
                title: "Success",
                description: `Driver ${isActive ? 'activated' : 'deactivated'} successfully`,
            });

            setIsStatusDialogOpen(false);
            fetchDriver(); // Refresh data
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to update driver status",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-lg text-slate-500 mb-4">Driver not found</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {driver.firstName} {driver.lastName}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        ID: {driver.id}
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    {driver.isVerified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 px-3 py-1">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Unverified
                        </Badge>
                    )}

                    {driver.status === 'active' ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
                            Active
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="px-3 py-1">
                            Inactive
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-slate-500">Email</Label>
                                    <p className="font-medium">{driver.email}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Phone</Label>
                                    <p className="font-medium">{driver.phone}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-500">Joined Date</Label>
                                    <p className="font-medium">
                                        {driver.createdAt ? format(new Date(driver.createdAt), "PPP") : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5 text-purple-500" />
                                Vehicle & License
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-slate-500">Vehicle Type</Label>
                                    <p className="font-medium capitalize">{driver.vehicleType || "Not specified"}</p>
                                </div>
                                <div>
                                    <Label className="text-slate-500">License Number</Label>
                                    <p className="font-medium">{driver.licenseNumber || "Not provided"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                            <CardDescription>Manage driver status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Verification Action */}
                            {!driver.isVerified && (
                                <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Verify Driver
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Verify Driver</DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to verify this driver? This will allow them to start accepting jobs.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Label htmlFor="notes" className="mb-2 block">Verification Notes</Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="e.g., Documents checked and approved"
                                                value={verifyNotes}
                                                onChange={(e) => setVerifyNotes(e.target.value)}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>Cancel</Button>
                                            <Button onClick={handleVerify} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
                                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Confirm Verification
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}

                            {/* Status Action */}
                            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant={driver.status === 'active' ? "destructive" : "default"}
                                        className="w-full"
                                    >
                                        {driver.status === 'active' ? (
                                            <>
                                                <XCircle className="w-4 h-4 mr-2" /> Deactivate Driver
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" /> Activate Driver
                                            </>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {driver.status === 'active' ? "Deactivate Driver" : "Activate Driver"}
                                        </DialogTitle>
                                        <DialogDescription>
                                            {driver.status === 'active'
                                                ? "This will prevent the driver from accessing the platform."
                                                : "This will restore the driver's access to the platform."}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label htmlFor="reason" className="mb-2 block">Reason</Label>
                                        <Textarea
                                            id="reason"
                                            placeholder="Reason for status change..."
                                            value={statusReason}
                                            onChange={(e) => setStatusReason(e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
                                        <Button
                                            onClick={() => handleStatusChange(driver.status !== 'active')}
                                            disabled={isProcessing}
                                            variant={driver.status === 'active' ? "destructive" : "default"}
                                        >
                                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Confirm
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
