"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, Truck, MapPin, AlertCircle, CheckCircle, Phone, FileText, Navigation, Clock, Scale, Wallet, Calendar, PackageSearch, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Mail, User, Map, Box } from "lucide-react";

type OrderDetails = {
  orders: any;
  id: number;
  trackingNumber: string;
  departure: string;
  destination: string;
  geoRoute: any;
  weight: number;
  dimensions: string;
  insuranceValue: number;
  taxDutyAmount: number;
  estimatedDuration: number;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  status: "pending" | "in-transit" | "delivered" | "accepted";
  status_history: any; // could be an array if available, otherwise null
  senderId: number;
  receiverId: number;
  userId: number;
  customsCleared: boolean;
};

type Orders ={
  ordersDetails: OrderDetails
}

async function getOrder(id: string): Promise<OrderDetails> {
  const response = await fetch(`/api/driver/orders/details/${id}`, {
    credentials: "include",
    next: { tags: ["driver-orders"] },
  });
  if (!response.ok) throw new Error("Failed to fetch order details");
  return response.json();
}

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { toast } = useToast();
  const router = useRouter();

  const { data: data, isLoading, error, isRefetching } = useQuery<OrderDetails>({
    queryKey: ["driver-orders", id],
    queryFn: () => getOrder(id),
    staleTime: 60_000,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading order",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

   // Map order status to a percentage value; add more mappings as needed.
   const statusMap: Record<string, number> = {
    pending: 30,
    "in-transit": 70,
    delivered: 100,
    Accepted: 100,
  };
  const statusPercentage = statusMap[data?.orders.status as keyof typeof statusMap] || 0;

  

  const statusColors = {
    pending: "bg-orange-500",
    "in-transit": "bg-blue-500",
    delivered: "bg-green-500",
    accepted: "bg-purple-500"
  };

  const statusIcons = {
    pending: <AlertCircle className="h-5 w-5" />,
    "in-transit": <Truck className="h-5 w-5" />,
    delivered: <CheckCircle className="h-5 w-5" />,
    accepted: <CheckCircle className="h-5 w-5" />
  };

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading order details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={() => router.back()} className="gap-2">
        <Navigation className="h-4 w-4" />
        Back to Orders
      </Button>
      <Badge 
        variant={data?.orders.customsCleared ? "default" : "destructive"} 
        className="gap-2"
      >
        {data?.orders.customsCleared ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        {data?.orders.customsCleared ? "Customs Cleared" : "Customs Pending"}
      </Badge>
    </div>

    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="overview" className="gap-2">
          <Package className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="timeline" className="gap-2">
          <Clock className="h-4 w-4" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="documents" className="gap-2">
          <FileText className="h-4 w-4" />
          Documents
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
  <Card className="relative overflow-hidden">
    <div className={cn(
      "absolute top-0 left-0 w-1 h-full",
      statusColors[(data?.orders?.status?.toLowerCase() as keyof typeof statusColors)] || "bg-muted"
    )} />
    
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle className="flex items-center gap-3">
            {data?.orders.tracking_number}
            <Badge variant="secondary" className="text-sm">
              {data?.orders.dimensions}
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground flex items-center gap-2 mt-2">
            <Map className="h-4 w-4" />
            {data?.orders.departure} → {data?.orders.destination}
          </p>
        </div>
      </div>
    </CardHeader>

    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sender & Receiver Section */}
      <div className="space-y-6">
        <div className="bg-muted/5 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <User className="h-5 w-5 text-primary" />
            Sender Details
          </h3>
          <DetailItem 
            icon={<Mail className="h-4 w-4" />}
            label="Name"
            value={data?.orders.sender.name}
          />
          <DetailItem 
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value={data?.orders.sender.address}
          />
          <DetailItem 
            icon={<Phone className="h-4 w-4" />}
            label="Contact"
            value={
              <a href={`tel:${data?.orders.sender.phone}`} className="text-primary hover:underline">
                {data?.orders.sender.phone}
              </a>
            }
          />
        </div>

        <div className="bg-muted/5 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <User className="h-5 w-5 text-primary" />
            Receiver Details
          </h3>
          <DetailItem 
            icon={<Mail className="h-4 w-4" />}
            label="Name"
            value={data?.orders.receiver.name}
          />
          <DetailItem 
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value={data?.orders.receiver.address}
          />
          <DetailItem 
            icon={<Phone className="h-4 w-4" />}
            label="Contact"
            value={
              <a href={`tel:${data?.orders.receiver.phone}`} className="text-primary hover:underline">
                {data?.orders.receiver.phone}
              </a>
            }
          />
        </div>
      </div>

      {/* Shipping & Financial Section */}
      <div className="space-y-6">
        <div className="bg-muted/5 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Truck className="h-5 w-5 text-primary" />
            Shipping Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem 
              icon={<Scale className="h-4 w-4" />}
              label="Weight"
              value={`${data?.orders.weight} kg`}
            />
            <DetailItem 
              icon={<Box className="h-4 w-4" />}
              label="Dimensions"
              value={data?.orders.dimensions}
            />
            <DetailItem 
              icon={<Wallet className="h-4 w-4" />}
              label="Insurance"
              value={`€${data?.orders.insurance_value}`}
            />
            <DetailItem 
              icon={<FileText className="h-4 w-4" />}
              label="Tax/Duty"
              value={data?.orders.tax_duty_amount ? `€${data?.orders.tax_duty_amount}` : "No duties"}
            />
          </div>
        </div>

        <div className="bg-muted/5 p-4 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Clock className="h-5 w-5 text-primary" />
            Collection Window
          </h3>
          <div className="space-y-2">
            <DetailItem
              icon={<Calendar className="h-4 w-4" />}
              label="Pickup Window"
              value={isValidDate(data?.orders.pickup_window_start) ? (
                <>
                  {new Date(data?.orders.pickup_window_start).toLocaleDateString()}
                  {" - "}
                  {new Date(data?.orders.pickup_window_end).toLocaleTimeString()}
                </>
              ) : "Flexible pickup window"}
            />
            {data?.orders.google_route_polyline && (
              <div className="mt-4 border rounded-lg overflow-hidden h-48 bg-gray-50">
                <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
                  <Map className="h-5 w-5" />
                  <span>Route Preview</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


      {/* Enhanced Timeline Tab */}
     
<TabsContent value="timeline">
  <Card>
    <CardContent className="pt-6">
      {data?.orders.status_history?.length ? (
        <div className="relative space-y-8">
          {data.orders.status_history.map((history: string, index: number) => {
            const [event, timestamp] = history.split(" @ ");
            const date = new Date(timestamp);
            const isCurrent = index === 0;
            const status = event.toLowerCase().replace(/_/g, ' ') as keyof typeof statusIcons;

            return (
              <div key={index} className="group relative flex gap-4">
                {/* Timeline line & dot */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-3 w-3 rounded-full flex items-center justify-center border-2 transition-all",
                    isCurrent 
                      ? "bg-primary border-primary/50 scale-125"
                      : "bg-background border-muted group-hover:border-primary",
                    "group-hover:scale-125"
                  )}>
                    {isCurrent && (
                      <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary/30" />
                    )}
                  </div>
                  {index < data.orders.status_history.length - 1 && (
                    <div className="w-px h-full bg-border group-hover:bg-primary/30 transition-colors" />
                  )}
                </div>

                {/* Content card */}
                <div className="flex-1 pb-8 group-hover:bg-muted/30 p-4 rounded-lg transition-colors space-y-1">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center",
                      isCurrent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <svg 
                        className={cn("w-3 h-3", isCurrent ? "animate-bounce" : "")}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        {statusIcons[status] || <path d="M5 13l4 4L19 7" />}
                      </svg>
                    </div>
                    <h4 className="font-semibold capitalize">
                      {event.replace(/_/g, ' ')}
                    </h4>
                  </div>
                  <time 
                    dateTime={date.toISOString()}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <CalendarDays className="h-4 w-4" />
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                    <span className="text-muted-foreground/50">•</span>
                    {date.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 gap-3 text-muted-foreground">
          <PackageSearch className="h-8 w-8" />
          <p>No tracking history available</p>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

      {/* Enhanced Documents Tab */}
      <TabsContent value="documents">
  <Card>
    <CardContent className="pt-6">
      {/* Create merged documents array with label */}
      {(() => {
        const documents = data?.orders.documents || [];
        const labelUrl = data?.orders.label_url;
        const mergedDocuments = [...documents];
        
        if (labelUrl) {
          mergedDocuments.push({
            id: 'parcel-label',
            name: 'Parcel Shipping Label',
            url: labelUrl,
            type: 'label',
            size: 0 // Add actual size if available from backend
          });
        }

        return mergedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mergedDocuments.map((doc: any, index: number) => (
              <div key={doc.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  {doc.type === 'label' ? (
                    <Truck className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      PDF{doc.size > 0 ? ` - ${(doc.size / 1024).toFixed(1)}KB` : ''}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  {doc.type === 'label' ? 'View Label' : 'Download'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 gap-3 text-muted-foreground">
            <FileText className="h-8 w-8" />
            No documents available
          </div>
        );
      })()}
    </CardContent>
  </Card>
</TabsContent>
    </Tabs>

    <div className="flex gap-4 justify-end">
      <Button variant="outline" className="gap-2">
        <Phone className="h-4 w-4" />
        Contact Recipient
      </Button>
      <Button className="gap-2 bg-green-600 hover:bg-green-700">
        <Truck className="h-4 w-4" />
        Start Delivery
      </Button>
    </div>
  </div>
);
}

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
<div className="flex items-center gap-3">
  <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
</div>
);

function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString !== "0000-12-31T23:45:16-00:14";
}