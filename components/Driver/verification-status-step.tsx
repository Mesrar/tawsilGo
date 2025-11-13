import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/app/services/driverService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, Clock, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VerificationStatusStepProps {
  driverId: string;
  onVerified?: () => void;
}

export function VerificationStatusStep({
  driverId,
  onVerified,
}: VerificationStatusStepProps) {
  // Poll for status every 5 seconds if pending verification
  const {
    data: statusResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverStatus", driverId],
    queryFn: () => driverService.getRegistrationStatus(driverId),
    refetchInterval: (data) => {
      // Continue polling if status is pending_verification
      return data?.data?.status === "pending_verification" ? 5000 : false;
    },
    enabled: !!driverId,
  });

  const status = statusResponse?.data;

  // Call onVerified callback when status becomes verified
  useEffect(() => {
    if (status?.status === "verified" && onVerified) {
      onVerified();
    }
  }, [status?.status, onVerified]);

  if (isLoading) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-muted-foreground">Loading status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load verification status. Please try again.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case "verified":
        return <CheckCircle2 className="h-16 w-16 text-green-600" />;
      case "pending_verification":
        return <Clock className="h-16 w-16 text-amber-600 animate-pulse" />;
      case "deactivated":
        return <XCircle className="h-16 w-16 text-red-600" />;
      default:
        return <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case "verified":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending_verification":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "deactivated":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case "verified":
        return "Verified";
      case "pending_verification":
        return "Pending Verification";
      case "deactivated":
        return "Application Rejected";
      case "profile_created":
        return "Profile Created";
      case "documents_submitted":
        return "Documents Submitted";
      case "vehicle_added":
        return "Vehicle Added";
      default:
        return status.status;
    }
  };

  const progress = (status.completed_steps.length / 4) * 100;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
            {getStatusIcon()}
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl mb-2">Registration Status</CardTitle>
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Completed Steps */}
        <div>
          <h3 className="font-semibold mb-3">Completed Steps</h3>
          <div className="space-y-2">
            {["profile", "documents", "vehicle", "verification"].map((step) => {
              const isCompleted = status.completed_steps.includes(step);
              return (
                <div
                  key={step}
                  className="flex items-center gap-2 text-sm"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span className={isCompleted ? "font-medium" : "text-muted-foreground"}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Messages */}
        {status.status === "pending_verification" && (
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Your application is currently under review by our admin team. You will be
              notified once your account is verified. This usually takes 1-2 business days.
            </AlertDescription>
          </Alert>
        )}

        {status.status === "verified" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Congratulations! Your driver account has been verified. You can now start
              accepting delivery requests.
            </AlertDescription>
          </Alert>
        )}

        {status.status === "deactivated" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Your application was not approved. Please contact support for more information.
            </AlertDescription>
          </Alert>
        )}

        {/* Missing Items */}
        {status.missing_items && status.missing_items.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">Missing required items:</p>
              <ul className="list-disc list-inside space-y-1">
                {status.missing_items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Next Step */}
        {status.next_step && !status.is_complete && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-1">Next Step</p>
            <p className="font-medium">{status.next_step}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
