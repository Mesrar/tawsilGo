"use client";

import { useState } from "react";
import { QrCode, Package, Search, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { ParcelDetails, checkParcelByTrackingNumber } from "@/app/services/parcelCheckService";
import { motion, AnimatePresence } from "framer-motion";
import { MobileToast } from "./MobileToast";

export default function MobileCheckParcelPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [parcelDetails, setParcelDetails] = useState<ParcelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "qrcode">("manual");
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    description?: string;
    variant: "success" | "error" | "info";
  } | null>(null);

  const showToast = (title: string, description?: string, variant: "success" | "error" | "info" = "info") => {
    setToast({ show: true, title, description, variant });
  };

  const handleManualCheck = async () => {
    if (!trackingNumber.trim()) {
      showToast("Error", "Please enter a valid tracking number", "error");
      return;
    }

    setIsLoading(true);
    const details = await checkParcelByTrackingNumber(trackingNumber);
    
    if (details) {
      setParcelDetails(details);
      showToast("Success", "Parcel information retrieved", "success");
    } else {
      showToast("Error", "Failed to find parcel information", "error");
    }
    
    setIsLoading(false);
  };

  const handleQrScanStart = () => {
    setIsScanning(true);
    // Simulating QR code scanning
    setTimeout(() => {
      const mockTrackingNumber = "QR" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      setTrackingNumber(mockTrackingNumber);
      setIsScanning(false);
      
      // Show toast notification for successful scan
      showToast("QR Code Scanned", `Tracking number: ${mockTrackingNumber}`, "success");
      
      // Automatically check the parcel after scanning
      setIsLoading(true);
      checkParcelByTrackingNumber(mockTrackingNumber).then(details => {
        setParcelDetails(details);
        setIsLoading(false);
      });
    }, 2000);
  };

  const handleStatusUpdate = async (status: "delivered" | "issue" | "picked_up") => {
    if (!parcelDetails) return;
    
    const statusLabel = status === "delivered" 
      ? "Delivered" 
      : status === "issue" 
        ? "Issue Reported" 
        : "Picked Up";
    
    showToast("Status Updated", `Parcel status updated to ${statusLabel}`, "success");
    
    // Update the local state to reflect the new status
    setParcelDetails({
      ...parcelDetails,
      status: statusLabel
    });
  };

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast notifications */}
      {toast && (
        <MobileToast
          open={toast.show}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header - strictly follows 375px viewport width */}
      <div className="bg-white dark:bg-gray-900 py-4">
        <h1 className="text-xl font-semibold text-center">Check Parcel</h1>
      </div>

      {/* Tabs - Accessible touch targets ≥48px */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-4">
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "manual"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab("qrcode")}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "qrcode"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          QR Code Scan
        </button>
      </div>

      {/* Content Area - 8px grid alignment */}
      <AnimatePresence mode="wait">
        {activeTab === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="px-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Enter the tracking number of the parcel you want to check
              </p>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <button
                onClick={handleManualCheck}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {isLoading ? "Checking..." : "Check Parcel"}
                {!isLoading && <Search className="ml-2 h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "qrcode" && (
          <motion.div
            key="qrcode"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Scan the QR code on the parcel to check its details
              </p>
              
              <div className="flex flex-col items-center">
                {isScanning ? (
                  <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4 rounded-lg overflow-hidden">
                    <div className="absolute border-2 border-primary w-48 h-48 animate-pulse rounded-lg"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Scanning...</span>
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center mb-4 rounded-lg">
                    <QrCode className="h-16 w-16 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Position QR code here</span>
                  </div>
                )}
                
                <button
                  onClick={handleQrScanStart}
                  disabled={isScanning || isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {isScanning ? "Scanning..." : isLoading ? "Loading..." : "Start Camera"}
                  {!isScanning && !isLoading && <QrCode className="ml-2 h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parcel Details - Card with 16px padding */}
      <AnimatePresence>
        {parcelDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 px-4 pb-24"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center mb-4">
                <Package className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-lg font-medium">Parcel Details</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Tracking Number</p>
                <p className="text-sm font-medium">{parcelDetails.id}</p>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <motion.div variants={itemVariants} className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="text-sm font-medium">{parcelDetails.status}</p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recipient</p>
                  <p className="text-sm font-medium">{parcelDetails.recipient}</p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Destination</p>
                  <p className="text-sm font-medium">{parcelDetails.destination}</p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Weight</p>
                  <p className="text-sm font-medium">{parcelDetails.weight}</p>
                </motion.div>
              </motion.div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStatusUpdate("picked_up")}
                  className="flex items-center justify-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm Pickup
                </button>
                <button
                  onClick={() => handleStatusUpdate("issue")}
                  className="flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Report Issue
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}