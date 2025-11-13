import { DriverRegistrationFormData } from "@/types/driver";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, IdCard, FileText, Truck, Phone, Globe, Award, Hash, Calendar, Weight, Box, Package } from "lucide-react";

interface ReviewStepProps {
  formData: Partial<DriverRegistrationFormData>;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const { license_number, phone_number, timezone, experience_years, documents, uploadedDocuments, vehicle } =
    formData;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Review & Submit</CardTitle>
            <CardDescription>
              Please review your information before submitting for verification
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Application Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <IdCard className="h-5 w-5 text-blue-600" />
            Driver Application
          </h3>
          <div className="space-y-2 ml-7">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">License Number</span>
              <span className="font-medium">{license_number || "Not provided"}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Phone Number</span>
              <span className="font-medium">{phone_number || "Not provided"}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-medium">{timezone || "Not provided"}</span>
            </div>
            {experience_years !== undefined && (
              <>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{experience_years} years</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Documents
          </h3>
          <div className="space-y-2 ml-7">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Driver's License</span>
              {documents?.license ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              ) : uploadedDocuments?.find((d) => d.type === "license") ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              ) : (
                <Badge variant="destructive">Missing</Badge>
              )}
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Identity Document</span>
              {documents?.identity ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              ) : uploadedDocuments?.find((d) => d.type === "identity") ? (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Uploaded
                </Badge>
              ) : (
                <Badge variant="destructive">Missing</Badge>
              )}
            </div>
            {(documents?.insurance || uploadedDocuments?.find((d) => d.type === "insurance")) && (
              <>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Insurance</span>
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                </div>
              </>
            )}
            {(documents?.vehicle_registration || uploadedDocuments?.find((d) => d.type === "vehicle_registration")) && (
              <>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Vehicle Registration</span>
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Uploaded
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Vehicle Information */}
        {vehicle && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              Vehicle Information
            </h3>
            <div className="space-y-2 ml-7">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{vehicle.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">{vehicle.type}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Plate Number</span>
                <span className="font-medium">{vehicle.plate_number}</span>
              </div>
              {vehicle.manufacture_year && (
                <>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{vehicle.manufacture_year}</span>
                  </div>
                </>
              )}
              {vehicle.model && (
                <>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">{vehicle.model}</span>
                  </div>
                </>
              )}
              {vehicle.color && (
                <>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Color</span>
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Max Weight</span>
                <span className="font-medium">{vehicle.max_weight} kg</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Max Volume</span>
                <span className="font-medium">{vehicle.max_volume} m³</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Max Packages</span>
                <span className="font-medium">{vehicle.max_packages}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
