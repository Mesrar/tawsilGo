"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MoreVertical, Truck, MapPin, Package, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  trackingNumber: string;
  departure: string;
  destination: string;
  weight: number;
  status: "pending" | "in-transit" | "delivered";
  customsCleared: boolean;
  estimatedDelivery: string;
  recipientName: string;
};

async function fetchDriverOrders(): Promise<Order[]> {
  const response = await fetch("/api/driver/orders/routes", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return (await response.json()).orders || [];
}

export default function AvailableOrders() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["driver-orders"],
    queryFn: fetchDriverOrders,
    staleTime: 60_000,
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

  const filteredOrders = data?.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesStatus ;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }



  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Your Shipments</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by tracking # or name..."
            className="px-4 py-2 border rounded-md w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Filter: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("in-transit")}>
                In Transit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("delivered")}>
                Delivered
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          >
            {viewMode === "card" ? "Table View" : "Card View"}
          </Button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Package className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">No orders found matching your criteria</p>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">#{order.trackingNumber}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push(`/drivers/dashboard/orders/${order.id}`)}>
          View Details
        </DropdownMenuItem>
                      <DropdownMenuItem>Start Delivery</DropdownMenuItem>
                      <DropdownMenuItem>Contact Recipient</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  {order.customsCleared ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Route</p>
                      <p className="text-sm">{order.departure} → {order.destination}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">{order.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recipient</p>
                      <p className="font-medium">{order.recipientName}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium text-sm">{order.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Customs</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.trackingNumber}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{order.departure} → {order.destination}</TableCell>
                <TableCell>{order.recipientName}</TableCell>
                <TableCell>{order.weight} kg</TableCell>
                <TableCell>
                  {order.customsCleared ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-5 w-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Start Delivery</DropdownMenuItem>
                      <DropdownMenuItem>Contact Recipient</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}