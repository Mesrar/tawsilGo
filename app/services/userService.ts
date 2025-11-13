import { apiClient, ApiResponse } from "@/lib/api/api-client";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, VerifyAccountRequest, ResendVerificationRequest, RequestPasswordResetRequest, ValidateResetTokenRequest, ResetPasswordRequest, UpdateProfileRequest } from "@/types/user";
import { User } from "next-auth";



/**
 * Service to manage user authentication and account operations
 */
export const userService = {
  /**
   * Log in a user with username/email and password
   */
  async login(
    data: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>("/api/login", data, {
      requireAuth: false, // Login endpoint doesn't require auth
    });
  },

  /**
   * Register a new user account
   */
  async register(
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>("/api/register", data, {
      requireAuth: false, // Registration endpoint doesn't require auth
    });
  },

  /**
   * Verify a user account with a verification code
   */
  async verifyAccount(
    data: VerifyAccountRequest
  ): Promise<ApiResponse<{ success: boolean; user: User }>> {
    return apiClient.post<{ success: boolean; user: User }>(
      "/api/verify-account",
      data,
      {
        requireAuth: false, // Verification endpoint doesn't require auth
      }
    );
  },

  /**
   * Resend verification code
   */
  async resendVerification(
    data: ResendVerificationRequest
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/resend-verification",
      data,
      {
        requireAuth: false, // Resend verification endpoint doesn't require auth
      }
    );
  },

  /**
   * Request a password reset
   */
  async requestPasswordReset(
    data: RequestPasswordResetRequest
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/request-password-reset",
      data,
      {
        requireAuth: false, // Password reset request endpoint doesn't require auth
      }
    );
  },

  /**
   * Validate a password reset token
   */
  async validateResetToken(
    data: ValidateResetTokenRequest
  ): Promise<ApiResponse<{ valid: boolean; email?: string }>> {
    return apiClient.post<{ valid: boolean; email?: string }>(
      "/api/validate-reset-token",
      data,
      {
        requireAuth: false, // Token validation endpoint doesn't require auth
      }
    );
  },

  /**
   * Reset password using a valid token
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/reset-password",
      data,
      {
        requireAuth: false, // Password reset endpoint doesn't require auth
      }
    );
  },

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>("/api/user/profile");
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<ApiResponse<{ user: User; message: string }>> {
    // Handle file uploads (different from standard JSON)
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    
    return apiClient.fetch<{ user: User; message: string }>(
      "/api/user/profile",
      {
        method: "PUT",
        body: formData,
        // Don't set Content-Type header for FormData
      }
    );
  },

  /**
   * Change user password
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/user/change-password",
      data
    );
  },

  /**
   * Log out current user
   */
  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      "/api/logout",
      {},
      {
        // Even if logout fails, we shouldn't retry with authentication
        requireAuth: false,
      }
    );
  },

  /**
   * Delete user account
   */
  async deleteAccount(data: {
    password: string;
    reason?: string;
  }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/user/delete-account",
      data
    );
  },

  /**
   * Check if a username or email is available
   */
  async checkAvailability(data: {
    username?: string;
    email?: string;
  }): Promise<ApiResponse<{ available: boolean }>> {
    const queryParams = new URLSearchParams();
    if (data.username) queryParams.append("username", data.username);
    if (data.email) queryParams.append("email", data.email);
    
    return apiClient.get<{ available: boolean }>(
      `/api/check-availability?${queryParams.toString()}`,
      {
        requireAuth: false, // Availability check doesn't require auth
      }
    );
  },
};