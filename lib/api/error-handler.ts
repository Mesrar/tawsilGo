import { NextResponse } from 'next/server';
import { ApiError, ApiResponse, ERROR_CODES, HTTP_STATUS, HttpStatus } from './types';

/**
 * Custom API Error class with additional properties for better error handling
 */
export class ApiException extends Error {
  public readonly code: string;
  public readonly status: HttpStatus;
  public readonly details?: unknown;

  constructor(message: string, code: string, status: HttpStatus, details?: unknown) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
    
    // Ensures proper instanceof checks work in TypeScript
    Object.setPrototypeOf(this, ApiException.prototype);
  }

  /**
   * Helper factory methods for common error types
   */
  static badRequest(message: string, details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST, details);
  }

  static validationError(message: string, details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY, details);
  }

  static authenticationError(message = 'Authentication required', details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.AUTHENTICATION_ERROR, HTTP_STATUS.UNAUTHORIZED, details);
  }

  static authorizationError(message = 'Insufficient permissions', details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.AUTHORIZATION_ERROR, HTTP_STATUS.FORBIDDEN, details);
  }

  static notFound(message = 'Resource not found', details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.RESOURCE_NOT_FOUND, HTTP_STATUS.NOT_FOUND, details);
  }

  static methodNotAllowed(allowedMethods: string[]): ApiException {
    return new ApiException(
      'Method not allowed', 
      ERROR_CODES.METHOD_NOT_ALLOWED, 
      HTTP_STATUS.METHOD_NOT_ALLOWED, 
      { allowedMethods }
    );
  }

  static conflict(message: string, details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.CONFLICT_ERROR, HTTP_STATUS.CONFLICT, details);
  }

  static internal(message = 'Internal server error', details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, details);
  }

  static serviceUnavailable(message = 'Service temporarily unavailable', details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.SERVICE_UNAVAILABLE, HTTP_STATUS.SERVICE_UNAVAILABLE, details);
  }

  static rateLimit(message = 'Rate limit exceeded', details?: unknown): ApiException {
    return new ApiException(message, ERROR_CODES.RATE_LIMIT_EXCEEDED, HTTP_STATUS.TOO_MANY_REQUESTS, details);
  }
}

/**
 * Create an error response with consistent structure
 */
export function createErrorResponse(
  error: ApiException | Error, 
  status: HttpStatus = HTTP_STATUS.INTERNAL_SERVER_ERROR
): NextResponse<ApiResponse<never>> {
  // Build a standard error object
  const apiError: ApiError = error instanceof ApiException 
    ? {
        code: error.code,
        message: error.message,
        status: error.status,
        details: error.details
      }
    : {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: error.message || 'An unexpected error occurred',
        status,
        details: process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
      };

  // Create a standardized API response
  const response: ApiResponse<never> = {
    success: false,
    error: apiError,
    meta: {
      timestamp: new Date().toISOString()
    }
  };

  return NextResponse.json(
    response,
    { status: apiError.status }
  );
}

/**
 * Create a success response with consistent structure
 */
export function createSuccessResponse<T>(
  data?: T, 
  status: HttpStatus = HTTP_STATUS.OK
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString()
    }
  };

  return NextResponse.json(response, { status });
}