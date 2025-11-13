"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentService } from "@/app/services/paymentService";
import { PaymentDetails } from "@/types/payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CheckoutForm from "@/components/Payment/PaymentForm";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Payment Intent Hook
const usePaymentIntent = (paymentId?: string | null, bookingId?: string | null) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Log for debugging
  console.log("usePaymentIntent: Starting with paymentId", paymentId, "bookingId", bookingId);

  useEffect(() => {
    if (!paymentId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchPaymentData = async () => {
      try {
        // Step 1: Get payment details
        console.log("Fetching payment details for:", paymentId);
        const detailsResponse = await paymentService.getPaymentDetails(paymentId);
        
        // Important: Check if component is still mounted
        if (!isMounted) return;
        
        console.log("Payment details response:", detailsResponse);
        
        if (!detailsResponse.success || !detailsResponse.data) {
          throw new Error(detailsResponse.error?.message || "Failed to fetch payment details");
        }
        
        const paymentData = detailsResponse.data;
        console.log("Payment details fetched:", paymentData);
        setPaymentDetails(paymentData);
        
        // Step 2: Create payment intent with Stripe
        console.log("Creating payment intent with data:", {
          paymentId,
          bookingId: bookingId || paymentData.bookingId,
          amount: paymentData.amount,
          currency: paymentData.currency || "EUR"
        });
        
        const intentResponse = await paymentService.createPaymentIntent({
          paymentId,
          bookingId: bookingId || paymentData.bookingId,
          amount: paymentData.amount,
          currency: paymentData.currency || "EUR"
        });
        
        // Check if component is still mounted
        if (!isMounted) return;
        
        console.log("Payment intent response:", intentResponse);
        
        if (!intentResponse.success) {
          throw new Error(intentResponse.error?.message || "Failed to create payment intent");
        }
        
        if (!intentResponse.data?.clientSecret) {
          throw new Error("No client secret returned from payment intent creation");
        }
        
        console.log("Payment intent created successfully, got client secret");
        setClientSecret(intentResponse.data.clientSecret);
      } catch (err) {
        // Check if component is still mounted
        if (!isMounted) return;
        
        console.error("Error in payment flow:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        // Check if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPaymentData();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [paymentId, bookingId]);

  return { clientSecret, paymentDetails, isLoading, error };
};

// Payment Page Component
function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("paymentId");
  const bookingId = searchParams?.get("bookingId");
  
  console.log("Payment page - params:", { paymentId, bookingId });
  console.log("Stripe key available:", !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  
  const { clientSecret, paymentDetails, isLoading, error } = usePaymentIntent(paymentId, bookingId);
  
  console.log("Payment form state:", { 
    hasClientSecret: !!clientSecret, 
    hasDetails: !!paymentDetails,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message
  });

  // Handle missing payment ID
  if (!paymentId) {
    return (
      <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No payment ID provided. Please return to booking.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/booking')}>
              Return to Booking
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Handle errors
  if (error && !isLoading) {
    return (
      <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Payment Error</AlertTitle>
            <AlertDescription>
              {error.message || "An error occurred while setting up the payment"}
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => router.push('/booking')}>
              Return to Booking
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
      {/* Trust badge with improved visibility */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex items-center justify-center bg-white/80 dark:bg-moroccan-mint/15 backdrop-blur-md rounded-full px-4 py-3 mb-6 shadow-lg border-2 border-moroccan-mint/30 dark:border-moroccan-mint/30">
          <span className="bg-moroccan-mint text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shadow-md">
            ✓
          </span>
          <span className="text-slate-900 dark:text-white font-medium text-sm">Secure Payment Processing</span>
        </div>

        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Complete Your Payment
        </h1>

        <p className="text-sm text-muted-foreground">
          Secure payment processed by Stripe
        </p>
      </div>

        <Card className="w-full">
          <CardContent className="pt-6">
            {isLoading || !paymentDetails ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Preparing payment form...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      {paymentDetails.currency} {paymentDetails.amount.toFixed(2)}
                    </span>
                  </div>



                  {bookingId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking ID</span>
                      <span className="text-xs font-mono">{bookingId}</span>
                    </div>
                  )}

                  <Separator className="my-2" />
                </div>

                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <CheckoutForm
                      paymentDetails={{
                        ...paymentDetails,
                        paymentId: paymentId,
                        bookingId: bookingId || paymentDetails.bookingId,
                      }}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Payment Setup Issue</AlertTitle>
                      <AlertDescription>
                        There was a problem setting up the payment form. Please try again.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={() => window.location.reload()}
                      className="mt-4"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="flex-col space-y-2 text-center text-xs text-muted-foreground">
            <p>Your payment information is secure and encrypted</p>
            <div className="flex justify-center space-x-2">
              <span>Powered by Stripe</span>
            </div>
          </CardFooter>
        </Card>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}