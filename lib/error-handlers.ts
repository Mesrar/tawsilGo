// lib/error-handlers.ts
import { toast } from "@/hooks/use-toast"; // Import the non-hook version
import { showLoginModal } from "@/lib/auth-context";

export async function handleApiError(response: Response, options?: {
  saveState?: () => void,
  onUnauthorized?: () => void,
}) {
  if (response.ok) return null;
  
  // No need for useToast() here - just use the toast function directly
  
  // Try to parse the response JSON
  let errorData;
  try {
    errorData = await response.json();
  } catch (e) {
    errorData = { message: "An error occurred" };
  }
  
  // Handle different error status codes
  switch (response.status) {
    case 401: {
      // Save state if provided
      if (options?.saveState) {
        options.saveState();
      }
      
      // Show toast - use the imported toast function directly
      toast({
        title: "Authentication Required",
        description: errorData.message || "Please sign in to continue",
        variant: "destructive",
      });
      
      // Show login modal with 401 status code
      const returnUrl = window.location.pathname + window.location.search;
      showLoginModal({ 
        message: errorData.message || "Your session has expired. Please sign in to continue.", 
        returnUrl,
        statusCode: 401
      });
      
      // Call optional callback
      options?.onUnauthorized?.();
      
      return new Error("Authentication required");
    }
    
    case 403: {
      // Save state if provided
      if (options?.saveState) {
        options.saveState();
      }
      
 
      
      // Show login modal for re-authentication with 403 status code
      const returnUrl = window.location.pathname + window.location.search;
      showLoginModal({ 
        message: errorData.message || "Authentication required. Please sign in with the appropriate credentials.", 
        returnUrl,
        statusCode: 403
      });
      
      // Call optional callback
      options?.onUnauthorized?.();
      
      return new Error("Access denied");
    }
    
    // Other cases...
    
    default:
      toast({
        title: "Error",
        description: errorData.message || `An error occurred (${response.status})`,
        variant: "destructive",
      });
      return new Error(errorData.message || `Error: ${response.status}`);
  }
}