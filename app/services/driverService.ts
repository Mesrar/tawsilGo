import { apiClient, ApiResponse } from "@/lib/api/api-client";
import {
  DriverApplyRequest,
  DriverProfile,
  VehicleRequest,
  Vehicle,
  DriverDocument,
  RegistrationStatus,
  SubmitVerificationResponse,
  DocumentType,
} from "@/types/driver";

/**
 * Service to manage driver registration and operations
 * Integrates with driver-service backend (port 8084)
 */
export const driverService = {
  /**
   * Step 1: Apply for driver role
   * Creates initial driver profile - user must be authenticated
   */
  async applyForDriver(
    data: DriverApplyRequest
  ): Promise<ApiResponse<DriverProfile>> {
    return apiClient.post<DriverProfile>("/api/driver/apply", data);
  },

  /**
   * Step 2: Upload a document
   * Can be called multiple times for different document types
   * @param driverId - The driver's ID
   * @param type - Document type (license, identity, insurance, vehicle_registration)
   * @param file - The file to upload (jpg, png, pdf)
   */
  async uploadDocument(
    driverId: string,
    type: DocumentType,
    file: File
  ): Promise<ApiResponse<DriverDocument>> {
    // Debug logging
    console.log("=== Frontend Upload Debug ===");
    console.log("Driver ID:", driverId);
    console.log("Document Type:", type);
    console.log("File object:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    console.log("Is File instance:", file instanceof File);
    console.log("Is Blob instance:", file instanceof Blob);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("type", type);
    formData.append("document", file, file.name); // Backend expects 'document' not 'file'

    // Log FormData entries
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], typeof pair[1], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
    }
    console.log("=== End Frontend Debug ===");

    // Use fetch directly for multipart/form-data
    // Don't set Content-Type header - browser sets it with boundary
    return apiClient.fetch<DriverDocument>(
      `/api/driver/${driverId}/documents`,
      {
        method: "POST",
        body: formData,
        // Remove Content-Type header to let browser set it with boundary
        headers: {},
      }
    );
  },

  /**
   * Get all documents for a driver
   */
  async getDocuments(
    driverId: string
  ): Promise<ApiResponse<DriverDocument[]>> {
    return apiClient.get<DriverDocument[]>(
      `/api/driver/${driverId}/documents`
    );
  },

  /**
   * Step 3: Add vehicle information
   * @param driverId - The driver's ID
   * @param vehicleData - Vehicle information
   */
  async addVehicle(
    driverId: string,
    vehicleData: VehicleRequest
  ): Promise<ApiResponse<Vehicle>> {
    return apiClient.post<Vehicle>(
      `/api/driver/${driverId}/vehicle`,
      vehicleData
    );
  },

  /**
   * Step 4: Submit driver profile for admin verification
   * Validates that all required documents and vehicle info are present
   */
  async submitForVerification(
    driverId: string
  ): Promise<ApiResponse<SubmitVerificationResponse>> {
    return apiClient.post<SubmitVerificationResponse>(
      `/api/driver/${driverId}/submit`,
      {}
    );
  },

  /**
   * Step 5: Get registration status
   * Use this to track progress and show what's missing
   */
  async getRegistrationStatus(
    driverId: string
  ): Promise<ApiResponse<RegistrationStatus>> {
    return apiClient.get<RegistrationStatus>(
      `/api/driver/${driverId}/registration-status`
    );
  },

  /**
   * Get driver profile by ID
   */
  async getDriverProfile(
    driverId: string
  ): Promise<ApiResponse<DriverProfile>> {
    return apiClient.get<DriverProfile>(`/api/driver/${driverId}`);
  },

  /**
   * Update driver availability
   */
  async updateAvailability(
    driverId: string,
    isAvailable: boolean
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put<{ success: boolean }>(
      `/api/driver/${driverId}/availability`,
      { is_available: isAvailable }
    );
  },

  /**
   * Get current authenticated user's driver profile
   * Returns null if user is not a driver
   */
  async getMyDriverProfile(): Promise<ApiResponse<DriverProfile | null>> {
    return apiClient.get<DriverProfile | null>("/api/driver/me");
  },
};
