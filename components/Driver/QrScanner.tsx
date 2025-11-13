"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QrScannerProps {
  onScanSuccess: (result: string) => void;
  onCancel: () => void;
  isScanning: boolean;
}

export default function QrScanner({ onScanSuccess, onCancel, isScanning }: QrScannerProps) {
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "pending">("pending");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // In a real implementation, this would use a library like react-qr-reader
  // Here we're just simulating the process
  useEffect(() => {
    if (isScanning) {
      // Simulate asking for camera permission
      setTimeout(() => {
        // For demo purposes, we'll assume permission is granted
        setCameraPermission("granted");
        
        // Simulate scanning process
        setTimeout(() => {
          const mockTrackingNumber = "QR" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          onScanSuccess(mockTrackingNumber);
        }, 3000);
      }, 1000);
    } else {
      setCameraPermission("pending");
      setErrorMessage(null);
    }
    
    return () => {
      // Cleanup function
    };
  }, [isScanning, onScanSuccess]);
  
  if (!isScanning) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Scan QR Code
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {cameraPermission === "pending" && (
          <div className="text-center py-4">
            <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-pulse" />
            <p className="text-sm text-gray-500">Requesting camera permission...</p>
          </div>
        )}
        
        {cameraPermission === "denied" && (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-4">
              Camera permission denied. Please allow camera access to scan QR codes.
            </p>
            <Button onClick={() => setCameraPermission("pending")}>
              Try Again
            </Button>
          </div>
        )}
        
        {cameraPermission === "granted" && (
          <div className="relative">
            <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center mb-4">
              <div className="absolute border-2 border-primary w-48 h-48 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6/12 h-[2px] bg-red-500 animate-pulse"></div>
              <span className="text-sm text-gray-500">Scanning...</span>
            </div>
            
            {errorMessage && (
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
            )}
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              Position the QR code within the frame to scan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}