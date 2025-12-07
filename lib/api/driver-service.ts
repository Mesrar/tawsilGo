import { apiClient } from "./api-client";

export interface CreateTripRequest {
    from_location: string;
    to_location: string;
    departure_time: string; // ISO string
    vehicle_id?: string;
    suggested_price: number;
}

export interface Trip {
    id: string;
    fromLocation: string;
    toLocation: string;
    departureTime: string;
    arrivalTime?: string; // Estimated
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
    price: number;
    duration?: string;
    stops: any[];
}

export interface TripDetails extends Trip {
    bookings: any[];
    currentLocation?: any;
    progress?: number;
}

export interface DriverProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    isVerified: boolean;
    vehicles?: any[];
    rating?: number;
    totalTrips?: number;
}

// Raw API responses
interface ApiTrip {
    id: string;
    origin: string; // "from" in UI
    destination: string; // "to" in UI
    departure_time: string;
    arrival_time?: string;
    status: string;
    price: number;
    stops?: any[];
    // Add other fields as needed
}

interface TripsListResponse {
    trips: ApiTrip[];
    page: number;
    limit: number;
    total: number;
}

class DriverService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tawsilgo.com";
    }

    private mapApiTripToTrip(apiTrip: ApiTrip): Trip {
        return {
            id: apiTrip.id,
            fromLocation: apiTrip.origin,
            toLocation: apiTrip.destination,
            departureTime: apiTrip.departure_time,
            arrivalTime: apiTrip.arrival_time,
            status: apiTrip.status as any,
            price: apiTrip.price,
            stops: apiTrip.stops || []
        };
    }

    /**
     * Get Driver Profile
     */
    async getProfile(driverId: string): Promise<DriverProfile> {
        const response = await apiClient.get<any>(`${this.baseUrl}/api/v1/drivers/${driverId}`);
        if (!response.success) {
            throw new Error(response.error?.message || "Failed to fetch profile");
        }

        const data = response.data;
        // Assuming response structure, adjust mapping as needed based on actual API return
        return {
            id: data.id,
            firstName: data.user?.name?.split(" ")[0] || "",
            lastName: data.user?.name?.split(" ").slice(1).join(" ") || "",
            email: data.user?.email,
            phone: data.user?.phone,
            status: data.status,
            isVerified: data.status === "verified",
            vehicles: data.vehicles,
            rating: data.rating,
            totalTrips: data.total_trips
        };
    }

    /**
     * Get Driver Trips
     */
    async getTrips(status?: string, page: number = 1, limit: number = 10): Promise<Trip[]> {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        if (status) queryParams.append("status", status);

        const response = await apiClient.get<TripsListResponse>(`${this.baseUrl}/api/v1/driver/trips?${queryParams.toString()}`);

        if (!response.success) {
            console.error("Failed to fetch trips:", response.error);
            // Return empty array instead of throwing to avoid crashing UI completely
            return [];
        }

        if (response.data && Array.isArray(response.data.trips)) {
            return response.data.trips.map(this.mapApiTripToTrip);
        }

        return [];
    }

    /**
     * Get Trip Details
     */
    async getTripDetails(tripId: string): Promise<TripDetails> {
        const response = await apiClient.get<any>(`${this.baseUrl}/api/v1/driver/trips/${tripId}/details`);

        if (!response.success) throw new Error(response.error?.message);

        const data = response.data;
        return {
            ...this.mapApiTripToTrip(data.trip || data),
            bookings: data.bookings || [],
            currentLocation: data.current_location,
            progress: data.progress_percentage
        };
    }

    /**
     * Create a new trip
     */
    async createTrip(data: CreateTripRequest): Promise<Trip> {
        const response = await apiClient.post<ApiTrip>(`${this.baseUrl}/api/v1/driver/trips`, data);

        if (!response.success) {
            throw new Error(response.error?.message || "Failed to create trip");
        }

        return this.mapApiTripToTrip(response.data!);
    }
}

export const driverService = new DriverService();
