import { apiClient } from "./api-client";

export interface Driver {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    isVerified: boolean;
    vehicleType?: string;
    licenseNumber?: string;
    createdAt: string;
    // Add other fields as needed based on API response
}

export interface VerifyDriverRequest {
    is_verified: boolean;
    notes: string;
}

export interface SetDriverStatusRequest {
    is_active: boolean;
    reason: string;
}

class AdminService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tawsilgo.com";
    }

    /**
     * List all drivers
     */
    async getDrivers(): Promise<Driver[]> {
        const response = await apiClient.get<any>(`${this.baseUrl}/api/v1/admin/drivers`);

        // Handle various response formats
        if (Array.isArray(response.data)) {
            return response.data;
        }
        // Handle { drivers: [...] }
        if (response.data && Array.isArray(response.data.drivers)) {
            return response.data.drivers;
        }
        // Handle { data: [...] } nested inside response.data
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        console.warn("Unexpected drivers API response format:", response.data);
        return [];
    }

    /**
     * Get specific driver profile
     */
    async getDriver(id: string): Promise<Driver> {
        const response = await apiClient.get<Driver>(`${this.baseUrl}/api/v1/admin/drivers/${id}`);
        if (!response.data) throw new Error("Driver not found");
        return response.data;
    }

    /**
     * Verify a driver's profile and documents
     */
    async verifyDriver(id: string, data: VerifyDriverRequest): Promise<void> {
        await apiClient.put<void>(`${this.baseUrl}/api/v1/admin/drivers/${id}/verify`, data);
    }

    /**
     * Enable/disable a driver (set active status)
     */
    async setDriverStatus(id: string, data: SetDriverStatusRequest): Promise<void> {
        await apiClient.put<void>(`${this.baseUrl}/api/v1/admin/drivers/${id}/status`, data);
    }

    /**
     * Verify an organization
     */
    async verifyOrganization(id: string): Promise<void> {
        await apiClient.post<void>(`${this.baseUrl}/api/v1/admin/organizations/${id}/verify`, {});
    }
}

export const adminService = new AdminService();
