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
import { fleetService } from "@/app/services/fleetService";
import { vehicleService } from "@/app/services/vehicleService";

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
  Car,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

// Validation schemas
const vehicleInfoSchema = z.object({
  type: z.enum(["motorcycle", "car", "van", "pickup_truck", "box_truck", "flatbed_truck", "refrigerated_truck"]),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, "License plate is required"),
  color: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
});

const capacitySchema = z.object({
  weight: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  volume: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }),
  passengers: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
});

const featuresSchema = z.object({
  features: z.array(z.string()),
});

type VehicleInfoFormData = z.infer<typeof vehicleInfoSchema>;
type CapacityFormData = z.infer<typeof capacitySchema>;
type FeaturesFormData = z.infer<typeof featuresSchema>;

const vehicleTypes = [
  { value: "motorcycle", label: "Motorcycle", icon: "🏍️" },
  { value: "car", label: "Car", icon: "🚗" },
  { value: "van", label: "Van", icon: "🚐" },
  { value: "pickup_truck", label: "Pickup Truck", icon: "🚚" },
  { value: "box_truck", label: "Box Truck", icon: "🚛" },
  { value: "flatbed_truck", label: "Flatbed Truck", icon: "🚛" },
  { value: "refrigerated_truck", label: "Refrigerated Truck", icon: "🚛" },
];

const availableFeatures = [
  { id: "air_conditioning", name: "Air Conditioning", category: "comfort" },
  { id: "heating", name: "Heating", category: "comfort" },
  { id: "gps_tracking", name: "GPS Tracking", category: "safety" },
  { id: "dashcam", name: "Dash Camera", category: "safety" },
  { id: "bluetooth", name: "Bluetooth", category: "comfort" },
  { id: "usb_charging", name: "USB Charging", category: "comfort" },
  { id: "parking_sensors", name: "Parking Sensors", category: "safety" },
  { id: "roof_rack", name: "Roof Rack", category: "capacity" },
  { id: "trailer_hitch", name: "Trailer Hitch", category: "capacity" },
  { id: "refrigeration", name: "Refrigeration", category: "specialized" },
  { id: "lift_gate", name: "Lift Gate", category: "specialized" },
  { id: "climate_control", name: "Climate Control", category: "specialized" },
];

const steps = [
  { id: "vehicle-info", title: "Vehicle Information", description: "Basic vehicle details" },
  { id: "capacity", title: "Capacity & Dimensions", description: "Weight and space specifications" },
  { id: "features", title: "Features & Equipment", description: "Vehicle features and amenities" },
  { id: "review", title: "Review & Add", description: "Review information and add to fleet" },
];

export default function AddVehiclePage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Step forms
  const vehicleInfoForm = useForm<VehicleInfoFormData>({
    resolver: zodResolver(vehicleInfoSchema),
    defaultValues: {
      type: "car",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      color: "",
      purchaseDate: "",
      purchasePrice: undefined,
      insuranceProvider: "",
      policyNumber: "",
    },
  });

  const capacityForm = useForm<CapacityFormData>({
    resolver: zodResolver(capacitySchema),
    defaultValues: {
      weight: { min: 0, max: 500 },
      volume: { min: 0, max: 2 },
      dimensions: { length: 400, width: 180, height: 150 },
      passengers: { min: 1, max: 4 },
    },
  });

  const featuresForm = useForm<FeaturesFormData>({
    defaultValues: { features: [] },
  });

  // Add vehicle mutation
  const addVehicleMutation = useMutation({
    mutationFn: fleetService.addVehicleToFleet,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Vehicle added to fleet successfully!");
        queryClient.invalidateQueries({ queryKey: ["fleet-vehicles"] });
        queryClient.invalidateQueries({ queryKey: ["fleet-overview"] });
        router.push("/organizations/fleet");
      } else {
        toast.error(response.error?.message || "Failed to add vehicle");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add vehicle");
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/organizations/fleet/vehicles/add");
    }
  }, [sessionStatus, router]);

  // Handle step submissions
  const handleVehicleInfoSubmit = async (data: VehicleInfoFormData) => {
    setCurrentStep(2);
  };

  const handleCapacitySubmit = async (data: CapacityFormData) => {
    setCurrentStep(3);
  };

  const handleFeaturesSubmit = async () => {
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    const vehicleData = {
      ...vehicleInfoForm.getValues(),
      capacity: capacityForm.getValues(),
      features: selectedFeatures,
    };

    setIsSubmitting(true);
    try {
      await addVehicleMutation.mutateAsync(vehicleData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const getDefaultCapacity = (vehicleType: string) => {
    const defaults = {
      motorcycle: { weight: { min: 1, max: 20 }, volume: { min: 0.01, max: 0.1 }, dimensions: { length: 60, width: 40, height: 40 } },
      car: { weight: { min: 10, max: 100 }, volume: { min: 0.2, max: 0.5 }, dimensions: { length: 100, width: 60, height: 50 } },
      van: { weight: { min: 100, max: 1000 }, volume: { min: 2, max: 15 }, dimensions: { length: 250, width: 180, height: 180 } },
      pickup_truck: { weight: { min: 500, max: 2000 }, volume: { min: 1, max: 5 }, dimensions: { length: 200, width: 160, height: 120 } },
      box_truck: { weight: { min: 1000, max: 5000 }, volume: { min: 15, max: 40 }, dimensions: { length: 600, width: 250, height: 260 } },
      flatbed_truck: { weight: { min: 2000, max: 8000 }, volume: { min: 20, max: 50 }, dimensions: { length: 700, width: 250, height: 100 } },
      refrigerated_truck: { weight: { min: 1000, max: 4000 }, volume: { min: 15, max: 35 }, dimensions: { length: 600, width: 250, height: 260 } },
    };
    return defaults[vehicleType as keyof typeof defaults] || defaults.car;
  };

  // Update capacity when vehicle type changes
  useEffect(() => {
    const vehicleType = vehicleInfoForm.watch("type");
    if (vehicleType) {
      const defaultCapacity = getDefaultCapacity(vehicleType);
      capacityForm.reset(defaultCapacity);
    }
  }, [vehicleInfoForm.watch("type")]);

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

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/organizations/fleet")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fleet
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Add Vehicle to Fleet
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Add a new vehicle to your organization's fleet
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

                {/* Step 1: Vehicle Information */}
                {currentStep === 1 && (
                  <FormProvider {...vehicleInfoForm}>
                    <form onSubmit={vehicleInfoForm.handleSubmit(handleVehicleInfoSubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Vehicle Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="type">Vehicle Type *</Label>
                            <Select
                              value={vehicleInfoForm.watch("type")}
                              onValueChange={(value) => vehicleInfoForm.setValue("type", value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                              <SelectContent>
                                {vehicleTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <span>{type.icon}</span>
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {vehicleInfoForm.formState.errors.type && (
                              <p className="text-sm text-red-600">{vehicleInfoForm.formState.errors.type.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="year">Year *</Label>
                            <Input
                              id="year"
                              type="number"
                              {...vehicleInfoForm.register("year", { valueAsNumber: true })}
                              placeholder="2024"
                            />
                            {vehicleInfoForm.formState.errors.year && (
                              <p className="text-sm text-red-600">{vehicleInfoForm.formState.errors.year.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="brand">Brand *</Label>
                            <Input
                              id="brand"
                              {...vehicleInfoForm.register("brand")}
                              placeholder="Toyota"
                            />
                            {vehicleInfoForm.formState.errors.brand && (
                              <p className="text-sm text-red-600">{vehicleInfoForm.formState.errors.brand.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="model">Model *</Label>
                            <Input
                              id="model"
                              {...vehicleInfoForm.register("model")}
                              placeholder="Camry"
                            />
                            {vehicleInfoForm.formState.errors.model && (
                              <p className="text-sm text-red-600">{vehicleInfoForm.formState.errors.model.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="licensePlate">License Plate *</Label>
                            <Input
                              id="licensePlate"
                              {...vehicleInfoForm.register("licensePlate")}
                              placeholder="12345-A"
                            />
                            {vehicleInfoForm.formState.errors.licensePlate && (
                              <p className="text-sm text-red-600">{vehicleInfoForm.formState.errors.licensePlate.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                              id="color"
                              {...vehicleInfoForm.register("color")}
                              placeholder="White"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Purchase Date</Label>
                            <Input
                              id="purchaseDate"
                              type="date"
                              {...vehicleInfoForm.register("purchaseDate")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Purchase Price</Label>
                            <Input
                              id="purchasePrice"
                              type="number"
                              {...vehicleInfoForm.register("purchasePrice", { valueAsNumber: true })}
                              placeholder="25000"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                            <Input
                              id="insuranceProvider"
                              {...vehicleInfoForm.register("insuranceProvider")}
                              placeholder="Insurance Company"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="policyNumber">Policy Number</Label>
                            <Input
                              id="policyNumber"
                              {...vehicleInfoForm.register("policyNumber")}
                              placeholder="POL-123456"
                            />
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

                {/* Step 2: Capacity & Dimensions */}
                {currentStep === 2 && (
                  <FormProvider {...capacityForm}>
                    <form onSubmit={capacityForm.handleSubmit(handleCapacitySubmit)} className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Capacity & Dimensions</h2>
                        <Alert className="mb-6">
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Default values are provided based on vehicle type. Adjust as needed for your specific vehicle.
                          </AlertDescription>
                        </Alert>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-medium">Weight Capacity (kg)</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="weightMin">Minimum</Label>
                                <Input
                                  id="weightMin"
                                  type="number"
                                  {...capacityForm.register("weight.min", { valueAsNumber: true })}
                                  placeholder="0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="weightMax">Maximum</Label>
                                <Input
                                  id="weightMax"
                                  type="number"
                                  {...capacityForm.register("weight.max", { valueAsNumber: true })}
                                  placeholder="500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="font-medium">Volume Capacity (m³)</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="volumeMin">Minimum</Label>
                                <Input
                                  id="volumeMin"
                                  type="number"
                                  step="0.1"
                                  {...capacityForm.register("volume.min", { valueAsNumber: true })}
                                  placeholder="0.5"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="volumeMax">Maximum</Label>
                                <Input
                                  id="volumeMax"
                                  type="number"
                                  step="0.1"
                                  {...capacityForm.register("volume.max", { valueAsNumber: true })}
                                  placeholder="2.0"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 md:col-span-2">
                            <h3 className="font-medium">Dimensions (cm)</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="length">Length</Label>
                                <Input
                                  id="length"
                                  type="number"
                                  {...capacityForm.register("dimensions.length", { valueAsNumber: true })}
                                  placeholder="400"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="width">Width</Label>
                                <Input
                                  id="width"
                                  type="number"
                                  {...capacityForm.register("dimensions.width", { valueAsNumber: true })}
                                  placeholder="180"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="height">Height</Label>
                                <Input
                                  id="height"
                                  type="number"
                                  {...capacityForm.register("dimensions.height", { valueAsNumber: true })}
                                  placeholder="150"
                                />
                              </div>
                            </div>
                          </div>

                          {vehicleInfoForm.watch("type") === "car" && (
                            <div className="space-y-4 md:col-span-2">
                              <h3 className="font-medium">Passenger Capacity</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="passengersMin">Minimum</Label>
                                  <Input
                                    id="passengersMin"
                                    type="number"
                                    {...capacityForm.register("passengers.min", { valueAsNumber: true })}
                                    placeholder="1"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="passengersMax">Maximum</Label>
                                  <Input
                                    id="passengersMax"
                                    type="number"
                                    {...capacityForm.register("passengers.max", { valueAsNumber: true })}
                                    placeholder="4"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
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

                {/* Step 3: Features & Equipment */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Features & Equipment</h2>
                      <p className="text-slate-600 mb-6">Select the features available in this vehicle</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {Object.entries(
                        availableFeatures.reduce((acc, feature) => {
                          if (!acc[feature.category]) acc[feature.category] = [];
                          acc[feature.category].push(feature);
                          return acc;
                        }, {} as Record<string, typeof availableFeatures>)
                      ).map(([category, features]) => (
                        <div key={category} className="space-y-3">
                          <h3 className="font-medium capitalize">{category}</h3>
                          <div className="space-y-2">
                            {features.map((feature) => (
                              <div key={feature.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={feature.id}
                                  checked={selectedFeatures.includes(feature.id)}
                                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                                />
                                <Label htmlFor={feature.id} className="text-sm font-normal">
                                  {feature.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
                        type="button"
                        onClick={handleFeaturesSubmit}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Add */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Review Vehicle Information</h2>
                      <p className="text-slate-600 mb-6">Please review all information before adding the vehicle to your fleet</p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Vehicle Details</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Type:</span> {vehicleTypes.find(t => t.value === vehicleInfoForm.watch("type"))?.label}
                          </div>
                          <div>
                            <span className="text-slate-500">Year:</span> {vehicleInfoForm.watch("year")}
                          </div>
                          <div>
                            <span className="text-slate-500">Brand:</span> {vehicleInfoForm.watch("brand")}
                          </div>
                          <div>
                            <span className="text-slate-500">Model:</span> {vehicleInfoForm.watch("model")}
                          </div>
                          <div>
                            <span className="text-slate-500">License Plate:</span> {vehicleInfoForm.watch("licensePlate")}
                          </div>
                          <div>
                            <span className="text-slate-500">Color:</span> {vehicleInfoForm.watch("color") || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Capacity</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Weight Capacity:</span> {capacityForm.watch("weight.min")} - {capacityForm.watch("weight.max")} kg
                          </div>
                          <div>
                            <span className="text-slate-500">Volume Capacity:</span> {capacityForm.watch("volume.min")} - {capacityForm.watch("volume.max")} m³
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-slate-500">Dimensions:</span> {capacityForm.watch("dimensions.length")} × {capacityForm.watch("dimensions.width")} × {capacityForm.watch("dimensions.height")} cm
                          </div>
                        </div>
                      </div>

                      {selectedFeatures.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <h3 className="font-medium mb-3">Features</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedFeatures.map((featureId) => {
                              const feature = availableFeatures.find(f => f.id === featureId);
                              return feature ? (
                                <Badge key={featureId} variant="secondary">
                                  {feature.name}
                                </Badge>
                              ) : null;
                            })}
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
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Vehicle...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Fleet
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