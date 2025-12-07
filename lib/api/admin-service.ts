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

// Raw API response shape
interface ApiDriver {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        username: string;
    };
    license_number: string;
    operator_type: string;
    status: string;
    created_at: string;
    // Add other fields if needed
}

interface DriversListResponse {
    drivers: ApiDriver[];
    page: number;
    size: number;
    total_items: number;
    total_pages: number;
}

class AdminService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tawsilgo.com";
    }

    private mapApiDriverToDriver(apiDriver: ApiDriver): Driver {
        const nameParts = (apiDriver.user.name || "").split(" ");
        const firstName = nameParts[0] || apiDriver.user.username || "Unknown";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
            id: apiDriver.id,
            firstName,
            lastName,
            email: apiDriver.user.email,
            phone: apiDriver.user.phone,
            status: apiDriver.status, // e.g. "verified", "pending"
            isVerified: apiDriver.status === "verified",
            vehicleType: apiDriver.operator_type,
            licenseNumber: apiDriver.license_number,
            createdAt: apiDriver.created_at
        };
    }

    /**
     * List all drivers
     */
    async getDrivers(): Promise<Driver[]> {
        const response = await apiClient.get<DriversListResponse>(`${this.baseUrl}/api/v1/admin/drivers`);

        if (!response.success) {
            console.error("Failed to fetch drivers:", response.error);
            throw new Error(response.error?.message || "Failed to fetch drivers");
        }

        if (response.data && Array.isArray(response.data.drivers)) {
            return response.data.drivers.map((d) => this.mapApiDriverToDriver(d));
        }

        console.warn("Unexpected drivers API response format:", response.data);
        return [];
    }

    /**
     * Get specific driver profile
     */
    async getDriver(id: string): Promise<Driver> {
        // Assuming getDriver returns the single ApiDriver object directly or wrapped
        const response = await apiClient.get<ApiDriver>(`${this.baseUrl}/api/v1/admin/drivers/${id}`);

        if (!response.data) throw new Error("Driver not found");

        // Handle potential wrapping (e.g. if it returns { driver: ... } or just the driver)
        const data = response.data as any;
        const apiDriver = data.driver || data;

        return this.mapApiDriverToDriver(apiDriver);
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
