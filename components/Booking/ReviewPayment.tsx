"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, AlertCircle, Loader2, ArrowRight,
  ChevronLeft, MapPin, Package, User, Clock,
  CreditCard, ShieldCheck, Truck, Calendar
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCountryCode } from "@/lib/utils";
import { FlagIcon } from "react-flag-kit";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SenderReceiverDetails {
  name: string;
  phone: string;
}

interface ReviewPaymentProps {
  selectedTrip: any;
  parcelWeight: number | string;
  specialRequirements?: string;
  bookingId?: string | null;
  senderDetails: SenderReceiverDetails;
  receiverDetails: SenderReceiverDetails;
  onBackToDetails?: () => void;
  onProceedToPayment: () => void;
  isPending?: boolean;
}

export function ReviewPayment({
  selectedTrip,
  parcelWeight,
  specialRequirements = "",
  bookingId,
  senderDetails,
  receiverDetails,
  onBackToDetails = () => {},
  onProceedToPayment,
  isPending = false,
}: ReviewPaymentProps) {
  const t = useTranslations("booking.review");

  // Calculate costs based on trip pricing data
  const weight =
    typeof parcelWeight === "string" ? parseFloat(parcelWeight) : parcelWeight;

  // Use trip pricing or fallback to defaults if not available
  const pricing = selectedTrip?.price || {
    basePrice: 10,
    pricePerKg: 2.5,
    minimumPrice: 15,
    currency: "EUR",
  };

  // Calculate base price (ensuring minimum price is met)
  const basePrice = Math.max(pricing.basePrice, pricing.minimumPrice);

  // Calculate weight fee
  const weightFee = weight * pricing.pricePerKg;

  // Fixed insurance fee
  const insuranceFee = 3.5;

  // Calculate subtotal and tax
  const subtotal = basePrice + weightFee + insuranceFee;
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  // Format currency based on trip's currency or default to EUR
  const currency = pricing.currency || "EUR";
  const currencySymbol = currency === "EUR" ? "€" : currency;

  // Format number helper
  const formatPrice = (amount: number) => {
    return amount.toFixed(2);
  };

  // Exchange rate EUR to MAD (Moroccan Dirham)
  // In production, this should use a live API like exchangerate-api.com
  const EUR_TO_MAD_RATE = 10.5;

  const formatDualCurrency = (eurAmount: number) => {
    const madAmount = eurAmount * EUR_TO_MAD_RATE;
    return `(≈ ${madAmount.toFixed(2)} MAD)`;
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-lg border border-green-100 overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-teal-50/50 border-b border-green-100">
        <div className="flex justify-between items-center">
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200 px-3 py-1 h-auto font-normal text-xs"
          >
            {t("stepLabel")}
          </Badge>

          {bookingId && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-100 px-2.5 py-1 h-auto font-normal text-xs"
            >
              {t("bookingId", { id: bookingId.substring(0, 8) })}
            </Badge>
          )}
        </div>

        <CardTitle className="flex items-center gap-2 text-xl mt-1">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          {t("title")}
        </CardTitle>

        <CardDescription className="text-sm">
          {t("description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={["trip", "cost", "parcel", "contact"]} className="w-full">
          {/* Trip details section */}
          <AccordionItem value="trip" className="border-b border-slate-100">
            <AccordionTrigger className="px-4 hover:bg-slate-50 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">{t("sections.tripDetails")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-0">
              <div className="px-4 pb-4 bg-slate-50/50">
                {/* Route visualization */}
                <div className="flex items-start mb-4">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="h-5 w-5 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="w-0.5 h-12 bg-slate-200"></div>
                    <div className="h-5 w-5 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                      <MapPin className="h-3 w-3 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-8 flex-1">
                    <div>
                      <div className="flex items-center">
                        <FlagIcon
                          code={getCountryCode(selectedTrip?.departureCountry)}
                          className="w-5 h-4 mr-1.5"
                        />
                        <p className="font-medium">{selectedTrip?.departureCity}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                        {selectedTrip?.departureTime ? formatDate(selectedTrip.departureTime) : "N/A"}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                        {selectedTrip?.departureTime ? formatTime(selectedTrip.departureTime) : "N/A"}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <FlagIcon
                          code={getCountryCode(selectedTrip?.destinationCountry)}
                          className="w-5 h-4 mr-1.5"
                        />
                        <p className="font-medium">{selectedTrip?.destinationCity}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-slate-400" />
                        {selectedTrip?.arrivalTime ? formatDate(selectedTrip.arrivalTime) : "N/A"}
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3 mr-1 text-slate-400" />
                        {selectedTrip?.arrivalTime ? formatTime(selectedTrip.arrivalTime) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Parcel details section */}
          <AccordionItem value="parcel" className="border-b border-slate-100">
            <AccordionTrigger className="px-4 hover:bg-slate-50 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">{t("sections.parcelDetails")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-0">
              <div className="px-4 pb-4 bg-slate-50/50">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-500">{t("parcel.weight")}</span>
                    <span className="font-medium">{weight} kg</span>
                  </div>

                  <div className="flex justify-between items-start py-3 border-b border-slate-200">
                    <span className="text-slate-500">{t("parcel.specialRequirements")}</span>
                    <span className="font-medium text-right">{specialRequirements || t("parcel.none")}</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Contact details section */}
          <AccordionItem value="contact" className="border-b border-slate-100">
            <AccordionTrigger className="px-4 hover:bg-slate-50 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium">{t("sections.contactDetails")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-0">
              <div className="px-4 pb-4 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-2">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-blue-800">{t("contacts.sender")}</h4>
                    </div>
                    <div className="space-y-2 pl-7">
                      <div>
                        <p className="text-xs text-slate-500">{t("contacts.name")}</p>
                        <p className="font-medium">{senderDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t("contacts.phone")}</p>
                        <p className="font-medium">{senderDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-red-600" />
                      </div>
                      <h4 className="font-medium text-red-800">{t("contacts.recipient")}</h4>
                    </div>
                    <div className="space-y-2 pl-7">
                      <div>
                        <p className="text-xs text-slate-500">{t("contacts.name")}</p>
                        <p className="font-medium">{receiverDetails.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{t("contacts.phone")}</p>
                        <p className="font-medium">{receiverDetails.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Cost breakdown section */}
          <AccordionItem value="cost" className="border-b border-slate-100">
            <AccordionTrigger className="px-4 hover:bg-slate-50 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-amber-600" />
                </div>
                <span className="font-medium">{t("sections.paymentDetails")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0 pt-0">
              <div className="px-4 pb-4 bg-slate-50/50">
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">{t("cost.baseFee")}</span>
                      <span>
                        {currencySymbol}
                        {formatPrice(basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 text-slate-400" />
                        {t("cost.weightFee", { weight, price: pricing.pricePerKg })}
                      </span>
                      <span>
                        {currencySymbol}
                        {formatPrice(weightFee)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                        {t("cost.insurance")}
                      </span>
                      <span>
                        {currencySymbol}
                        {formatPrice(insuranceFee)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">{t("cost.subtotal")}</span>
                      <span className="font-medium">
                        {currencySymbol}
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">{t("cost.tax")}</span>
                      <span>
                        {currencySymbol}
                        {formatPrice(tax)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between pt-1 font-semibold">
                      <span>{t("cost.totalAmount")}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-lg text-green-700">
                          {currencySymbol}
                          {formatPrice(total)}
                        </span>
                        {currency === "EUR" && (
                          <span className="text-xs text-slate-500 font-normal mt-0.5">
                            {formatDualCurrency(total)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className="bg-slate-50 border-t border-slate-200 p-3">
                    <p className="text-xs text-slate-500 mb-2">{t("cost.paymentMethods")}</p>
                    <div className="flex flex-wrap gap-2">
                      {["Visa", "MasterCard", "PayPal", "ApplePay", "GooglePay"].map(method => (
                        <Badge
                          key={method}
                          variant="outline"
                          className="bg-white text-xs h-6 px-2 border-slate-200"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Important Information Alert */}
        <div className="px-4 py-4 mb-2">
          <Alert variant="default" className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <p className="font-medium text-sm mb-1">{t("alert.title")}</p>
              <p className="text-xs">
                {t("alert.message")}
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-4 flex flex-col sm:flex-row gap-3 border-t border-slate-200 bg-white">
        <Button
          variant="outline"
          onClick={onBackToDetails}
          className="w-full sm:w-auto h-12 sm:h-11 border-slate-200"
        >
          <ChevronLeft className="mr-1.5 h-4 w-4" />
          {t("buttons.backToDetails")}
        </Button>

        <Button
          className="w-full sm:w-auto h-12 sm:h-11 bg-green-600 hover:bg-green-700 text-white"
          onClick={onProceedToPayment}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("buttons.processing")}
            </>
          ) : (
            <>
              {t("buttons.proceedToPayment")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Optional: Create a wrapped version with motion animation
export function ReviewPaymentCard(props: ReviewPaymentProps) {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ReviewPayment {...props} />
    </motion.div>
  );
}