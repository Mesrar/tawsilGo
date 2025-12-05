// filepath: /home/mesrar/Desktop/nextjs-app/pages/api/auth/validate-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { jwtDecode } from 'jwt-decode';

// Define response types for consistent API responses
type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  details?: unknown;
  claims?: T;
};

// Define types for token claims/payload
// Support both standard JWT claims (sub, name) and custom backend claims (userId, username)
type TokenClaims = {
  sub?: string;          // Standard JWT claim for user ID
  userId?: string;       // Custom backend claim for user ID
  name?: string;         // Standard JWT claim for user name
  username?: string;     // Custom backend claim for user name
  role: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

// Custom error class for token validation
class TokenValidationError extends Error {
  statusCode: number;
  details?: unknown;
  
  constructor(message: string, statusCode: number = 401, details?: unknown) {
    super(message);
    this.name = 'TokenValidationError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Schema for validating authorization header
const authHeaderSchema = z.string()
  .min(1, 'Authorization header is required')
  .refine(
    (val) => val.startsWith('Bearer '),
    { message: 'Authorization header must use Bearer scheme' }
  );

// Check if token is expired
const isTokenExpired = (exp?: number): boolean => {
  if (!exp) return false;
  // Add a small buffer (30 seconds) to account for clock differences
  return Date.now() >= (exp * 1000) - 30000;
};

// Validate a JWT token against the backend service
async function validateTokenWithBackend(token: string): Promise<boolean> {
  const apiUrl = process.env.VERIFY_API_URL;
  if (!apiUrl) {
    throw new TokenValidationError(
      'Server configuration error: Missing token validation service URL',
      500
    );
  }

  try {
    // Setup request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${apiUrl}/validate-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // If the response is not OK, the token is invalid
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new TokenValidationError(
        errorData?.message || 'Token validation failed',
        response.status,
        errorData
      );
    }
    
    return true;
  } catch (error) {
    if (error instanceof TokenValidationError) {
      throw error;
    }
    
    if (error instanceof Error) {
      // Handle timeout errors
      if (error.name === 'AbortError') {
        throw new TokenValidationError(
          'Token validation timed out',
          503
        );
      }
      
      // Handle other network errors
      throw new TokenValidationError(
        'Unable to connect to token validation service',
        503,
        { originalError: error.message }
      );
    }
    
    // Fallback for unknown errors
    throw new TokenValidationError('Unknown error during token validation', 500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenClaims>>
) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: `Method ${req.method} is not allowed. Only GET requests are supported.`
    });
  }
  
  try {
    // Extract and validate Authorization header
    const authHeader = req.headers.authorization;
    
    const parseResult = authHeaderSchema.safeParse(authHeader);
    if (!parseResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Authorization',
        message: parseResult.error.issues[0].message
      });
    }
    
    // Extract token from Bearer scheme
    const token = authHeader?.substring(7).trim();
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token is missing'
      });
    }
    
    try {
      // First, check if token is properly formatted and decode it
      const decoded = jwtDecode<TokenClaims>(token);
      
      // Check token expiration
      if (isTokenExpired(decoded.exp)) {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
          message: 'Authentication token has expired'
        });
      }

      // Extract user ID and name from either standard or custom claims
      const userId = decoded.sub || decoded.userId;
      const userName = decoded.name || decoded.username;

      // Required fields check with flexible claim names
      if (!userId || !userName || !decoded.role) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
          message: 'Token is missing required claims (userId/sub, username/name, role)'
        });
      }
      
      // Validate token with backend service if configured to do so
      if (process.env.VALIDATE_WITH_BACKEND === 'true') {
        await validateTokenWithBackend(token);
      }
      
      // Return success with token claims
      // Always return as 'sub' and 'name' for NextAuth compatibility
      return res.status(200).json({
        success: true,
        message: 'Token is valid',
        claims: {
          sub: userId,           // Normalized user ID (from sub or userId)
          name: userName,        // Normalized user name (from name or username)
          role: decoded.role,
          email: decoded.email,
          exp: decoded.exp,
          iat: decoded.iat
        }
      });
    } catch (decodeError) {
      console.error('Error decoding or validating token:', decodeError);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token format is invalid or token cannot be decoded'
      });
    }
  } catch (error) {
    // Handle specific token validation errors
    if (error instanceof TokenValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
        details: error.details
      });
    }
    
    // Log and handle unexpected errors
    console.error('Unhandled error in token validation API:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred during token validation',
      details: process.env.NODE_ENV === 'development'
        ? { message: error instanceof Error ? error.message : String(error) }
        : undefined
    });
  }
}