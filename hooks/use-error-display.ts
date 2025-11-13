import { useState, useCallback } from "react";

export interface ErrorState {
  show: boolean;
  type: "service-unavailable" | "booking-failed" | "network" | "authentication" | "generic";
  title: string;
  description: string;
  retryAction?: () => void;
  dismissAction?: () => void;
}

export function useErrorDisplay() {
  const [error, setError] = useState<ErrorState>({
    show: false,
    type: "generic",
    title: "",
    description: "",
  });

  const showError = useCallback((
    type: ErrorState["type"],
    title: string,
    description: string,
    retryAction?: () => void,
    dismissAction?: () => void
  ) => {
    setError({
      show: true,
      type,
      title,
      description,
      retryAction,
      dismissAction,
    });
  }, []);

  const hideError = useCallback(() => {
    setError(prev => ({ ...prev, show: false }));
  }, []);

  const showServiceUnavailable = useCallback((retryAction?: () => void, dismissAction?: () => void) => {
    showError("service-unavailable", "Service Temporarily Unavailable",
      "Our booking service is currently experiencing some issues. We're working to resolve this as quickly as possible. Please try again in a few moments.",
      retryAction, dismissAction
    );
  }, [showError]);

  const showBookingFailed = useCallback((title: string, description: string, retryAction?: () => void, dismissAction?: () => void) => {
    showError("booking-failed", title, description, retryAction, dismissAction);
  }, [showError]);

  const showNetworkError = useCallback((retryAction?: () => void, dismissAction?: () => void) => {
    showError("network", "Connection Issue",
      "We're having trouble connecting to our servers. Please check your internet connection and try again.",
      retryAction, dismissAction
    );
  }, [showError]);

  const showAuthenticationError = useCallback((retryAction?: () => void) => {
    showError("authentication", "Authentication Required",
      "You need to be logged in to complete this action. Please sign in to continue with your booking.",
      retryAction
    );
  }, [showError]);

  const showGenericError = useCallback((title: string, description: string, retryAction?: () => void, dismissAction?: () => void) => {
    showError("generic", title, description, retryAction, dismissAction);
  }, [showError]);

  return {
    error,
    showError,
    hideError,
    showServiceUnavailable,
    showBookingFailed,
    showNetworkError,
    showAuthenticationError,
    showGenericError,
  };
}