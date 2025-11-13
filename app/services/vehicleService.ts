import { apiClient, ApiResponse } from "@/lib/api/api-client";
import {
  Vehicle,
  VehicleRegistrationRequest,
  UpdateVehicleRequest,
  VehicleSearchParams,
  VehicleListResponse,
  VehicleDetailsResponse,
  VehicleAvailability,
  MaintenanceRecord,
  VehicleDocument,
  VehicleAnalytics,
  VehicleTransferRequest,
  VehicleAvailabilityResponse,
} from "@/types/vehicle";

/**
 * Service to manage vehicle operations for both individual drivers and organizations
 */
export const vehicleService = {
  /**
   * Register a new vehicle (for individual drivers)
   */
  async registerVehicle(
    data: VehicleRegistrationRequest
  ): Promise<ApiResponse<{ vehicle: Vehicle; message: string }>> {
    const formData = new FormData();

    // Add all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !(value instanceof File) && !Array.isArray(value)) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Add features array
    if (data.features) {
      formData.append('features', JSON.stringify(data.features));
    }

    // Add document files
    if (data.documents?.registration) {
      formData.append('registrationDocument', data.documents.registration);
    }
    if (data.documents?.insurance) {
      formData.append('insuranceDocument', data.documents.insurance);
    }
    if (data.documents?.inspection) {
      formData.append('inspectionDocument', data.documents.inspection);
    }

    // Add photos
    if (data.documents?.photos) {
      data.documents.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append(`photos`, photo);
        }
      });
    }

    return apiClient.fetch<{ vehicle: Vehicle; message: string }>(
      "/api/vehicles/register",
      {
        method: "POST",
        body: formData,
      }
    );
  },

  /**
   * Get current user's vehicles
   */
  async getCurrentUserVehicles(
    params?: VehicleSearchParams
  ): Promise<ApiResponse<VehicleListResponse>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    return apiClient.get<VehicleListResponse>(
      `/api/vehicles/current?${queryParams.toString()}`
    );
  },

  /**
   * Get vehicle by ID
   */
  async getVehicle(
    vehicleId: string
  ): Promise<ApiResponse<VehicleDetailsResponse>> {
    return apiClient.get<VehicleDetailsResponse>(
      `/api/vehicles/${vehicleId}`
    );
  },

  /**
   * Update vehicle details
   */
  async updateVehicle(
    vehicleId: string,
    data: UpdateVehicleRequest
  ): Promise<ApiResponse<{ vehicle: Vehicle; message: string }>> {
    const formData = new FormData();

    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !(value instanceof File) && !Array.isArray(value)) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Handle arrays
    if (data.features) {
      formData.append('features', JSON.stringify(data.features));
    }

    if (data.photos) {
      data.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append(`newPhotos`, photo);
        } else if (typeof photo === 'string') {
          formData.append(`existingPhotos`, photo);
        }
      });
    }

    return apiClient.fetch<{ vehicle: Vehicle; message: string }>(
      `/api/vehicles/${vehicleId}`,
      {
        method: "PUT",
        body: formData,
      }
    );
  },

  /**
   * Delete vehicle
   */
  async deleteVehicle(
    vehicleId: string,
    reason: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/vehicles/${vehicleId}/delete`,
      { reason }
    );
  },

  /**
   * Update vehicle status
   */
  async updateVehicleStatus(
    vehicleId: string,
    status: Vehicle['status'],
    reason?: string
  ): Promise<ApiResponse<{ vehicle: Vehicle; message: string }>> {
    return apiClient.post<{ vehicle: Vehicle; message: string }>(
      `/api/vehicles/${vehicleId}/status`,
      { status, reason }
    );
  },

  /**
   * Update vehicle availability
   */
  async updateVehicleAvailability(
    vehicleId: string,
    availability: VehicleAvailability
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/vehicles/${vehicleId}/availability`,
      availability
    );
  },

  /**
   * Get vehicle availability for multiple vehicles
   */
  async getVehiclesAvailability(
    vehicleIds: string[]
  ): Promise<ApiResponse<VehicleAvailabilityResponse>> {
    return apiClient.post<VehicleAvailabilityResponse>(
      "/api/vehicles/availability/batch",
      { vehicleIds }
    );
  },

  /**
   * Search vehicles (for organization fleet management)
   */
  async searchVehicles(
    params: VehicleSearchParams
  ): Promise<ApiResponse<VehicleListResponse>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return apiClient.get<VehicleListResponse>(
      `/api/vehicles/search?${queryParams.toString()}`
    );
  },

  /**
   * Upload vehicle document
   */
  async uploadVehicleDocument(
    vehicleId: string,
    type: VehicleDocument['type'],
    file: File,
    metadata?: {
      issueDate?: string;
      expiryDate?: string;
      issuingAuthority?: string;
      documentNumber?: string;
    }
  ): Promise<ApiResponse<{ document: VehicleDocument; message: string }>> {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('document', file);

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
    }

    return apiClient.fetch<{ document: VehicleDocument; message: string }>(
      `/api/vehicles/${vehicleId}/documents`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  /**
   * Get vehicle documents
   */
  async getVehicleDocuments(
    vehicleId: string
  ): Promise<ApiResponse<VehicleDocument[]>> {
    return apiClient.get<VehicleDocument[]>(
      `/api/vehicles/${vehicleId}/documents`
    );
  },

  /**
   * Delete vehicle document
   */
  async deleteVehicleDocument(
    vehicleId: string,
    documentId: string
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/vehicles/${vehicleId}/documents/${documentId}/delete`
    );
  },

  /**
   * Add maintenance record
   */
  async addMaintenanceRecord(
    vehicleId: string,
    data: Omit<MaintenanceRecord, 'id' | 'vehicleId' | 'createdAt'>
  ): Promise<ApiResponse<{ record: MaintenanceRecord; message: string }>> {
    const formData = new FormData();

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !Array.isArray(value)) {
        formData.append(key, value);
      }
    });

    // Add documents if any
    if (data.documents) {
      data.documents.forEach((doc, index) => {
        formData.append(`maintenanceDocument${index}`, doc);
      });
    }

    return apiClient.fetch<{ record: MaintenanceRecord; message: string }>(
      `/api/vehicles/${vehicleId}/maintenance`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  /**
   * Get maintenance history
   */
  async getMaintenanceHistory(
    vehicleId: string,
    params?: {
      type?: MaintenanceRecord['type'];
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<{ records: MaintenanceRecord[]; total: number; page: number; limit: number }>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<{ records: MaintenanceRecord[]; total: number; page: number; limit: number }>(
      `/api/vehicles/${vehicleId}/maintenance?${queryParams.toString()}`
    );
  },

  /**
   * Get upcoming maintenance
   */
  async getUpcomingMaintenance(
    vehicleId: string
  ): Promise<ApiResponse<MaintenanceRecord[]>> {
    return apiClient.get<MaintenanceRecord[]>(
      `/api/vehicles/${vehicleId}/maintenance/upcoming`
    );
  },

  /**
   * Update vehicle location
   */
  async updateVehicleLocation(
    vehicleId: string,
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    }
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/vehicles/${vehicleId}/location`,
      location
    );
  },

  /**
   * Get vehicle analytics
   */
  async getVehicleAnalytics(
    vehicleId: string,
    period: {
      start: string;
      end: string;
    }
  ): Promise<ApiResponse<VehicleAnalytics>> {
    const queryParams = new URLSearchParams();
    queryParams.append('start', period.start);
    queryParams.append('end', period.end);

    return apiClient.get<VehicleAnalytics>(
      `/api/vehicles/${vehicleId}/analytics?${queryParams.toString()}`
    );
  },

  /**
   * Transfer vehicle ownership
   */
  async transferVehicle(
    vehicleId: string,
    data: VehicleTransferRequest
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    const formData = new FormData();

    // Add text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && !(value instanceof File)) {
        formData.append(key, value);
      }
    });

    // Add documents
    if (data.documents) {
      data.documents.forEach((doc, index) => {
        formData.append(`transferDocument${index}`, doc);
      });
    }

    return apiClient.fetch<{ success: boolean; message: string }>(
      `/api/vehicles/${vehicleId}/transfer`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  /**
   * Get vehicle types and configurations
   */
  async getVehicleTypes(): Promise<ApiResponse<{
    types: Array<{
      type: string;
      name: string;
      description: string;
      defaultCapacity: any;
      commonFeatures: string[];
    }>;
  }>> {
    return apiClient.get<{
      types: Array<{
        type: string;
        name: string;
        description: string;
        defaultCapacity: any;
        commonFeatures: string[];
      }>;
    }>("/api/vehicles/types");
  },

  /**
   * Verify vehicle document
   */
  async verifyVehicleDocument(
    vehicleId: string,
    documentId: string,
    status: VehicleDocument['status'],
    rejectionReason?: string
  ): Promise<ApiResponse<{ document: VehicleDocument; message: string }>> {
    return apiClient.post<{ document: VehicleDocument; message: string }>(
      `/api/vehicles/${vehicleId}/documents/${documentId}/verify`,
      { status, rejectionReason }
    );
  },

  /**
   * Get vehicles needing attention (expiring documents, maintenance due, etc.)
   */
  async getVehiclesNeedingAttention(): Promise<ApiResponse<{
    expiringDocuments: Array<{
      vehicle: Vehicle;
      document: VehicleDocument;
      daysUntilExpiry: number;
    }>;
    maintenanceDue: Array<{
      vehicle: Vehicle;
      maintenanceRecord: MaintenanceRecord;
      daysUntilDue: number;
    }>;
    inactiveVehicles: Vehicle[];
  }>> {
    return apiClient.get<{
      expiringDocuments: Array<{
        vehicle: Vehicle;
        document: VehicleDocument;
        daysUntilExpiry: number;
      }>;
      maintenanceDue: Array<{
        vehicle: Vehicle;
        maintenanceRecord: MaintenanceRecord;
        daysUntilDue: number;
      }>;
      inactiveVehicles: Vehicle[];
    }>("/api/vehicles/attention-needed");
  },

  /**
   * Bulk update vehicle status
   */
  async bulkUpdateVehicleStatus(
    vehicleIds: string[],
    status: Vehicle['status'],
    reason?: string
  ): Promise<ApiResponse<{ updated: Vehicle[]; failed: string[]; message: string }>> {
    return apiClient.post<{ updated: Vehicle[]; failed: string[]; message: string }>(
      "/api/vehicles/bulk/status",
      { vehicleIds, status, reason }
    );
  },

  /**
   * Check vehicle availability for trip
   */
  async checkAvailabilityForTrip(
    vehicleId: string,
    tripDetails: {
      startTime: string;
      endTime: string;
      requiredCapacity: number;
      pickupLocation: {
        latitude: number;
        longitude: number;
      };
      dropoffLocation: {
        latitude: number;
        longitude: number;
      };
    }
  ): Promise<ApiResponse<{
    isAvailable: boolean;
    conflicts?: Array<{
      type: 'time_conflict' | 'capacity_conflict' | 'location_conflict';
      details: string;
    }>;
    alternativeVehicles?: Vehicle[];
  }>> {
    return apiClient.post<{
      isAvailable: boolean;
      conflicts?: Array<{
        type: 'time_conflict' | 'capacity_conflict' | 'location_conflict';
        details: string;
      }>;
      alternativeVehicles?: Vehicle[];
    }>(
      `/api/vehicles/${vehicleId}/check-availability`,
      tripDetails
    );
  },
};