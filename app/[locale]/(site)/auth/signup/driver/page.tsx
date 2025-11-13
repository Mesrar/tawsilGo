"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Legacy driver signup redirect page
 * This page redirects to the new driver registration flow at /drivers/register
 *
 * The new flow uses the updated backend architecture with:
 * - Separate user authentication (required first)
 * - 5-step driver application process
 * - Document uploads
 * - Admin verification
 */
export default function DriverSignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new driver registration page
    router.replace("/drivers/register");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4 p-8">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Redirecting to Driver Registration</h2>
          <p className="text-muted-foreground">
            Please wait while we redirect you to the new registration process...
          </p>
        </div>
      </div>
    </div>
  );
}
