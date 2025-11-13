import { apiClient, ApiResponse } from "@/lib/api/api-client";
import {
  Organization,
  OrganizationRegistrationRequest,
  OrganizationRegistrationResponse,
  UpdateOrganizationRequest,
  OrganizationListResponse,
  OrganizationDetailsResponse,
  OrganizationSearchParams,
  OrganizationInvitation,
  DriverInvitationRequest,
  VerificationDocument,
  OrganizationStats,
  OrganizationDriver,
  OrganizationTrip,
} from "@/types/organization";

/**
 * Service to manage organization operations and multi-profile trip management
 */
export const organizationService = {
  /**
   * Register a new organization with admin account
   */
  async register(
    data: OrganizationRegistrationRequest
  ): Promise<ApiResponse<OrganizationRegistrationResponse>> {
    // Handle file uploads for verification documents
    const formData = new FormData();

    // Add all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !(value instanceof File)) {
        formData.append(key, value);
      }
    });

    // Add file fields separately
    if (data.businessRegistrationDocument) {
      formData.append('businessRegistrationDocument', data.businessRegistrationDocument);
    }
    if (data.taxIdDocument) {
      formData.append('taxIdDocument', data.taxIdDocument);
    }
    if (data.addressProofDocument) {
      formData.append('addressProofDocument', data.addressProofDocument);
    }
    if (data.insuranceDocument) {
      formData.append('insuranceDocument', data.insuranceDocument);
    }

    return apiClient.fetch<OrganizationRegistrationResponse>(
      "/api/organizations/register",
      {
        method: "POST",
        body: formData,
        requireAuth: false, // Registration doesn't require existing auth
      }
    );
  },

  /**
   * Get current user's organization details
   */
  async getCurrentOrganization(): Promise<ApiResponse<OrganizationDetailsResponse>> {
    return apiClient.get<OrganizationDetailsResponse>("/api/organizations/current");
  },

  /**
   * Get organization by ID
   */
  async getOrganization(
    organizationId: string
  ): Promise<ApiResponse<OrganizationDetailsResponse>> {
    return apiClient.get<OrganizationDetailsResponse>(
      `/api/organizations/${organizationId}`
    );
  },

  /**
   * Update organization profile
   */
  async updateOrganization(
    data: UpdateOrganizationRequest
  ): Promise<ApiResponse<{ organization: Organization; message: string }>> {
    return apiClient.put<{ organization: Organization; message: string }>(
      "/api/organizations/current",
      data
    );
  },

  /**
   * Search and list organizations (for admin purposes)
   */
  async searchOrganizations(
    params: OrganizationSearchParams
  ): Promise<ApiResponse<OrganizationListResponse>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    return apiClient.get<OrganizationListResponse>(
      `/api/organizations/search?${queryParams.toString()}`,
      {
        requireAuth: true,
        // Add admin role check middleware
      }
    );
  },

  /**
   * Get organization statistics
   */
  async getOrganizationStats(
    organizationId?: string
  ): Promise<ApiResponse<OrganizationStats>> {
    const endpoint = organizationId
      ? `/api/organizations/${organizationId}/stats`
      : "/api/organizations/current/stats";

    return apiClient.get<OrganizationStats>(endpoint);
  },

  /**
   * Invite a driver to join organization
   */
  async inviteDriver(
    data: DriverInvitationRequest
  ): Promise<ApiResponse<{ invitation: OrganizationInvitation; message: string }>> {
    return apiClient.post<{ invitation: OrganizationInvitation; message: string }>(
      "/api/organizations/invite-driver",
      data
    );
  },

  /**
   * Get pending invitations
   */
  async getPendingInvitations(): Promise<ApiResponse<OrganizationInvitation[]>> {
    return apiClient.get<OrganizationInvitation[]>(
      "/api/organizations/invitations/pending"
    );
  },

  /**
   * Cancel an invitation
   */
  async cancelInvitation(
    invitationId: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/organizations/invitations/${invitationId}/cancel`
    );
  },

  /**
   * Resend an invitation
   */
  async resendInvitation(
    invitationId: string
  ): Promise<ApiResponse<{ invitation: OrganizationInvitation; message: string }>> {
    return apiClient.post<{ invitation: OrganizationInvitation; message: string }>(
      `/api/organizations/invitations/${invitationId}/resend`
    );
  },

  /**
   * Get organization drivers
   */
  async getDrivers(
    organizationId?: string
  ): Promise<ApiResponse<OrganizationDriver[]>> {
    const endpoint = organizationId
      ? `/api/organizations/${organizationId}/drivers`
      : "/api/organizations/current/drivers";

    return apiClient.get<OrganizationDriver[]>(endpoint);
  },

  /**
   * Update driver status
   */
  async updateDriverStatus(
    driverId: string,
    status: OrganizationDriver['status']
  ): Promise<ApiResponse<{ driver: OrganizationDriver; message: string }>> {
    return apiClient.post<{ driver: OrganizationDriver; message: string }>(
      `/api/organizations/drivers/${driverId}/status`,
      { status }
    );
  },

  /**
   * Remove driver from organization
   */
  async removeDriver(
    driverId: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/organizations/drivers/${driverId}/remove`
    );
  },

  /**
   * Get organization trips
   */
  async getTrips(
    params?: {
      status?: OrganizationTrip['status'];
      driverId?: string;
      vehicleId?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<{ trips: OrganizationTrip[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<{ trips: OrganizationTrip[]; total: number; page: number; limit: number }>(
      `/api/organizations/current/trips?${queryParams.toString()}`
    );
  },

  /**
   * Upload verification document
   */
  async uploadVerificationDocument(
    type: VerificationDocument['type'],
    file: File
  ): Promise<ApiResponse<{ document: VerificationDocument; message: string }>> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('document', file);

    return apiClient.fetch<{ document: VerificationDocument; message: string }>(
      "/api/organizations/documents/upload",
      {
        method: "POST",
        body: formData,
      }
    );
  },

  /**
   * Get verification documents
   */
  async getVerificationDocuments(): Promise<ApiResponse<VerificationDocument[]>> {
    return apiClient.get<VerificationDocument[]>(
      "/api/organizations/current/documents"
    );
  },

  /**
   * Delete verification document
   */
  async deleteVerificationDocument(
    documentId: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/organizations/documents/${documentId}/delete`
    );
  },

  /**
   * Assign vehicle to driver
   */
  async assignVehicleToDriver(
    driverId: string,
    vehicleId: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/organizations/drivers/${driverId}/assign-vehicle`,
      { vehicleId }
    );
  },

  /**
   * Unassign vehicle from driver
   */
  async unassignVehicleFromDriver(
    driverId: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/organizations/drivers/${driverId}/unassign-vehicle`
    );
  },

  /**
   * Get driver performance metrics
   */
  async getDriverPerformance(
    driverId: string,
    period?: {
      start: string;
      end: string;
    }
  ): Promise<ApiResponse<{
    driver: OrganizationDriver;
    metrics: {
      completedTrips: number;
      totalRevenue: number;
      averageRating: number;
      onTimePerformance: number;
      customerSatisfaction: number;
      efficiency: number;
    };
    recentTrips: OrganizationTrip[];
  }>> {
    const queryParams = new URLSearchParams();

    if (period) {
      queryParams.append('startDate', period.start);
      queryParams.append('endDate', period.end);
    }

    return apiClient.get<{
      driver: OrganizationDriver;
      metrics: {
        completedTrips: number;
        totalRevenue: number;
        averageRating: number;
        onTimePerformance: number;
        customerSatisfaction: number;
        efficiency: number;
      };
      recentTrips: OrganizationTrip[];
    }>(
      `/api/organizations/drivers/${driverId}/performance?${queryParams.toString()}`
    );
  },

  /**
   * Create organization trip
   */
  async createTrip(data: {
    departureCountry: string;
    destinationCountry: string;
    departureCity: string;
    destinationCity: string;
    departureAddress: string;
    destinationAddress: string;
    departureTime: string;
    arrivalTime: string;
    vehicleId: string;
    driverId?: string;
    basePrice: number;
    pricePerKg: number;
    minimumPrice: number;
    currency?: string;
    totalCapacity: number;
    notes?: string;
  }): Promise<ApiResponse<{ trip: OrganizationTrip; message: string }>> {
    return apiClient.post<{ trip: OrganizationTrip; message: string }>(
      "/api/organizations/trips",
      data
    );
  },

  /**
   * Update organization trip
   */
  async updateTrip(
    tripId: string,
    data: Partial<{
      driverId: string;
      vehicleId: string;
      departureTime: string;
      arrivalTime: string;
      price: {
        basePrice: number;
        pricePerKg: number;
        minimumPrice: number;
        currency: string;
      };
      status: OrganizationTrip['status'];
      notes: string;
    }>
  ): Promise<ApiResponse<{ trip: OrganizationTrip; message: string }>> {
    return apiClient.post<{ trip: OrganizationTrip; message: string }>(
      `/api/organizations/trips/${tripId}`,
      data
    );
  },

  /**
   * Cancel organization trip
   */
  async cancelTrip(
    tripId: string,
    reason: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/organizations/trips/${tripId}/cancel`,
      { reason }
    );
  },

  /**
   * Deactivate organization
   */
  async deactivateOrganization(
    reason: string,
    password: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/organizations/deactivate",
      { reason, password }
    );
  },

  /**
   * Create organization vehicle
   */
  async createVehicle(data: {
    type: string;
    brand: string;
    model: string;
    licensePlate: string;
    year: number;
    capacityWeightMin: number;
    capacityWeightMax: number;
    capacityVolumeMin: number;
    capacityVolumeMax: number;
    features?: string[];
    photos?: string[];
    status?: string;
  }): Promise<ApiResponse<{ vehicle: any; message: string }>> {
    return apiClient.post<{ vehicle: any; message: string }>(
      "/api/organizations/vehicles",
      data
    );
  },

  /**
   * Get organization vehicles
   */
  async getVehicles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<{
    vehicles: any[];
    pagination: any;
    stats: any;
    filters: any;
  }>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<{
      vehicles: any[];
      pagination: any;
      stats: any;
      filters: any;
    }>(`/api/organizations/vehicles?${queryParams.toString()}`);
  },

  /**
   * Get organization trips
   */
  async getTrips(params?: {
    page?: number;
    limit?: number;
    status?: string;
    driverId?: string;
    vehicleId?: string;
    departureCity?: string;
    destinationCity?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ApiResponse<{
    trips: any[];
    pagination: any;
    stats: any;
    filters: any;
  }>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<{
      trips: any[];
      pagination: any;
      stats: any;
      filters: any;
    }>(`/api/organizations/trips?${queryParams.toString()}`);
  },

  /**
   * Transfer organization ownership
   */
  async transferOwnership(
    newAdminEmail: string,
    currentPassword: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      "/api/organizations/transfer-ownership",
      { newAdminEmail, currentPassword }
    );
  },
};