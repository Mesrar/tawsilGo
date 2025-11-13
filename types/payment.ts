// Define payment-related types
export interface PaymentDetails {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  externalId?: string;
  externalProvider?: string;
  booking?: {
    id: string;
    tripId: string;
    status: string;
  };
}

export interface PaymentIntent {
  clientSecret: string;
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CreatePaymentIntentRequest {
  paymentId: string;
  amount: number;
  currency?: string;
  bookingId: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerifyRequest {
  paymentIntentId: string;
}

// Types for payment verification result
export interface PaymentVerificationResult {
  success?: boolean;
  status: string;
  paymentIntentId?: string;
  amount?: number;
  currency?: string;
  message?: string;
  payment?: {
    id: string;
    bookingId: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    description: string;
    completedAt: string;
    createdAt: string;
  };
  bookingId?: string;
  receiptUrl?: string;
  paymentMethod?: string;
}