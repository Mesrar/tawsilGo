"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import QrScanner to avoid SSR issues
const QrScanner = dynamic(() => import("@/components/Driver/QrScanner"), {
  ssr: false,
});

interface QRBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (trackingId: string) => void;
  onManualEntry?: () => void;
}

export function QRBottomSheet({
  isOpen,
  onClose,
  onScanSuccess,
  onManualEntry,
}: QRBottomSheetProps) {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-moroccan-mint/20 flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-moroccan-mint" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Scan Tracking QR Code
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Point camera at QR code
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* QR Scanner */}
              <div className="mb-6">
                <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <QrScanner
                    onScanSuccess={onScanSuccess}
                    onCancel={onClose}
                    isScanning={isOpen}
                  />

                  {/* Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-64 h-64">
                        {/* Corner Guides */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-moroccan-mint rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-moroccan-mint rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-moroccan-mint rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-moroccan-mint rounded-br-lg" />

                        {/* Scanning Line Animation */}
                        <motion.div
                          animate={{ y: [0, 256, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute left-0 right-0 h-0.5 bg-moroccan-mint shadow-lg shadow-moroccan-mint/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Position the QR code from your booking confirmation or bus ticket within the frame
                </p>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                    or
                  </span>
                </div>
              </div>

              {/* Manual Entry Option */}
              <Button
                onClick={() => {
                  onClose();
                  onManualEntry?.();
                }}
                variant="outline"
                className="w-full h-12 border-moroccan-mint text-moroccan-mint hover:bg-moroccan-mint/10"
              >
                <Type className="h-4 w-4 mr-2" />
                Enter Tracking Number Manually
              </Button>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Where to find your QR code?
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-moroccan-mint mt-0.5">•</span>
                    <span>Booking confirmation email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-moroccan-mint mt-0.5">•</span>
                    <span>Printed receipt from driver</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-moroccan-mint mt-0.5">•</span>
                    <span>SMS confirmation message</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
