"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Ensure correct import

type Order = {
  id: number;
  trackingNumber: string;
  departure: string;
  destination: string;
  weight: number;
  status: string;
  customsCleared: boolean;
};

async function fetchOrders() {
  const response = await fetch("/api/driver/orders/available", {
    credentials: "include",
    next: { tags: ["driver-orders"] }, // Add Next.js cache tag
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await response.json();
  return data.orders || [];
}

export default function AvailableOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["driver-orders"],
    queryFn: fetchOrders,
    staleTime: 60_000, // 1 minute cache
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  async function handleAcceptOrder(orderId: number) {
    try {
      const response = await fetch(`/api/driver/orders/${orderId}/accept`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to accept order");
      }
      const data = await response.json();
      toast({
        title: "Order Accepted",
        description: `Order ${orderId} accepted successfully`,
      });
      // Optionally refetch the orders to update UI
      queryClient.invalidateQueries({ queryKey: ["driver-orders"] });
    } catch (error: any) {
      toast({
        title: "Error accepting order",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {!data || data?.length === 0 ? (
        <p className="text-muted-foreground">No available orders.</p>
      ) : (
        data.map((order: Order) => (
          <Card
            key={order.id}
            className="bg-background/60 sm:rounded-lg"
          >
            <CardHeader>
              <CardTitle>Order: {order.trackingNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>From:</strong> {order.departure}
                </p>
                <p>
                  <strong>To:</strong> {order.destination}
                </p>
                <p>
                  <strong>Weight:</strong> {order.weight} kg
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Customs Cleared:</strong>{" "}
                  {order.customsCleared ? "Yes" : "No"}
                </p>
                <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => handleAcceptOrder(order.id)}>
                    Accept Order
                  </Button>
                  <Link
                    href={`/drivers/dashboard/orders/${order.id}`}
                  >
                    <Button variant="default">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
