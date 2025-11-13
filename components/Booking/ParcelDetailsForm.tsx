"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  MapPin,
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  User,
  ChevronLeft,
  Calendar,
  Clock,
  Banknote,
  Truck,
  Info,
  PiggyBank,
  CreditCard,
  ArrowDown,
  ShieldCheck,
  ArrowUp,
  PackageOpen,
  Box,
  FileType,
  Wine,
  Shield,
  Smartphone,
  HelpCircle,
} from "lucide-react";

// Components
import WeightQuickSelect from "./WeightQuickSelect";
import PackagingSelector from "./PackagingSelector";

// Utils
import { cn } from "@/lib/utils";
import { ParcelDetailsFormProps } from "@/types/Parcel";
import {
  ParcelDetailsFormValues,
  parcelDetailsSchema,
} from "@/lib/parcel-schema";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export function ParcelDetailsForm({
  selectedTrip,
  parcelWeight,
  setParcelWeight,
  packagingType, // Add this line
  setPackagingType, // Add this line
  selectedPickupPoint,
  setSelectedPickupPoint,
  selectedDeliveryPoint,
  setSelectedDeliveryPoint,
  specialRequirements,
  setSpecialRequirements,
  pickupContactName,
  setPickupContactName,
  pickupContactPhone,
  setPickupContactPhone,
  deliveryContactName,
  setDeliveryContactName,
  deliveryContactPhone,
  setDeliveryContactPhone,
  handleBooking,
  isBooking,
  goBack = () => {},
  user,
}: ParcelDetailsFormProps) {
  const t = useTranslations("booking.parcelDetails");

  // Track completed sections and accordion state
  const [expandedSections, setExpandedSections] = useState<string[]>(["details"]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      details: false,
      specifications: false,
      contacts: false,
    }
  );

  // Auto-fill sender details from user profile
  const autoFillSenderDetails = () => {
    if (user) {
      return {
        name: user.fullName || user.name || "",
        phone: user.phone || "",
      };
    }
    return {
      name: pickupContactName || "",
      phone: pickupContactPhone || "",
    };
  };

  // Initialize form with Zod validation and smart defaults
  const form = useForm<ParcelDetailsFormValues>({
    resolver: zodResolver(parcelDetailsSchema),
    defaultValues: {
      pickupPoint: selectedPickupPoint || (selectedTrip?.departureCity) || "",
      deliveryPoint: selectedDeliveryPoint || (selectedTrip?.destinationCity) || "",
      parcelWeight: parcelWeight || 5, // Default to 5kg (popular choice)
      packagingType: packagingType || "medium", // Default to medium box
      specialRequirements: specialRequirements || "",
      senderDetails: autoFillSenderDetails(),
      receiverDetails: {
        name: deliveryContactName || "",
        phone: deliveryContactPhone || "",
      },
    },
    mode: "onChange", // Enable real-time validation
  });

  const pickupPoint = form.watch("pickupPoint");
  const deliveryPoint = form.watch("deliveryPoint");
  const weightValue = form.watch("parcelWeight");
  const senderName = form.watch("senderDetails.name");
  const senderPhone = form.watch("senderDetails.phone");
  const receiverName = form.watch("receiverDetails.name");
  const receiverPhone = form.watch("receiverDetails.phone");

  useEffect(() => {
    console.log("Form values changed:", {
      weightValue,
      packagingType,
      weightCheck: Number(weightValue) > 0,
      packagingCheck: Boolean(packagingType),
    });

    setCompletedSteps({
      details: Boolean(pickupPoint && deliveryPoint),
      specifications: Number(weightValue) > 0 && Boolean(packagingType), // Add this check
      contacts: Boolean(
        senderName && senderPhone && receiverName && receiverPhone
      ),
    });
  }, [
    pickupPoint,
    deliveryPoint,
    weightValue,
    packagingType,
    senderName,
    senderPhone,
    receiverName,
    receiverPhone,
  ]);

  // Helper function to get location options
  const getLocationOptions = (trip: any, type: "pickup" | "delivery") => {
    const options = [];

    // Add origin for pickup points
    if (type === "pickup") {
      options.push({
        value: "departureCity",
        label: `${trip.departureCity} (Departure)`,
      });
    }

    // Add stops based on type
    if (trip.stops) {
      options.push(
        ...trip.stops
          .filter((stop: any) => {
            if (type === "pickup")
              return ["pickup", "both"].includes(stop.stopType);
            if (type === "delivery")
              return ["delivery", "both"].includes(stop.stopType);
            return false;
          })
          .map((stop: any) => ({
            value: stop.id,
            label: `${stop.location} (Stop ${stop.order})`,
          }))
      );
    }

    // Add destination for delivery points
    if (type === "delivery") {
      options.push({
        value: "destinationCity",
        label: `${trip.destinationCity} (Destination)`,
      });
    }

    return options;
  };

  const onSubmit = async (data: ParcelDetailsFormValues) => {
    // Update all state variables

    console.log("Form submission values:", {
      sender: data.senderDetails,
      receiver: data.receiverDetails,
      parcel: {
        weight: data.parcelWeight,
        type: data.packagingType,
      },
    });

    // Create a function to set all state values
    const updateAllValues = async () => {
      // Update parent component state
      setSelectedPickupPoint(data.pickupPoint);
      setSelectedDeliveryPoint(data.deliveryPoint);
      setParcelWeight(data.parcelWeight);
      setPackagingType(data.packagingType);
      setSpecialRequirements(data.specialRequirements || "");

      // Update contact information
      setPickupContactName(data.senderDetails.name);
      setPickupContactPhone(data.senderDetails.phone);
      setDeliveryContactName(data.receiverDetails.name);
      setDeliveryContactPhone(data.receiverDetails.phone);
    };

    await updateAllValues();
    // Wait for next render cycle to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the data before proceeding
    if (
      !data.senderDetails.name ||
      !data.senderDetails.phone ||
      !data.receiverDetails.name ||
      !data.receiverDetails.phone
    ) {
      // Show error message
      toast.error(t("validation.fillContactInfo"));
      return;
    }

    // Call booking handler
    handleBooking({
      pickupContactName: data.senderDetails.name,
      pickupContactPhone: data.senderDetails.phone,
      deliveryContactName: data.receiverDetails.name,
      deliveryContactPhone: data.receiverDetails.phone,
      parcelWeight: data.parcelWeight,
      packagingType: data.packagingType,
      specialRequirements: data.specialRequirements || "",
      pickupPoint: data.pickupPoint,
      deliveryPoint: data.deliveryPoint,
    });
  };

  // Navigation helpers for accordion
  const expandNextSection = () => {
    if (!expandedSections.includes("specifications") && !expandedSections.includes("contacts")) {
      setExpandedSections([...expandedSections, "specifications"]);
    } else if (!expandedSections.includes("contacts")) {
      setExpandedSections([...expandedSections, "contacts"]);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Trip summary card with enhanced mobile design */}
      <Card className="mb-5 border-t-4 border-t-blue-500 shadow-md overflow-hidden">
        <CardHeader className="pb-1 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Truck className="h-4 w-4 text-blue-600" />
              {t("tripOverview.title")}
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {new Date(selectedTrip.departureTime).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                }
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-3">
          {/* Route visualization */}
          <div className="flex items-start mb-3">
            <div className="mr-3 flex flex-col items-center">
              <div className="h-5 w-5 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                <MapPin className="h-3 w-3 text-blue-600" />
              </div>
              <div className="w-0.5 h-8 bg-slate-200"></div>
              <div className="h-5 w-5 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                <MapPin className="h-3 w-3 text-red-600" />
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">{t("tripOverview.from")}</p>
                <p className="font-medium">
                  {selectedTrip.departureCity}, {selectedTrip.departureCountry}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">{t("tripOverview.to")}</p>
                <p className="font-medium">
                  {selectedTrip.destinationCity},{" "}
                  {selectedTrip.destinationCountry}
                </p>
              </div>
            </div>
          </div>

          {/* Trip details in badges */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-4 w-4 text-slate-500 mb-1" />
              <span className="text-xs text-slate-600">
                {new Date(selectedTrip.departureTime).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-4 w-4 text-slate-500 mb-1" />
              <span className="text-xs text-slate-600">
                {new Date(selectedTrip.departureTime).toLocaleTimeString(
                  undefined,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Package className="h-4 w-4 text-slate-500 mb-1" />
              <span className="text-xs text-slate-600">
                {selectedTrip.remainingCapacityKg} kg
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Progress Bar */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm mb-4 rounded-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">{t("sections.progressTitle")}</span>
            <span className="text-xs font-medium text-primary">
              {t("sections.progressStatus", {
                completed: Object.values(completedSteps).filter(Boolean).length,
                total: 3
              })}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-500 ease-out"
              style={{
                width: `${(Object.values(completedSteps).filter(Boolean).length / 3) * 100}%`
              }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            <div className={cn(
              "flex items-center gap-1.5 text-xs",
              completedSteps.details ? "text-blue-600 font-medium" : "text-slate-400"
            )}>
              {completedSteps.details ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-current" />
              )}
              <span className="hidden sm:inline">{t("sections.locationsLabel")}</span>
            </div>

            <div className={cn(
              "flex items-center gap-1.5 text-xs",
              completedSteps.specifications ? "text-purple-600 font-medium" : "text-slate-400"
            )}>
              {completedSteps.specifications ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-current" />
              )}
              <span className="hidden sm:inline">{t("sections.parcelLabel")}</span>
            </div>

            <div className={cn(
              "flex items-center gap-1.5 text-xs",
              completedSteps.contacts ? "text-green-600 font-medium" : "text-slate-400"
            )}>
              {completedSteps.contacts ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-current" />
              )}
              <span className="hidden sm:inline">{t("sections.contactsLabel")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-optimized form with accordion */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion
            type="multiple"
            value={expandedSections}
            onValueChange={setExpandedSections}
            className="space-y-4"
          >
            {/* Section 1: Locations */}
            <AccordionItem value="details" id="section-details" className="border-none">
              <Card className="shadow-sm border-slate-200">
                <AccordionTrigger className="px-6 pt-4 pb-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        completedSteps.details ? "bg-green-100" : "bg-blue-100"
                      )}>
                        {completedSteps.details ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <MapPin className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold">{t("sections.locations.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("sections.locations.description")}</p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>

                <CardContent className="space-y-5">
                  {/* Pickup Point with animated indicator */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="pickupPoint"
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <MapPin className="h-3.5 w-3.5 text-blue-600" />
                            </div>
                            {t("sections.locations.pickupLabel")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="h-12 bg-white">
                                <SelectValue placeholder={t("sections.locations.pickupPlaceholder")} />
                              </SelectTrigger>
                              <SelectContent>
                                {getLocationOptions(selectedTrip, "pickup").map(
                                  (option: any) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Direction indicator */}
                    <div className="flex justify-center my-4">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <ArrowDown className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>

                    {/* Delivery Point */}
                    <FormField
                      control={form.control}
                      name="deliveryPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                              <MapPin className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            {t("sections.locations.deliveryLabel")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="h-12 bg-white">
                                <SelectValue placeholder={t("sections.locations.deliveryPlaceholder")} />
                              </SelectTrigger>
                              <SelectContent>
                                {getLocationOptions(
                                  selectedTrip,
                                  "delivery"
                                ).map((option: any) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </CardContent>

                <CardFooter className="flex justify-between pt-3 pb-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-3 border-slate-200"
                    onClick={goBack}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {t("buttons.back")}
                  </Button>

                  <Button
                    type="button"
                    className="h-11 px-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      expandNextSection();
                      setTimeout(() => scrollToSection("specifications"), 100);
                    }}
                    disabled={!completedSteps.details}
                  >
                    {t("buttons.nextStep")}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </CardFooter>

                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Section 2: Parcel Specifications */}
            <AccordionItem value="specifications" id="section-specifications" className="border-none">
              <Card className="shadow-sm border-slate-200">
                <AccordionTrigger className="px-6 pt-4 pb-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        completedSteps.specifications ? "bg-green-100" : "bg-purple-100"
                      )}>
                        {completedSteps.specifications ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Package className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold">{t("sections.specifications.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("sections.specifications.description")}</p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>

                <CardContent className="space-y-6">
                  {/* Parcel weight with improved visualization */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="parcelWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                              <Package className="h-3.5 w-3.5 text-purple-600" />
                            </div>
                            {t("sections.specifications.weight.label")}
                          </FormLabel>

                          <FormControl>
                            <WeightQuickSelect
                              value={field.value || 5}
                              onChange={(value) => {
                                field.onChange(value);
                                setParcelWeight(value);
                              }}
                              maxCapacity={selectedTrip?.remainingCapacityKg}
                              selectedTrip={selectedTrip}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="packagingType"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-base flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                              <PackageOpen className="h-3.5 w-3.5 text-indigo-600" />
                            </div>
                            {t("sections.specifications.packaging.label")}
                          </FormLabel>

                          <FormControl>
                            <PackagingSelector
                              value={field.value || 'medium'}
                              onChange={(value) => {
                                field.onChange(value);
                                setPackagingType(value);
                              }}
                              weight={form.watch('parcelWeight') || 5}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Special Requirements with better UI */}
                    <FormField
                      control={form.control}
                      name="specialRequirements"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-base flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <Info className="h-3.5 w-3.5 text-slate-600" />
                            </div>
                            {t("sections.specifications.specialRequirements.label")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("sections.specifications.specialRequirements.placeholder")}
                              className="h-24 resize-none mt-2 bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </CardContent>

                <CardFooter className="flex justify-between pt-3 pb-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 px-3 border-slate-200"
                    onClick={() => scrollToSection("details")}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {t("buttons.previous")}
                  </Button>

                  <Button
                    type="button"
                    className="h-11 px-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      expandNextSection();
                      setTimeout(() => scrollToSection("contacts"), 100);
                    }}
                    disabled={
                      !completedSteps.details || !completedSteps.specifications
                    }
                  >
                    {t("buttons.nextStep")}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </CardFooter>

                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Section 3: Contact Information */}
            <AccordionItem value="contacts" id="section-contacts" className="border-none">
              <Card className="shadow-sm border-slate-200">
                <AccordionTrigger className="px-6 pt-4 pb-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        completedSteps.contacts ? "bg-green-100" : "bg-green-50"
                      )}>
                        {completedSteps.contacts ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <User className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-semibold">{t("sections.contacts.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("sections.contacts.description")}</p>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>

                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Sender info card */}
                    <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-medium text-blue-800 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          {t("sections.contacts.sender.title")}
                        </h3>

                        {/* Auto-fill indicator */}
                        {user && (user.fullName || user.name) && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Auto-filled
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Auto-fill message */}
                      {user && (user.fullName || user.name) && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Pre-filled from your profile. You can edit if needed.
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="senderDetails.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm text-blue-800">
                                {t("sections.contacts.sender.nameLabel")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("sections.contacts.sender.namePlaceholder")}
                                  className="h-11 bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="senderDetails.phone"
                          render={({ field }) => (
                            <FormItem>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel className="text-sm text-blue-800 flex items-center gap-1 cursor-help">
                                      {t("sections.contacts.sender.phoneLabel")}
                                      <HelpCircle className="h-3 w-3 text-blue-400" />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">{t("sections.contacts.sender.phoneTooltip")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormControl>
                                <Input
                                  placeholder={t("sections.contacts.sender.phonePlaceholder")}
                                  className="h-11 bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Direction indicator */}
                    <div className="flex justify-center my-4">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <ArrowDown className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>

                    {/* Receiver info card */}
                    <div className="bg-green-50/30 rounded-lg p-4 border border-green-100">
                      <h3 className="text-base font-medium text-green-800 mb-3 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        {t("sections.contacts.receiver.title")}
                      </h3>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="receiverDetails.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm text-green-800">
                                {t("sections.contacts.receiver.nameLabel")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("sections.contacts.receiver.namePlaceholder")}
                                  className="h-11 bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="receiverDetails.phone"
                          render={({ field }) => (
                            <FormItem>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <FormLabel className="text-sm text-green-800 flex items-center gap-1 cursor-help">
                                      {t("sections.contacts.receiver.phoneLabel")}
                                      <HelpCircle className="h-3 w-3 text-green-400" />
                                    </FormLabel>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">{t("sections.contacts.receiver.phoneTooltip")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <FormControl>
                                <Input
                                  placeholder={t("sections.contacts.receiver.phonePlaceholder")}
                                  className="h-11 bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                </CardContent>

                <CardFooter className="flex flex-col pt-4 pb-4 border-t">
                  {/* Security badge */}
                  <div className="flex items-center justify-center bg-green-50 rounded-lg p-3 my-4 w-full">
                    <ShieldCheck className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-xs text-green-700">
                      {t("sections.contacts.securityNote")}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex w-full justify-between gap-3 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 px-3 border-slate-200 flex-1"
                      onClick={() => scrollToSection("specifications")}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      {t("buttons.previous")}
                    </Button>

                    <Button
                      type="submit"
                      className="h-12 px-4 bg-green-600 hover:bg-green-700 flex-1"
                      disabled={
                        isBooking ||
                        form.formState.isSubmitting ||
                        !completedSteps.details ||
                        !completedSteps.specifications ||
                        !completedSteps.contacts
                      }
                      onClick={() => {
                        // Optional: Add additional validation check before form submission
                        form.trigger().then((isValid) => {
                          if (!isValid) {
                            // Log validation errors for debugging
                            console.log(
                              "Form validation errors:",
                              form.formState.errors
                            );

                            // Check contact fields specifically and show a more targeted error
                            const senderName =
                              form.getValues("senderDetails.name");
                            const senderPhone = form.getValues(
                              "senderDetails.phone"
                            );
                            const receiverName = form.getValues(
                              "receiverDetails.name"
                            );
                            const receiverPhone = form.getValues(
                              "receiverDetails.phone"
                            );

                            if (
                              !senderName ||
                              !senderPhone ||
                              !receiverName ||
                              !receiverPhone
                            ) {
                              toast.error(
                                t("validation.fillContactInfo")
                              );
                              // Focus on the first empty field
                              if (!senderName)
                                form.setFocus("senderDetails.name");
                              else if (!senderPhone)
                                form.setFocus("senderDetails.phone");
                              else if (!receiverName)
                                form.setFocus("receiverDetails.name");
                              else if (!receiverPhone)
                                form.setFocus("receiverDetails.phone");
                            }
                          }
                        });
                      }}
                    >
                      {isBooking || form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("buttons.processing")}
                        </>
                      ) : (
                        <>
                          {t("buttons.continueToReview")}
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>

                </AccordionContent>
              </Card>
            </AccordionItem>

          </Accordion>
        </form>
      </Form>

      {/* Sticky Price Calculator at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 z-30 mt-4 pb-4 md:pb-0">
        <EnhancedPriceCalculator
          parcelWeight={form.watch("parcelWeight")}
          tripPricing={selectedTrip.price}
        />
      </div>
    </>
  );
}

// Enhanced Price Calculator component
function EnhancedPriceCalculator({
  parcelWeight,
  tripPricing,
}: {
  parcelWeight: number;
  tripPricing: any;
}) {
  const t = useTranslations("booking.parcelDetails");
  const [expanded, setExpanded] = useState(false);

  // Calculate price details directly without state
  const priceDetails = React.useMemo(() => {
    const weight = parcelWeight || 0;
    const pricing = tripPricing || {
      basePrice: 10,
      pricePerKg: 2.5,
      minimumPrice: 15,
      currency: "EUR",
    };

    // Calculate base price
    const basePrice = Math.max(pricing.basePrice, pricing.minimumPrice);
    const weightFee = weight * pricing.pricePerKg;
    const insuranceFee = 3.5;
    const subtotal = basePrice + weightFee + insuranceFee;
    const tax = subtotal * 0.19;
    const total = subtotal + tax;

    return {
      basePrice,
      weightFee,
      insuranceFee,
      subtotal,
      tax,
      total,
      currency: pricing.currency || "EUR",
    };
  }, [parcelWeight, tripPricing]);

  // Currency symbol derived from the price details
  const currencySymbol = React.useMemo(() => {
    const currency = priceDetails.currency;
    return currency === "EUR"
      ? "€"
      : currency === "USD"
        ? "$"
        : currency === "GBP"
          ? "£"
          : currency;
  }, [priceDetails.currency]);

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

  return (
    <Card className="w-full border-t-4 border-t-green-500 shadow-sm">
      <CardHeader className="pb-0 pt-3 px-4">
        <CardTitle className="text-base font-medium flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Banknote className="h-4 w-4 text-green-600" />
            {t('priceCalculator.title')}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                {t('priceCalculator.hide')}
              </>
            ) : (
              <>
                <ArrowDown className="h-3.5 w-3.5 mr-1" />
                {t('priceCalculator.details')}
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-1 pb-3 px-4">
        {/* Price breakdown - animates open/closed */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden mb-3"
            >
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-gray-200">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                  {t('priceCalculator.baseFee')}
                </span>
                <span>
                  {currencySymbol}
                  {formatPrice(priceDetails.basePrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-gray-200">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  {t('priceCalculator.weightFee')}
                  <span className="text-xs text-muted-foreground/70">
                    ({parcelWeight || 0} kg)
                  </span>
                </span>
                <span>
                  {currencySymbol}
                  {formatPrice(priceDetails.weightFee)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-gray-200">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  {t('priceCalculator.insurance')}
                </span>
                <span>
                  {currencySymbol}
                  {formatPrice(priceDetails.insuranceFee)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-gray-200">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <PiggyBank className="h-3.5 w-3.5 text-slate-400" />
                  {t('priceCalculator.vat')}
                </span>
                <span>
                  {currencySymbol}
                  {formatPrice(priceDetails.tax)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total row - always shown with dual currency */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold text-base">{t('priceCalculator.total')}</span>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-green-700">
              {currencySymbol}
              {formatPrice(priceDetails.total)}
            </span>
            {priceDetails.currency === "EUR" && (
              <span className="text-xs text-slate-500 mt-0.5">
                {formatDualCurrency(priceDetails.total)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Optional: Wrapper component for card layout
export function ParcelDetailsCard(props: ParcelDetailsFormProps) {
  const t = useTranslations("booking.parcelDetails");
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Package className="h-5 w-5 text-blue-600" />
            <span>{t('title')}</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParcelDetailsForm {...props} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
