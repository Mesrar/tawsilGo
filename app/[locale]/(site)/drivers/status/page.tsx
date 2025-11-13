"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/app/services/driverService";
import { Loader2 } from "lucide-react";
import { OnboardingContainer } from "@/components/Driver/onboarding-container";
import { VerificationStatusStep } from "@/components/Driver/verification-status-step";

export default function DriverStatusPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  // Fetch driver profile
  const { data: profileResponse, isLoading, error } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: () => driverService.getMyDriverProfile(),
    enabled: sessionStatus === "authenticated",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/drivers/status");
    }
  }, [sessionStatus, router]);

  // Redirect to register if no driver profile found
  useEffect(() => {
    if (profileResponse && profileResponse.success && !profileResponse.data) {
      router.push("/drivers/register");
    }
  }, [profileResponse, router]);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <OnboardingContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </OnboardingContainer>
    );
  }

  if (sessionStatus === "unauthenticated" || !profileResponse?.data) {
    return null;
  }

  const driverProfile = profileResponse.data;

  return (
    <OnboardingContainer>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Driver Registration Status
          </h1>
          <p className="text-muted-foreground">
            Track your application progress
          </p>
        </div>

        <VerificationStatusStep
          driverId={driverProfile.id}
          onVerified={() => router.push("/drivers/dashboard")}
        />
      </div>
    </OnboardingContainer>
  );
}
