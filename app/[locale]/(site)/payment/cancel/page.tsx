"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Suspense } from "react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_intent");
  const reason = searchParams?.get("reason") || "The payment was canceled";

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="w-full">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-xl">Payment Canceled</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            {reason}
          </p>
          
          {paymentId && (
            <p className="text-xs text-muted-foreground mb-2">
              Reference: {paymentId}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
          
          {paymentId && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/payment?paymentId=${paymentId}`}>
                Try Payment Again
              </Link>
            </Button>
          )}
          
          <div className="text-xs text-center text-muted-foreground mt-4">
            <p>If you believe this is an error, please contact our support team.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="container max-w-md mx-auto py-12 text-center">Loading...</div>}>
      <PaymentCancelContent />
    </Suspense>
  );
}