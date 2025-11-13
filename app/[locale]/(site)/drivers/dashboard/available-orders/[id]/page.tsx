"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Clock, Package, Truck, CheckCircle, Phone, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderDetails = {
  id: number;
  trackingNumber: string;
  departure: string;
  destination: string;
  weight: number;
  status: "pending" | "in-transit" | "delivered";
  customsCleared: boolean;
  recipientName: string;
  recipientPhone: string;
  estimatedDelivery: string;
  specialInstructions: string;
  deliveryAddress: string;
  coordinates: [number, number];
  timeline: {
    event: string;
    timestamp: string;
    location: string;
  }[];
  documents: string[];
};

async function getOrder(id: string) {
  const response = await fetch(`/api/driver/orders/details/${id}`, {
    credentials: "include",
    next: { tags: ["driver-orders"] },
  });

  if (!response.ok) throw new Error("Failed to fetch order details");
  return await response.json();
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading, error, isRefetching } = useQuery<OrderDetails>({
    queryKey: ["driver-orders", id],
    queryFn: () => getOrder(id),
    staleTime: 60_000,
    retry: 2,
  });

  console.log(data)
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading order",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center mt-8">{error.message}</p>;
  if (!data) return <p className="text-center mt-8">No details available for this order.</p>;

  const statusPercentage = {
    pending: 30,
    "in-transit": 70,
    delivered: 100
  }[data.status];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          &larr; Back to Orders
        </Button>
        <Badge variant={data.customsCleared ? "default" : "destructive"}>
          {data.customsCleared ? "Customs Cleared" : "Customs Pending"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Order #{data.trackingNumber}</CardTitle>
                  <p className="text-muted-foreground">{data.recipientName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Delivery Information</h3>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Status:</strong></p>
                    <div className="flex items-center gap-2">
                      <Progress value={statusPercentage} className="h-2 w-[200px]" />
                      <span className="capitalize">{data.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Estimated Delivery:</strong></p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{data.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Recipient Details</h3>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Address:</strong></p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {data.deliveryAddress}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Contact:</strong></p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {data.recipientPhone}
                    </p>
                  </div>
                </div>
              </div>

              {data.specialInstructions && (
                <div className="bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Special Instructions</h4>
                    <p className="text-yellow-700">{data.specialInstructions}</p>
                  </div>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden h-[300px] bg-gray-50">
                {/* Map Integration - Replace with actual map component */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <MapPin className="h-8 w-8" />
                  <span className="ml-2">Delivery Location Map</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardContent className="pt-6">
              <div className="relative space-y-8">
                {data.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`h-4 w-4 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-muted'
                      }`} />
                      {index < data.timeline.length - 1 && (
                        <div className="w-px h-full bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-semibold">{event.event}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">Document {index + 1}</span>
                      <span className="text-sm text-muted-foreground">PDF</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button variant="outline">Contact Recipient</Button>
        <Button>Start Delivery</Button>
      </div>
    </div>
  );
}