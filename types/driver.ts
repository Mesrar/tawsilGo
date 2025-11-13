/**
 * Driver registration and management types
 * Based on driver-service API specification (port 8084)
 */

// Enums
export type VehicleType = "sedan" | "suv" | "van" | "truck" | "motorcycle";
export type DocumentType = "license" | "identity" | "insurance" | "vehicle_registration";
export type DriverStatus =
  | "profile_created"
  | "documents_submitted"
  | "vehicle_added"
  | "pending_verification"
  | "verified"
  | "deactivated";

// Driver Application (Step 1)
export interface DriverApplyRequest {
  license_number: string;
  timezone: string;
  phone_number: string;
  experience_years?: number;
}

// User information (embedded in driver profile)
export interface DriverUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
}

// Driver Profile Response
export interface DriverProfile {
  id: string;
  user_id: string;
  user: DriverUser;
  license_number: string;
  status: DriverStatus;
  is_available: boolean;
  timezone: string;
  rating: number;
  rating_count: number;
  document_count: number;
  created_at: string;
  updated_at?: string;
}

// Vehicle Capacity
export interface VehicleCapacity {
  max_weight: number;
  max_volume: number;
  max_packages: number;
}

// Vehicle Information (Step 3)
export interface VehicleRequest {
  name: string;
  type: VehicleType;
  plate_number: string;
  manufacture_year?: number;
  model?: string;
  color?: string;
  max_weight: number;
  max_volume: number;
  max_packages: number;
}

export interface Vehicle {
  id: string;
  driver_id?: string;
  name: string;
  type: VehicleType;
  plate_number: string;
  manufacture_year?: number;
  model?: string;
  color?: string;
  capacity: VehicleCapacity;
  created_at: string;
  updated_at?: string;
}

// Document Upload (Step 2)
export interface DocumentUploadRequest {
  type: DocumentType;
  file: File;
}

export interface DriverDocument {
  id: string;
  driver_id: string;
  type: DocumentType;
  url: string;
  verified: boolean;
  created_at: string;
  updated_at?: string;
}

// Registration Status
export interface RegistrationStatus {
  driver_id: string;
  current_step: string;
  completed_steps: string[];
  next_step: string;
  is_complete: boolean;
  status: DriverStatus;
  missing_items: string[];
}

// Submit for Verification Response
export interface SubmitVerificationResponse {
  message: string;
  status: DriverStatus;
}

// Form state for multi-step flow
export interface DriverRegistrationFormData {
  // Step 1
  license_number: string;
  timezone: string;
  phone_number: string;
  experience_years: number;

  // Step 2
  documents: {
    license?: File;
    identity?: File;
    insurance?: File;
    vehicle_registration?: File;
  };
  uploadedDocuments: DriverDocument[];

  // Step 3
  vehicle: VehicleRequest | null;

  // Tracking
  driverId?: string;
  currentStep: number;
}
