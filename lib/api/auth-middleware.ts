// lib/api/auth-middleware.ts - Authentication middleware for API routes

import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ApiException } from './error-handler';
import { cookies } from 'next/dist/server/request/cookies';

// Define the JWT token interface with our custom fields
export interface JwtToken extends JwtPayload {
  id: string;
  name: string;
  role: string;
  email?: string;
}

// API response types for client-side fetching
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    status: number;
  };
}

/**
 * Authentication middleware to verify JWT tokens
 */
export async function authenticateRequest(
  request: NextRequest,
  options: {
    allowedRoles?: string[];
    requireAuth?: boolean;
  } = { requireAuth: true }
): Promise<JwtToken | null> {
  const { requireAuth = true, allowedRoles = [] } = options;
  
  // Get token from cookies
  const token = (await cookies()).get('token')?.value;
  
  // If no token found but auth is required, throw error
  if (!token && requireAuth) {
    throw ApiException.authenticationError('Authentication required');
  }
  
  // If no token but auth is optional, return null
  if (!token) {
    return null;
  }
  
  try {
    // Decode the JWT token
    const decoded = jwtDecode<JwtToken>(token);
    
    // Check for token expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      throw ApiException.authenticationError('Token expired');
    }
    
    // Check role permissions if required
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      throw ApiException.authorizationError('Insufficient permissions');
    }
    
    return decoded;
  } catch (error) {
    // Handle specific decode errors
    if (error instanceof ApiException) {
      throw error;
    }
    
    // For other JWT errors
    throw ApiException.authenticationError('Invalid authentication token');
  }
}

/**
 * Higher-order function to create role-based route handlers
 */
export function withAuth<T>(
  handler: (request: NextRequest, user: JwtToken) => Promise<NextResponse<T>>,
  options: {
    allowedRoles?: string[];
    requireAuth?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    const user = await authenticateRequest(request, options);
    
    // If auth is optional and no user found, pass null to handler
    if (!options.requireAuth && !user) {
      return handler(request, null as unknown as JwtToken);
    }
    
    return handler(request, user as JwtToken);
  };
}

/**
 * Client-side API request function with authentication awareness
 * @param url The API endpoint URL
 * @param options Fetch request options
 * @returns A standardized API response
 */
export async function apiRequest<T>(
  url: string, 
  options?: RequestInit & {
    requireAuth?: boolean;
    handleAuthError?: (error: any) => void;
  }
): Promise<ApiResponse<T>> {
  try {
    // Default options
    const { requireAuth = true, handleAuthError, ...fetchOptions } = options || {};
    
    // Get auth token from cookies
    let token = '';
    if (typeof document !== 'undefined') {
      // Client-side cookies
      token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1] || '';
    }

    // Prepare headers with auth token if available
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...fetchOptions?.headers,
    };

    // Make the request
    const response = await fetch(url, {
      ...fetchOptions,
      credentials: 'include', // Always include cookies
      headers,
    });
    
    // Parse response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'No response data' };
      }
    }
    
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      if (handleAuthError) {
        handleAuthError({
          code: `AUTH_ERROR_${response.status}`,
          message: data.message || (response.status === 401 ? 'Authentication required' : 'Insufficient permissions'),
          status: response.status
        });
      }
      
      return {
        success: false,
        error: {
          code: response.status === 401 ? 'UNAUTHENTICATED' : 'UNAUTHORIZED',
          message: data.message || (response.status === 401 ? 'Authentication required' : 'Insufficient permissions'),
          status: response.status
        },
      };
    }
    
    // Handle other error responses
    if (!response.ok) {
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: data.message || 'An error occurred',
          details: data.details,
          status: response.status
        },
      };
    }
    
    // Handle successful responses
    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    // Network errors or other exceptions
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      },
    };
  }
}

/**
 * Create an authenticated API client with base URL and default options
 */
export function createApiClient(baseUrl: string = '') {
  return {
    /**
     * Make an authenticated API request
     */
    fetch: async <T>(
      path: string,
      options?: RequestInit & {
        requireAuth?: boolean;
        handleAuthError?: (error: any) => void;
      }
    ): Promise<ApiResponse<T>> => {
      const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
      return apiRequest<T>(url, options);
    }
  };
}

// Create a default API client instance
export const apiClient = createApiClient();