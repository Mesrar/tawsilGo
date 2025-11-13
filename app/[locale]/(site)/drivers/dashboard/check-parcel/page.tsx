"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Package, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  ParcelDetails, 
  checkParcelByTrackingNumber,
  updateParcelStatus 
} from "@/app/services/parcelCheckService";
import QrScanner from "@/components/Driver/QrScanner";

export default function CheckParcelPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [parcelDetails, setParcelDetails] = useState<ParcelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const handleManualCheck = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid tracking number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const details = await checkParcelByTrackingNumber(trackingNumber);
    setParcelDetails(details);
    setIsLoading(false);
  };

  const handleQrScanStart = () => {
    setIsScanning(true);
  };

  const handleQrScanCancel = () => {
    setIsScanning(false);
  };

  const handleQrScanSuccess = async (scannedTrackingNumber: string) => {
    setTrackingNumber(scannedTrackingNumber);
    setIsScanning(false);
    
    // Show toast notification for successful scan
    toast({
      title: "QR Code Scanned",
      description: `Tracking number: ${scannedTrackingNumber}`,
    });
    
    // Automatically check the parcel after scanning
    setIsLoading(true);
    const details = await checkParcelByTrackingNumber(scannedTrackingNumber);
    setParcelDetails(details);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (status: "delivered" | "issue" | "picked_up") => {
    if (!parcelDetails) return;
    
    setIsUpdatingStatus(true);
    const success = await updateParcelStatus(parcelDetails.id, status);
    if (success && parcelDetails) {
      // Update the local state to reflect the new status
      setParcelDetails({
        ...parcelDetails,
        status: status === "delivered" 
          ? "Delivered" 
          : status === "issue" 
            ? "Issue Reported" 
            : "Picked Up"
      });
    }
    setIsUpdatingStatus(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Check Parcel</h1>
      
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="qrcode">QR Code Scan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Enter Tracking Number</CardTitle>
              <CardDescription>
                Type the tracking number of the parcel you want to check
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter tracking number" 
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  onClick={handleManualCheck} 
                  disabled={isLoading}
                >
                  {isLoading ? "Checking..." : "Check"}
                  {!isLoading && <Search className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qrcode">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>
                Scan the QR code on the parcel to check its details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isScanning ? (
                <QrScanner 
                  isScanning={isScanning}
                  onScanSuccess={handleQrScanSuccess} 
                  onCancel={handleQrScanCancel} 
                />
              ) : (
                <>
                  <div className="w-64 h-64 bg-gray-100 flex flex-col items-center justify-center mb-4">
                    <QrCode className="h-24 w-24 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">QR code preview area</span>
                  </div>
                  
                  <Button 
                    onClick={handleQrScanStart} 
                    disabled={isLoading}
                    className="mt-4"
                  >
                    {isLoading ? "Loading..." : "Start Scanning"}
                    {!isLoading && <QrCode className="ml-2 h-4 w-4" />}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {parcelDetails && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Parcel Details
            </CardTitle>
            <CardDescription>
              Information about tracking #{parcelDetails.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(parcelDetails).map(([key, value]) => (
                key !== 'id' && (
                  <div key={key} className="border-t pt-4">
                    <dt className="font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                    <dd className="mt-1 text-gray-900">{value}</dd>
                  </div>
                )
              ))}
            </dl>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStatusUpdate("delivered")}
                disabled={isUpdatingStatus}
              >
                Mark as Delivered
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleStatusUpdate("issue")}
                disabled={isUpdatingStatus}
              >
                Report Issue
              </Button>
              <Button 
                onClick={() => handleStatusUpdate("picked_up")}
                disabled={isUpdatingStatus}
              >
                Confirm Pickup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}