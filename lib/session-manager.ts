// lib/session-manager.ts
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { refreshToken } from "./api/api-client";
import { useToast } from "@/hooks/use-toast";
import { showLoginModal } from "./auth-context";

// Constants
const SESSION_WARNING_THRESHOLD = 120; // Show warning 2 minutes before expiry
const REFRESH_INTERVAL = 60000; // Check every minute

// Import your actual modal function from where it's defined

export function useSessionManager() {
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Memoize handlers to prevent recreation on each render
  const handleRefresh = useCallback(async () => {
    try {
      // Use the refreshToken function from your api-client
      const refreshed = await refreshToken();
      
      if (refreshed) {
        setShowWarning(false);
        // Update the session after successful refresh
        await updateSession();
        
        toast({
          title: "Session extended",
          description: "Your session has been refreshed successfully.",
        });
      } else {
        toast({
          title: "Unable to refresh session",
          description: "Please save your work and log in again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      toast({
        title: "Session refresh failed",
        description: "Please save your work and log in again.",
        variant: "destructive",
      });
    }
  }, [toast, updateSession]);
  
  const handleExpiry = useCallback(() => {
    showLoginModal({
      message: "Your session has expired. Please sign in to continue.",
      returnUrl: window.location.pathname + window.location.search,
    });
  }, []);

  useEffect(() => {
    if (!session?.expires) return;
    
    // Parse expiration time
    const expiry = new Date(session.expires);
    setExpiresAt(expiry);
    
    const checkSession = () => {
      if (!expiry) return;
      
      const now = new Date();
      const remainingSeconds = Math.floor((expiry.getTime() - now.getTime()) / 1000);
      setTimeRemaining(remainingSeconds);
      
      // Show warning when session is about to expire
      if (remainingSeconds <= SESSION_WARNING_THRESHOLD && !showWarning) {
        setShowWarning(true);
        
        // Show toast with countdown
        toast({
          title: "Session expiring soon",
          description: "Your session will expire soon. Click to extend.",
          duration: 10000, // Show for 10 seconds instead of the full countdown
        });
        
        // If still about to expire, show more persistent UI
        if (remainingSeconds <= 60) {
          // You can implement a more persistent notification here
          // For example, a modal that can't be dismissed
        }
      }
      
      // Handle actual expiry
      if (remainingSeconds <= 0 && showWarning) {
        handleExpiry();
        setShowWarning(false); // Reset after handling
      }
    };
    
    // Initial check
    checkSession();
    
    // Set up interval
    const interval = setInterval(checkSession, 10000); // Check more frequently (every 10 seconds)
    
    return () => clearInterval(interval);
  }, [session, showWarning, toast, handleRefresh, handleExpiry]);

  // Expose a function to manually check/refresh the session
  const checkAndRefreshSession = useCallback(async () => {
    if (!expiresAt) return false;
    
    const now = new Date();
    const remainingSeconds = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);
    
    // If session is getting close to expiry, refresh it proactively
    if (remainingSeconds < 300) { // 5 minutes
      return await handleRefresh();
    }
    
    return true;
  }, [expiresAt, handleRefresh]);
  
  return {
    expiresAt,
    timeRemaining,
    showWarning,
    refreshSession: handleRefresh,
    checkAndRefreshSession,
    isExpired: timeRemaining <= 0,
  };
}