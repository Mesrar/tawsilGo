import React from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorAlertProps {
  title: string;
  description: string;
  variant?: "destructive" | "warning" | "info";
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  showDismiss?: boolean;
  className?: string;
}

export function ErrorAlert({
  title,
  description,
  variant = "destructive",
  onRetry,
  onDismiss,
  showRetry = true,
  showDismiss = true,
  className = "",
}: ErrorAlertProps) {
  const getIconColor = () => {
    switch (variant) {
      case "destructive":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  const getBgColor = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
      default:
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
    }
  };

  const getRetryButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "default" as const;
      case "warning":
        return "outline" as const;
      case "info":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className={`relative z-30 ${className}`}>
      <Alert
        className={`${getBgColor()} border-2 shadow-sm rounded-xl p-6`}
        variant={variant}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 ${getIconColor()}`}>
            <AlertCircle className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AlertTitle className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {title}
            </AlertTitle>
            <AlertDescription className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </AlertDescription>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {showRetry && onRetry && (
                <Button
                  variant={getRetryButtonVariant()}
                  size="sm"
                  onClick={onRetry}
                  className="gap-2 h-9 px-4"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}

              {showDismiss && onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="gap-2 h-9 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}

// Specialized error components for different scenarios
export function ServiceUnavailableError({ onRetry, onDismiss }: {
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorAlert
      title="Service Temporarily Unavailable"
      description="Our booking service is currently experiencing some issues. We're working to resolve this as quickly as possible. Please try again in a few moments."
      variant="warning"
      showRetry={true}
      showDismiss={true}
      onRetry={onRetry}
      onDismiss={onDismiss}
      className="my-6 animate-in slide-in-from-top-2 duration-300"
    />
  );
}

export function BookingFailedError({
  title = "Booking Failed",
  description,
  onRetry,
  onDismiss
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorAlert
      title={title}
      description={description}
      variant="destructive"
      showRetry={true}
      showDismiss={true}
      onRetry={onRetry}
      onDismiss={onDismiss}
      className="my-6 animate-in slide-in-from-top-2 duration-300"
    />
  );
}

export function NetworkError({ onRetry, onDismiss }: {
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorAlert
      title="Connection Issue"
      description="We're having trouble connecting to our servers. Please check your internet connection and try again."
      variant="warning"
      showRetry={true}
      showDismiss={true}
      onRetry={onRetry}
      onDismiss={onDismiss}
      className="my-6 animate-in slide-in-from-top-2 duration-300"
    />
  );
}

export function AuthenticationError({ onRetry }: {
  onRetry?: () => void;
}) {
  return (
    <ErrorAlert
      title="Authentication Required"
      description="You need to be logged in to complete this action. Please sign in to continue with your booking."
      variant="info"
      showRetry={true}
      showDismiss={false}
      onRetry={onRetry}
      className="my-6 animate-in slide-in-from-top-2 duration-300"
    />
  );
}