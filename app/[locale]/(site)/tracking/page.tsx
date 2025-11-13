"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { QrCode, Search, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { QRBottomSheet } from "@/components/Tracking/QRBottomSheet";
import { ErrorStates, type ErrorType } from "@/components/Tracking/ErrorStates";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackingSearchPage() {
  const t = useTranslations('tracking');
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === 'ar';

  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [isQRSheetOpen, setIsQRSheetOpen] = useState(false);

  const handleTrackPackage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!trackingId.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate validation
    setTimeout(() => {
      // Validation: Check format
      if (!/^TR-\d{8}$/i.test(trackingId.trim()) && !/^[a-f0-9-]{36}$/i.test(trackingId.trim())) {
        setError("invalid-format");
        setIsLoading(false);
        return;
      }

      // Simulate network error (5% chance for demo)
      if (Math.random() < 0.05) {
        setError("network");
        setIsLoading(false);
        return;
      }

      // Success - redirect to tracking details page
      const id = trackingId.trim();
      router.push(`/${locale}/tracking/${id}`);
    }, 800);
  };

  const handleQRScanSuccess = (scannedId: string) => {
    setTrackingId(scannedId);
    setIsQRSheetOpen(false);

    // Auto-track after QR scan with slight delay
    setTimeout(() => {
      const id = scannedId.trim();
      router.push(`/${locale}/tracking/${id}`);
    }, 300);
  };

  const handleRetry = () => {
    setError(null);
    if (trackingId.trim()) {
      handleTrackPackage();
    }
  };

  const handleContactSupport = () => {
    router.push("/support");
  };

  return (
    <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className={`text-2xl font-bold ${isRTL ? 'text-right' : ''}`}>
            {t('title')}
          </h1>
          <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card className="mb-8 shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleTrackPackage}>
            {/* Input Field */}
            <div className="mb-4">
              <label
                htmlFor="tracking-input"
                className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : ''}`}
              >
                {t('trackingNumber')}
              </label>
              <Input
                id="tracking-input"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder={t('trackingNumberPlaceholder')}
                className={`h-14 text-lg ${isRTL ? 'text-right' : ''}`}
                disabled={isLoading}
              />
              <p className={`text-xs text-muted-foreground mt-2 ${isRTL ? 'text-right' : ''}`}>
                {t('exampleFormat')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading || !trackingId.trim()}
                className="w-full h-12 bg-moroccan-mint hover:bg-moroccan-mint-600 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <div className={`h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('tracking')}
                  </>
                ) : (
                  <>
                    <Search className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('trackPackage')}
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setIsQRSheetOpen(true)}
                variant="outline"
                className="w-full h-12 border-moroccan-mint text-moroccan-mint hover:bg-moroccan-mint/10 text-base font-medium"
                disabled={isLoading}
              >
                <QrCode className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('scanQR')}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t">
            <p className={`text-sm text-muted-foreground mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('whereToFind')}
            </p>
            <ul className={`text-sm text-muted-foreground space-y-1 ${isRTL ? 'text-right' : ''}`}>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-moroccan-mint">•</span>
                {t('bookingConfirmationEmail')}
              </li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-moroccan-mint">•</span>
                {t('smsNotification')}
              </li>
              <li className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-moroccan-mint">•</span>
                {t('printedReceipt')}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      <AnimatePresence mode="wait">
        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ErrorStates
              errorType={error}
              trackingId={trackingId}
              onRetry={handleRetry}
              onContactSupport={handleContactSupport}
            />
          </motion.div>
        )}

        {!error && !isLoading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-moroccan-mint/10 mb-4">
              <Package className="h-12 w-12 text-moroccan-mint" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {t('startTracking')}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {t('startTrackingDescription')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner Bottom Sheet */}
      <QRBottomSheet
        isOpen={isQRSheetOpen}
        onClose={() => setIsQRSheetOpen(false)}
        onScanSuccess={handleQRScanSuccess}
        onManualEntry={() => {
          setIsQRSheetOpen(false);
          // Focus on input (with delay for animation)
          setTimeout(() => {
            document.getElementById("tracking-input")?.focus();
          }, 300);
        }}
      />
    </main>
  );
}
