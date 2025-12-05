// lib/api/user-service.ts - User API service
import {
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  ValidationError
} from './errors';

/**
 * Class for handling user-related API requests
 */
export class UserService {
  private apiUrl: string;

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tawsilgo.com';
    this.apiUrl = apiUrl;
  }

  /**
   * Get the profile of the current user
   * @param token The authentication token
   * @returns User profile data
   */
  async getProfile(token: string) {
    const response = await fetch(`${this.apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });

    if (!response.ok) {
      throw this.handleApiError(response.status, 'Failed to fetch user profile');
    }

    return await response.json();
  }

  /**
   * Update user profile information
   * @param token The authentication token
   * @param userData The user data to update
   * @returns Updated user profile
   */
  async updateProfile(token: string, userData: Record<string, any>) {
    const response = await fetch(`${this.apiUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw this.handleApiError(response.status, 'Failed to update user profile');
    }

    return await response.json();
  }

  /**
   * Handle common API error responses with specific error types
   * @param status The HTTP status code
   * @param defaultMessage Default error message
   * @returns The appropriate error instance
   */
  private handleApiError(status: number, defaultMessage: string): ApiError {
    switch (status) {
      case 400:
        return new ValidationError('Bad request: Invalid input data');
      case 401:
        return new AuthenticationError('Unauthorized: Invalid or expired token');
      case 403:
        return new AuthorizationError('Forbidden: Insufficient permissions');
      case 404:
        return new NotFoundError('user profile');
      case 429:
        return new RateLimitError();
      case 500:
      case 502:
      case 503:
        return new ApiError('Server error: Please try again later');
      default:
        return new ApiError(`${defaultMessage} (Status ${status})`);
    }
  }
}