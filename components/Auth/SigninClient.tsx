"use client";

import Signin from "@/components/Auth/Signin";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

function SigninClientContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const tokenExpired = searchParams?.get("tokenExpired") === "true";
  const [showExpiredMessage, setShowExpiredMessage] = useState(tokenExpired);


  useEffect(() => {
    if (status === "authenticated" && !showExpiredMessage) {
      // Check if session has an error
      if (session?.error === "TokenExpired") {
        setShowExpiredMessage(true);
        return;
      }
      
      // Redirect authenticated users away
      router.replace(callbackUrl);
    }
  }, [session, status, router, callbackUrl, showExpiredMessage]);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {showExpiredMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Session Expired</AlertTitle>
          <AlertDescription>
            Your session has expired. Please sign in again to continue.
          </AlertDescription>
        </Alert>
      )}
      <Signin />
    </>
  );
}

const SigninClient = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SigninClientContent />
    </Suspense>
  );
};

export default SigninClient;