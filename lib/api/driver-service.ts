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
    // Extended fields matching UI requirements
    departureCountry: string;
    destinationCountry: string;
    departureCity: string;
    destinationCity: string;
    departureAddress: string;
    destinationAddress: string;
    dapartPoint: { lat: number; lng: number };
    arrivalPoint: { lat: number; lng: number };
    totalCapacity: number;
    remainingCapacity: number;
    estimatedDistance?: number;
    estimatedDuration?: number;
    statistics: {
        totalBookings: number;
        capacityUtilized: number;
        totalParcelWeight: number;
        pendingBookings: number;
        completedBookings: number;
        totalDistanceKm: number;
        totalDuration: number;
        averageSpeed: number;
    };
    route: {
        totalDistanceKm: number;
        totalDurationMins: number;
        routePolyline: string;
        directionSteps: any;
        hasStops: boolean;
    };
    priceDetails: {
        basePrice: number;
        pricePerKg: number;
        pricePerKm: number;
        currency: string;
    };
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
    departure_country?: string;
    destination_country?: string;
    departure_city?: string;
    destination_city?: string;
    departure_address?: string;
    destination_address?: string;
    depart_point?: { lat: number; lng: number };
    arrival_point?: { lat: number; lng: number };
    total_capacity?: number;
    remaining_capacity?: number;
    statistics?: any;
    route?: any;
    price_details?: any;
    current_location?: any;
    progress_percentage?: number;
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

        if (!response.success) {
            // Fallback for demo/dev if endpoint missing or fails
            console.warn("Failed to fetch trip details, trying listing...");
            const trips = await this.getTrips();
            const trip = trips.find(t => t.id === tripId);
            if (trip) {
                return {
                    ...trip,
                    bookings: [],
                    departureCountry: "Morocco",
                    destinationCountry: "Morocco",
                    departureCity: trip.fromLocation?.split(",")[0] || "",
                    destinationCity: trip.toLocation?.split(",")[0] || "",
                    departureAddress: trip.fromLocation,
                    destinationAddress: trip.toLocation,
                    dapartPoint: { lat: 0, lng: 0 },
                    arrivalPoint: { lat: 0, lng: 0 },
                    totalCapacity: 1000,
                    remainingCapacity: 1000,
                    statistics: {
                        totalBookings: 0,
                        capacityUtilized: 0,
                        totalParcelWeight: 0,
                        pendingBookings: 0,
                        completedBookings: 0,
                        totalDistanceKm: 0,
                        totalDuration: 0,
                        averageSpeed: 0
                    },
                    route: {
                        totalDistanceKm: 0,
                        totalDurationMins: 0,
                        routePolyline: "",
                        directionSteps: [],
                        hasStops: false
                    },
                    priceDetails: {
                        basePrice: trip.price || 0,
                        pricePerKg: 0,
                        pricePerKm: 0,
                        currency: "MAD"
                    }
                };
            }
            throw new Error(response.error?.message || "Failed to fetch trip details");
        }

        const data = response.data.trip || response.data;

        // Map API response to UI TripDetails structure
        // This is a comprehensive mapping assuming backend might return snake_case or different structure
        return {
            ...this.mapApiTripToTrip(data),
            bookings: response.data.bookings || [],
            currentLocation: data.current_location,
            progress: data.progress_percentage,

            departureCountry: data.departure_country || "Morocco",
            destinationCountry: data.destination_country || "Morocco",
            departureCity: data.departure_city || data.origin?.split(",")[0] || "",
            destinationCity: data.destination_city || data.destination?.split(",")[0] || "",
            departureAddress: data.departure_address || data.origin,
            destinationAddress: data.destination_address || data.destination,

            dapartPoint: data.depart_point || { lat: 0, lng: 0 },
            arrivalPoint: data.arrival_point || { lat: 0, lng: 0 },

            totalCapacity: data.total_capacity || 1000,
            remainingCapacity: data.remaining_capacity || 1000,

            statistics: data.statistics || {
                totalBookings: 0,
                capacityUtilized: 0,
                totalParcelWeight: 0,
                pendingBookings: 0,
                completedBookings: 0,
                totalDistanceKm: 0,
                totalDuration: 0,
                averageSpeed: 0
            },

            route: data.route || {
                totalDistanceKm: 0,
                totalDurationMins: 0,
                routePolyline: "",
                directionSteps: [],
                hasStops: false
            },

            priceDetails: data.price_details || {
                basePrice: data.price || 0,
                pricePerKg: 0,
                pricePerKm: 0,
                currency: "MAD"
            }
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

    /**
     * Start a trip
     */
    async startTrip(tripId: string): Promise<void> {
        const response = await apiClient.put<void>(`${this.baseUrl}/api/v1/driver/trips/${tripId}/start`, {});
        if (!response.success) {
            throw new Error(response.error?.message || "Failed to start trip");
        }
    }

    /**
     * Complete a trip
     */
    async completeTrip(tripId: string): Promise<void> {
        const response = await apiClient.put<void>(`${this.baseUrl}/api/v1/driver/trips/${tripId}/complete`, {});
        if (!response.success) {
            throw new Error(response.error?.message || "Failed to complete trip");
        }
    }

    /**
     * Get trip history
     */
    async getTripHistory(page: number = 1, limit: number = 10): Promise<Trip[]> {
        return this.getTrips("completed", page, limit);
    }

    /**
     * Get Driver Statistics
     */
    async getStatistics(driverId: string): Promise<any> {
        const response = await apiClient.get<any>(`${this.baseUrl}/api/v1/drivers/${driverId}/statistics`);

        if (!response.success) {
            // Return default/empty stats if endpoint fails
            console.warn("Failed to fetch statistics:", response.error);
            return {
                this_month_trips: 0,
                total_earnings: 0,
                on_time_rate: 0,
                average_rating: 0,
                weekly_activity: []
            };
        }

        return response.data;
    }

    /**
     * Get Driver Earnings & Financial History
     */
    async getEarnings(driverId: string): Promise<any> {
        const response = await apiClient.get<any>(`${this.baseUrl}/api/v1/drivers/${driverId}/earnings`);

        if (!response.success) {
            console.warn("Failed to fetch earnings:", response.error);
            // Return mock data for demo
            return {
                total_balance: 4250.00,
                pending_payout: 1250.00,
                last_payout: { amount: 3000.00, date: "2023-12-01" },
                currency: "MAD",
                chart_data: [
                    { name: 'Mon', amount: 450 },
                    { name: 'Tue', amount: 620 },
                    { name: 'Wed', amount: 550 },
                    { name: 'Thu', amount: 800 },
                    { name: 'Fri', amount: 950 },
                    { name: 'Sat', amount: 480 },
                    { name: 'Sun', amount: 400 },
                ],
                transactions: [
                    { id: "TX-9821", date: "2023-12-07T14:30:00", description: "Trip #TR-8534 payout", amount: 150.00, type: "credit", status: "completed" },
                    { id: "TX-9820", date: "2023-12-07T10:15:00", description: "Trip #TR-8533 payout", amount: 220.00, type: "credit", status: "completed" },
                    { id: "TX-9819", date: "2023-12-06T18:45:00", description: "Weekly payout", amount: -3000.00, type: "debit", status: "completed" },
                    { id: "TX-9818", date: "2023-12-06T12:00:00", description: "Bonus: High rating", amount: 50.00, type: "credit", status: "completed" },
                ]
            };
        }

        return response.data;
    }
}

export const driverService = new DriverService();
