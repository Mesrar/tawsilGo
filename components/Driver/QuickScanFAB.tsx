"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QrCode, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface QuickScanFABProps {
  show?: boolean;
  onScan?: () => void;
  className?: string;
}

export function QuickScanFAB({ show = true, onScan, className }: QuickScanFABProps) {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const router = useRouter();

  if (!show) return null;

  const handleQuickScan = () => {
    if (onScan) {
      onScan();
    } else {
      router.push("/drivers/dashboard/check-parcel?tab=qr");
    }
    setShowQuickMenu(false);
  };

  const handleManualEntry = () => {
    router.push("/drivers/dashboard/check-parcel?tab=manual");
    setShowQuickMenu(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        size="lg"
        className={cn(
          "fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-2xl md:bottom-6",
          "hover:scale-110 active:scale-95 transition-all duration-200",
          "bg-primary hover:bg-primary/90",
          className
        )}
        onClick={() => setShowQuickMenu(true)}
        aria-label="Quick scan parcel"
      >
        <QrCode className="h-6 w-6" />
      </Button>

      {/* Quick Action Dialog */}
      <Dialog open={showQuickMenu} onOpenChange={setShowQuickMenu}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Quick Scan
            </DialogTitle>
            <DialogDescription>
              Choose how you want to check the parcel
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <Button
              size="lg"
              className="h-auto flex-col gap-2 py-6"
              onClick={handleQuickScan}
            >
              <Camera className="h-8 w-8" />
              <div className="text-center">
                <p className="font-semibold">Scan QR Code</p>
                <p className="text-xs opacity-90">Use camera to scan parcel QR code</p>
              </div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-auto flex-col gap-2 py-6"
              onClick={handleManualEntry}
            >
              <QrCode className="h-8 w-8" />
              <div className="text-center">
                <p className="font-semibold">Manual Entry</p>
                <p className="text-xs opacity-90">Enter tracking number manually</p>
              </div>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowQuickMenu(false)}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
