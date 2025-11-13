import { useState, useEffect } from "react";
import { paymentService } from "@/app/services/paymentService";
import { PaymentDetails } from "@/types/payment";

export const usePaymentIntent = (
  paymentId?: string | null,
  bookingId?: string | null
) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Log for debugging
  console.log(
    "usePaymentIntent: Starting with paymentId",
    paymentId,
    "bookingId",
    bookingId
  );

  useEffect(() => {
    if (!paymentId) {
      setIsLoading(false);
      return;
    }

    const fetchPaymentData = async () => {
      console.log("Fetching payment details for:", paymentId);
      try {
        // Step 1: Get payment details
        const detailsResponse =
          await paymentService.getPaymentDetails(paymentId);

        if (!detailsResponse.success || !detailsResponse.data) {
          throw new Error(
            detailsResponse.error?.message || "Failed to fetch payment details"
          );
        }

        console.log("Payment details fetched:", detailsResponse.data);
        setPaymentDetails(detailsResponse.data);

        // Step 2: Create payment intent
        console.log("Creating payment intent...");
        const intentResponse = await paymentService.createPaymentIntent({
          paymentId,
          bookingId: bookingId || detailsResponse.data.bookingId,
          amount: detailsResponse.data.amount,
          currency: detailsResponse.data.currency || "EUR",
        });
        console.log("Payment intent response:", intentResponse);
        console.log("Raw response data:", JSON.stringify(intentResponse));

        console.log("Payment intent response:", intentResponse);
        if (!intentResponse.success || !intentResponse.data?.clientSecret) {
          throw new Error(
            intentResponse.error?.message || "Failed to create payment intent"
          );
        }

        console.log("Payment intent created successfully, got client secret");
        setClientSecret(intentResponse.data.clientSecret);
      } catch (err) {
        console.error("Error in payment flow:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [paymentId, bookingId]);

  return { clientSecret, paymentDetails, isLoading, error };
};
