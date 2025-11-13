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

// Services
import { organizationService } from "@/app/services/organizationService";

// Types
import { Organization, UpdateOrganizationRequest } from "@/types/organization";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building, Upload, Save, Check, AlertCircle, User, Mail, Phone, MapPin, Globe, FileText, Users, Truck } from "lucide-react";

// Validation schema
const updateProfileSchema = {
  businessName: "",
  businessType: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  registrationNumber: "",
  taxId: "",
  website: "",
  description: "",
};

type UpdateProfileFormData = typeof updateProfileSchema;

const businessTypes = [
  { value: "freight_forward", label: "Freight Forwarding" },
  { value: "moving_company", label: "Moving Company" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "corporate", label: "Corporate" },
  { value: "logistics_provider", label: "Logistics Provider" },
  { value: "other", label: "Other" },
];

export default function OrganizationProfilePage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile form
  const profileForm = useForm<UpdateProfileFormData>({
    defaultValues: updateProfileSchema,
  });

  // Get current organization
  const { data: organizationData, isLoading, error } = useQuery({
    queryKey: ["current-organization"],
    queryFn: () => organizationService.getCurrentOrganization(),
    enabled: sessionStatus === "authenticated",
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: organizationService.updateOrganization,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["current-organization"] });
      } else {
        toast.error(response.error?.message || "Failed to update profile");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ type, file }: { type: string; file: File }) =>
      organizationService.uploadVerificationDocument(type as any, file),
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["current-organization"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload document");
    },
  });

  // Initialize form with organization data
  useEffect(() => {
    if (organizationData?.data?.organization) {
      const org = organizationData.data.organization;
      profileForm.reset({
        businessName: org.businessName || "",
        businessType: org.businessType || "",
        email: org.email || "",
        phone: org.phone || "",
        address: org.address || "",
        city: org.city || "",
        country: org.country || "",
        registrationNumber: org.registrationNumber || "",
        taxId: org.taxId || "",
        website: org.website || "",
        description: org.description || "",
      });
    }
  }, [organizationData, profileForm]);

  // Handle profile update
  const handleProfileUpdate = async (data: UpdateProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(data as UpdateOrganizationRequest);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (type: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    await uploadDocumentMutation.mutateAsync({ type, file });
  };

  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    // This would be implemented with a separate logo upload endpoint
    toast.success("Logo upload functionality coming soon!");
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/organizations/profile");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load organization profile. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const organization = organizationData?.data?.organization;
  const stats = organizationData?.data?.stats;

  if (!organization) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No organization profile found. Please register your organization first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const verificationStatusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    needs_review: "bg-orange-100 text-orange-800",
  }[organization.verificationStatus];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={organization.logo} alt={organization.businessName} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {organization.businessName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {organization.businessName}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={verificationStatusColor}>
                      {organization.verificationStatus.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {businessTypes.find(t => t.value === organization.businessType)?.label}
                    </Badge>
                    {organization.isActive ? (
                      <Badge variant="secondary" className="text-green-600">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-red-600">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {organization.description || "No description provided"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="text-lg font-semibold">
                  {new Date(organization.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Drivers</p>
                      <p className="text-2xl font-bold">{stats.totalDrivers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Truck className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Active Vehicles</p>
                      <p className="text-2xl font-bold">{stats.activeVehicles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Trips</p>
                      <p className="text-2xl font-bold">{stats.totalTrips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Building className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</p>
                      <p className="text-2xl font-bold">{stats.averageDriverRating.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-slate-500">Email</Label>
                        <p className="font-medium">{organization.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-slate-500">Phone</Label>
                        <p className="font-medium">{organization.phone}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-slate-500">Address</Label>
                      <p className="font-medium">
                        {organization.address}, {organization.city}, {organization.country}
                      </p>
                    </div>
                    {organization.website && (
                      <div>
                        <Label className="text-sm text-slate-500">Website</Label>
                        <p className="font-medium text-blue-600 hover:underline">
                          <a href={organization.website} target="_blank" rel="noopener noreferrer">
                            {organization.website}
                          </a>
                        </p>
                      </div>
                    )}
                    {(organization.registrationNumber || organization.taxId) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-slate-500">Registration Number</Label>
                          <p className="font-medium">{organization.registrationNumber || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-slate-500">Tax ID</Label>
                          <p className="font-medium">{organization.taxId || "N/A"}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Administrator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={organization.admin.profileImage} alt={organization.admin.name} />
                        <AvatarFallback>
                          {organization.admin.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{organization.admin.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{organization.admin.email}</p>
                        <p className="text-sm text-slate-500">{organization.admin.phone}</p>
                        <Badge variant="outline" className="mt-1">
                          {organization.admin.isOwner ? "Owner" : "Admin"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Edit Profile Tab */}
            <TabsContent value="edit-profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Business Profile</CardTitle>
                  <CardDescription>
                    Update your organization information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormProvider {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            {...profileForm.register("businessName")}
                            placeholder="Enter your business name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type</Label>
                          <Select
                            value={profileForm.watch("businessType")}
                            onValueChange={(value) => profileForm.setValue("businessType", value)}
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Business Email</Label>
                          <Input
                            id="email"
                            type="email"
                            {...profileForm.register("email")}
                            placeholder="business@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Business Phone</Label>
                          <Input
                            id="phone"
                            {...profileForm.register("phone")}
                            placeholder="+212 600 000 000"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Business Address</Label>
                          <Input
                            id="address"
                            {...profileForm.register("address")}
                            placeholder="123 Business Street"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            {...profileForm.register("city")}
                            placeholder="Casablanca"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            {...profileForm.register("country")}
                            placeholder="Morocco"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            {...profileForm.register("registrationNumber")}
                            placeholder="Company registration number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID</Label>
                          <Input
                            id="taxId"
                            {...profileForm.register("taxId")}
                            placeholder="Tax identification number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            {...profileForm.register("website")}
                            placeholder="https://www.example.com"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description">Business Description</Label>
                          <Textarea
                            id="description"
                            {...profileForm.register("description")}
                            placeholder="Tell us about your business..."
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Verification Documents
                  </CardTitle>
                  <CardDescription>
                    Manage your organization verification documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Upload required documents to verify your organization. Accepted formats: PDF, JPG, PNG (Max 10MB per file)
                      </AlertDescription>
                    </Alert>

                    {organizationData?.data?.documents && organizationData.data.documents.length > 0 ? (
                      <div className="space-y-4">
                        {organizationData.data.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-slate-400" />
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-slate-500">
                                  {doc.type.replace('_', ' ')} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {doc.status}
                              </Badge>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No documents uploaded yet</p>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { type: "business_registration", label: "Business Registration" },
                          { type: "tax_id", label: "Tax ID Document" },
                          { type: "address_proof", label: "Address Proof" },
                          { type: "insurance", label: "Insurance Document" },
                        ].map((docType) => (
                          <div key={docType.type} className="space-y-2">
                            <Label>{docType.label}</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleDocumentUpload(docType.type, file);
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Manage your organization team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {organizationData?.data?.drivers && organizationData.data.drivers.length > 0 ? (
                    <div className="space-y-4">
                      {organizationData.data.drivers.map((driver) => (
                        <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {driver.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-slate-500">{driver.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              driver.status === 'active' ? 'bg-green-100 text-green-800' :
                              driver.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {driver.status}
                            </Badge>
                            {driver.isVerified && (
                              <Badge variant="secondary" className="text-blue-600">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No team members yet</p>
                      <p className="text-sm">Invite team members to join your organization</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Invite Team Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}