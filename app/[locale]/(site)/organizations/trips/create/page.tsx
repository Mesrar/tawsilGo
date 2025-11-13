"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { z } from "zod";

// Services
import { organizationService } from "@/app/services/organizationService";
import { fleetService } from "@/app/services/fleetService";
import { tripService } from "@/app/services/tripService";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Car,
  User,
  DollarSign,
  Route,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Navigation,
  Package
} from "lucide-react";

// Validation schemas
const routeInfoSchema = z.object({
  departureCountry: z.string().min(1, "Departure country is required"),
  departureCity: z.string().min(1, "Departure city is required"),
  departureAddress: z.string().min(1, "Departure address is required"),
  destinationCountry: z.string().min(1, "Destination country is required"),
  destinationCity: z.string().min(1, "Destination city is required"),
  destinationAddress: z.string().min(1, "Destination address is required"),
});

const scheduleSchema = z.object({
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  estimatedDistance: z.number().min(1, "Estimated distance is required"),
  estimatedDuration: z.number().min(1, "Estimated duration is required"),
});

const pricingSchema = z.object({
  basePrice: z.number().min(0, "Base price must be positive"),
  pricePerKg: z.number().min(0, "Price per kg must be positive"),
  minimumPrice: z.number().min(0, "Minimum price must be positive"),
  currency: z.string().min(1, "Currency is required"),
});

const assignmentSchema = z.object({
  driverId: z.string().min(1, "Driver selection is required"),
  vehicleId: z.string().min(1, "Vehicle selection is required"),
});

const fullTripSchema = routeInfoSchema.and(scheduleSchema).and(pricingSchema).and(assignmentSchema).and({
  notes: z.string().optional(),
  allowPartialBooking: z.boolean().default(true),
  requirePrePayment: z.boolean().default(false),
});

type RouteInfoFormData = z.infer<typeof routeInfoSchema>;
type ScheduleFormData = z.infer<typeof scheduleSchema>;
type PricingFormData = z.infer<typeof pricingSchema>;
type AssignmentFormData = z.infer<typeof assignmentSchema>;
type FullTripData = z.infer<typeof fullTripSchema>;

const steps = [
  { id: "route", title: "Route Information", description: "Set departure and destination" },
  { id: "schedule", title: "Schedule & Timing", description: "Set trip schedule and duration" },
  { id: "pricing", title: "Pricing", description: "Set pricing and payment options" },
  { id: "assignment", title: "Driver & Vehicle", description: "Assign driver and vehicle" },
  { id: "review", title: "Review & Create", description: "Review and create the trip" },
];

const commonCountries = [
  { value: "Morocco", code: "MA" },
  { value: "France", code: "FR" },
  { value: "Spain", code: "ES" },
  { value: "Italy", code: "IT" },
  { value: "Germany", code: "DE" },
  { value: "Netherlands", code: "NL" },
  { value: "Belgium", code: "BE" },
  { value: "Portugal", code: "PT" },
];

const currencies = [
  { value: "MAD", symbol: "MAD", name: "Moroccan Dirham" },
  { value: "EUR", symbol: "€", name: "Euro" },
  { value: "USD", symbol: "$", name: "US Dollar" },
];

export default function CreateOrganizationTripPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripData, setTripData] = useState<Partial<FullTripData>>({});

  // Forms for each step
  const routeForm = useForm<RouteInfoFormData>({
    resolver: zodResolver(routeInfoSchema),
    defaultValues: {
      departureCountry: "Morocco",
      destinationCountry: "France",
      departureCity: "",
      destinationCity: "",
      departureAddress: "",
      destinationAddress: "",
    },
  });

  const scheduleForm = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      departureTime: "",
      arrivalTime: "",
      estimatedDistance: 0,
      estimatedDuration: 0,
    },
  });

  const pricingForm = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      basePrice: 50,
      pricePerKg: 5,
      minimumPrice: 25,
      currency: "EUR",
    },
  });

  const assignmentForm = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      driverId: "",
      vehicleId: "",
    },
  });

  // Get organization drivers
  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["fleet-drivers-active"],
    queryFn: () => fleetService.getFleetDrivers({
      status: "active",
      includePerformance: true,
    }),
    enabled: sessionStatus === "authenticated" && currentStep >= 4,
  });

  // Get organization vehicles
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["fleet-vehicles-active"],
    queryFn: () => fleetService.getFleetVehicles({
      status: "active",
    }),
    enabled: sessionStatus === "authenticated" && currentStep >= 4,
  });

  // Create organization trip mutation
  const createTripMutation = useMutation({
    mutationFn: organizationService.createTrip,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Organization trip created successfully!");
        queryClient.invalidateQueries({ queryKey: ["organization-trips"] });
        router.push(`/organizations/trips/${response.data.trip.id}`);
      } else {
        toast.error(response.error?.message || "Failed to create trip");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create trip");
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/organizations/trips/create");
    }
  }, [sessionStatus, router]);

  // Handle step submissions
  const handleRouteSubmit = async (data: RouteInfoFormData) => {
    const updatedData = { ...tripData, ...data };
    setTripData(updatedData);
    setCurrentStep(2);
  };

  const handleScheduleSubmit = async (data: ScheduleFormData) => {
    const updatedData = { ...tripData, ...data };
    setTripData(updatedData);
    setCurrentStep(3);
  };

  const handlePricingSubmit = async (data: PricingFormData) => {
    const updatedData = { ...tripData, ...data };
    setTripData(updatedData);
    setCurrentStep(4);
  };

  const handleAssignmentSubmit = async (data: AssignmentFormData) => {
    const updatedData = { ...tripData, ...data };
    setTripData(updatedData);
    setCurrentStep(5);
  };

  const handleFinalSubmit = async () => {
    const finalData = {
      ...tripData,
      departureCountry: routeForm.getValues("departureCountry"),
      destinationCountry: routeForm.getValues("destinationCountry"),
      departureCity: routeForm.getValues("departureCity"),
      destinationCity: routeForm.getValues("destinationCity"),
      departureAddress: routeForm.getValues("departureAddress"),
      destinationAddress: routeForm.getValues("destinationAddress"),
    } as FullTripData;

    setIsSubmitting(true);
    try {
      await createTripMutation.mutateAsync(finalData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableVehicles = (driverId: string) => {
    const driver = driversData?.data?.drivers?.find(d => d.id === driverId);
    if (driver?.currentVehicleId) {
      return vehiclesData?.data?.vehicles?.filter(v => v.id === driver.currentVehicleId) || [];
    }
    return vehiclesData?.data?.vehicles || [];
  };

  const getCompatibleDrivers = (vehicleId: string) => {
    const vehicle = vehiclesData?.data?.vehicles?.find(v => v.id === vehicleId);
    if (vehicle?.driverId) {
      return driversData?.data?.drivers?.filter(d => d.id === vehicle.driverId) || [];
    }
    return driversData?.data?.drivers || [];
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return null;
  }

  const drivers = driversData?.data?.drivers || [];
  const vehicles = vehiclesData?.data?.vehicles || [];
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/organizations/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Create Organization Trip
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create a new trip for your organization with driver and vehicle assignment
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    index + 1 === currentStep
                      ? "border-blue-600 bg-blue-600 text-white"
                      : index + 1 < currentStep
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-slate-300 bg-slate-100 text-slate-500"
                  }`}>
                    {index + 1 < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${
                      index + 1 === currentStep ? "text-blue-600" : "text-slate-600"
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 hidden md:block">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-4 transition-colors ${
                      index + 1 < currentStep ? "bg-green-600" : "bg-slate-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Form Steps */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">

                {/* Step 1: Route Information */}
                {currentStep === 1 && (
                  <FormProvider {...routeForm}>
                    <form onSubmit={routeForm.handleSubmit(handleRouteSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Route Information</h2>
                        <Alert className="mb-6">
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Set the departure and destination locations for this trip. This information will be visible to customers.
                          </AlertDescription>
                        </Alert>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-medium text-blue-600">Departure</h3>
                            <div className="space-y-2">
                              <Label htmlFor="departureCountry">Country *</Label>
                              <Select
                                value={routeForm.watch("departureCountry")}
                                onValueChange={(value) => routeForm.setValue("departureCountry", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select departure country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {commonCountries.map((country) => (
                                    <SelectItem key={country.value} value={country.value}>
                                      {country.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="departureCity">City *</Label>
                              <Input
                                id="departureCity"
                                {...routeForm.register("departureCity")}
                                placeholder="Casablanca"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="departureAddress">Address *</Label>
                              <Textarea
                                id="departureAddress"
                                {...routeForm.register("departureAddress")}
                                placeholder="123 Main Street, Casablanca"
                                rows={2}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-medium text-green-600">Destination</h3>
                            <div className="space-y-2">
                              <Label htmlFor="destinationCountry">Country *</Label>
                              <Select
                                value={routeForm.watch("destinationCountry")}
                                onValueChange={(value) => routeForm.setValue("destinationCountry", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select destination country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {commonCountries.map((country) => (
                                    <SelectItem key={country.value} value={country.value}>
                                      {country.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="destinationCity">City *</Label>
                              <Input
                                id="destinationCity"
                                {...routeForm.register("destinationCity")}
                                placeholder="Paris"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="destinationAddress">Address *</Label>
                              <Textarea
                                id="destinationAddress"
                                {...routeForm.register("destinationAddress")}
                                placeholder="456 Avenue des Champs-Élysées, Paris"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}

                {/* Step 2: Schedule & Timing */}
                {currentStep === 2 && (
                  <FormProvider {...scheduleForm}>
                    <form onSubmit={scheduleForm.handleSubmit(handleScheduleSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Schedule & Timing</h2>
                        <Alert className="mb-6">
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            Set the departure and arrival times, along with estimated distance and duration.
                          </AlertDescription>
                        </Alert>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Departure</h3>
                            <div className="space-y-2">
                              <Label htmlFor="departureTime">Departure Date & Time *</Label>
                              <Input
                                id="departureTime"
                                type="datetime-local"
                                {...scheduleForm.register("departureTime")}
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-medium">Arrival</h3>
                            <div className="space-y-2">
                              <Label htmlFor="arrivalTime">Arrival Date & Time *</Label>
                              <Input
                                id="arrivalTime"
                                type="datetime-local"
                                {...scheduleForm.register("arrivalTime")}
                                min={scheduleForm.watch("departureTime")}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="estimatedDistance">Estimated Distance (km) *</Label>
                            <Input
                              id="estimatedDistance"
                              type="number"
                              {...scheduleForm.register("estimatedDistance", { valueAsNumber: true })}
                              placeholder="500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="estimatedDuration">Estimated Duration (minutes) *</Label>
                            <Input
                              id="estimatedDuration"
                              type="number"
                              {...scheduleForm.register("estimatedDuration", { valueAsNumber: true })}
                              placeholder="480"
                            />
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-blue-800">
                            <Navigation className="h-4 w-4" />
                            <span className="font-medium">Route Summary</span>
                          </div>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>From: {routeForm.watch("departureCity")}, {routeForm.watch("departureCountry")}</p>
                            <p>To: {routeForm.watch("destinationCity")}, {routeForm.watch("destinationCountry")}</p>
                            {scheduleForm.watch("estimatedDistance") > 0 && (
                              <p>Distance: {scheduleForm.watch("estimatedDistance")} km</p>
                            )}
                            {scheduleForm.watch("estimatedDuration") > 0 && (
                              <p>Duration: {Math.round(scheduleForm.watch("estimatedDuration") / 60)}h {scheduleForm.watch("estimatedDuration") % 60}m</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}

                {/* Step 3: Pricing */}
                {currentStep === 3 && (
                  <FormProvider {...pricingForm}>
                    <form onSubmit={pricingForm.handleSubmit(handlePricingSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                        <Alert className="mb-6">
                          <DollarSign className="h-4 w-4" />
                          <AlertDescription>
                            Set the pricing structure for this trip. Customers will see these prices when booking.
                          </AlertDescription>
                        </Alert>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="basePrice">Base Price *</Label>
                              <div className="relative">
                                <Input
                                  id="basePrice"
                                  type="number"
                                  {...pricingForm.register("basePrice", { valueAsNumber: true })}
                                  placeholder="50"
                                  className="pl-16"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                                  {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="pricePerKg">Price per Kilogram *</Label>
                              <div className="relative">
                                <Input
                                  id="pricePerKg"
                                  type="number"
                                  step="0.01"
                                  {...pricingForm.register("pricePerKg", { valueAsNumber: true })}
                                  placeholder="5.00"
                                  className="pl-16"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                                  {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="minimumPrice">Minimum Price *</Label>
                              <div className="relative">
                                <Input
                                  id="minimumPrice"
                                  type="number"
                                  {...pricingForm.register("minimumPrice", { valueAsNumber: true })}
                                  placeholder="25"
                                  className="pl-16"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-500">
                                  {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency *</Label>
                              <Select
                                value={pricingForm.watch("currency")}
                                onValueChange={(value) => pricingForm.setValue("currency", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value}>
                                      {currency.symbol} {currency.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-green-800">
                            <Package className="h-4 w-4" />
                            <span className="font-medium">Pricing Example</span>
                          </div>
                          <div className="mt-2 text-sm text-green-700">
                            <p>For a 10kg package:</p>
                            <p>Base: {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}{pricingForm.watch("basePrice") || 0}</p>
                            <p>Weight: 10kg × {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}{pricingForm.watch("pricePerKg") || 0} = {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}{(pricingForm.watch("pricePerKg") || 0) * 10}</p>
                            <p className="font-medium">Total: {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}{Math.max((pricingForm.watch("basePrice") || 0) + ((pricingForm.watch("pricePerKg") || 0) * 10), pricingForm.watch("minimumPrice") || 0)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}

                {/* Step 4: Driver & Vehicle Assignment */}
                {currentStep === 4 && (
                  <FormProvider {...assignmentForm}>
                    <form onSubmit={assignmentForm.handleSubmit(handleAssignmentSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Driver & Vehicle Assignment</h2>
                        <Alert className="mb-6">
                          <User className="h-4 w-4" />
                          <AlertDescription>
                            Assign a driver and vehicle for this trip. Only active drivers and vehicles are available.
                          </AlertDescription>
                        </Alert>

                        {(driversLoading || vehiclesLoading) ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <Label htmlFor="driverId">Select Driver *</Label>
                              <Select
                                value={assignmentForm.watch("driverId")}
                                onValueChange={(value) => {
                                  assignmentForm.setValue("driverId", value);
                                  // Auto-select vehicle if driver has one assigned
                                  const driver = drivers.find(d => d.id === value);
                                  if (driver?.currentVehicleId) {
                                    assignmentForm.setValue("vehicleId", driver.currentVehicleId);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a driver" />
                                </SelectTrigger>
                                <SelectContent>
                                  {drivers.map((driver) => (
                                    <SelectItem key={driver.id} value={driver.id}>
                                      <div className="flex items-center gap-2">
                                        <span>{driver.name}</span>
                                        {driver.performanceRating && (
                                          <Badge variant="outline" className="text-xs">
                                            ⭐ {driver.performanceRating.toFixed(1)}
                                          </Badge>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-4">
                              <Label htmlFor="vehicleId">Select Vehicle *</Label>
                              <Select
                                value={assignmentForm.watch("vehicleId")}
                                onValueChange={(value) => {
                                  assignmentForm.setValue("vehicleId", value);
                                  // Auto-select driver if vehicle has one assigned
                                  const vehicle = vehicles.find(v => v.id === value);
                                  if (vehicle?.driverId) {
                                    assignmentForm.setValue("driverId", vehicle.driverId);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a vehicle" />
                                </SelectTrigger>
                                <SelectContent>
                                  {vehicles.map((vehicle) => (
                                    <SelectItem key={vehicle.id} value={vehicle.id}>
                                      <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4" />
                                        <span>{vehicle.brand} {vehicle.model}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {vehicle.licensePlate}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* Assignment Preview */}
                        {assignmentForm.watch("driverId") && assignmentForm.watch("vehicleId") && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">Assignment Preview</span>
                            </div>
                            <div className="mt-2 text-sm text-blue-700">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-3 w-3" />
                                <span>
                                  Driver: {drivers.find(d => d.id === assignmentForm.watch("driverId"))?.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="h-3 w-3" />
                                <span>
                                  Vehicle: {vehicles.find(v => v.id === assignmentForm.watch("vehicleId"))?.brand}{" "}
                                  {vehicles.find(v => v.id === assignmentForm.watch("vehicleId"))?.model}{" "}
                                  ({vehicles.find(v => v.id === assignmentForm.watch("vehicleId"))?.licensePlate})
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(3)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}

                {/* Step 5: Review & Create */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Review & Create Trip</h2>
                      <Alert className="mb-6">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Please review all trip information before creating. The trip will be visible to customers once created.
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="space-y-6">
                      {/* Route Summary */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Route className="h-4 w-4" />
                          Route Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">From:</span>
                            <p className="font-medium">
                              {routeForm.watch("departureAddress")}, {routeForm.watch("departureCity")}, {routeForm.watch("departureCountry")}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">To:</span>
                            <p className="font-medium">
                              {routeForm.watch("destinationAddress")}, {routeForm.watch("destinationCity")}, {routeForm.watch("destinationCountry")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Summary */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Schedule & Timing
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Departure:</span>
                            <p className="font-medium">
                              {new Date(scheduleForm.watch("departureTime")).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Arrival:</span>
                            <p className="font-medium">
                              {new Date(scheduleForm.watch("arrivalTime")).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Distance:</span>
                            <p className="font-medium">{scheduleForm.watch("estimatedDistance")} km</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Duration:</span>
                            <p className="font-medium">
                              {Math.round(scheduleForm.watch("estimatedDuration") / 60)}h {scheduleForm.watch("estimatedDuration") % 60}m
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Pricing
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Base Price:</span>
                            <p className="font-medium">
                              {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}
                              {pricingForm.watch("basePrice")}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Price per kg:</span>
                            <p className="font-medium">
                              {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}
                              {pricingForm.watch("pricePerKg")}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Minimum Price:</span>
                            <p className="font-medium">
                              {currencies.find(c => c.value === pricingForm.watch("currency"))?.symbol}
                              {pricingForm.watch("minimumPrice")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Assignment Summary */}
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Driver & Vehicle Assignment
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Driver:</span>
                            <p className="font-medium">
                              {drivers.find(d => d.id === assignmentForm.watch("driverId"))?.name}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-500">Vehicle:</span>
                            <p className="font-medium">
                              {vehicles.find(v => v.id === assignmentForm.watch("vehicleId"))?.brand}{" "}
                              {vehicles.find(v => v.id === assignmentForm.watch("vehicleId"))?.model}{" "}
                              ({vehicles.find(v => v.id === assignmentForm.watch("vehicleId"))?.licensePlate})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(4)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Trip...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Organization Trip
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}