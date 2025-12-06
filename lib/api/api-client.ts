import { signOut, getSession } from 'next-auth/react';
import { showLoginModal } from '../auth-context';

// Define comprehensive API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  status: number;
  ok: boolean;
}

export interface ApiError {
  code?: string;
  message: string;
  details?: any;
  status: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

// Authentication state management
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: any) => void;
  url: string;
  options?: RequestInit;
}> = [];

/**
 * Attempts to refresh the authentication token
 * @returns Promise resolving to success/failure of token refresh
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If refresh fails, clear the session
      await signOut({ redirect: false });
      return false;
    }

    const data = await response.json() as RefreshTokenResponse;
    return data.success === true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

/**
 * Handles unauthorized responses by attempting token refresh
 * @param originalUrl Original request URL
 * @param originalOptions Original fetch options
 * @returns Promise resolving to a new fetch response or rejection
 */
async function handleUnauthorized(
  originalUrl: string,
  originalOptions?: RequestInit
): Promise<Response> {
  // Try token refresh only once to prevent infinite loops
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const refreshed = await refreshToken();

      if (refreshed) {
        // Token refreshed successfully, retry queued requests
        failedRequestsQueue.forEach(request => {
          fetch(request.url, {
            ...request.options,
            credentials: 'include'
          }).then(request.resolve).catch(request.reject);
        });
        failedRequestsQueue = [];

        // Retry the original request with new token
        return fetch(originalUrl, {
          ...originalOptions,
          credentials: 'include'
        });
      } else {
        // Refresh failed, clear session and show login modal
        showLoginModal({
          message: "Your session has expired. Please sign in again to continue.",
          returnUrl: window.location.pathname + window.location.search,
        });

        throw new Error("Authentication required");
      }
    } catch (error) {
      // Handle refresh failure
      showLoginModal({
        message: "Your session has expired. Please sign in again to continue.",
        returnUrl: window.location.pathname + window.location.search,
      });

      throw error;
    } finally {
      isRefreshing = false;
    }
  } else {
    // Queue this request to retry after refresh
    return new Promise((resolve, reject) => {
      failedRequestsQueue.push({
        resolve,
        reject,
        url: originalUrl,
        options: originalOptions
      });
    });
  }
}

/**
 * Processes API response into a consistent format
 * @param response Fetch Response object
 * @returns Promise resolving to typed ApiResponse
 */
async function processApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const status = response.status;
  const ok = response.ok;

  try {
    // Try to parse JSON response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      // Format response consistently
      if (ok) {
        return {
          success: true,
          data: data.data || data,
          status,
          ok
        };
      } else {
        // Support RFC 7807 Problem Details format
        const errorMessage = data.detail || data.message || data.error || data.title || 'An error occurred';
        const errorCode = data.type || data.code || `HTTP_${status}`;

        return {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            details: data,
            status
          },
          status,
          ok
        };
      }
    } else {
      // Handle non-JSON responses
      const text = await response.text();

      if (ok) {
        return {
          success: true,
          data: text as unknown as T,
          status,
          ok
        };
      } else {
        return {
          success: false,
          error: {
            code: `HTTP_${status}`,
            message: text || response.statusText || 'An error occurred',
            status
          },
          status,
          ok
        };
      }
    }
  } catch (error) {
    // Handle parsing errors
    return {
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to parse response',
        status
      },
      status,
      ok
    };
  }
}

/**
 * API client with typed responses and authentication handling
 */
export const apiClient = {
  /**
   * Fetch data from API with authentication and error handling
   * @param url API endpoint URL
   * @param options Fetch options
   * @param customHandlers Custom handlers for different response types
   * @returns Promise resolving to typed API response
   */
  async fetch<T = any>(
    url: string,
    options?: RequestInit & {
      handleAuthError?: (error: ApiError) => void;
      requireAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    const { handleAuthError, requireAuth = true, ...fetchOptions } = options || {};

    try {
      // Get session to retrieve access token
      const session = await getSession();
      const headers = new Headers(fetchOptions.headers);

      if (session && (session as any).accessToken) {
        headers.set('Authorization', `Bearer ${(session as any).accessToken}`);
      }

      let response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      });

      // Handle 401/403 errors globally
      if ((response.status === 401 || response.status === 403) && requireAuth) {
        try {
          response = await handleUnauthorized(url, fetchOptions);
        } catch (error) {
          // If auth handler was provided, call it
          if (handleAuthError) {
            handleAuthError({
              code: `AUTH_ERROR_${response.status}`,
              message: response.status === 401 ? 'Authentication required' : 'Access denied',
              status: response.status
            });
          }

          return {
            success: false,
            error: {
              code: response.status === 401 ? 'UNAUTHENTICATED' : 'UNAUTHORIZED',
              message: response.status === 401 ? 'Authentication required' : 'Access denied',
              status: response.status
            },
            status: response.status,
            ok: false
          };
        }
      }

      // Process response to consistent format
      return await processApiResponse<T>(response);

    } catch (error) {
      // Handle network errors
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
          status: 0
        },
        status: 0,
        ok: false
      };
    }
  },

  /**
   * Simplified GET request
   */
  async get<T = any>(
    url: string,
    options?: Omit<RequestInit, 'method'> & {
      handleAuthError?: (error: ApiError) => void;
      requireAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(url, { ...options, method: 'GET' });
  },

  /**
   * Simplified POST request
   */
  async post<T = any>(
    url: string,
    data: any,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      handleAuthError?: (error: ApiError) => void;
      requireAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data)
    });
  },

  /**
   * Simplified PUT request
   */
  async put<T = any>(
    url: string,
    data: any,
    options?: Omit<RequestInit, 'method' | 'body'> & {
      handleAuthError?: (error: ApiError) => void;
      requireAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data)
    });
  },

  /**
   * Simplified DELETE request
   */
  async delete<T = any>(
    url: string,
    options?: Omit<RequestInit, 'method'> & {
      handleAuthError?: (error: ApiError) => void;
      requireAuth?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    return this.fetch<T>(url, { ...options, method: 'DELETE' });
  }
};