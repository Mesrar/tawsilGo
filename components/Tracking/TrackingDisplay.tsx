"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroStatusCard } from "./HeroStatusCard";
import { CondensedTimeline } from "./CondensedTimeline";
import { CustomsStatusCard } from "./CustomsStatusCard";
import { DutyCalculator } from "./DutyCalculator";
import { DriverInfoCard } from "./DriverInfoCard";
import { RouteMap } from "./RouteMap";
import { ContextualFAQ } from "./ContextualFAQ";
import { LiveUpdateIndicator } from "./LiveUpdateIndicator";
import type { EnhancedTrackingData } from "@/types/booking";
import { motion } from "framer-motion";

interface TrackingDisplayProps {
  trackingData: EnhancedTrackingData;
  onContactDriver?: () => void;
  onShareTracking?: () => void;
  onPayDuty?: () => void;
  onUploadDocuments?: () => void;
  onCallDriver?: () => void;
  onRefreshTracking?: () => Promise<void>;
  lastUpdateTime?: Date;
  isPolling?: boolean;
  pollingInterval?: number;
}

export function TrackingDisplay({
  trackingData,
  onContactDriver = () => alert("Opening driver contact..."),
  onShareTracking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Track My Parcel",
        text: `Track my TawsilGo delivery: ${trackingData.trackingId}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tracking link copied to clipboard!");
    }
  },
  onPayDuty = () => alert("Opening duty payment flow..."),
  onUploadDocuments = () => alert("Opening document uploader..."),
  onCallDriver = () => alert("Calling driver..."),
  onRefreshTracking = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
  },
  lastUpdateTime = new Date(),
  isPolling = false,
  pollingInterval = 30,
}: TrackingDisplayProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Mock route checkpoints based on tracking data
  const getRouteCheckpoints = () => {
    // This would be populated from tracking data in production
    return trackingData.timeline.map((event, index) => ({
      id: event.id,
      name: event.location || event.title,
      city: event.location?.split(',')[0] || '',
      country: event.location?.split(',')[1]?.trim() || '',
      completed: event.completed,
      active: event.active,
      actualTime: event.completed ? `${event.date}, ${event.time}` : undefined,
      estimatedTime: !event.completed ? `${event.date}, ${event.time}` : undefined,
      type: (index === 0 ? 'hub' : index === trackingData.timeline.length - 1 ? 'delivery' : 'hub') as const,
    }));
  };

  // Translations - in production these would use useTranslations
  const t = (key: string) => {
    const translations: Record<string, string> = {
      faq: 'FAQ',
      dutyCalculator: 'Duty Calculator',
      packageDetails: 'Package Details',
      packageInformation: 'Package Information',
      trackingId: 'Tracking ID',
      bookingId: 'Booking ID',
      weight: 'Weight',
      packaging: 'Packaging',
      carrier: 'Carrier',
      insuranceCoverage: 'Insurance Coverage',
      upTo: 'Up to',
      origin: 'Origin',
      destination: 'Destination',
      estimatedDelivery: 'Estimated Delivery',
    };
    return translations[key] || key;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Hero Status Card */}
      <HeroStatusCard
        trackingData={trackingData}
        onContactDriver={onContactDriver}
        onShareTracking={onShareTracking}
      />

      {/* Live Update Indicator */}
      <LiveUpdateIndicator
        lastUpdate={lastUpdateTime}
        isPolling={isPolling}
        pollingInterval={pollingInterval}
        onRefresh={onRefreshTracking}
      />

      {/* Customs Status Card (show if customs-related status) */}
      {trackingData.customsInfo && (
        <CustomsStatusCard
          customsInfo={trackingData.customsInfo}
          onPayDuty={onPayDuty}
          onUploadDocuments={onUploadDocuments}
        />
      )}

      {/* Route Map */}
      <RouteMap
        origin={trackingData.origin}
        destination={trackingData.destination}
        currentLocation={trackingData.currentLocation}
        checkpoints={getRouteCheckpoints()}
      />

      {/* Driver Info Card */}
      {trackingData.driver && (
        <DriverInfoCard
          driver={trackingData.driver}
          contactEnabled={trackingData.contactEnabled}
          isDelayed={false}
          onContactDriver={onContactDriver}
          onCallDriver={onCallDriver}
        />
      )}

      {/* Timeline */}
      <CondensedTimeline timeline={trackingData.timeline} />

      {/* Additional Info Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">{t('faq')}</TabsTrigger>
          <TabsTrigger value="calculator">{t('dutyCalculator')}</TabsTrigger>
          <TabsTrigger value="details">{t('packageDetails')}</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <ContextualFAQ currentStatus={trackingData.currentStatus} />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <DutyCalculator />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className={`text-lg font-bold text-slate-900 dark:text-white mb-4 ${isRTL ? 'text-right' : ''}`}>
                {t('packageInformation')}
              </h2>

              <div className="space-y-3">
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('trackingId')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.trackingId}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('bookingId')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.bookingId}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('weight')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.parcelInfo.weight}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('packaging')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.parcelInfo.packagingType}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('carrier')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.parcelInfo.carrier}
                  </span>
                </div>
                {trackingData.parcelInfo.insuranceAmount && (
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {t('insuranceCoverage')}
                    </span>
                    <span className="text-sm font-medium text-moroccan-mint">
                      {t('upTo')} €{trackingData.parcelInfo.insuranceAmount}
                    </span>
                  </div>
                )}
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('origin')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.origin}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('destination')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.destination}
                  </span>
                </div>
                <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {t('estimatedDelivery')}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {trackingData.estimatedDelivery}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
