/**
 * Vehicle types for individual drivers and organization fleets
 * Extends existing organization vehicle types with driver-specific features
 */

// Base vehicle interface (shared between individual drivers and organizations)
export interface Vehicle {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  color?: string;
  photos?: string[];
  capacity: VehicleCapacity;
  features: VehicleFeature[];
  status: VehicleStatus;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isAvailable: boolean;
  location?: VehicleLocation;
  documents: VehicleDocument[];
  createdAt: string;
  updatedAt: string;
  ownerId: string; // Either individual driver ID or organization ID
  ownerType: 'driver' | 'organization';
  currentDriverId?: string; // For organization vehicles
}

// Vehicle type enumeration (aligned with Go backend)
export type VehicleType =
  | 'motorcycle'
  | 'car'
  | 'van'
  | 'bus'
  | 'truck'
  | 'other';

// Vehicle capacity specifications
export interface VehicleCapacity {
  weight: {
    min: number; // kg
    max: number; // kg
    recommended?: number; // kg for optimal performance
  };
  volume: {
    min: number; // m³
    max: number; // m³
  };
  dimensions: {
    length: number; // cm
    width: number; // cm
    height: number; // cm
  };
  passengers?: {
    min: number;
    max: number;
  };
  specialCapacity?: {
    refrigerated: boolean;
    temperatureRange?: {
      min: number; // °C
      max: number; // °C
    };
    hazardous: boolean;
    fragile: boolean;
    oversized: boolean;
  };
}

// Vehicle features and equipment
export interface VehicleFeature {
  id: string;
  name: string;
  category: 'safety' | 'comfort' | 'capacity' | 'tracking' | 'specialized';
  isAvailable: boolean;
  description?: string;
}

// Predefined vehicle features
export const VEHICLE_FEATURES = {
  SAFETY: [
    { id: 'airbags', name: 'Airbags', category: 'safety' as const },
    { id: 'abs', name: 'ABS Brakes', category: 'safety' as const },
    { id: 'esp', name: 'Electronic Stability', category: 'safety' as const },
    { id: 'parking_sensors', name: 'Parking Sensors', category: 'safety' as const },
    { id: 'dashcam', name: 'Dash Camera', category: 'safety' as const },
    { id: 'gps_tracking', name: 'GPS Tracking', category: 'safety' as const },
  ],
  COMFORT: [
    { id: 'air_conditioning', name: 'Air Conditioning', category: 'comfort' as const },
    { id: 'heating', name: 'Heating', category: 'comfort' as const },
    { id: 'bluetooth', name: 'Bluetooth', category: 'comfort' as const },
    { id: 'usb_charging', name: 'USB Charging', category: 'comfort' as const },
  ],
  CAPACITY: [
    { id: 'roof_rack', name: 'Roof Rack', category: 'capacity' as const },
    { id: 'trailer_hitch', name: 'Trailer Hitch', category: 'capacity' as const },
    { id: 'cargo_nets', name: 'Cargo Nets', category: 'capacity' as const },
    { id: 'moving_blankets', name: 'Moving Blankets', category: 'capacity' as const },
  ],
  SPECIALIZED: [
    { id: 'refrigeration', name: 'Refrigeration', category: 'specialized' as const },
    { id: 'lift_gate', name: 'Lift Gate', category: 'specialized' as const },
    { id: 'climate_control', name: 'Climate Control', category: 'specialized' as const },
    { id: 'secure_locking', name: 'Secure Locking', category: 'specialized' as const },
  ],
} as const;

// Vehicle status enumeration
export type VehicleStatus =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'verification_pending'
  | 'verification_rejected'
  | 'retired'
  | 'accident'
  | 'theft_reported';

// Vehicle current location
export interface VehicleLocation {
  latitude: number;
  longitude: number;
  address?: string;
  lastUpdated: string;
  accuracy?: number;
}

// Vehicle documents and certificates
export interface VehicleDocument {
  id: string;
  type: VehicleDocumentType;
  name: string;
  url: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  documentNumber?: string;
  status: DocumentStatus;
  uploadDate: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  reminderSent?: boolean;
  vehicleId: string;
}

// Vehicle document types
export type VehicleDocumentType =
  | 'registration'
  | 'insurance'
  | 'inspection'
  | 'roadworthiness'
  | 'pollution_certificate'
  | 'special_permit'
  | 'hazardous_materials'
  | 'international_permit'
  | 'ownership_document'
  | 'maintenance_record'
  | 'accident_report';

// Document verification status
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'expiring_soon';

// Vehicle maintenance record
export interface MaintenanceRecord {
  id: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  cost: number;
  currency: string;
  performedAt: string;
  performedBy: string;
  mileageAtService?: number;
  nextServiceDue?: string;
  documents: string[]; // URLs to invoices/receipts
  vehicleId: string;
  createdAt: string;
}

// Vehicle registration request (for individual drivers)
export interface VehicleRegistrationRequest {
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  color?: string;
  licensePlate: string;
  capacity: Omit<VehicleCapacity, 'min'>;
  features: string[]; // Feature IDs
  documents: {
    registration?: File;
    insurance?: File;
    inspection?: File;
    photos?: File[];
  };
}

// Vehicle update request
export interface UpdateVehicleRequest {
  type?: VehicleType;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  capacity?: Partial<VehicleCapacity>;
  features?: string[];
  status?: VehicleStatus;
  isAvailable?: boolean;
  photos?: (File | string)[];
}

// Vehicle search and filters
export interface VehicleSearchParams {
  type?: VehicleType;
  brand?: string;
  status?: VehicleStatus;
  isAvailable?: boolean;
  minCapacity?: number; // kg
  maxCapacity?: number; // kg
  features?: string[];
  ownerType?: 'driver' | 'organization';
  ownerId?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // km
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

// Vehicle availability and scheduling
export interface VehicleAvailability {
  vehicleId: string;
  isAvailable: boolean;
  unavailableReason?: string;
  unavailableFrom?: string;
  unavailableTo?: string;
  timezone?: string;
  recurringSchedule?: {
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  };
}

// Vehicle transfer between owners
export interface VehicleTransferRequest {
  vehicleId: string;
  fromOwnerId: string;
  toOwnerId: string;
  toOwnerType: 'driver' | 'organization';
  transferType: 'sale' | 'gift' | 'organization_assignment';
  agreedPrice?: number;
  currency?: string;
  transferDate?: string;
  documents: File[];
  notes?: string;
}

// Vehicle analytics and performance
export interface VehicleAnalytics {
  vehicleId: string;
  period: {
    start: string;
    end: string;
  };
  totalTrips: number;
  totalDistance: number; // km
  totalRevenue: number;
  averageFuelConsumption?: number; // L/100km
  maintenanceCosts: number;
  utilizationRate: number; // percentage
  averageRating: number;
  incidents: number;
  onTimePerformance: number; // percentage
  earningsPerKm: number;
  costsPerKm: number;
}

// Vehicle types with default configurations
export const VEHICLE_TYPE_CONFIGS = {
  MOTORCYCLE: {
    type: 'motorcycle' as const,
    defaultCapacity: {
      weight: { min: 1, max: 20, recommended: 15 },
      volume: { min: 0.01, max: 0.1 },
      dimensions: { length: 60, width: 40, height: 40 },
    },
    commonFeatures: ['gps_tracking', 'bluetooth'],
  },
  CAR: {
    type: 'car' as const,
    defaultCapacity: {
      weight: { min: 10, max: 100, recommended: 50 },
      volume: { min: 0.2, max: 0.5 },
      dimensions: { length: 100, width: 60, height: 50 },
      passengers: { min: 1, max: 4 },
    },
    commonFeatures: ['air_conditioning', 'gps_tracking', 'bluetooth', 'usb_charging'],
  },
  VAN: {
    type: 'van' as const,
    defaultCapacity: {
      weight: { min: 100, max: 1000, recommended: 500 },
      volume: { min: 2, max: 15 },
      dimensions: { length: 250, width: 180, height: 180 },
    },
    commonFeatures: ['air_conditioning', 'gps_tracking', 'cargo_nets', 'moving_blankets'],
  },
  TRUCK: {
    type: 'box_truck' as const,
    defaultCapacity: {
      weight: { min: 1000, max: 5000, recommended: 3000 },
      volume: { min: 15, max: 40 },
      dimensions: { length: 600, width: 250, height: 260 },
    },
    commonFeatures: ['air_conditioning', 'gps_tracking', 'lift_gate', 'cargo_nets'],
  },
} as const;

// API Response types
export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface VehicleDetailsResponse {
  vehicle: Vehicle;
  maintenanceHistory: MaintenanceRecord[];
  analytics?: VehicleAnalytics;
  upcomingMaintenance: MaintenanceRecord[];
}

export interface VehicleAvailabilityResponse {
  [vehicleId: string]: VehicleAvailability;
}

// Go Backend compatible vehicle types
export interface GoBackendVehicle {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  license_plate: string; // snake_case for Go backend
  year: number;
  capacity_weight_min: number;
  capacity_weight_max: number;
  capacity_volume_min: number;
  capacity_volume_max: number;
  status: VehicleStatus;
  is_available: boolean;
  organization_id: string;
  created_at: string;
  updated_at: string;
  utilization_rate?: number;
  stats?: {
    monthly_revenue?: number;
    maintenance_costs?: number;
    total_distance?: number;
    average_fuel_efficiency?: number;
  };
  _count?: {
    trips?: number;
    maintenance_records?: number;
  };
}

// Go Backend compatible vehicle creation request
export interface GoBackendVehicleRequest {
  type: VehicleType;
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  capacity_weight_min: number;
  capacity_weight_max: number;
  capacity_volume_min: number;
  capacity_volume_max: number;
  organization_id?: string;
  status?: VehicleStatus;
}