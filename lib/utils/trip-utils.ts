import { formatDistanceToNow, differenceInHours, isPast, isFuture } from "date-fns";
import type { Trip, TripPrice } from "@/types/trip";

/**
 * Calculate potential earnings for a trip based on capacity utilization
 */
export function calculateTripEarnings(trip: Trip): number {
  const { price, totalCapacity, remainingCapacity } = trip;
  const usedCapacity = totalCapacity - remainingCapacity;

  // Calculate earnings: base price + (used weight * price per kg)
  const earnings = price.basePrice + (usedCapacity * price.pricePerKg);

  // Apply premium factor if exists
  const finalEarnings = earnings * (1 + (price.premiumFactor || 0));

  return Math.max(finalEarnings, price.minimumPrice);
}

/**
 * Calculate potential maximum earnings if trip is fully booked
 */
export function calculateMaxEarnings(trip: Trip): number {
  const { price, totalCapacity } = trip;

  const maxEarnings = price.basePrice + (totalCapacity * price.pricePerKg);
  const finalEarnings = maxEarnings * (1 + (price.premiumFactor || 0));

  return Math.max(finalEarnings, price.minimumPrice);
}

/**
 * Format currency value with proper symbol
 */
export function formatCurrency(amount: number, currency: string = "EUR"): string {
  const symbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    MAD: "MAD",
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Get urgency level based on departure time
 * Returns: 'critical' (< 1h), 'high' (1-3h), 'medium' (3-12h), 'low' (> 12h)
 */
export function getTripUrgency(departureTime: string): 'critical' | 'high' | 'medium' | 'low' {
  const hoursUntilDeparture = differenceInHours(new Date(departureTime), new Date());

  if (hoursUntilDeparture < 0) return 'critical'; // Overdue
  if (hoursUntilDeparture < 1) return 'critical';
  if (hoursUntilDeparture <= 3) return 'high';
  if (hoursUntilDeparture <= 12) return 'medium';
  return 'low';
}

/**
 * Get color classes for urgency level
 */
export function getUrgencyColors(urgency: 'critical' | 'high' | 'medium' | 'low'): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = {
    critical: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
    high: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    medium: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    low: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    },
  };

  return colors[urgency];
}

/**
 * Format relative time for trip departure/arrival
 */
export function formatRelativeTime(dateTime: string): string {
  const date = new Date(dateTime);
  const now = new Date();

  if (isPast(date)) {
    return `Started ${formatDistanceToNow(date, { addSuffix: true })}`;
  }

  if (isFuture(date)) {
    const hours = differenceInHours(date, now);

    if (hours < 1) {
      const minutes = Math.round((date.getTime() - now.getTime()) / (1000 * 60));
      return `Departs in ${minutes}m`;
    }

    if (hours < 24) {
      const remainingMinutes = Math.round((date.getTime() - now.getTime()) / (1000 * 60)) % 60;
      return `Departs in ${hours}h ${remainingMinutes}m`;
    }

    return `Departs ${formatDistanceToNow(date, { addSuffix: true })}`;
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  const normalizedStatus = status.toLowerCase().replace('_', '');

  const colors: Record<string, { bg: string; text: string; border: string }> = {
    scheduled: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    inprogress: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
    pending: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    },
  };

  return colors[normalizedStatus] || colors.pending;
}

/**
 * Format status for display
 */
export function formatStatus(status: string): string {
  return status
    .replace('_', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Calculate capacity utilization percentage
 */
export function calculateCapacityUtilization(totalCapacity: number, remainingCapacity: number): number {
  if (totalCapacity === 0) return 0;
  const used = totalCapacity - remainingCapacity;
  return Math.round((used / totalCapacity) * 100);
}

/**
 * Get capacity color based on utilization
 */
export function getCapacityColor(utilizationPercentage: number): string {
  if (utilizationPercentage >= 80) return "bg-red-500";
  if (utilizationPercentage >= 60) return "bg-amber-500";
  if (utilizationPercentage >= 40) return "bg-blue-500";
  return "bg-green-500";
}

/**
 * Get country flag emoji
 */
export function getCountryFlag(countryName: string): string {
  const countryFlags: Record<string, string> = {
    france: "🇫🇷",
    spain: "🇪🇸",
    belgium: "🇧🇪",
    morocco: "🇲🇦",
    portugal: "🇵🇹",
    italy: "🇮🇹",
    germany: "🇩🇪",
    netherlands: "🇳🇱",
  };

  return countryFlags[countryName.toLowerCase()] || "🌍";
}

/**
 * Format location for display (show city only)
 */
export function formatLocation(address: string): string {
  // Extract city from full address (usually first part before comma)
  const parts = address.split(',');
  return parts[0].trim();
}

/**
 * Get contextual action buttons based on trip status and time
 */
export function getContextualActions(trip: Trip): {
  primary: { label: string; action: string; variant?: 'default' | 'destructive' };
  secondary: Array<{ label: string; action: string; variant?: 'outline' | 'ghost' }>;
} {
  const status = trip.status.toUpperCase();
  const urgency = getTripUrgency(trip.departureTime);

  if (status === 'IN_PROGRESS') {
    return {
      primary: { label: 'Continue Trip', action: 'continue' },
      secondary: [
        { label: 'Check Parcels', action: 'parcels', variant: 'outline' },
        { label: 'Contact Support', action: 'support', variant: 'ghost' },
      ],
    };
  }

  if (status === 'SCHEDULED') {
    if (urgency === 'critical' || urgency === 'high') {
      return {
        primary: { label: 'Start Trip', action: 'start' },
        secondary: [
          { label: 'Navigate', action: 'navigate', variant: 'outline' },
          { label: 'View Details', action: 'details', variant: 'ghost' },
        ],
      };
    }

    return {
      primary: { label: 'View Details', action: 'details' },
      secondary: [
        { label: 'Edit', action: 'edit', variant: 'outline' },
        { label: 'Cancel', action: 'cancel', variant: 'outline' },
      ],
    };
  }

  if (status === 'COMPLETED') {
    return {
      primary: { label: 'View Summary', action: 'summary' },
      secondary: [
        { label: 'Download Report', action: 'report', variant: 'outline' },
      ],
    };
  }

  // Default fallback
  return {
    primary: { label: 'View Details', action: 'details' },
    secondary: [],
  };
}

/**
 * Filter trips by status and time period
 */
export function filterTrips(
  trips: Trip[],
  filter: 'all' | 'active' | 'today' | 'week' | 'completed'
): Trip[] {
  const now = new Date();

  switch (filter) {
    case 'active':
      return trips.filter(t => t.status === 'IN_PROGRESS');

    case 'today':
      return trips.filter(t => {
        const departureDate = new Date(t.departureTime);
        const hoursUntil = differenceInHours(departureDate, now);
        return hoursUntil >= 0 && hoursUntil <= 24;
      });

    case 'week':
      return trips.filter(t => {
        const departureDate = new Date(t.departureTime);
        const hoursUntil = differenceInHours(departureDate, now);
        return hoursUntil >= 0 && hoursUntil <= 168; // 7 days
      });

    case 'completed':
      return trips.filter(t => t.status === 'COMPLETED');

    case 'all':
    default:
      return trips;
  }
}

/**
 * Count trips by filter type
 */
export function countTripsByFilter(
  trips: Trip[],
  filter: 'all' | 'active' | 'today' | 'week' | 'completed'
): number {
  return filterTrips(trips, filter).length;
}
