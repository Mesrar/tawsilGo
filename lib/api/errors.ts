// lib/api/errors.ts - Custom API error classes

/**
 * Base class for all API errors
 */
export class ApiError extends Error {
  public readonly status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error for authentication failures - 401 Unauthorized
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Error for authorization failures - 403 Forbidden
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Error for invalid input data - 400 Bad Request
 */
export class ValidationError extends ApiError {
  public readonly validationErrors?: Record<string, string[]>;
  
  constructor(message: string = 'Invalid input data', validationErrors?: Record<string, string[]>) {
    super(message, 400);
    this.validationErrors = validationErrors;
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error for not found resources - 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource: string = 'resource') {
    super(`The requested ${resource} was not found`, 404);
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Error for rate limiting - 429 Too Many Requests
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429);
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}