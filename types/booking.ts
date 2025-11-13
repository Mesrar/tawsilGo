import { ParcelDetails } from "./Parcel";

export type BookingStep = "search" | "select" | "details" | "review";

// Enhanced Parcel Status Enum for comprehensive tracking
export enum ParcelStatus {
  // Pre-pickup
  BOOKED = "BOOKED",
  PICKUP_SCHEDULED = "PICKUP_SCHEDULED",

  // Pickup phase
  PICKUP_ATTEMPTED = "PICKUP_ATTEMPTED",
  PICKED_UP = "PICKED_UP",

  // Origin customs (EU)
  CUSTOMS_SUBMITTED_EU = "CUSTOMS_SUBMITTED_EU",
  CUSTOMS_INSPECTION_EU = "CUSTOMS_INSPECTION_EU",
  CUSTOMS_CLEARED_EU = "CUSTOMS_CLEARED_EU",
  CUSTOMS_HELD_EU = "CUSTOMS_HELD_EU",

  // Transit
  IN_TRANSIT_HUB = "IN_TRANSIT_HUB",
  IN_TRANSIT_BUS = "IN_TRANSIT_BUS",
  ARRIVED_DESTINATION_HUB = "ARRIVED_DESTINATION_HUB",

  // Destination customs (Morocco)
  CUSTOMS_SUBMITTED_MA = "CUSTOMS_SUBMITTED_MA",
  DUTY_PAYMENT_PENDING = "DUTY_PAYMENT_PENDING",
  DUTY_PAYMENT_RECEIVED = "DUTY_PAYMENT_RECEIVED",
  CUSTOMS_INSPECTION_MA = "CUSTOMS_INSPECTION_MA",
  CUSTOMS_CLEARED_MA = "CUSTOMS_CLEARED_MA",
  CUSTOMS_HELD_MA = "CUSTOMS_HELD_MA",

  // Final delivery
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERY_ATTEMPTED = "DELIVERY_ATTEMPTED",
  DELIVERED = "DELIVERED",

  // Exceptions
  LOST = "LOST",
  DAMAGED = "DAMAGED",
  RETURNED_TO_SENDER = "RETURNED_TO_SENDER",
  CANCELLED = "CANCELLED"
}

// Driver information interface
export interface DriverInfo {
  id: string;
  name: string;
  photo?: string;
  rating: number;
  completedDeliveries: number;
  isVerified: boolean;
  phone?: string; // Only shown when contact is enabled
  vehicleInfo?: {
    type: "Coach Bus" | "Minibus";
    plateNumber: string;
    company: string;
    busNumber?: string;
  };
}

// Customs information interface
export interface CustomsInfo {
  stage: "EU_EXIT" | "MA_ENTRY";
  status: ParcelStatus;
  submittedAt?: string;
  clearedAt?: string;
  estimatedClearanceTime?: string;
  dutyInfo?: {
    amount: number;
    currency: string;
    breakdown: {
      itemValue: number;
      dutyRate: number;
      dutyAmount: number;
      vat: number;
      processingFee: number;
    };
    paymentStatus: "PENDING" | "PAID" | "NOT_REQUIRED";
    paymentMethod?: "TAWSILGO" | "DIRECT";
  };
  documents?: {
    name: string;
    status: "SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  }[];
  delayReason?: string;
}

// Tracking event interface
export interface TrackingEvent {
  id: string;
  status: ParcelStatus;
  title: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
  active?: boolean;
  details?: string;
}

// Enhanced tracking data interface
export interface EnhancedTrackingData {
  bookingId: string;
  trackingId: string;
  currentStatus: ParcelStatus;
  statusText: string;
  progress: number;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  currentLocation: string;
  lastUpdated: string;
  timeline: TrackingEvent[];
  driver?: DriverInfo;
  customsInfo?: CustomsInfo;
  parcelInfo: {
    weight: string;
    packagingType: string;
    carrier: string;
    insuranceAmount?: number;
    hasExpress?: boolean;
    hasCustomsBrokerage?: boolean;
  };
  contactEnabled: boolean;
  deliveryPreferences?: {
    canChangeAddress: boolean;
    canHoldForPickup: boolean;
    canScheduleTime: boolean;
  };
}

export interface BookingDetails {
  bookingId: string;
  tripId: string;
  parcelId: string;
  customerName: string;
  parcelWeight: number;
  status: string;
  bookedAt: string;
  price: number;
  pickupPoint: string;
  deliveryPoint: string;
  pickupTime: string | null;
  deliveryTime: string | null;
  packagingType: string;
  specialRequirements: string;
  senderDetails: {
    name: string;
    phone: string;
  };
  receiverDetails: {
    name: string;
    phone: string;
  };
  trip: {
    departureCity: string;
    destinationCity: string;
    departureCountry: string;
    destinationCountry: string;
    departureDate: string;
    status: string;
    driverName: string;
    driverPhone: string;
  };
  timeline: {
    status: string;
    timestamp: string;
    message: string;
  }[];
}



// Define request type
export interface BookingRequest {
  tripId: string;
  parcel: ParcelDetails;
}

// Define response types with proper structure
export interface Booking {
  booking: any;
  id: string;
  tripId: string;
  parcelId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pickupPoint?: string;
  deliveryPoint?: string;
  parcel?: {
    id: string;
    weight: number;
    packagingType: string;
    specialRequirements?: string;
  };
  trip?: {
    id: string;
    departureCity: string;
    destinationCity: string;
    departureDate: string;
  };
}

export interface BookingCreateResponse {
  bookingId: string;
  booking: Booking;
}

// =========== Price Estimate Types ===========
export interface PriceBreakdown {
  total: number;
  base: number;
  weightCost: number;
  insurance: number;
  tax: number;
}

export interface PriceEstimateData {
  tripId: string;
  weight: number;
  currency: string;
  priceBreakdown: PriceBreakdown;
  madEquivalent: {
    total: number;
    rate: number;
  };
  formattedPrice: {
    eur: string;
    mad: string;
  };
  displayText: string;
  minimumPrice: number;
  pricePerKg: number;
  weightThreshold: number;
}

export interface PriceEstimateResponse {
  success: boolean;
  data: PriceEstimateData;
  meta: {
    calculatedAt: string;
    weightUsed: number;
  };
}

export interface BatchEstimate {
  weight: number;
  priceBreakdown: PriceBreakdown;
  madEquivalent: number;
  formattedPrice: string;
  displayText: string;
}

export interface PriceRange {
  minimum: number;
  maximum: number;
  displayText: string;
}

export interface BatchPriceEstimateData {
  tripId: string;
  estimates: BatchEstimate[];
  priceRange: PriceRange;
  defaultEstimate: BatchEstimate;
}

export interface BatchPriceEstimateResponse {
  success: boolean;
  data: BatchPriceEstimateData;
  meta: {
    calculatedAt: string;
    weightsCalculated: number[];
  };
}

// =========== Smart Booking Form Types ===========
export interface WeightQuickSelect {
  value: number;
  label: string;
  description?: string;
  popular?: boolean;
}

export interface PackagingOption {
  id: 'small' | 'medium' | 'large';
  name: string;
  icon: string;
  weightRange: {
    min: number;
    max: number;
  };
  description: string;
  popular?: boolean;
}

export interface SmartBookingFormSection {
  id: 'locations' | 'parcel' | 'contacts';
  title: string;
  isExpanded: boolean;
  isComplete: boolean;
  icon: string;
}

export interface AutoExpandConfig {
  enabled: boolean;
  scrollOffset?: number;
  animationDuration?: number;
  threshold?: {
    locations: boolean;
    parcel: boolean;
    contacts: boolean;
  };
}

// =========== Analytics Types ===========
export interface BookingAnalytics {
  step: 'search' | 'select' | 'bookingForm' | 'payment';
  timestamp: string;
  data: Record<string, any>;
}

export interface FormFieldInteraction {
  field: string;
  action: 'focus' | 'blur' | 'change' | 'error';
  value?: any;
  timestamp: string;
}

export interface ConversionEvent {
  bookingId: string;
  details: {
    amount: number;
    currency: string;
    tripRoute: string;
    timeTaken: number; // seconds from start to completion
  };
  timestamp: string;
}

// =========== Dynamic Pricing Types ===========
export interface LeadTimeDiscount {
  daysAhead: number;
  discountPercent: number;
  label: string;
}

export interface DemandMultiplier {
  routeId: string;
  multiplier: number;
  label: string;
  lastUpdated: string;
}

// =========== Revenue Expansion Types ===========
export interface InsuranceTier {
  id: 'basic' | 'standard' | 'premium' | 'full';
  name: string;
  price: number;
  coverage: number;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
}

export interface CustomsConcierge {
  price: number;
  features: string[];
  sla: string;
  guarantee: string;
}

export interface SubscriptionTier {
  id: 'monthly' | 'annual' | 'business';
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  benefits: string[];
  breakEven: number;
  popular?: boolean;
  savings?: {
    amount: number;
    percentage: number;
  };
}

// =========== Advanced Pricing Types ===========
export interface PricingContext {
  trip: any;
  weight: number;
  departureDate: string;
  bookingDate: string;
  demandMultiplier?: number;
  leadTimeDiscount?: LeadTimeDiscount;
  insuranceTier?: InsuranceTier;
  conciergeService?: boolean;
  subscriptionDiscount?: number;
}

export interface OptimizedPriceBreakdown extends PriceBreakdown {
  discounts?: {
    leadTime?: {
      percent: number;
      amount: number;
      label: string;
    };
    demand?: {
      multiplier: number;
      amount: number;
      label: string;
    };
    subscription?: {
      percent: number;
      amount: number;
      label: string;
    };
  };
  upsells?: {
    insurance?: number;
    concierge?: number;
  };
  originalTotal: number;
  finalTotal: number;
  savingsTotal: number;
}