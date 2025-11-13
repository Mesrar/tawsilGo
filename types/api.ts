// types/api.ts - Common types for API responses

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  error?: ApiError;
  status: number;
}
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  status: number;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

