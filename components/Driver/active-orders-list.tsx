"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, ChevronRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Sample data - replace with real data from API
const activeOrders = [
  {
    id: "ORD-001",
    status: "in-transit",
    pickup: "123 Main St",
    dropoff: "456 Oak Ave",
    estimatedTime: "15 min",
    priority: "high",
  },
  {
    id: "ORD-002",
    status: "picked-up",
    pickup: "789 Elm St",
    dropoff: "321 Pine Rd",
    estimatedTime: "25 min",
    priority: "normal",
  },
  {
    id: "ORD-003",
    status: "assigned",
    pickup: "555 Maple Dr",
    dropoff: "888 Cedar Ln",
    estimatedTime: "40 min",
    priority: "normal",
  },
];

const statusConfig = {
  "in-transit": {
    label: "In Transit",
    variant: "default" as const,
    color: "bg-blue-500",
  },
  "picked-up": {
    label: "Picked Up",
    variant: "secondary" as const,
    color: "bg-purple-500",
  },
  assigned: {
    label: "Assigned",
    variant: "outline" as const,
    color: "bg-gray-500",
  },
};

interface ActiveOrdersListProps {
  className?: string;
}

// Swipeable Order Card Component
interface SwipeableOrderCardProps {
  order: typeof activeOrders[0];
  index: number;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
}

function SwipeableOrderCard({ order, index, onAccept, onReject }: SwipeableOrderCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const x = useMotionValue(0);

  // Transform x position to background color
  const background = useTransform(
    x,
    [-150, 0, 150],
    ["rgb(239 68 68)", "rgb(255 255 255)", "rgb(34 197 94)"]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right - Accept
      setIsDismissed(true);
      setTimeout(() => {
        onAccept?.(order.id);
      }, 300);
    } else if (info.offset.x < -threshold) {
      // Swiped left - Reject
      setIsDismissed(true);
      setTimeout(() => {
        onReject?.(order.id);
      }, 300);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <motion.div
      className="relative"
      style={{ x }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: x.get() > 0 ? 300 : -300 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Background action indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        <div className="flex items-center gap-2 text-red-600">
          <X className="h-6 w-6" />
          <span className="font-semibold">Reject</span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <span className="font-semibold">Accept</span>
          <Check className="h-6 w-6" />
        </div>
      </div>

      {/* Order Card */}
      <motion.div
        style={{ background }}
        className={cn(
          "rounded-lg border p-4 transition-all relative z-10",
          order.priority === "high" && "border-l-4 border-l-red-500"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">{order.id}</span>
              <Badge variant={statusConfig[order.status].variant}>
                {statusConfig[order.status].label}
              </Badge>
              {order.priority === "high" && (
                <Badge variant="destructive" className="text-xs">
                  Priority
                </Badge>
              )}
            </div>

            {/* Locations */}
            <div className="space-y-1 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Pickup</p>
                  <p className="font-medium">{order.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Dropoff</p>
                  <p className="font-medium">{order.dropoff}</p>
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>ETA: {order.estimatedTime}</span>
            </div>

            {/* Swipe hint */}
            <div className="text-xs text-muted-foreground italic mt-2">
              ← Swipe to reject | Swipe to accept →
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/drivers/dashboard/my-orders/${order.id}`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">View order details</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ActiveOrdersList({ className }: ActiveOrdersListProps) {
  const [orders, setOrders] = useState(activeOrders);

  const handleAcceptOrder = (orderId: string) => {
    console.log("Accepted order:", orderId);
    // In real app, call API to accept order
    setOrders(orders.filter(o => o.id !== orderId));
  };

  const handleRejectOrder = (orderId: string) => {
    console.log("Rejected order:", orderId);
    // In real app, call API to reject order
    setOrders(orders.filter(o => o.id !== orderId));
  };

  if (orders.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Active Orders
          </CardTitle>
          <CardDescription>Your current deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No active orders</p>
            <p className="text-xs text-muted-foreground">
              New orders will appear here when they're assigned
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Active Orders
            </CardTitle>
            <CardDescription>Your current deliveries</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold">
            {orders.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order, index) => (
            <SwipeableOrderCard
              key={order.id}
              order={order}
              index={index}
              onAccept={handleAcceptOrder}
              onReject={handleRejectOrder}
            />
          ))}
        </div>

        {/* View All Button */}
        <Link href="/drivers/dashboard/my-orders">
          <Button variant="outline" className="w-full mt-4">
            View All Orders
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
