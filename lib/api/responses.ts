// lib/api/responses.ts - Utility functions for API responses

import { NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { 
  ApiError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError 
} from './errors';

/**
 * Creates a standardized success response
 */
export function successResponse<T>(
  res: NextApiResponse,
  data: T,
  status: number = 200
): void {
  res.status(status).json({
    success: true,
    data,
    status,
  });
}

/**
 * Creates a standardized error response
 */
export function errorResponse(
  res: NextApiResponse,
  error: string,
  status: number = 500,
  message?: string
): void {
  res.status(status).json({
    success: false,
    error,
    status,
    message,
  });
}

/**
 * Handles an API error and sends the appropriate response
 */
export function handleApiError(
  res: NextApiResponse, 
  error: unknown
): void {
  console.error('[API Error]:', error);
  
  if (error instanceof ApiError) {
    // Handle specific error types
    return errorResponse(res, error.name, error.status, error.message);
  } else if (error instanceof Error) {
    // Handle generic errors
    return errorResponse(res, 'Server error', 500, error.message);
  } else {
    // Handle unknown errors
    return errorResponse(res, 'Unknown error', 500, 'An unexpected error occurred');
  }
}

/**
 * Wraps an API handler with error handling
 */
export function withErrorHandling<T>(
  handler: (req: any, res: NextApiResponse<ApiResponse<T>>) => Promise<void>
) {
  return async (req: any, res: NextApiResponse<ApiResponse<T>>): Promise<void> => {
    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(res, error);
    }
  };
}

/**
 * Validates that only specific HTTP methods are allowed for an endpoint
 */
export function validateHttpMethod(
  req: any,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!allowedMethods.includes(req.method || '')) {
    errorResponse(
      res,
      'Method not allowed',
      405,
      `The ${req.method} method is not supported for this endpoint`
    );
    return false;
  }
  return true;
}