"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface SessionMonitorProps {
  children: ReactNode;
}

const SessionMonitor = ({ children }: SessionMonitorProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const checkedRef = useRef(false);

  // Check for token expiration
  useEffect(() => {
    // Skip if not authenticated or we've already checked
    if (status !== "authenticated" || checkedRef.current) return;

    // If session has TokenExpired error, handle it
    if (session?.error === "TokenExpired") {
      handleExpiredSession();
      return;
    }

    // If session has tokenExpires, check if it's expired
    const sessionWithCustomProps = session as any;
    if (sessionWithCustomProps?.tokenExpires) {
      const now = Math.floor(Date.now() / 1000);
      if (sessionWithCustomProps.tokenExpires < now) {
        handleExpiredSession();
        return;
      }
    }

    checkedRef.current = true;
  }, [session, status, router]);

  const handleExpiredSession = async () => {
    console.log("Session expired, logging out user");

    // Get the current URL for redirect after login
    const callbackUrl = encodeURIComponent(window.location.pathname);

    // Sign out the user without redirecting
    await signOut({ redirect: false });

    // Redirect to sign-in page with callback URL and expired flag
    router.push(`/auth/signin?callbackUrl=${callbackUrl}&tokenExpired=true`);
  };

  // Return children so the component acts as a wrapper
  return <>{children}</>;
};

export default SessionMonitor;
