"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { TrackingDisplay } from "@/components/Tracking/TrackingDisplay";
import { bookingService } from "@/app/services/bookingService";
import type { EnhancedTrackingData } from "@/types/booking";

export default function TrackingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('tracking');
  const trackingId = params?.id as string;

  const [trackingData, setTrackingData] = useState<EnhancedTrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  useEffect(() => {
    if (!trackingId) {
      setError('No tracking ID provided');
      setIsLoading(false);
      return;
    }

    fetchTrackingData();

    // Set up polling for live updates (every 30 seconds)
    const pollInterval = setInterval(() => {
      if (trackingData) {
        fetchTrackingData(true); // Silent refresh
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [trackingId]);

  const fetchTrackingData = async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const response = await bookingService.trackBooking(trackingId);

      if (response.success && response.data) {
        // Backend now returns the exact format we need
        const data = response.data as any;

        // Map the backend response to EnhancedTrackingData
        const enhancedData: EnhancedTrackingData = {
          bookingId: data.bookingId || trackingId,
          trackingId: data.trackingNumber || trackingId,
          currentStatus: data.currentStatus || 'pending',
          statusText: data.statusText || data.currentStatus || 'Pending',
          progress: data.progress || 0,
          estimatedDelivery: data.estimatedDelivery
            ? new Date(data.estimatedDelivery).toLocaleDateString()
            : 'TBD',
          origin: data.origin || 'Unknown',
          destination: data.destination || 'Unknown',
          currentLocation: data.currentLocation || 'In transit',
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          timeline: data.timeline || [],
          driver: data.driver || undefined,
          customsInfo: data.customsInfo || undefined,
          parcelInfo: {
            weight: data.parcelInfo?.weight || 'N/A',
            packagingType: data.parcelInfo?.packagingType || 'Standard',
            carrier: data.parcelInfo?.carrier || 'TawsilGo Express',
            insuranceAmount: data.parcelInfo?.insuranceAmount,
            hasExpress: data.parcelInfo?.hasExpress || false,
            hasCustomsBrokerage: data.parcelInfo?.hasCustomsBrokerage || false,
          },
          contactEnabled: data.contactEnabled || false,
          deliveryPreferences: data.deliveryPreferences || {
            canChangeAddress: false,
            canHoldForPickup: true,
            canScheduleTime: true,
          },
        };

        setTrackingData(enhancedData);
        setLastUpdateTime(new Date());
        setIsPolling(true);
      } else {
        // Handle API error response
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : response.error?.message || 'Failed to fetch tracking information';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error fetching tracking data:', err);
      // Ensure error is always a string
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching tracking data';
      setError(errorMessage);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };


  const handleRefreshTracking = async () => {
    await fetchTrackingData(false);
  };

  const handleContactDriver = () => {
    // TODO: Implement driver contact modal
    alert("Driver contact feature coming soon");
  };

  const handleShareTracking = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Track TawsilGo Parcel ${trackingId}`,
        text: `Track my TawsilGo delivery: ${trackingId}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Tracking link copied to clipboard!");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Track Package</h1>
        </div>

        <div className="space-y-6">
          {/* Skeleton Loaders */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Track Package</h1>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="mt-6 space-y-3">
          <Button onClick={() => fetchTrackingData()} className="w-full">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push('/tracking')} className="w-full">
            Search Another Package
          </Button>
        </div>
      </main>
    );
  }

  // Show tracking data
  return (
    <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
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
          <h1 className="text-2xl font-bold">Track Package</h1>
          <p className="text-sm text-muted-foreground">{trackingId}</p>
        </div>
      </div>

      {trackingData && (
        <TrackingDisplay
          trackingData={trackingData}
          onContactDriver={handleContactDriver}
          onShareTracking={handleShareTracking}
          onRefreshTracking={handleRefreshTracking}
          lastUpdateTime={lastUpdateTime}
          isPolling={isPolling}
          pollingInterval={30}
        />
      )}
    </main>
  );
}
