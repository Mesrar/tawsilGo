// filepath: /home/mesrar/Desktop/nextjs-app/types/auth.ts
import { DefaultSession } from 'next-auth';

/**
 * Extended types for NextAuth.js session
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
    accessToken: string;
    error?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    token?: string;
  }
}

/**
 * Extended types for NextAuth.js JWT
 */
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    error?: string;
    refreshToken?: string;
    tokenExpires?: number;
  }
}

/**
 * Authentication API response types
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  details?: unknown;
  user?: T;
  claims?: T;
};

/**
 * User data returned from authentication
 */
export type AuthUser = {
  id: string;
  name: string;
  role: string;
  email?: string;
  token: string;
};

/**
 * JWT token payload structure
 */
export type TokenPayload = {
  sub: string;
  name: string;
  role: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

/**
 * Authentication error with HTTP status code
 */
export class AuthError extends Error {
  statusCode: number;
  details?: unknown;
  
  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Authentication state enum for UI components
 */
export enum AuthState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * Role-based permissions definition
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ORGANIZATION_ADMIN = 'organization_admin',
  ORGANIZATION_DRIVER = 'organization_driver',
  GUEST = 'guest'
}

/**
 * Organization-based role permissions
 */
export const ROLE_PERMISSIONS = {
  admin: ['*'], // All permissions
  manager: ['manage_users', 'view_analytics', 'manage_content'],
  customer: ['book_trips', 'manage_bookings', 'view_profile'],
  driver: ['manage_trips', 'manage_vehicles', 'view_earnings'],
  organization_admin: [
    'manage_organization',
    'manage_drivers',
    'manage_fleet',
    'create_organization_trips',
    'view_organization_analytics',
    'manage_organization_billing'
  ],
  organization_driver: [
    'manage_assigned_trips',
    'manage_assigned_vehicle',
    'view_performance',
    'report_maintenance'
  ],
  guest: ['view_public_content']
} as const;

/**
 * Authentication configuration settings
 */
export interface AuthConfig {
  tokenName: string;
  tokenLifetime: number;
  refreshTokenLifetime: number;
  tokenEndpoint: string;
  validateEndpoint: string;
}