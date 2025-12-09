import { apiClient } from "./api-client";

export interface Parcel {
    id: string;
    trackingNumber: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
    weight: number;
    dimensions?: string;
    pickupAddress: string;
    deliveryAddress: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

export interface ParcelHistory {
    id: string;
    parcelId: string;
    status: string;
    location?: string;
    timestamp: string;
    note?: string;
}

export interface UpdateParcelStatusRequest {
    status: string;
    location?: string;
    note?: string;
    proofOfDelivery?: File; // For future implementation
}

class ParcelService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tawsilgo.com";
    }

    /**
     * Scan a parcel by tracking number or ID
     */
    async scanParcel(identifier: string): Promise<Parcel> {
        const response = await apiClient.get<Parcel>(`${this.baseUrl}/api/v1/driver/parcels/${identifier}`);

        if (!response.success) {
            throw new Error(response.error?.message || "Parcel not found");
        }

        return response.data!;
    }

    /**
     * Update parcel status
     */
    async updateParcelStatus(parcelId: string, data: UpdateParcelStatusRequest): Promise<void> {
        const response = await apiClient.put<void>(`${this.baseUrl}/api/v1/driver/parcels/${parcelId}/status`, {
            status: data.status,
            location: data.location,
            note: data.note
        });

        if (!response.success) {
            throw new Error(response.error?.message || "Failed to update parcel status");
        }
    }

    /**
     * Get parcel history/tracking
     */
    async getParcelHistory(parcelId: string): Promise<ParcelHistory[]> {
        const response = await apiClient.get<ParcelHistory[]>(`${this.baseUrl}/api/v1/driver/parcels/${parcelId}/history`);

        if (!response.success) {
            // Return empty array or throw based on preference. 
            // Often generic errors if identifier not found, but if found, return history.
            console.warn("Failed to fetch parcel history:", response.error);
            return [];
        }

        return response.data || [];
    }
}

export const parcelService = new ParcelService();
