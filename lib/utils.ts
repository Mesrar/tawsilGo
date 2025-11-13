import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { FlagIconCode } from "react-flag-kit";
import { Trip } from "@/types/trip";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const formatSafeDate = (dateString: string, formatPattern: string) => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, formatPattern);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};


// Add this function to your existing utils file
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Decodes an encoded polyline string into an array of coordinates
 * @param encoded - Google-encoded polyline string
 * @returns Array of [lat, lng] coordinates
 */
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    points.push([lat / 1e5, lng / 1e5]);
  }
  
  return points;
}

export const getCountryCode = (country?: string): FlagIconCode => {
  if (!country) return "UN" as FlagIconCode; // Safe default if country is undefined or null
  
  const countryCodeMap: Record<string, FlagIconCode> = {
    // Full country names (lowercase)
    "france": "FR",
    "morocco": "MA", 
    "italy": "IT",
    "spain": "ES",
    "germany": "DE",
    "netherlands": "NL",
    
    // Also handle ISO codes (lowercase)
    "fr": "FR",
    "ma": "MA",
    "it": "IT",
    "es": "ES",
    "de": "DE",
    "nl": "NL",
    
    // Common variations
    "maroc": "MA",
    "italia": "IT",
    "españa": "ES",
    "deutschland": "DE"
  };
  
  // Handle different cases and formats
  const normalizedCountry = country.trim().toLowerCase();
  
  // If it's already a 2-letter country code in uppercase, just return it
  if (/^[A-Z]{2}$/.test(country)) {
    return country as FlagIconCode;
  }
  
  // Check in map or convert if it's a valid 2-letter code
  if (countryCodeMap[normalizedCountry]) {
    return countryCodeMap[normalizedCountry];
  } else if (/^[a-z]{2}$/.test(normalizedCountry)) {
    return normalizedCountry.toUpperCase() as FlagIconCode;
  }
  
  // If we reach here and still don't have a match, return "XX" as fallback
  return "UN" as FlagIconCode;
};

/**
 * Calculate payment amount for a trip based on parcel weight
 */
export function calculatePaymentAmount(trip: Trip, weight: number) {
  // Base price from trip
  let amount = trip.price.minimumPrice;

  // Apply weight-based pricing
  if (weight > trip.price.weightThreshold) {
    amount += weight * trip.price.pricePerKg;
  }

  // Add insurance fee
  const insuranceFee = 3.5;
  amount += insuranceFee;

  // Calculate tax
  const taxRate = 0.19;
  const tax = amount * taxRate;
  const total = amount + tax;

  return {
    total: parseFloat(total.toFixed(2)),
    base: trip.price.minimumPrice,
    weightCost:
      weight > trip.price.weightThreshold
        ? weight * trip.price.pricePerKg
        : 0,
    insurance: insuranceFee,
    tax: parseFloat(tax.toFixed(2)),
  };
}