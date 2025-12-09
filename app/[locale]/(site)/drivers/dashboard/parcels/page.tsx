"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, Search, Package, CheckCircle, Truck, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parcelService, Parcel } from "@/lib/api/parcel-service";
import { StatusBadge } from "@/components/Status-Bagde/status-badge";

export default function ParcelScannerPage() {
    const [scannedId, setScannedId] = useState("");
    const [parcel, setParcel] = useState<Parcel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannedId) return;

        setIsLoading(true);
        setParcel(null);

        try {
            const data = await parcelService.scanParcel(scannedId);
            setParcel(data);
        } catch (error: any) {
            toast({
                title: "Scan Failed",
                description: error.message || "Could not find parcel",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!parcel) return;
        setIsUpdating(true);

        try {
            await parcelService.updateParcelStatus(parcel.id, { status: newStatus });
            setParcel({ ...parcel, status: newStatus as any });
            toast({
                title: "Status Updated",
                description: `Parcel status changed to ${newStatus}`,
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="container py-8 max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Parcel Scanner</h1>
                <p className="text-muted-foreground">Scan or enter tracking number to manage parcels</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Scan Parcel</CardTitle>
                    <CardDescription>Enter the parcel ID or tracking number</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleScan} className="flex gap-4">
                        <div className="relative flex-1">
                            <QrCode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Scan or enter ID..."
                                className="pl-9"
                                value={scannedId}
                                onChange={(e) => setScannedId(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            <span className="ml-2">Scan</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {parcel && (
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Parcel Details</CardTitle>
                            <CardDescription className="font-mono">{parcel.trackingNumber}</CardDescription>
                        </div>
                        <StatusBadge status={parcel.status} />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Sender</p>
                                <p className="font-medium">{parcel.senderName}</p>
                                <p className="text-xs text-muted-foreground">{parcel.pickupAddress}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Receiver</p>
                                <p className="font-medium">{parcel.receiverName}</p>
                                <p className="text-xs text-muted-foreground">{parcel.deliveryAddress}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="font-medium text-sm">Update Status</h4>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isUpdating || parcel.status === 'picked_up'}
                                    onClick={() => handleUpdateStatus('picked_up')}
                                >
                                    <Package className="h-4 w-4 mr-2" />
                                    Pickup
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={isUpdating || parcel.status === 'in_transit'}
                                    onClick={() => handleUpdateStatus('in_transit')}
                                >
                                    <Truck className="h-4 w-4 mr-2" />
                                    In Transit
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={isUpdating || parcel.status === 'delivered'}
                                    onClick={() => handleUpdateStatus('delivered')}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Delivered
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
