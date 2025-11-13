/**
 * Data transformation utilities for Go backend integration
 * Handles conversion between frontend (camelCase) and Go backend (snake_case) formats
 */

// Vehicle type mapping between frontend and Go backend
export const VEHICLE_TYPE_MAPPING = {
  'truck': 'TRUCK',
  'van': 'VAN',
  'motorcycle': 'MOTORCYCLE',
  'car': 'CAR',
  'bus': 'BUS',
  'other': 'OTHER'
} as const;

// Reverse mapping for Go to frontend
export const REVERSE_VEHICLE_TYPE_MAPPING = {
  'TRUCK': 'truck',
  'VAN': 'van',
  'MOTORCYCLE': 'motorcycle',
  'CAR': 'car',
  'BUS': 'bus',
  'OTHER': 'other'
} as const;

// Organization type mapping
export const ORGANIZATION_TYPE_MAPPING = {
  'freight_forward': 'FREIGHT_FORWARDER',
  'moving_company': 'MOVING_COMPANY',
  'ecommerce': 'ECOMMERCE',
  'corporate': 'CORPORATE',
  'logistics_provider': 'LOGISTICS_PROVIDER',
  'other': 'OTHER'
} as const;

export const REVERSE_ORGANIZATION_TYPE_MAPPING = {
  'FREIGHT_FORWARDER': 'freight_forward',
  'MOVING_COMPANY': 'moving_company',
  'ECOMMERCE': 'ecommerce',
  'CORPORATE': 'corporate',
  'LOGISTICS_PROVIDER': 'logistics_provider',
  'OTHER': 'other'
} as const;

// Organization status mapping
export const ORGANIZATION_STATUS_MAPPING = {
  'pending_verification': 'pending_verification',
  'verified': 'verified',
  'suspended': 'suspended',
  'deactivated': 'deactivated'
} as const;

// Trip status mapping
export const TRIP_STATUS_MAPPING = {
  'planned': 'planned',
  'scheduled': 'scheduled',
  'active': 'in_progress',
  'completed': 'completed',
  'cancelled': 'cancelled',
  'delayed': 'delayed'
} as const;

export const REVERSE_TRIP_STATUS_MAPPING = {
  'planned': 'planned',
  'scheduled': 'scheduled',
  'in_progress': 'active',
  'completed': 'completed',
  'cancelled': 'cancelled',
  'delayed': 'delayed'
} as const;

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from camelCase to snake_case recursively
 */
export function objectKeysToSnake(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => objectKeysToSnake(item));
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    result[snakeKey] = objectKeysToSnake(value);
  }

  return result;
}

/**
 * Convert object keys from snake_case to camelCase recursively
 */
export function objectKeysToCamel(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => objectKeysToCamel(item));
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    result[camelKey] = objectKeysToCamel(value);
  }

  return result;
}

/**
 * Transform frontend organization registration data to Go backend format
 */
export function transformOrganizationRegistrationToGo(data: any): any {
  const transformed = {
    legal_name: data.businessName,
    trade_name: data.tradeName || data.businessName,
    registration_number: data.registrationNumber,
    tax_id: data.taxId,
    organization_type: ORGANIZATION_TYPE_MAPPING[data.businessType as keyof typeof ORGANIZATION_TYPE_MAPPING] || 'OTHER',
    contact_email: data.businessEmail,
    contact_phone: data.businessPhone,
    address: data.businessAddress,
    city: data.businessCity,
    country: data.businessCountry,
    postal_code: data.businessPostalCode,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0
  };

  return objectKeysToSnake(transformed);
}

/**
 * Transform Go organization response to frontend format
 */
export function transformOrganizationFromGo(data: any): any {
  const transformed = objectKeysToCamel(data);

  return {
    ...transformed,
    id: data.id,
    businessName: data.legal_name,
    tradeName: data.trade_name,
    businessType: REVERSE_ORGANIZATION_TYPE_MAPPING[data.organization_type as keyof typeof REVERSE_ORGANIZATION_TYPE_MAPPING] || 'other',
    registrationNumber: data.registration_number,
    taxId: data.tax_id,
    businessEmail: data.contact_email,
    businessPhone: data.contact_phone,
    businessAddress: data.address,
    businessCity: data.city,
    businessCountry: data.country,
    businessPostalCode: data.postal_code,
    status: data.status,
    employeeCount: data.employee_count || 0,
    headquartersLocation: {
      latitude: data.latitude || 0,
      longitude: data.longitude || 0
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    verifiedAt: data.verified_at
  };
}

/**
 * Transform frontend vehicle data to Go backend format
 */
export function transformVehicleToGo(data: any): any {
  const transformed = {
    name: data.name || `${data.brand} ${data.model}`,
    type: VEHICLE_TYPE_MAPPING[data.type as keyof typeof VEHICLE_TYPE_MAPPING] || 'OTHER',
    plate_number: data.licensePlate,
    manufacture_year: data.year,
    model: data.model,
    color: data.color,
    max_weight: data.capacityWeightMax || data.capacityWeight,
    max_volume: data.capacityVolumeMax || data.capacityVolume,
    max_packages: Math.floor((data.capacityWeightMax || data.capacityWeight || 1000) / 20) // Estimate packages
  };

  return objectKeysToSnake(transformed);
}

/**
 * Transform Go vehicle response to frontend format
 */
export function transformVehicleFromGo(data: any): any {
  const transformed = objectKeysToCamel(data);

  return {
    ...transformed,
    id: data.id,
    name: data.name,
    type: REVERSE_VEHICLE_TYPE_MAPPING[data.type as keyof typeof REVERSE_VEHICLE_TYPE_MAPPING] || 'other',
    licensePlate: data.plate_number,
    brand: data.model?.split(' ')[0] || 'Unknown',
    model: data.model,
    year: data.manufacture_year,
    color: data.color,
    capacityWeightMin: Math.max(50, (data.max_weight || 0) * 0.1), // Estimate min capacity
    capacityWeightMax: data.max_weight,
    capacityVolumeMin: Math.max(1, (data.max_volume || 0) * 0.1), // Estimate min volume
    capacityVolumeMax: data.max_volume,
    status: data.status || 'active',
    isAvailable: data.status !== 'maintenance',
    organizationId: data.organization_id,
    ownerId: data.organization_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

/**
 * Transform frontend trip data to Go backend format
 */
export function transformTripToGo(data: any): any {
  const transformed = {
    origin: `${data.departureAddress}, ${data.departureCity}, ${data.departureCountry}`,
    destination: `${data.destinationAddress}, ${data.destinationCity}, ${data.destinationCountry}`,
    departure_time: data.departureTime,
    capacity: data.totalCapacity || data.capacity,
    price: {
      base_price: data.basePrice,
      price_per_kg: data.pricePerKg,
      currency: data.currency || 'USD'
    },
    vehicle_id: data.vehicleId,
    stops: data.stops?.map((stop: any) => ({
      address: stop.address,
      city: stop.city,
      country: stop.country,
      location: {
        latitude: stop.latitude || stop.location?.latitude,
        longitude: stop.longitude || stop.location?.longitude
      },
      sequence: stop.sequence,
      estimated_arrival: stop.estimatedArrival,
      stop_type: stop.stopType
    })) || []
  };

  return objectKeysToSnake(transformed);
}

/**
 * Transform Go trip response to frontend format
 */
export function transformTripFromGo(data: any): any {
  const transformed = objectKeysToCamel(data);

  // Parse address components
  const parseAddress = (fullAddress: string) => {
    const parts = fullAddress?.split(', ') || [];
    return {
      address: parts[0] || '',
      city: parts[1] || '',
      country: parts[2] || ''
    };
  };

  const departure = parseAddress(data.departure_address);
  const destination = parseAddress(data.destination_address);

  return {
    ...transformed,
    id: data.id,
    departureAddress: departure.address,
    departureCity: departure.city,
    departureCountry: departure.country,
    destinationAddress: destination.address,
    destinationCity: destination.city,
    destinationCountry: destination.country,
    departureTime: data.departure_time,
    arrivalTime: data.arrival_time,
    totalCapacity: data.total_capacity || data.capacity,
    remainingCapacity: data.remaining_capacity,
    basePrice: data.price?.base_price || data.base_price,
    pricePerKg: data.price?.price_per_kg || data.price_per_kg,
    currency: data.price?.currency || data.currency || 'USD',
    status: REVERSE_TRIP_STATUS_MAPPING[data.status as keyof typeof REVERSE_TRIP_STATUS_MAPPING] || data.status,
    driverId: data.driver_reference?.id,
    vehicleId: data.vehicle_id,
    organizationId: data.organization_id,
    ownerType: data.owner_type,
    estimatedDistance: data.estimated_distance,
    estimatedDuration: data.estimated_duration,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    stops: data.stops?.map((stop: any) => ({
      id: stop.id,
      address: stop.address,
      city: stop.city,
      country: stop.country,
      latitude: stop.location?.latitude,
      longitude: stop.location?.longitude,
      sequence: stop.sequence,
      estimatedArrival: stop.estimated_arrival,
      stopType: stop.stop_type,
      status: stop.status
    })) || []
  };
}

/**
 * Transform Go backend error response to frontend format
 */
export function transformErrorFromGo(error: any): any {
  return {
    code: error.type || error.code || 'UNKNOWN_ERROR',
    message: error.detail || error.message || error.title || 'An error occurred',
    details: error,
    status: error.status || 500
  };
}

/**
 * Validate vehicle capacity against Go backend constraints
 */
export function validateVehicleCapacityForGo(type: string, weight: number, packages: number): string | null {
  const constraints = {
    'VAN': { minWeight: 50, maxWeight: 3000, minPackages: 1, maxPackages: 15 },
    'TRUCK': { minWeight: 500, maxWeight: 15000, minPackages: 10, maxPackages: 100 },
    'BUS': { minWeight: 100, maxWeight: 500, minPackages: 5, maxPackages: 50 },
    'MOTORCYCLE': { minWeight: 10, maxWeight: 200, minPackages: 1, maxPackages: 5 },
    'CAR': { minWeight: 20, maxWeight: 500, minPackages: 1, maxPackages: 10 }
  };

  const goType = VEHICLE_TYPE_MAPPING[type as keyof typeof VEHICLE_TYPE_MAPPING] || 'OTHER';
  const constraint = constraints[goType as keyof typeof constraints];

  if (!constraint) {
    return `Vehicle type '${type}' is not supported by the backend`;
  }

  if (weight < constraint.minWeight || weight > constraint.maxWeight) {
    return `Weight for ${type} must be between ${constraint.minWeight}-${constraint.maxWeight} kg`;
  }

  if (packages < constraint.minPackages || packages > constraint.maxPackages) {
    return `Packages for ${type} must be between ${constraint.minPackages}-${constraint.maxPackages}`;
  }

  return null;
}