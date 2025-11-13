"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Schemas
import {
  driverApplicationSchema,
  DriverApplicationFormData,
  vehicleSchema,
  VehicleFormData,
} from "@/lib/driver-schemas";

// Services
import { driverService } from "@/app/services/driverService";

// Types
import { DriverRegistrationFormData, DocumentType } from "@/types/driver";

// Components
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/Driver/stepper";
import { ApplicationStep } from "@/components/Driver/application-step";
import { DocumentUploadStep } from "@/components/Driver/document-upload-step-new";
import { VehicleFormStep } from "@/components/Driver/vehicle-form-step";
import { ReviewStep } from "@/components/Driver/review-step";
import { VerificationStatusStep } from "@/components/Driver/verification-status-step";
import { OnboardingContainer } from "@/components/Driver/onboarding-container";
import { Loader2, ChevronLeft, ChevronRight, Send } from "lucide-react";

const steps = [
  "Application",
  "Documents",
  "Vehicle",
  "Review",
  "Verification",
];

export default function DriverRegistrationPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<DriverRegistrationFormData>>({
    documents: {},
    uploadedDocuments: [],
    currentStep: 1,
  });

  // Step 1 form
  const applicationForm = useForm<DriverApplicationFormData>({
    resolver: zodResolver(driverApplicationSchema),
    defaultValues: {
      license_number: "",
      phone_number: "",
      timezone: "",
      experience_years: undefined,
    },
  });

  // Step 3 form
  const vehicleForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      type: "sedan",
      plate_number: "",
      manufacture_year: undefined,
      model: "",
      color: "",
      max_weight: 0,
      max_volume: 0,
      max_packages: 1,
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/drivers/register");
    }
  }, [sessionStatus, router]);

  // Load saved form data from session storage
  useEffect(() => {
    const savedData = sessionStorage.getItem("driverRegistrationData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setCurrentStep(parsed.currentStep || 1);

        // Restore form values
        if (parsed.license_number) {
          applicationForm.reset({
            license_number: parsed.license_number,
            phone_number: parsed.phone_number,
            timezone: parsed.timezone,
            experience_years: parsed.experience_years,
          });
        }

        if (parsed.vehicle) {
          vehicleForm.reset(parsed.vehicle);
        }
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  // Save form data to session storage
  const saveFormData = (data: Partial<DriverRegistrationFormData>) => {
    const updatedData = { ...formData, ...data, currentStep };
    setFormData(updatedData);

    // Don't save File objects to sessionStorage (they can't be serialized)
    const { documents, ...dataToSave } = updatedData;
    sessionStorage.setItem("driverRegistrationData", JSON.stringify(dataToSave));
  };

  // Step 1: Apply for driver role
  const applyMutation = useMutation({
    mutationFn: driverService.applyForDriver,
    onSuccess: (response) => {
      if (response.success && response.data) {
        const driverId = response.data.id;
        saveFormData({ driverId });
        toast.success("Application submitted successfully!");
        setCurrentStep(2);
      } else {
        toast.error(response.error?.message || "Failed to submit application");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  // Step 2: Upload documents
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ driverId, type, file }: { driverId: string; type: DocumentType; file: File }) =>
      driverService.uploadDocument(driverId, type, file),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        const updatedDocs = [...(formData.uploadedDocuments || []), response.data];
        saveFormData({ uploadedDocuments: updatedDocs });
        toast.success(`${variables.type} uploaded successfully`);
      } else {
        // Log detailed error for debugging
        console.error(`Upload failed for ${variables.type}:`, response.error);
        toast.error(`Failed to upload ${variables.type}: ${response.error?.message || 'Unknown error'}`);
      }
    },
    onError: (error: any, variables) => {
      console.error(`Upload error for ${variables.type}:`, error);
      toast.error(`Failed to upload ${variables.type}: ${error.message}`);
    },
  });

  // Step 3: Add vehicle
  const addVehicleMutation = useMutation({
    mutationFn: ({ driverId, vehicleData }: { driverId: string; vehicleData: VehicleFormData }) =>
      driverService.addVehicle(driverId, vehicleData),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Vehicle added successfully!");
        setCurrentStep(4);
      } else {
        toast.error(response.error?.message || "Failed to add vehicle");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add vehicle");
    },
  });

  // Step 4: Submit for verification
  const submitVerificationMutation = useMutation({
    mutationFn: (driverId: string) => driverService.submitForVerification(driverId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Application submitted for verification!");
        sessionStorage.removeItem("driverRegistrationData");
        setCurrentStep(5);
      } else {
        toast.error(response.error?.message || "Failed to submit for verification");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit for verification");
    },
  });

  // Handle step 1 submission
  const handleStep1Submit = async (data: DriverApplicationFormData) => {
    saveFormData(data);
    await applyMutation.mutateAsync(data);
  };

  // Handle step 2 (documents) continuation
  const handleStep2Continue = async () => {
    const { license, identity, insurance, vehicle_registration } = formData.documents || {};

    if (!license || !identity) {
      toast.error("Please upload both license and identity documents");
      return;
    }

    if (!formData.driverId) {
      toast.error("Driver ID not found. Please restart the process.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload required documents
      const uploads: Promise<any>[] = [];

      if (license && !formData.uploadedDocuments?.find((d) => d.type === "license")) {
        uploads.push(uploadDocumentMutation.mutateAsync({
          driverId: formData.driverId,
          type: "license",
          file: license,
        }));
      }

      if (identity && !formData.uploadedDocuments?.find((d) => d.type === "identity")) {
        uploads.push(uploadDocumentMutation.mutateAsync({
          driverId: formData.driverId,
          type: "identity",
          file: identity,
        }));
      }

      if (insurance && !formData.uploadedDocuments?.find((d) => d.type === "insurance")) {
        uploads.push(uploadDocumentMutation.mutateAsync({
          driverId: formData.driverId,
          type: "insurance",
          file: insurance,
        }));
      }

      if (vehicle_registration && !formData.uploadedDocuments?.find((d) => d.type === "vehicle_registration")) {
        uploads.push(uploadDocumentMutation.mutateAsync({
          driverId: formData.driverId,
          type: "vehicle_registration",
          file: vehicle_registration,
        }));
      }

      const results = await Promise.all(uploads);

      // Check if all uploads succeeded
      const failedUploads = results.filter((r) => !r.success);
      if (failedUploads.length > 0) {
        toast.error("Some documents failed to upload. Please try again.");
        return;
      }

      toast.success("All documents uploaded successfully!");
      setCurrentStep(3);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload documents. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle step 3 (vehicle) submission
  const handleStep3Submit = async (data: VehicleFormData) => {
    if (!formData.driverId) {
      toast.error("Driver ID not found. Please restart the process.");
      return;
    }

    saveFormData({ vehicle: data });
    await addVehicleMutation.mutateAsync({
      driverId: formData.driverId,
      vehicleData: data,
    });
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    if (!formData.driverId) {
      toast.error("Driver ID not found. Please restart the process.");
      return;
    }

    await submitVerificationMutation.mutateAsync(formData.driverId);
  };

  // Handle document change
  const handleDocumentChange = (type: DocumentType, file: File | undefined) => {
    const updatedDocuments = { ...(formData.documents || {}), [type]: file };
    saveFormData({ documents: updatedDocuments });
  };

  if (sessionStatus === "loading") {
    return (
      <OnboardingContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </OnboardingContainer>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return null;
  }

  return (
    <OnboardingContainer>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Become a Driver
          </h1>
          <p className="text-muted-foreground">
            Complete the registration process to start delivering
          </p>
        </div>

        {/* Stepper */}
        <Stepper currentStep={currentStep} steps={steps} />

        {/* Form Steps */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <FormProvider {...applicationForm}>
              <form onSubmit={applicationForm.handleSubmit(handleStep1Submit)} className="space-y-6">
                <ApplicationStep form={applicationForm} />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={applyMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {applyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <DocumentUploadStep
                documents={formData.documents || {}}
                onDocumentChange={handleDocumentChange}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleStep2Continue}
                  disabled={isSubmitting || !formData.documents?.license || !formData.documents?.identity}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <FormProvider {...vehicleForm}>
              <form onSubmit={vehicleForm.handleSubmit(handleStep3Submit)} className="space-y-6">
                <VehicleFormStep form={vehicleForm} />
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={addVehicleMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {addVehicleMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Vehicle...
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <ReviewStep formData={formData} />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitVerificationMutation.isPending}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {submitVerificationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit for Verification
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 5 && formData.driverId && (
            <VerificationStatusStep
              driverId={formData.driverId}
              onVerified={() => router.push("/drivers/dashboard")}
            />
          )}
        </motion.div>
      </div>
    </OnboardingContainer>
  );
}
