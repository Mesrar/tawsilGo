
// Define proper types for the new API response format
export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TripPrice {
  basePrice: number;
  pricePerKg: number;
  pricePerKm: number;
  minimumPrice: number;
  currency: string;
  weightThreshold: number;
  premiumFactor: number;
}

export interface TripStop {
  id: string;
  location: string;
  locationPoint: GeoPoint;
  arrivalTime: string;
  stopType: 'pickup' | 'dropoff' | 'both' | string;
  order: number;
  // Enhanced fields (optional - graceful degradation)
  fullAddress?: string;
  departureTime?: string;
  durationFromPreviousMins?: number;
  distanceFromPreviousKm?: number;
  stopStatus?: 'confirmed' | 'conditional' | 'optional';
  facilityType?: 'bus_station' | 'meeting_point' | 'warehouse' | string;
  localizedNames?: {
    fr?: string;
    ar?: string;
  };
  remainingCapacityAfterStop?: number;
  operatingHours?: string;
  durationAtStop?: number;
}

export interface TripStatistics {
  totalBookings: number;
  capacityUtilized: number;
  totalParcelWeight: number;
  pendingBookings: number;
  completedBookings: number;
  totalDistanceKm: number;
  totalDuration: number;
  averageSpeed: number;
}

export interface TripRoute {
  totalDistanceKm: number;
  totalDurationMins: number;
  routePolyline: string;
  directionSteps: any;
  hasStops: boolean;
}

// Driver information for trip cards
export interface TripDriver {
  id: string;
  name: string;
  profileImage?: string;
  rating: number;
  ratingCount: number;
  completedTrips?: number;
  isVerified: boolean;
  joinedDate?: string;
}

export interface TripSelectionCardProps {
  departureCountryFilter: string;
  destinationCountryFilter: string;
  departureFilter: string;
  destinationFilter: string;
  dateFilter?: Date;
  isLoading: boolean;
  onEditSearch: () => void;
  onTripSelected: (trip: Trip) => void;
  onBookTrip: (trip: Trip) => void;
  departureCountry?: string;
  destinationCountry?: string;
}


export interface Trip {
  id: string;
  departureCountry: string;
  destinationCountry: string;
  departureCity: string;
  destinationCity: string;
  departureAddress: string;
  destinationAddress: string;
  departureTime: string;
  arrivalTime: string;
  price: TripPrice;
  dapartPoint: GeoPoint;
  arrivalPoint: GeoPoint;
  totalCapacity: number;
  remainingCapacity: number;
  status: string;
  stops: TripStop[];
  estimatedDistance: number;
  estimatedDuration: number;
  statistics: TripStatistics;
  route: TripRoute;
  driver?: TripDriver; // Driver trust information
  // Organization context for multi-profile system
  organizationId?: string;
  organization?: {
    id: string;
    businessName: string;
    logo?: string;
  };
  vehicleId?: string;
  vehicle?: {
    id: string;
    type: string;
    licensePlate: string;
    capacity: {
      weight: number;
      volume: number;
    };
  };
  // Trip ownership and assignment
  ownerType: 'individual_driver' | 'organization';
  createdBy: string; // User ID who created the trip
  assignedDriverId?: string;
  assignedVehicleId?: string;
}

// Define search parameters interface
export interface TripSearchParams {
  departureCity?: string;
  destinationCity?: string;
  departureCountry?: string;
  destinationCountry?: string;
  date?: string;
  minCapacity?: number;
  transportMethod?: string;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
  // Organization-specific filters
  organizationId?: string;
  ownerType?: 'individual_driver' | 'organization' | 'all';
  vehicleType?: string;
  driverId?: string;
  includeOrganizationTrips?: boolean;
}

// Define response interfaces
export interface TripSearchResponse {
  trips: Trip[];
  total: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface TripDetailsResponse {
  trip: Trip;
}