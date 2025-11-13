"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  CreditCard, 
  Calendar, 
  FileText, 
  ArrowRight,
  ExternalLink,
  Home
} from "lucide-react";
import { paymentService } from "@/app/services/paymentService";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentVerificationResult } from "@/types/payment";



export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Look for multiple possible parameters
  const paymentIntentId = 
    searchParams?.get("payment_intent") ||
    searchParams?.get("paymentId") ||
    searchParams?.get("paymentIntentId");

  const redirectStatus = searchParams?.get("redirect_status");
  const bookingIdFromUrl = searchParams?.get("booking_id");
  
  // State for payment verification
  const [verificationData, setVerificationData] = useState<PaymentVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch payment verification data
  useEffect(() => {
    if (!paymentIntentId) {
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await paymentService.verifyPayment(paymentIntentId);
        
        if (response.success && response.data) {
          // Log for debugging
          console.log("Payment verification data:", response.data);
          setVerificationData(response.data);
        } else {
          throw new Error(response.error?.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [paymentIntentId]);

  // Fall back to directly getting payment details if verification fails
  useEffect(() => {
    if (error && paymentIntentId) {
      const getPaymentDetails = async () => {
        try {
          const response = await paymentService.getPaymentDetails(paymentIntentId);
          
          if (response.success && response.data) {
            setVerificationData({
              status: response.data.status || "unknown",
              bookingId: response.data.bookingId,
              amount: response.data.amount,
              currency: response.data.currency,
              payment: {
                id: response.data.id || "",
                bookingId: response.data.bookingId || "",
                amount: response.data.amount || 0,
                currency: response.data.currency || "EUR",
                status: response.data.status || "unknown",
                method: response.data.method || "",
                completedAt: response.data.updatedAt || new Date().toISOString(),
                createdAt: response.data.createdAt || new Date().toISOString(),
                description: ""
              }
            });
            setError(null);
          }
        } catch (secondError) {
          console.error("Failed to get payment details:", secondError);
        }
      };

      getPaymentDetails();
    }
  }, [error, paymentIntentId]);

  // Handle payment result logic
  const payment = verificationData?.payment;
  const paymentSuccessful = 
    redirectStatus === "succeeded" || 
    verificationData?.status === "succeeded" || 
    payment?.status === "completed" ||
    payment?.status === "paid";
  
  // Get booking ID from various possible sources
  const bookingId = payment?.bookingId || verificationData?.bookingId || bookingIdFromUrl;
  
  // Format currency for display
  const formatCurrency = (amount?: number, currency = "EUR") => {
    if (amount === undefined) return "";
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Handle missing payment ID
  if (!paymentIntentId) {
    return (
      <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-5">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle className="sr-only">Error</AlertTitle>
          <AlertDescription>
            Invalid payment information. No payment ID was provided.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => router.push('/dashboard')}
            className="mt-2"
          >
            Return to Dashboard
            <Home className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
      <Card className="w-full shadow-md animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        <CardHeader className="text-center pb-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center mb-4" aria-live="polite" aria-busy="true">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <span className="sr-only">Verifying your payment</span>
            </div>
          ) : error && !verificationData ? (
            <div className="flex justify-center mb-4">
              <AlertCircle 
                className="h-16 w-16 text-amber-500" 
                aria-hidden="true" 
              />
            </div>
          ) : paymentSuccessful ? (
            <div className="flex justify-center mb-4" aria-live="polite">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 
                  className="h-16 w-16 text-green-600" 
                  aria-hidden="true" 
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-amber-100 p-3">
                <AlertCircle 
                  className="h-16 w-16 text-amber-600" 
                  aria-hidden="true" 
                />
              </div>
            </div>
          )}
          
          <CardTitle 
            className={cn(
              "text-2xl font-bold",
              paymentSuccessful && !isLoading && !error && "text-green-700"
            )}
            aria-live="polite"
          >
            {isLoading ? "Verifying Payment..." : 
             error && !verificationData ? "Payment Verification Failed" : 
             paymentSuccessful ? "Payment Successful!" : 
             "Payment Status Uncertain"}
          </CardTitle>
          
          {!isLoading && !error && paymentSuccessful && (
            <CardDescription className="text-green-600 text-base">
              Thank you for your payment
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-5">
          {isLoading ? (
            <p className="text-center text-muted-foreground">
              Please wait while we verify your payment...
            </p>
          ) : error && !verificationData ? (
            <div className="space-y-4">
              <Alert variant="default">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>
                  We couldn't verify your payment status. However, your payment may still have been processed.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground mt-2">
                Error: {error.message || "Unknown error"}
              </p>
            </div>
          ) : (
            <>
              {/* Payment Status */}
              <div className={cn(
                "rounded-lg p-4",
                paymentSuccessful 
                  ? "bg-green-50 border border-green-100" 
                  : "bg-amber-50 border border-amber-100"
              )}>
                <h3 className="font-medium mb-1 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" aria-hidden="true" />
                  Payment {paymentSuccessful ? "Completed" : "Status"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {verificationData?.message || 
                   (paymentSuccessful 
                     ? "Your payment has been processed successfully." 
                     : "The status of your payment is unclear.")}
                </p>
              </div>
              
              {/* Payment Details */}
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="font-medium">Payment Details</h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium text-right">
                    {formatCurrency(
                      payment?.amount || verificationData?.amount,
                      payment?.currency || verificationData?.currency
                    )}
                  </div>
                  
                  {payment?.method && (
                    <>
                      <div className="text-muted-foreground">Method</div>
                      <div className="font-medium text-right capitalize">
                        {payment.method}
                      </div>
                    </>
                  )}
                  
                  {payment?.description && (
                    <>
                      <div className="text-muted-foreground">Description</div>
                      <div className="font-medium text-right">
                        {payment.description}
                      </div>
                    </>
                  )}
                  
                  {payment?.completedAt && (
                    <>
                      <div className="text-muted-foreground">Completed</div>
                      <div className="font-medium text-right">
                        <span title={payment.completedAt}>
                          {formatDate(payment.completedAt)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  <div className="text-muted-foreground">Payment ID</div>
                  <div className="font-mono text-xs text-right truncate" title={paymentIntentId}>
                    {payment?.id || paymentIntentId}
                  </div>
                </div>
                
                {bookingId && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Booking Reference</span>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded" title={bookingId}>
                        {bookingId.substring(0, 8)}...
                      </code>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 pt-2">
          {bookingId ? (
            <Button 
              asChild 
              className="w-full h-11"
              aria-label="View booking details"
            >
              <Link href={`/booking/${bookingId}`}>
                View Booking Details
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              className="w-full h-11"
              aria-label="Return to dashboard"
            >
              <Link href="/dashboard">
                Return to Dashboard
                <Home className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
          
          {verificationData?.receiptUrl && (
            <Button 
              variant="outline" 
              className="w-full h-11" 
              asChild
              aria-label="View payment receipt"
            >
              <Link 
                href={verificationData.receiptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Receipt
                <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
          
          {!paymentSuccessful && !isLoading && (
            <Button 
              asChild 
              variant="outline" 
              className="w-full h-11"
              aria-label="Contact customer support"
            >
              <Link href="/support/contact">
                Contact Support
                <FileText className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
          
          <div className="text-xs text-center text-muted-foreground mt-4 px-2">
            <p>
              {paymentSuccessful
                ? "A confirmation email has been sent to your registered email address."
                : "If you believe there's an issue with your payment, please contact our support team."}
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}