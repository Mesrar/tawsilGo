"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Edit,
  MapPin,
  Package,
  User,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Types
import { Trip } from "@/types/trip";

interface ReviewStepProps {
  trip: Trip;
  bookingData: {
    parcelDetails: any;
    senderInfo: any;
    recipientInfo: any;
  };
  onEdit?: (section: string) => void;
  onSubmit?: () => void;
}

export function ReviewStep({
  trip,
  bookingData,
  onEdit,
  onSubmit,
}: ReviewStepProps) {
  const t = useTranslations('booking.review');

  const formatPrice = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <div className="space-y-6">
      {/* Trip Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('tripDetails')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.('trip')}
            >
              <Edit className="h-4 w-4 mr-1" />
              {t('edit')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">{t('from')}</label>
              <p className="text-gray-900">{trip.departureCity}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">{t('to')}</label>
              <p className="text-gray-900">{trip.destinationCity}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">{t('date')}</label>
              <p className="text-gray-900">
                {format(new Date(trip.departureTime), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">{t('time')}</label>
              <p className="text-gray-900">
                {format(new Date(trip.departureTime), "h:mm a")}
              </p>
            </div>
          </div>

          {trip.driver && (
            <div>
              <label className="text-sm font-medium text-gray-700">{t('driver')}</label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{trip.driver.name}</span>
                {trip.driver.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parcel Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('parcelDetails')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.('details')}
            >
              <Edit className="h-4 w-4 mr-1" />
              {t('edit')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingData.parcelDetails && Object.keys(bookingData.parcelDetails).length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('weight')}</label>
                  <p className="text-gray-900">
                    {bookingData.parcelDetails.parcelWeight || 'N/A'} kg
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('packaging')}</label>
                  <p className="text-gray-900 capitalize">
                    {bookingData.parcelDetails.packagingType || 'N/A'}
                  </p>
                </div>
              </div>

              {bookingData.parcelDetails.specialRequirements && (
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('specialRequirements')}</label>
                  <p className="text-gray-900 text-sm italic">
                    {bookingData.parcelDetails.specialRequirements}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('pickupPoint')}</label>
                  <p className="text-gray-900 text-sm">
                    {bookingData.parcelDetails.pickupPoint || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('deliveryPoint')}</label>
                  <p className="text-gray-900 text-sm">
                    {bookingData.parcelDetails.deliveryPoint || 'N/A'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">{t('noParcelDetails')}</p>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('contactInfo')}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.('details')}
            >
              <Edit className="h-4 w-4 mr-1" />
              {t('edit')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sender Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('sender')}</h4>
            {bookingData.senderInfo && Object.keys(bookingData.senderInfo).length > 0 ? (
              <div className="space-y-1 text-sm">
                <p className="text-gray-900">
                  <span className="font-medium">{t('name')}:</span> {bookingData.senderInfo.senderName || 'N/A'}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">{t('phone')}:</span> {bookingData.senderInfo.senderPhone || 'N/A'}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">{t('noSenderInfo')}</p>
            )}
          </div>

          <Separator />

          {/* Recipient Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">{t('recipient')}</h4>
            {bookingData.recipientInfo && Object.keys(bookingData.recipientInfo).length > 0 ? (
              <div className="space-y-1 text-sm">
                <p className="text-gray-900">
                  <span className="font-medium">{t('name')}:</span> {bookingData.recipientInfo.recipientName || 'N/A'}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">{t('phone')}:</span> {bookingData.recipientInfo.recipientPhone || 'N/A'}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">{t('noRecipientInfo')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="h-5 w-5" />
            {t('priceSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('estimatedCost')}</span>
              <span className="font-medium text-green-800">
                {formatPrice(50 + (bookingData.parcelDetails?.parcelWeight || 5) * 2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('insurance')}</span>
              <span className="font-medium text-green-800">{formatPrice(5)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="font-semibold text-green-900">{t('total')}</span>
              <span className="text-xl font-bold text-green-900">
                {formatPrice(55 + (bookingData.parcelDetails?.parcelWeight || 5) * 2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => onEdit?.('details')}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          {t('editDetails')}
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          size="lg"
        >
          {t('proceedToPayment')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}