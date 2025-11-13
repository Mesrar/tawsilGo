import React from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  XCircle, 
  Truck, 
  Package, 
  Calendar,
  User,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define all possible status types for type safety
export type BookingStatus = 
  | "PENDING" 
  | "PAID" 
  | "CONFIRMED" 
  | "CANCELLED" 
  | "DELIVERED" 
  | "REJECTED"
  | "REFUNDED";

export type TripStatus = 
  | "SCHEDULED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELLED"
  | "DELAYED";

export type ParcelStatus = 
  | "pending" 
  | "in-transit" 
  | "delivered" 
  | "returned";

export type GenericStatus = BookingStatus | TripStatus | ParcelStatus | string;

// Define the style and icon configuration for each status
type StatusConfig = {
  color: string;
  icon: React.ReactNode;
  label?: string; // Optional override for the display text
};

/**
 * Status configuration map for all possible statuses across the application
 */
const STATUS_CONFIG: Record<string, StatusConfig> = {
  // Booking statuses
  "PENDING": {
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
    icon: <Clock className="h-3.5 w-3.5 mr-1" />,
  },
  "PAID": {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    icon: <CreditCard className="h-3.5 w-3.5 mr-1" />,
  },
  "CONFIRMED": {
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
  },
  "CANCELLED": {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
  },
  "DELIVERED": {
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
  },
  "REJECTED": {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
  },
  "REFUNDED": {
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500",
    icon: <CreditCard className="h-3.5 w-3.5 mr-1" />,
    label: "Refunded",
  },

  // Trip statuses
  "SCHEDULED": {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    icon: <Calendar className="h-3.5 w-3.5 mr-1" />,
  },
  "IN_PROGRESS": {
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
    icon: <Truck className="h-3.5 w-3.5 mr-1" />,
    label: "In Progress",
  },
  "COMPLETED": {
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
  },
  "DELAYED": {
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500",
    icon: <Clock className="h-3.5 w-3.5 mr-1" />,
  },

  // Parcel statuses (lowercase variants)
  "pending": {
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
    icon: <Package className="h-3.5 w-3.5 mr-1" />,
    label: "Pending",
  },
  "in-transit": {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    icon: <Truck className="h-3.5 w-3.5 mr-1" />,
    label: "In Transit",
  },
  "delivered": {
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    label: "Delivered",
  },
  "returned": {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
    label: "Returned",
  },
};

/**
 * Default configuration for unknown statuses
 */
const DEFAULT_STATUS_CONFIG: StatusConfig = {
  color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400",
  icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
};

/**
 * StatusBadge options for customization
 */
export interface StatusBadgeOptions {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'filled' | 'outline' | 'subtle';
  className?: string;
  uppercase?: boolean;
}

/**
 * Gets the status configuration for a given status
 * @param status The status string
 * @returns The status configuration with color and icon
 */
export const getStatusConfig = (status: GenericStatus): StatusConfig => {
  return STATUS_CONFIG[status] || DEFAULT_STATUS_CONFIG;
};

/**
 * Renders a status badge with consistent styling based on the status
 * Can be used for bookings, trips, parcels, or any other status type
 * 
 * @param status The status string
 * @param options Optional configuration options
 * @returns A badge component with appropriate styling
 */
export const StatusBadge: React.FC<{
  status: GenericStatus;
  options?: StatusBadgeOptions;
}> = ({ status, options = {} }) => {
  const { 
    size = 'md', 
    showIcon = true, 
    variant = 'filled',
    className = '',
    uppercase = false
  } = options;

  const config = getStatusConfig(status);
  
  // Determine display text
  let displayText = config.label || status;
  
  // Handle case formatting
  if (uppercase) {
    displayText = displayText.toUpperCase();
  } else if (displayText === displayText.toUpperCase()) {
    // If the status is all uppercase, convert to title case
    displayText = displayText
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "px-3 py-1",
  };

  // Variant classes
  const variantClasses = {
    filled: config.color,
    outline: `border border-current bg-transparent ${config.color.split(' ')[1]}`,
    subtle: `bg-opacity-10 ${config.color.split(' ')[1]}`,
  };

  return (
    <Badge 
      className={cn(
        "font-medium rounded-full flex items-center",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {showIcon && config.icon}
      {displayText}
    </Badge>
  );
};

/**
 * Legacy helper function for backward compatibility
 * @deprecated Use StatusBadge component instead
 */
export const getStatusBadge = (status: GenericStatus, options?: StatusBadgeOptions) => {
  return <StatusBadge status={status} options={options} />;
};

/**
 * Legacy helper function for getting just the style configuration
 * @deprecated Use getStatusConfig instead
 */
export const getStatusStyle = (status: GenericStatus) => {
  const config = getStatusConfig(status);
  return {
    color: config.color,
    icon: config.icon,
  };
};