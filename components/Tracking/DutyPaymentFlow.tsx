"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Clock,
  Euro,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DutyBreakdown {
  itemValue: number;
  dutyRate: number;
  dutyAmount: number;
  vat: number;
  processingFee: number;
  totalDuty: number;
}

interface DutyPaymentFlowProps {
  trackingNumber: string;
  dutyBreakdown: DutyBreakdown;
  currency?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

type PaymentStep = "review" | "payment" | "processing" | "success" | "error";

/**
 * DutyPaymentFlow Component
 *
 * Integrated Stripe payment flow for Morocco customs duties.
 *
 * Features:
 * - Transparent duty breakdown
 * - Secure Stripe payment integration
 * - 3D Secure (SCA) support
 * - Multi-currency support (EUR/MAD)
 * - Payment confirmation with receipt
 * - Instant customs release notification
 *
 * Target: 85% duty payment conversion rate
 * Processing time: 4 hours after payment
 */
export function DutyPaymentFlow({
  trackingNumber,
  dutyBreakdown,
  currency = "EUR",
  onPaymentSuccess,
  onPaymentError,
}: DutyPaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("review");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"tawsilgo" | "direct">("tawsilgo");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulate Stripe Elements mount
  useEffect(() => {
    if (currentStep === "payment") {
      // In production, initialize Stripe Elements here
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      // const elements = stripe.elements();
      // const cardElement = elements.create('card');
      // cardElement.mount('#card-element');
    }
  }, [currentStep]);

  const handlePaymentMethodChange = (method: "tawsilgo" | "direct") => {
    setPaymentMethod(method);
  };

  const handleProceedToPayment = () => {
    setCurrentStep("payment");
  };

  const handleSubmitPayment = async () => {
    setIsProcessing(true);
    setCurrentStep("processing");

    try {
      // Simulate Stripe payment intent creation and confirmation
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // In production:
      // 1. Create payment intent on server
      // const response = await fetch('/api/duty-payment/create-intent', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     trackingNumber,
      //     amount: dutyBreakdown.totalDuty,
      //     currency,
      //   }),
      // });
      // const { clientSecret } = await response.json();
      //
      // 2. Confirm payment with Stripe
      // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: cardElement,
      //     billing_details: { name: cardDetails.name },
      //   },
      // });
      //
      // 3. Handle 3D Secure if required
      // if (paymentIntent.status === 'requires_action') {
      //   await stripe.handleCardAction(clientSecret);
      // }

      // Simulate successful payment
      const mockPaymentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setPaymentId(mockPaymentId);
      setCurrentStep("success");

      if (onPaymentSuccess) {
        onPaymentSuccess(mockPaymentId);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setCurrentStep("error");

      if (onPaymentError) {
        onPaymentError(error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Review Step
  if (currentStep === "review") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Euro className="h-6 w-6 text-moroccan-mint" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Pay Customs Duty
            </h3>
          </div>

          <Alert className="mb-6 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-semibold mb-1">Payment Required</p>
              <p>
                Your package is being held at Morocco customs. Pay now to release your
                package within 4 hours.
              </p>
            </AlertDescription>
          </Alert>

          {/* Duty Breakdown */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Duty Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Item Value:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(dutyBreakdown.itemValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Import Duty ({(dutyBreakdown.dutyRate * 100).toFixed(1)}%):
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(dutyBreakdown.dutyAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">VAT (20%):</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(dutyBreakdown.vat)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Processing Fee:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatCurrency(dutyBreakdown.processingFee)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-900 dark:text-white">
                  Total Due:
                </span>
                <span className="text-2xl font-bold text-moroccan-mint">
                  {formatCurrency(dutyBreakdown.totalDuty)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Payment Method
            </h4>
            <div className="space-y-3">
              {/* TawsilGo (Recommended) */}
              <button
                onClick={() => handlePaymentMethodChange("tawsilgo")}
                className={cn(
                  "w-full p-4 border-2 rounded-lg text-left transition-all",
                  paymentMethod === "tawsilgo"
                    ? "border-moroccan-mint bg-moroccan-mint/5"
                    : "border-slate-200 dark:border-slate-700 hover:border-moroccan-mint/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                          paymentMethod === "tawsilgo"
                            ? "border-moroccan-mint"
                            : "border-slate-300"
                        )}
                      >
                        {paymentMethod === "tawsilgo" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-moroccan-mint" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-slate-900 dark:text-white">
                          Pay via TawsilGo
                        </h5>
                        <Badge className="bg-moroccan-mint text-white text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Fast, secure payment with instant processing
                      </p>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <li className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-600" />
                          Package released in 4 hours
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-600" />
                          SMS confirmation immediately
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="h-3 w-3 text-green-600" />
                          All major cards accepted
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-moroccan-mint">+€5</div>
                    <div className="text-xs text-slate-500">Service fee</div>
                  </div>
                </div>
              </button>

              {/* Direct Payment */}
              <button
                onClick={() => handlePaymentMethodChange("direct")}
                className={cn(
                  "w-full p-4 border-2 rounded-lg text-left transition-all",
                  paymentMethod === "direct"
                    ? "border-moroccan-mint bg-moroccan-mint/5"
                    : "border-slate-200 dark:border-slate-700 hover:border-moroccan-mint/50"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                          paymentMethod === "direct"
                            ? "border-moroccan-mint"
                            : "border-slate-300"
                        )}
                      >
                        {paymentMethod === "direct" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-moroccan-mint" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-1">
                        Pay at Customs Office
                      </h5>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Pay in person at Tangier customs
                      </p>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                        <li className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          2-5 day processing delay
                        </li>
                        <li className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          Must visit customs in person
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white">Free</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Total to Pay */}
          <div className="mb-6 p-4 bg-moroccan-mint/10 rounded-lg border border-moroccan-mint/20">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">
                Total to Pay Now:
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-moroccan-mint">
                  {formatCurrency(
                    dutyBreakdown.totalDuty + (paymentMethod === "tawsilgo" ? 5 : 0)
                  )}
                </div>
                {paymentMethod === "tawsilgo" && (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Includes €5 service fee
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleProceedToPayment}
            disabled={paymentMethod === "direct"}
            className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600 h-12"
          >
            {paymentMethod === "tawsilgo" ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Proceed to Secure Payment
              </>
            ) : (
              "Visit Customs Office to Pay"
            )}
          </Button>

          {paymentMethod === "tawsilgo" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Secured by Stripe • PCI DSS Compliant</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Payment Step
  if (currentStep === "payment") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Payment Details
            </h3>
            <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <Lock className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          </div>

          {/* Stripe Card Element Placeholder */}
          <div className="mb-6">
            <Label>Card Information</Label>
            <div
              id="card-element"
              className="mt-2 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg min-h-[50px] bg-white dark:bg-slate-900"
            >
              {/* In production, Stripe Elements mounts here */}
              <div className="space-y-3">
                <Input
                  placeholder="Card number"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="MM / YY"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                  />
                  <Input
                    placeholder="CVC"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              placeholder="John Doe"
              className="mt-2"
            />
          </div>

          {/* Amount Summary */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Amount to charge:
              </span>
              <span className="text-xl font-bold text-moroccan-mint">
                {formatCurrency(dutyBreakdown.totalDuty + 5)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmitPayment}
              disabled={isProcessing || !cardDetails.name}
              className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600 h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay {formatCurrency(dutyBreakdown.totalDuty + 5)}
                </>
              )}
            </Button>
            <Button
              onClick={() => setCurrentStep("review")}
              variant="outline"
              disabled={isProcessing}
              className="w-full"
            >
              Back
            </Button>
          </div>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
            Your payment information is encrypted and secure. We never store your card
            details.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Processing Step
  if (currentStep === "processing") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-moroccan-mint animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Processing Payment...
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Please don't close this window. This may take a few seconds.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success Step
  if (currentStep === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Your customs duty has been paid. Your package will be released within 4
                hours.
              </p>

              <div className="inline-block p-4 bg-moroccan-mint/10 rounded-lg border border-moroccan-mint/20 mb-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  Payment Reference
                </p>
                <p className="text-xl font-mono font-bold text-moroccan-mint">
                  {paymentId}
                </p>
              </div>

              <div className="text-left space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <p className="font-semibold text-slate-900 dark:text-white">
                  What happens next?
                </p>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0 mt-0.5" />
                    <span>Payment confirmation sent to your email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0 mt-0.5" />
                    <span>Customs clearance initiated (processing time: 4 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0 mt-0.5" />
                    <span>SMS notification when package is cleared</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0 mt-0.5" />
                    <span>Delivery resumes to final destination</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => window.location.reload()}
                className="bg-moroccan-mint hover:bg-moroccan-mint-600"
              >
                Back to Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Error Step
  if (currentStep === "error") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Payment Failed
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {errorMessage || "We couldn't process your payment. Please try again."}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => setCurrentStep("payment")}
                className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setCurrentStep("review")}
                variant="outline"
                className="w-full"
              >
                Change Payment Method
              </Button>
            </div>

            <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              Need help?{" "}
              <a href="/support" className="text-moroccan-mint hover:underline">
                Contact Support
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
