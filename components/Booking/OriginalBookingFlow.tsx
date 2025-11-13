"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

// Original Components (4-step flow)
import { TripSelectionStep } from "./trip-selection-step";
import { ParcelDetailsForm } from "./ParcelDetailsForm";
import { ReviewStep } from "./ReviewStep";

// Types
import { Trip } from "@/types/trip";

interface OriginalBookingFlowProps {
  initialFilters?: {
    departureCity?: string;
    destinationCity?: string;
    departureDate?: Date;
  };
  user?: any;
  className?: string;
}

type BookingStep = 'search' | 'details' | 'review' | 'payment';

export function OriginalBookingFlow({
  initialFilters = {},
  user,
  className,
}: OriginalBookingFlowProps) {
  const t = useTranslations('booking.original');
  const { data: session } = useSession();

  const [currentStep, setCurrentStep] = useState<BookingStep>('search');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [bookingData, setBookingData] = useState({
    parcelDetails: {},
    senderInfo: {},
    recipientInfo: {},
  });

  const steps = [
    { id: 'search', label: t('steps.search'), description: t('steps.searchDesc') },
    { id: 'details', label: t('steps.details'), description: t('steps.detailsDesc') },
    { id: 'review', label: t('steps.review'), description: t('steps.reviewDesc') },
    { id: 'payment', label: t('steps.payment'), description: t('steps.paymentDesc') },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleTripSelected = (trip: Trip) => {
    setSelectedTrip(trip);
    setCurrentStep('details');
  };

  const handleDetailsSubmit = (data: any) => {
    setBookingData(prev => ({
      ...prev,
      parcelDetails: data.parcelDetails,
      senderInfo: data.senderInfo,
      recipientInfo: data.recipientInfo,
    }));
    setCurrentStep('review');
  };

  const handleReviewSubmit = () => {
    setCurrentStep('payment');
  };

  const handleBack = () => {
    const stepOrder: BookingStep[] = ['search', 'details', 'review', 'payment'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {/* Legacy Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Legacy Progress */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    index < currentStepIndex
                      ? "bg-green-500 text-white"
                      : index === currentStepIndex
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-full h-1 mx-2 transition-colors",
                      index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  index === currentStepIndex ? "bg-blue-50 border border-blue-200" : ""
                )}
              >
                <div>
                  <div className={cn(
                    "font-medium text-sm",
                    index === currentStepIndex ? "text-blue-900" : "text-gray-600"
                  )}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index === currentStepIndex && (
                  <div className="text-sm text-blue-600 font-medium">
                    {progress.toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legacy Content */}
      <div className="bg-white">
        <div className="px-6 py-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'search' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {t('search.title')}
                  </div>
                  <div className="text-gray-600 mb-6">
                    {t('search.description')}
                  </div>
                </div>
                <TripSelectionStep
                  onTripSelected={handleTripSelected}
                  initialFilters={initialFilters}
                />
              </div>
            )}

            {currentStep === 'details' && selectedTrip && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t('details.title')}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {t('details.description')}
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← {t('backToSearch')}
                  </button>
                </div>
                <ParcelDetailsForm
                  trip={selectedTrip}
                  onSubmit={handleDetailsSubmit}
                  user={session?.user}
                />
              </div>
            )}

            {currentStep === 'review' && selectedTrip && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t('review.title')}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {t('review.description')}
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← {t('backToDetails')}
                  </button>
                </div>
                <ReviewStep
                  trip={selectedTrip}
                  bookingData={bookingData}
                  onEdit={(section) => {
                    // Handle editing - go back to appropriate step
                    if (section === 'trip') {
                      setCurrentStep('search');
                    } else if (section === 'details') {
                      setCurrentStep('details');
                    }
                  }}
                  onSubmit={handleReviewSubmit}
                />
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {t('payment.title')}
                  </div>
                  <div className="text-gray-600 mb-6">
                    {t('payment.description')}
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                    <div className="text-yellow-800">
                      <div className="font-medium mb-2">💳 {t('payment.comingSoon')}</div>
                      <div className="text-sm">
                        {t('payment.demoNote')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Legacy Footer Info */}
      <div className="bg-gray-50 border-t">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>{t('footer.step', { current: currentStepIndex + 1, total: steps.length })}</div>
            <div>{t('footer.estimatedTime')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}