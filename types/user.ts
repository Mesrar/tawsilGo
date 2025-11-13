// Basic user interface
export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  isVerified: boolean;
  profileImage?: string;
  phoneNumber?: string;
  token?: string;
  createdAt: string;
  // Organization context for multi-profile system
  organizationId?: string;
  organization?: {
    id: string;
    businessName: string;
    logo?: string;
    role: 'organization_admin' | 'organization_driver';
  };
  // Profile completion for organizations
  profileCompleted?: boolean;
  onboardingStep?: number;
}

// Login related interfaces
export interface LoginRequest {
  username: string;
  password: string;
  keepSignedIn?: boolean;
}

export interface LoginResponse {
  user: User;
  expiresAt?: string;
}

// Registration related interfaces
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  username?: string;
  phone: string;  // Changed from phoneNumber to match backend
  address: string;
  acceptTerms: boolean;
  // V2 API - Business account support
  accountType?: "personal" | "business";
  companyName?: string;
  vatNumber?: string;
}

export interface RegisterResponse {
  user: User;
  token?: string;
  requiresVerification: boolean;
  verificationMethod?: 'email' | 'phone';
}

// Verification interfaces
export interface VerifyAccountRequest {
  userId: string;
  code: string;
  verificationMethod?: 'email' | 'phone';
}

export interface ResendVerificationRequest {
  email: string;
}

// Password reset interfaces
export interface RequestPasswordResetRequest {
  email: string;
}

export interface ValidateResetTokenRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// User profile interfaces
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  profileImage?: File | string;
}

// User role enumeration for multi-profile system
export type UserRole =
  | 'customer'
  | 'driver'
  | 'organization_admin'
  | 'organization_driver'
  | 'admin';

// Organization admin registration request
export interface OrganizationAdminRegistrationRequest {
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
  // Admin account details
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  adminConfirmPassword: string;
  // Verification documents
  businessRegistrationDocument?: File;
  taxIdDocument?: File;
  addressProofDocument?: File;
  insuranceDocument?: File;
  // Terms and conditions
  acceptTerms: boolean;
  acceptPrivacyPolicy: boolean;
}

// Organization driver registration request (invited by organization)
export interface OrganizationDriverRegistrationRequest {
  invitationToken: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
  // Driver-specific details
  driverLicenseNumber?: string;
  driverLicenseExpiry?: string;
  vehiclePreferences?: string[];
  acceptTerms: boolean;
}

// User profile completion request
export interface CompleteProfileRequest {
  // For organization admins
  organizationDetails?: {
    businessName: string;
    businessType: string;
    address: string;
    phone: string;
    description?: string;
  };
  // For individual drivers
  vehicleDetails?: {
    type: string;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  // For all users
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
    currency: string;
  };
}