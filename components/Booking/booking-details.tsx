import React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
  Package,
  MapPin,
  Truck,
  User,
  Phone,
  Clock,
  Calendar,
  CheckCircle,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar } from "../ui/avatar";
import { StatusBadge } from "../Status-Bagde/status-badge";

interface TimelineEvent {
  eventType: string;
  timestamp: string;
  details: string;
}

interface ParcelDetails {
  id: string;
  weight: number;
  packagingType: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  statusHistory?: string[]; // Add this new field
}

interface TripDetails {
  id: string;
  departureCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  driverName: string;
  driverPhone: string;
  status: string;
}

interface BookingDetailsProps {
  bookingId: string;
  customerName: string;
  status: string;
  bookedAt: string;
  price: number;
  trip: TripDetails;
  parcel: ParcelDetails;
  timeline: TimelineEvent[];
  onTrackPackage?: () => void;
  onContactDriver?: (phone: string) => void;
  onShareBooking?: () => void;
}

// Helper function to format dates
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "No date available";
  
  try {
    // First try using parseISO for better handling of ISO strings
    return format(parseISO(dateString), "MMM d, yyyy • h:mm a");
  } catch (error) {
    // If parseISO fails, try using the Date constructor with fallbacks
    try {
      // Some browsers handle date strings differently, especially future dates
      return format(new Date(dateString), "MMM d, yyyy • h:mm a");
    } catch (secondError) {
      console.error("Date parsing error:", { dateString, error });
      return "Invalid date format";
    }
  }
};

const parseStatusHistory = (statusHistory: string[] = []): TimelineEvent[] => {
  return statusHistory.map((entry) => {
    let status: string;
    let timestamp: string;

    // Handle different format patterns in status history
    if (entry.includes("@")) {
      // Format: "status @ timestamp"
      [status, timestamp] = entry.split("@").map((part) => part.trim());
    } else if (entry.includes(":")) {
      // Format: "status:timestamp"
      [status, timestamp] = entry.split(":").map((part) => part.trim());
    } else {
      // Fallback if no separator is found
      status = entry;
      timestamp = new Date().toISOString();
    }

    // Add time zone offset if not included
    if (timestamp && !timestamp.includes("Z") && !timestamp.includes("+")) {
      // If it doesn't have a timezone, assume UTC
      timestamp = `${timestamp}Z`;
    }

    return {
      eventType: status.toLowerCase().replace(/\s+/g, "_"),
      timestamp,
      details: formatStatusForDisplay(status),
    };
  });
};

// Helper to format status strings for display
const formatStatusForDisplay = (status: string): string => {
  // Convert status strings to more readable format
  // e.g. "order_created" -> "Order Created"
  // or "Waiting For Parcel" -> "Waiting For Parcel"

  if (status.includes("_")) {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // If it's already in a readable format, return as is
  return status;
};

// Add this function to get appropriate icon and color for a status
const getStatusStyle = (eventType: string) => {
  const type = eventType.toLowerCase();

  if (type.includes("cancel") || type.includes("rejected")) {
    return {
      color: "bg-red-500",
      icon: <XCircle className="h-3.5 w-3.5" />,
    };
  }

  if (
    type.includes("deliver") ||
    type.includes("completed") ||
    type.includes("accepted")
  ) {
    return {
      color: "bg-green-500",
      icon: <CheckCircle className="h-3.5 w-3.5" />,
    };
  }

  if (type.includes("wait") || type.includes("pending")) {
    return {
      color: "bg-amber-500",
      icon: <Clock className="h-3.5 w-3.5" />,
    };
  }

  if (type.includes("transit") || type.includes("shipping")) {
    return {
      color: "bg-purple-500",
      icon: <Truck className="h-3.5 w-3.5" />,
    };
  }

  // Default
  return {
    color: "bg-blue-500",
    icon: <Package className="h-3.5 w-3.5" />,
  };
};

// Helper to get readable package type
const getPackagingTypeDisplay = (type: string) => {
  const packageTypes: Record<string, string> = {
    "box-small": "Small Box",
    "box-medium": "Medium Box",
    "box-large": "Large Box",
    envelope: "Envelope",
    custom: "Custom Packaging",
  };

  return packageTypes[type] || type;
};

// Format price helper
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
};

export const BookingDetails: React.FC<BookingDetailsProps> = ({
  bookingId,
  customerName,
  status,
  bookedAt,
  price,
  trip,
  parcel,
  timeline,
  onTrackPackage,
  onContactDriver,
  onShareBooking,
}) => {
  const allTimelineEvents = React.useMemo(() => {
    const statusEvents = parcel.statusHistory
      ? parseStatusHistory(parcel.statusHistory)
      : [];

    // If we have both sources, combine them
    if (timeline.length > 0 && statusEvents.length > 0) {
      // Combine and sort by timestamp (newest first)
      return [...timeline, ...statusEvents].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    // If we only have status history, use that
    return statusEvents.length > 0 ? statusEvents : timeline;
  }, [timeline, parcel.statusHistory]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header with status and route */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <StatusBadge
            status={status}
            options={{
              size: "lg",
              showIcon: true,
              variant: "filled",
            }}
          />
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            #{bookingId.substring(0, 8)}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1">
          {trip.departureCity} → {trip.destinationCity}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Booked on {formatDate(bookedAt)}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Departure</span>
            </div>
            <p className="font-medium">{formatDate(trip.departureTime)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Arrival</span>
            </div>
            <p className="font-medium">{formatDate(trip.arrivalTime)}</p>
          </div>
        </div>
      </div>

      {/* Package information */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Package Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Package Type</p>
                <p className="font-medium">
                  {getPackagingTypeDisplay(parcel.packagingType)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Weight</p>
                <p className="font-medium">{parcel.weight} kg</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Total Price
                </p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {formatPrice(price)}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip timeline */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-lg">Delivery Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {allTimelineEvents.length === 0 ? (
              <div className="text-center p-6 text-gray-500">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No tracking information available yet</p>
              </div>
            ) : (
              allTimelineEvents.map((event, index) => {
                const statusStyle = getStatusStyle(event.eventType);

                return (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <div className="mr-3 relative">
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 mt-1.5 ${statusStyle.color}`}
                      />
                      {index < allTimelineEvents.length - 1 && (
                        <motion.div
                          className="absolute top-4 bottom-0 left-1.5 w-px bg-gray-200 dark:bg-gray-700 -ml-px"
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + 0.2,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-5">
                      <p className="font-medium">{event.details}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(event.timestamp)}
                      </p>
                      <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {event.eventType.replace(/_/g, " ")}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Driver information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mr-3">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-lg">Driver</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Avatar className="h-14 w-14 mr-4">
              <div className="bg-green-100 dark:bg-green-900 h-full w-full rounded-full flex items-center justify-center">
                <User className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-lg">{trip.driverName}</p>
              <p className="text-gray-500">{trip.driverPhone}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => onContactDriver?.(trip.driverPhone)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Sender</h4>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  <div className="bg-blue-100 dark:bg-blue-900 h-full w-full rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{parcel.senderName}</p>
                  <p className="text-sm text-gray-500">{parcel.senderPhone}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  onClick={() =>
                    (window.location.href = `tel:${parcel.senderPhone}`)
                  }
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Receiver
              </h4>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  <div className="bg-purple-100 dark:bg-purple-900 h-full w-full rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{parcel.receiverName}</p>
                  <p className="text-sm text-gray-500">
                    {parcel.receiverPhone}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  onClick={() =>
                    (window.location.href = `tel:${parcel.receiverPhone}`)
                  }
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating action buttons */}
      <div className="bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-full font-medium"
          onClick={onShareBooking}
        >
          Share
        </Button>
        <Button
          className="flex-1 h-12 rounded-full font-medium bg-blue-600 hover:bg-blue-700"
          onClick={onTrackPackage}
        >
          Track Package <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
