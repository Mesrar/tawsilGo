/**
 * Organization types for multi-profile trip management system
 * Based on PRD specifications and existing codebase patterns
 */

// Base organization interface
export interface Organization {
  id: string;
  businessName: string;
  businessType: 'freight_forward' | 'moving_company' | 'ecommerce' | 'corporate' | 'logistics_provider' | 'other';
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  description?: string;
  logo?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'needs_review';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  admin: OrganizationAdmin;
  drivers: OrganizationDriver[];
  vehicles?: OrganizationVehicle[];
  stats?: OrganizationStats;
}

// Organization admin (main account holder)
export interface OrganizationAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'organization_admin';
  isOwner: boolean;
  isActive: boolean;
  joinedAt: string;
}

// Organization drivers (linked to organization)
export interface OrganizationDriver {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: 'organization_driver';
  status: 'active' | 'inactive' | 'suspended';
  isVerified: boolean;
  joinedAt: string;
  lastActiveAt?: string;
  assignedVehicleId?: string;
  performanceRating?: number;
  completedTrips: number;
  organizationId: string;
}

// Organization vehicles (fleet)
export interface OrganizationVehicle {
  id: string;
  type: 'car' | 'van' | 'truck' | 'motorcycle' | 'bicycle';
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  capacity: {
    weight: number; // kg
    volume: number; // m³
    dimensions: {
      length: number; // cm
      width: number; // cm
      height: number; // cm
    };
  };
  features: string[];
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  insuranceExpiryDate?: string;
  registrationExpiryDate?: string;
  isAvailable: boolean;
  organizationId: string;
  currentDriverId?: string;
  createdAt: string;
  updatedAt: string;
}

// Organization statistics
export interface OrganizationStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  activeVehicles: number;
  totalTrips: number;
  completedTrips: number;
  totalRevenue: number;
  averageDriverRating: number;
  fleetUtilization: number; // percentage
  monthlyTrips: number;
  monthlyRevenue: number;
}

// Organization registration request
export interface OrganizationRegistrationRequest {
  // Business Information
  businessName: string;
  businessType: Organization['businessType'];
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  description?: string;

  // Admin Account Information
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  adminConfirmPassword: string;

  // Verification Documents
  businessRegistrationDocument?: File;
  taxIdDocument?: File;
  addressProofDocument?: File;
  insuranceDocument?: File;

  // Terms and Conditions
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
}

// Organization registration response
export interface OrganizationRegistrationResponse {
  organization: Organization;
  admin: OrganizationAdmin;
  requiresVerification: boolean;
  verificationSteps: string[];
  message: string;
}

// Organization profile update request
export interface UpdateOrganizationRequest {
  businessName?: string;
  businessType?: Organization['businessType'];
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  description?: string;
  logo?: File | string;
}

// Organization verification document
export interface VerificationDocument {
  id: string;
  type: 'business_registration' | 'tax_id' | 'address_proof' | 'insurance' | 'vehicle_registration' | 'other';
  name: string;
  url: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  uploadedBy: string;
  organizationId: string;
}

// Organization invitation for team members
export interface OrganizationInvitation {
  id: string;
  email: string;
  role: 'organization_admin' | 'organization_driver';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  token: string;
  expiresAt: string;
  createdAt: string;
  organizationId: string;
}

// Driver invitation request
export interface DriverInvitationRequest {
  email: string;
  phone?: string;
  role: 'organization_driver';
  message?: string;
  vehicleId?: string; // If assigning specific vehicle
}

// Organization trip specific fields (extends base trip)
export interface OrganizationTrip {
  id: string;
  organizationId: string;
  driverId: string;
  vehicleId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  organization: {
    businessName: string;
    logo?: string;
  };
  driver: {
    name: string;
    phone: string;
    rating?: number;
  };
  vehicle: {
    type: string;
    licensePlate: string;
    capacity: OrganizationVehicle['capacity'];
  };
  // Base trip fields would be included here
  // ... (extends from types/trip.ts Trip interface)
}

// Organization management API responses
export interface OrganizationListResponse {
  organizations: Organization[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OrganizationDetailsResponse {
  organization: Organization;
  drivers: OrganizationDriver[];
  vehicles: OrganizationVehicle[];
  recentTrips: OrganizationTrip[];
  stats: OrganizationStats;
}

// Organization search and filter params
export interface OrganizationSearchParams {
  businessType?: Organization['businessType'];
  country?: string;
  city?: string;
  status?: Organization['verificationStatus'];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

// Fleet management filters
export interface FleetSearchParams {
  type?: OrganizationVehicle['type'];
  status?: OrganizationVehicle['status'];
  isAvailable?: boolean;
  organizationId?: string;
  page?: number;
  limit?: number;
}

// Driver management filters
export interface DriverSearchParams {
  status?: OrganizationDriver['status'];
  isVerified?: boolean;
  organizationId?: string;
  vehicleId?: string;
  page?: number;
  limit?: number;
}

// Go Backend compatible organization types
export interface GoBackendOrganization {
  id: string;
  legal_name: string;
  trade_name?: string;
  registration_number?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  description?: string;
  status: 'pending_verification' | 'verified' | 'deactivated';
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

// Go Backend compatible organization registration request
export interface GoBackendOrganizationRequest {
  legal_name: string;
  trade_name?: string;
  registration_number?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  description?: string;
  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_phone: string;
  admin_password: string;
  accept_terms: boolean;
  accept_privacy: boolean;
}

// Go Backend compatible trip types
export interface GoBackendTrip {
  id: string;
  organization_id: string;
  driver_id?: string;
  vehicle_id?: string;
  departure_country: string;
  departure_city: string;
  departure_address: string;
  destination_country: string;
  destination_city: string;
  destination_address: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  actual_departure?: string;
  actual_arrival?: string;
  base_price: number;
  price_per_kg: number;
  minimum_price: number;
  currency: string;
  total_capacity: number;
  remaining_capacity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  total_revenue?: number;
  utilization?: number;
}

// Go Backend compatible trip creation request
export interface GoBackendTripRequest {
  departure_country: string;
  departure_city: string;
  departure_address: string;
  destination_country: string;
  destination_city: string;
  destination_address: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  price_per_kg: number;
  minimum_price: number;
  currency?: string;
  total_capacity: number;
  vehicle_id?: string;
  driver_id?: string;
  notes?: string;
}