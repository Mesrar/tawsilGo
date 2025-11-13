// Standard API response type with TypeScript generics
export type ApiResponse<T = undefined> = {
  success: boolean;
  data?: T;
  user?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    requestId?: string;
    [key: string]: unknown;
  };
};

// Structured error type for consistent error responses
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  status: number;
};

// HTTP status codes mapped to readable names
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Type for HTTP status codes
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// Error codes for consistent error classification
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];