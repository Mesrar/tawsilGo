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
    documents?: {
        name: string;
        type: 'license' | 'id_card' | 'insurance' | 'other';
        url: string;
        status: 'pending' | 'verified' | 'rejected';
    }[];
}

export interface VerifyDriverRequest {
    is_verified: boolean;
    notes: string;
}

export interface SetDriverStatusRequest {
    is_active: boolean;
    reason: string;
}

// Document verification types
export interface DriverDocument {
    id: string;
    name: string;
    type: 'license' | 'id_card' | 'insurance' | 'vehicle_registration' | 'other';
    url: string;
    status: 'pending' | 'approved' | 'rejected';
    uploaded_at: string;
    verified_at?: string;
    verified_by?: string;
    rejection_reason?: string;
}

export interface DocumentVerificationRequest {
    status: 'approved' | 'rejected';
    notes?: string;
}

export interface BulkDocumentVerifyRequest {
    document_ids: string[];
    notes?: string;
}

// Status history types
export interface StatusHistoryEntry {
    id: string;
    action_type: 'verified' | 'unverified' | 'activated' | 'deactivated' | 'document_approved' | 'document_rejected' | 'created';
    admin_id?: string;
    admin_name?: string;
    previous_value?: string;
    new_value: string;
    notes?: string;
    timestamp: string;
}

// Vehicle types
export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    type: string;
    capacity: number;
    status: 'pending' | 'verified' | 'rejected' | 'verification_pending';
    driverId: string;
    driverName: string;
    documents?: {
        name: string;
        url: string;
        status: string;
    }[];
    createdAt: string;
}

export interface VerifyVehicleRequest {
    status: 'verified' | 'rejected';
    notes?: string;
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
    documents?: any[];
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

        // Mock documents if not present for UI demonstration
        const documents = apiDriver.documents || [
            { name: "Driving License", type: "license", url: "https://placehold.co/600x400/png?text=Driving+License", status: apiDriver.status === 'verified' ? 'verified' : 'pending' },
            { name: "ID Card (Front)", type: "id_card", url: "https://placehold.co/600x400/png?text=ID+Card", status: apiDriver.status === 'verified' ? 'verified' : 'pending' },
            { name: "Insurance Policy", type: "insurance", url: "https://placehold.co/600x400/png?text=Insurance", status: apiDriver.status === 'verified' ? 'verified' : 'pending' }
        ];

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
            createdAt: apiDriver.created_at,
            documents: documents as any
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

    /**
     * Get driver documents
     */
    async getDriverDocuments(driverId: string): Promise<DriverDocument[]> {
        try {
            // Backend returns: {data: {documents: [], total: 0}, success: true}
            const response = await apiClient.get<{ data: { documents: DriverDocument[] | null; total: number }; success: boolean }>(
                `${this.baseUrl}/api/v1/admin/drivers/${driverId}/documents`
            );
            return response.data?.data?.documents || [];
        } catch (error) {
            console.warn("Documents endpoint not available, using mock data");
            // Return mock documents for UI development
            return [
                {
                    id: "doc-1",
                    name: "Driving License",
                    type: "license",
                    url: "https://placehold.co/600x400/png?text=Driving+License",
                    status: "pending",
                    uploaded_at: new Date().toISOString()
                },
                {
                    id: "doc-2",
                    name: "ID Card",
                    type: "id_card",
                    url: "https://placehold.co/600x400/png?text=ID+Card",
                    status: "pending",
                    uploaded_at: new Date().toISOString()
                },
                {
                    id: "doc-3",
                    name: "Insurance Policy",
                    type: "insurance",
                    url: "https://placehold.co/600x400/png?text=Insurance",
                    status: "approved",
                    uploaded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    verified_at: new Date().toISOString(),
                    verified_by: "Admin"
                }
            ];
        }
    }

    /**
     * Verify or reject a single document
     */
    async verifyDocument(
        driverId: string,
        documentId: string,
        data: DocumentVerificationRequest
    ): Promise<void> {
        await apiClient.put<void>(
            `${this.baseUrl}/api/v1/admin/drivers/${driverId}/documents/${documentId}/verify`,
            data
        );
    }

    /**
     * Bulk verify all pending documents
     */
    async bulkVerifyDocuments(
        driverId: string,
        data: BulkDocumentVerifyRequest
    ): Promise<void> {
        await apiClient.put<void>(
            `${this.baseUrl}/api/v1/admin/drivers/${driverId}/documents/bulk-verify`,
            data
        );
    }

    /**
     * Get driver status change history
     */
    async getDriverStatusHistory(driverId: string): Promise<StatusHistoryEntry[]> {
        try {
            // Backend returns: {data: {history: [], total: 0}, success: true}
            const response = await apiClient.get<{ data: { history: StatusHistoryEntry[] | null; total: number }; success: boolean }>(
                `${this.baseUrl}/api/v1/admin/drivers/${driverId}/status-history`
            );
            return response.data?.data?.history || [];
        } catch (error) {
            console.warn("Status history endpoint not available, using mock data");
            // Return mock history for UI development
            return [
                {
                    id: "hist-1",
                    action_type: "created",
                    new_value: "Driver account created",
                    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "hist-2",
                    action_type: "document_approved",
                    admin_name: "Admin User",
                    new_value: "Insurance Policy approved",
                    notes: "Document verified",
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: "hist-3",
                    action_type: "activated",
                    admin_name: "Admin User",
                    previous_value: "inactive",
                    new_value: "active",
                    notes: "Driver activated after document review",
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];
        }
    }

    /**
     * List all vehicles
     */
    async getVehicles(): Promise<Vehicle[]> {
        // Expected endpoint: GET /api/v1/admin/vehicles
        const response = await apiClient.get<{ vehicles: any[] }>(`${this.baseUrl}/api/v1/admin/vehicles`);

        if (!response.success && !response.data) {
            console.warn("Vehicles endpoint failed or empty, returning mock data");
            return [
                {
                    id: "v1",
                    make: "Volvo",
                    model: "FH16",
                    year: 2022,
                    plateNumber: "WA-12345-AB",
                    type: "Truck",
                    capacity: 20000,
                    status: "verification_pending",
                    driverId: "d1",
                    driverName: "Ahmed Benali",
                    createdAt: new Date().toISOString()
                }
            ];
        }

        const vehicles = response.data?.vehicles || (response.data as any) || [];

        return vehicles.map((v: any) => ({
            id: v.id,
            make: v.make || "Unknown",
            model: v.model || "Unknown",
            year: v.year || 2020,
            plateNumber: v.plate_number || v.plateNumber || "Unknown",
            type: v.type || "Unknown",
            capacity: v.capacity || 0,
            status: v.status || "pending",
            driverId: v.driver_id || v.driverId || "",
            driverName: v.driver_name || v.driverName || "Unknown Driver",
            createdAt: v.created_at || v.createdAt || new Date().toISOString()
        }));
    }

    /**
     * Verify a vehicle
     */
    async verifyVehicle(id: string, data: VerifyVehicleRequest): Promise<void> {
        // Expected endpoint: PUT /api/v1/admin/vehicles/:id/verify
        await apiClient.put<void>(`${this.baseUrl}/api/v1/admin/vehicles/${id}/verify`, data);
    }
}

export const adminService = new AdminService();
