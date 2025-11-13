"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Schemas
import { z } from "zod";

// Services
import { organizationService } from "@/app/services/organizationService";

// Types
import { OrganizationAdminRegistrationRequest } from "@/types/user";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ChevronLeft, ChevronRight, Building, FileText, Upload, Check, AlertCircle, User, Mail, Phone, MapPin, Globe } from "lucide-react";

const organizationSteps = [
  {
    id: "business-info",
    title: "Business Information",
    icon: Building,
    description: "Tell us about your organization",
  },
  {
    id: "admin-account",
    title: "Admin Account",
    icon: User,
    description: "Create the main administrator account",
  },
  {
    id: "verification-docs",
    title: "Verification Documents",
    icon: FileText,
    description: "Upload required verification documents",
  },
  {
    id: "review",
    title: "Review & Submit",
    icon: Check,
    description: "Review your information before submission",
  },
];

// Validation schemas
const businessInfoSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.enum(["freight_forward", "moving_company", "ecommerce", "corporate", "logistics_provider", "other"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

const adminAccountSchema = z.object({
  adminName: z.string().min(2, "Name must be at least 2 characters"),
  adminEmail: z.string().email("Invalid email address"),
  adminPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  adminConfirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.adminPassword === data.adminConfirmPassword, {
  message: "Passwords don't match",
  path: ["adminConfirmPassword"],
});

const documentsSchema = z.object({
  businessRegistrationDocument: z.instanceof(File).optional(),
  taxIdDocument: z.instanceof(File).optional(),
  addressProofDocument: z.instanceof(File).optional(),
  insuranceDocument: z.instanceof(File).optional(),
});

const termsSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  acceptPrivacyPolicy: z.boolean().refine((val) => val === true, "You must accept the privacy policy"),
});

const fullRegistrationSchema = businessInfoSchema.and(adminAccountSchema).and(documentsSchema).and(termsSchema);

type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
type AdminAccountFormData = z.infer<typeof adminAccountSchema>;
type DocumentsFormData = z.infer<typeof documentsSchema>;
type FullRegistrationData = z.infer<typeof fullRegistrationSchema>;

const businessTypes = [
  { value: "freight_forward", label: "Freight Forwarding" },
  { value: "moving_company", label: "Moving Company" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "corporate", label: "Corporate" },
  { value: "logistics_provider", label: "Logistics Provider" },
  { value: "other", label: "Other" },
];

export default function OrganizationRegistrationPage() {
  const t = useTranslations('organization.register');
  const locale = useLocale();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FullRegistrationData>>({});

  // Step forms
  const businessInfoForm = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: "",
      businessType: "freight_forward",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      registrationNumber: "",
      taxId: "",
      website: "",
      description: "",
    },
  });

  const adminAccountForm = useForm<AdminAccountFormData>({
    resolver: zodResolver(adminAccountSchema),
    defaultValues: {
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
      adminConfirmPassword: "",
    },
  });

  // Registration mutation
  const registrationMutation = useMutation({
    mutationFn: organizationService.register,
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success("Organization registered successfully!");
        sessionStorage.removeItem("organizationRegistrationData");

        // Redirect based on verification requirements
        if (response.data.requiresVerification) {
          router.push("/organizations/verification-pending");
        } else {
          router.push("/organizations/dashboard");
        }
      } else {
        toast.error(response.error?.message || "Failed to register organization");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register organization");
    },
  });

  // Load saved form data from session storage
  useEffect(() => {
    const savedData = sessionStorage.getItem("organizationRegistrationData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setCurrentStep(parsed.currentStep || 1);

        // Restore form values
        if (parsed.businessName) {
          businessInfoForm.reset({
            businessName: parsed.businessName,
            businessType: parsed.businessType,
            email: parsed.email,
            phone: parsed.phone,
            address: parsed.address,
            city: parsed.city,
            country: parsed.country,
            registrationNumber: parsed.registrationNumber,
            taxId: parsed.taxId,
            website: parsed.website,
            description: parsed.description,
          });
        }

        if (parsed.adminName) {
          adminAccountForm.reset({
            adminName: parsed.adminName,
            adminEmail: parsed.adminEmail,
            adminPhone: parsed.adminPhone,
            adminPassword: parsed.adminPassword,
            adminConfirmPassword: parsed.adminConfirmPassword,
          });
        }
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  // Save form data to session storage
  const saveFormData = (data: Partial<FullRegistrationData>) => {
    const updatedData = { ...formData, ...data, currentStep };
    setFormData(updatedData);

    // Don't save File objects to sessionStorage
    const { businessRegistrationDocument, taxIdDocument, addressProofDocument, insuranceDocument, ...dataToSave } = updatedData;
    sessionStorage.setItem("organizationRegistrationData", JSON.stringify(dataToSave));
  };

  // Handle step submissions
  const handleBusinessInfoSubmit = async (data: BusinessInfoFormData) => {
    saveFormData(data);
    setCurrentStep(2);
  };

  const handleAdminAccountSubmit = async (data: AdminAccountFormData) => {
    saveFormData(data);
    setCurrentStep(3);
  };

  const handleDocumentsSubmit = (data: DocumentsFormData) => {
    saveFormData(data);
    setCurrentStep(4);
  };

  const handleFinalSubmit = async () => {
    const fullData = {
      ...formData,
      acceptTerms: true,
      acceptPrivacyPolicy: true,
    } as FullRegistrationData;

    setIsSubmitting(true);
    try {
      await registrationMutation.mutateAsync(fullData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentChange = (docType: keyof DocumentsFormData, file: File | undefined) => {
    const updatedDocs = { ...formData, [docType]: file };
    saveFormData(updatedDocs);
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const progressPercentage = (currentStep / organizationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Register Your Organization
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Join TawsilGo's enterprise platform and manage your fleet with ease
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {organizationSteps.map((step, index) => {
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCompleted
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-slate-300 bg-slate-100 text-slate-500"
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    {index < organizationSteps.length - 1 && (
                      <div className={`w-full h-1 mx-4 transition-colors ${
                        isCompleted ? "bg-green-600" : "bg-slate-300"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-slate-600">
              {organizationSteps.map((step, index) => (
                <div key={step.id} className={`text-center ${
                  index + 1 === currentStep ? "text-blue-600 font-semibold" : ""
                }`}>
                  <div className="hidden md:block">{step.title}</div>
                </div>
              ))}
            </div>
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
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {(() => {
                    const StepIcon = organizationSteps[currentStep - 1].icon;
                    return <StepIcon className="h-6 w-6 text-blue-600" />;
                  })()}
                  {organizationSteps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>
                  {organizationSteps[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Step 1: Business Information */}
                {currentStep === 1 && (
                  <FormProvider {...businessInfoForm}>
                    <form onSubmit={businessInfoForm.handleSubmit(handleBusinessInfoSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            {...businessInfoForm.register("businessName")}
                            placeholder="Enter your business name"
                          />
                          {businessInfoForm.formState.errors.businessName && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.businessName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type *</Label>
                          <Select
                            value={businessInfoForm.watch("businessType")}
                            onValueChange={(value) => businessInfoForm.setValue("businessType", value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {businessInfoForm.formState.errors.businessType && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.businessType.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Business Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...businessInfoForm.register("email")}
                            placeholder="business@example.com"
                          />
                          {businessInfoForm.formState.errors.email && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Business Phone *</Label>
                          <Input
                            id="phone"
                            {...businessInfoForm.register("phone")}
                            placeholder="+212 600 000 000"
                          />
                          {businessInfoForm.formState.errors.phone && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.phone.message}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Business Address *</Label>
                          <Input
                            id="address"
                            {...businessInfoForm.register("address")}
                            placeholder="123 Business Street"
                          />
                          {businessInfoForm.formState.errors.address && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.address.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            {...businessInfoForm.register("city")}
                            placeholder="Casablanca"
                          />
                          {businessInfoForm.formState.errors.city && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.city.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            {...businessInfoForm.register("country")}
                            placeholder="Morocco"
                          />
                          {businessInfoForm.formState.errors.country && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.country.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            {...businessInfoForm.register("registrationNumber")}
                            placeholder="Company registration number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID</Label>
                          <Input
                            id="taxId"
                            {...businessInfoForm.register("taxId")}
                            placeholder="Tax identification number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            {...businessInfoForm.register("website")}
                            placeholder="https://www.example.com"
                          />
                          {businessInfoForm.formState.errors.website && (
                            <p className="text-sm text-red-600">{businessInfoForm.formState.errors.website.message}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description">Business Description</Label>
                          <Textarea
                            id="description"
                            {...businessInfoForm.register("description")}
                            placeholder="Tell us about your business..."
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}

                {/* Step 2: Admin Account */}
                {currentStep === 2 && (
                  <FormProvider {...adminAccountForm}>
                    <form onSubmit={adminAccountForm.handleSubmit(handleAdminAccountSubmit)} className="space-y-6">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This account will have full administrative access to your organization.
                          You can add more team members after registration.
                        </AlertDescription>
                      </Alert>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="adminName">Admin Name *</Label>
                          <Input
                            id="adminName"
                            {...adminAccountForm.register("adminName")}
                            placeholder="John Doe"
                          />
                          {adminAccountForm.formState.errors.adminName && (
                            <p className="text-sm text-red-600">{adminAccountForm.formState.errors.adminName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminEmail">Admin Email *</Label>
                          <Input
                            id="adminEmail"
                            type="email"
                            {...adminAccountForm.register("adminEmail")}
                            placeholder="admin@example.com"
                          />
                          {adminAccountForm.formState.errors.adminEmail && (
                            <p className="text-sm text-red-600">{adminAccountForm.formState.errors.adminEmail.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminPhone">Admin Phone *</Label>
                          <Input
                            id="adminPhone"
                            {...adminAccountForm.register("adminPhone")}
                            placeholder="+212 600 000 000"
                          />
                          {adminAccountForm.formState.errors.adminPhone && (
                            <p className="text-sm text-red-600">{adminAccountForm.formState.errors.adminPhone.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminPassword">Password *</Label>
                          <Input
                            id="adminPassword"
                            type="password"
                            {...adminAccountForm.register("adminPassword")}
                            placeholder="Enter a strong password"
                          />
                          {adminAccountForm.formState.errors.adminPassword && (
                            <p className="text-sm text-red-600">{adminAccountForm.formState.errors.adminPassword.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminConfirmPassword">Confirm Password *</Label>
                          <Input
                            id="adminConfirmPassword"
                            type="password"
                            {...adminAccountForm.register("adminConfirmPassword")}
                            placeholder="Confirm your password"
                          />
                          {adminAccountForm.formState.errors.adminConfirmPassword && (
                            <p className="text-sm text-red-600">{adminAccountForm.formState.errors.adminConfirmPassword.message}</p>
                          )}
                        </div>
                      </div>

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
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}

                {/* Step 3: Verification Documents */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        Upload the required documents to verify your organization.
                        Accepted formats: PDF, JPG, PNG (Max 10MB per file)
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      {[
                        {
                          key: "businessRegistrationDocument" as keyof DocumentsFormData,
                          label: "Business Registration Document",
                          description: "Certificate of incorporation or business license",
                          required: true,
                        },
                        {
                          key: "taxIdDocument" as keyof DocumentsFormData,
                          label: "Tax ID Document",
                          description: "Tax identification certificate",
                          required: false,
                        },
                        {
                          key: "addressProofDocument" as keyof DocumentsFormData,
                          label: "Address Proof",
                          description: "Utility bill or lease agreement",
                          required: false,
                        },
                        {
                          key: "insuranceDocument" as keyof DocumentsFormData,
                          label: "Insurance Document",
                          description: "Business liability insurance",
                          required: false,
                        },
                      ].map((doc) => (
                        <div key={doc.key} className="space-y-2">
                          <Label htmlFor={doc.key}>
                            {doc.label} {doc.required && "*"}
                          </Label>
                          <div className="flex items-center gap-4">
                            <Input
                              id={doc.key}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 10 * 1024 * 1024) {
                                    toast.error("File size must be less than 10MB");
                                    return;
                                  }
                                  handleDocumentChange(doc.key, file);
                                }
                              }}
                              className="flex-1"
                            />
                            {formData[doc.key] && (
                              <Badge variant="secondary" className="text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Uploaded
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{doc.description}</p>
                        </div>
                      ))}
                    </div>

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
                        type="button"
                        onClick={() => handleDocumentsSubmit(formData as DocumentsFormData)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please review all information before submitting. You'll need to verify your email after registration.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Business Information</h3>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Business Name:</span> {formData.businessName}
                            </div>
                            <div>
                              <span className="font-medium">Type:</span> {businessTypes.find(t => t.value === formData.businessType)?.label}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {formData.email}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {formData.phone}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.country}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Admin Account</h3>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Name:</span> {formData.adminName}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {formData.adminEmail}
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> {formData.adminPhone}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Documents</h3>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                          <div className="space-y-2 text-sm">
                            {formData.businessRegistrationDocument && (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Business Registration Document</span>
                              </div>
                            )}
                            {formData.taxIdDocument && (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Tax ID Document</span>
                              </div>
                            )}
                            {formData.addressProofDocument && (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Address Proof</span>
                              </div>
                            )}
                            {formData.insuranceDocument && (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                <span>Insurance Document</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" defaultChecked />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the Terms and Conditions and Privacy Policy
                          </Label>
                        </div>
                      </div>
                    </div>

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
                        disabled={isSubmitting || !formData.businessRegistrationDocument}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Register Organization
                            <Check className="ml-2 h-4 w-4" />
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