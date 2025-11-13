import { apiClient, ApiResponse } from "@/lib/api/api-client";
import { TripDetailsResponse, TripSearchParams, TripSearchResponse } from "@/types/trip";



/**
 * Service to manage trip search and details
 */
export const tripService = {
  /**
   * Search for available trips based on criteria
   */
  async searchTrips(params: TripSearchParams): Promise<ApiResponse<TripSearchResponse>> {
    // Build query string from params
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryString.append(key, String(value));
      }
    });
    
    return apiClient.get<TripSearchResponse>(`/api/user/available/trips?${queryString.toString()}`);
  },
  
  /**
   * Get a single trip by ID
   */
  async getTripById(tripId: string): Promise<ApiResponse<TripDetailsResponse>> {
    return apiClient.get<TripDetailsResponse>(`/api/trips/${tripId}`);
  },
  
  /**
   * Search for trips with popular routes
   */
  async getPopularRoutes(): Promise<ApiResponse<{
    routes: Array<{
      departureCountry: string;
      destinationCountry: string;
      departureCity: string;
      destinationCity: string;
      tripCount: number;
      lowestPrice: number;
      currency: string;
    }>;
  }>> {
    return apiClient.get<{
      routes: Array<{
        departureCountry: string;
        destinationCountry: string;
        departureCity: string;
        destinationCity: string;
        tripCount: number;
        lowestPrice: number;
        currency: string;
      }>;
    }>('/api/trips/popular-routes');
  },
  
  /**
   * Get trips scheduled for a specific carrier
   */
  async getCarrierTrips(
    carrierId: string,
    params?: {
      status?: 'upcoming' | 'completed' | 'cancelled' | 'all';
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<TripSearchResponse>> {
    // Build query params
    const queryString = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryString.append(key, String(value));
        }
      });
    }
    
    return apiClient.get<TripSearchResponse>(
      `/api/carriers/${carrierId}/trips${queryString.toString() ? `?${queryString.toString()}` : ''}`
    );
  },
  
  /**
   * Search trips by their trip code (for tracking)
   */
  async searchByTripCode(tripCode: string): Promise<ApiResponse<TripDetailsResponse>> {
    return apiClient.get<TripDetailsResponse>(`/api/trips/code/${tripCode}`);
  },
  
  /**
   * Get recommended trips based on user history
   */
  async getRecommendedTrips(): Promise<ApiResponse<TripSearchResponse>> {
    return apiClient.get<TripSearchResponse>('/api/user/recommended-trips');
  },
  
  /**
   * Get recent searches for the current user
   */
  async getRecentSearches(): Promise<ApiResponse<{
    searches: Array<{
      id: string;
      departureCity?: string;
      destinationCity?: string;
      departureCountry?: string;
      destinationCountry?: string;
      date?: string;
      searchedAt: string;
    }>;
  }>> {
    return apiClient.get<{
      searches: Array<{
        id: string;
        departureCity?: string;
        destinationCity?: string;
        departureCountry?: string;
        destinationCountry?: string;
        date?: string;
        searchedAt: string;
      }>;
    }>('/api/user/recent-searches');
  },
  
  /**
   * Save a trip search to history
   */
  async saveSearch(params: TripSearchParams): Promise<ApiResponse<{ success: boolean; searchId: string }>> {
    return apiClient.post<{ success: boolean; searchId: string }>(
      '/api/user/save-search',
      params
    );
  }
};