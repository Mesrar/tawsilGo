import { apiClient, ApiResponse } from "@/lib/api/api-client";
import {
  PaymentDetails,
  CreatePaymentIntentRequest,
  PaymentVerifyRequest,
} from "@/types/payment";
import { PaymentIntent } from "@stripe/stripe-js";

/**
 * Service to manage payments and payment intents
 */
export const paymentService = {
  /**
   * Create a payment for a booking
   */
  async createPayment(data: {
    bookingId: string;
    amount: number;
    currency?: string;
    method?: string;
    description?: string;
    metadata?: Record<string, any>;
    tripId?: string;
  }): Promise<ApiResponse<{ paymentId: string; payment: PaymentDetails }>> {
    return apiClient.post("/api/payments/create", data);
  },

  /**
   * Fetch payment details by ID
   */
  async getPaymentDetails(
    paymentId: string
  ): Promise<ApiResponse<PaymentDetails>> {
    return apiClient.get(`/api/payments/${paymentId}`);
  },

  /**
   * Create a payment intent with Stripe
   * Make sure this matches your actual API endpoint
   */
  async createPaymentIntent(data: {
    paymentId: string;
    bookingId?: string;
    amount: number;
    currency?: string;
  }): Promise<ApiResponse<{ clientSecret: string }>> {
    // Based on your logs, this should be the correct endpoint
    return apiClient.post("/api/payments/stripe/intent", data);
  },

  /**
   * Verify a payment status after redirect
   */
  async verifyPayment(paymentIntentId: string): Promise<
    ApiResponse<{
      status: string;
      bookingId?: string;
      amount?: number;
      currency?: string;
      customerId?: string;
      receiptUrl?: string;
      paymentMethod?: string;
    }>
  > {
    return apiClient.get(`/api/payments/verify/${paymentIntentId}`);
  },
  /**
   * Get payment methods for the current user
   */
  async getPaymentMethods(): Promise<
    ApiResponse<{ methods: Array<{ id: string; type: string; last4: string }> }>
  > {
    return apiClient.get("/api/user/payment-methods");
  },

  /**
   * Cancel a payment
   */
  async cancelPayment(
    paymentId: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `/api/payments/${paymentId}/cancel`,
      {}
    );
  },

  /**
   * Helper to recover saved payment data after authentication
   */
  getRecoveredPaymentData(): CreatePaymentIntentRequest | null {
    const savedData = sessionStorage.getItem("pending_payment_data");
    if (savedData) {
      sessionStorage.removeItem("pending_payment_data");
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error("Error parsing saved payment data:", error);
        return null;
      }
    }
    return null;
  },

  /**
   * Get payment history for current user
   */
  async getPaymentHistory(): Promise<
    ApiResponse<{ payments: PaymentDetails[] }>
  > {
    return apiClient.get<{ payments: PaymentDetails[] }>(
      "/api/user/payment-history"
    );
  },
};
