import { apiClient, ApiResponse } from "@/lib/api/api-client";
import { BookingRequest, BookingCreateResponse, Booking } from "@/types/booking";

/**
 * Service to manage bookings and parcels
 */
export const bookingService = {
  /**
   * Create a booking and parcel in a single atomic transaction
   * This prevents orphaned parcels by ensuring both operations succeed or fail together
   */
  async createBookingWithParcel(
    request: BookingRequest
  ): Promise<ApiResponse<BookingCreateResponse>> {
    return apiClient.post<BookingCreateResponse>(
      "/api/booking/create",
      request,
      {
        // Optional custom auth error handler
        handleAuthError: (error) => {
          console.error("Authentication error creating booking:", error);
          // You could trigger a custom event or callback here
        },
      }
    );
  },

  /**
   * Get a booking by its ID
   * Calls the Next.js API route which proxies to the Go backend
   */
  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    // Use the local Next.js API route which handles backend communication
    return apiClient.get<Booking>(`/api/booking/${bookingId}`);
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `/api/bookings/${bookingId}/cancel`,
      {}
    );
  },

  /**
   * Get a user's booking history
   */
  async getUserBookings(): Promise<ApiResponse<{ bookings: Booking[] }>> {
    return apiClient.get<{ bookings: Booking[] }>("/api/user/bookings");
  },
  
  /**
   * Track a booking's status
   */
  async trackBooking(trackingId: string): Promise<ApiResponse<{
    booking: Booking;
    currentStatus: string;
    statusHistory: Array<{
      status: string;
      timestamp: string;
      location?: string;
    }>;
  }>> {
    return apiClient.get(`/api/tracking/${trackingId}`);
  },
  
  /**
   * Update a booking's details before payment
   */
  async updateBookingDetails(
    bookingId: string, 
    updates: {
      pickupPoint?: string;
      deliveryPoint?: string;
      specialRequirements?: string;
      senderDetails?: { name?: string; phone?: string };
      receiverDetails?: { name?: string; phone?: string };
    }
  ): Promise<ApiResponse<{ booking: Booking }>> {
    return apiClient.put<{ booking: Booking }>(
      `/api/bookings/${bookingId}`,
      updates
    );
  }
};