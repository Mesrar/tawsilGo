"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Share2,
  MessageSquare,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api/api-client";
import { cn } from "@/lib/utils";
import { bookingService } from "@/app/services/bookingService";
import { StatusBadge } from "@/components/Status-Bagde/status-badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookingDetails } from "@/components/Booking/booking-details";

// Define the new booking response type
interface BookingResponse {
  booking: {
    bookingId: string;
    customerName: string;
    status: string;
    bookedAt: string;
    price: number;
    trip: {
      id: string;
      departureCity: string;
      destinationCity: string;
      departureTime: string;
      arrivalTime: string;
      driverName: string;
      driverPhone: string;
      status: string;
    };
    parcel: {
      id: string;
      weight: number;
      packagingType: string;
      senderName: string;
      senderPhone: string;
      receiverName: string;
      receiverPhone: string;
    };
    timeline: {
      eventType: string;
      timestamp: string;
      details: string;
    }[];
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<BookingResponse["booking"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "timeline"
  );
  const [isCancellingBooking, setIsCancellingBooking] = useState(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;

      try {
        setIsLoading(true);

        // Use the bookingService to fetch booking data from our API
        const response = await bookingService.getBookingById(bookingId);

        if (!response.success || !response.data) {
          throw new Error(
            response.error?.message || "Could not load booking details"
          );
        }

        // Handle the new response structure where the booking is nested
        const bookingData = response.data.booking;

        if (!bookingData) {
          throw new Error("Booking not found");
        }

        console.log("Booking data:", bookingData);
        setBooking(bookingData);
        setError(null);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not load booking details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (
      confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      try {
        setIsCancellingBooking(true);

        // Use the booking service to cancel the booking
        const response = await bookingService.cancelBooking(bookingId);

        if (!response.success) {
          throw new Error(
            response.error?.message || "Could not cancel booking"
          );
        }

        toast({
          title: "Booking cancelled",
          description: "Your booking has been successfully cancelled.",
          variant: "default",
        });

        // Update local state
        setBooking({
          ...booking,
          status: "CANCELLED",
        });
      } catch (err) {
        console.error("Error cancelling booking:", err);
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Could not cancel your booking. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCancellingBooking(false);
      }
    }
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    try {
      return format(new Date(dateString), "MMM d, yyyy • h:mm a");
    } catch (err) {
      return "Invalid date";
    }
  };

  const handleTrackPackage = () => {
    if (!booking) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Tracking initiated",
        description: "You can now track your package in real-time",
        variant: "default",
      });
      
      // In a real app, this would navigate to a tracking page
      window.location.href = `/tracking/${booking.bookingId}`;
    }, 1500);
  };

  const handleContactDriver = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleShareBooking = () => {
    
    if (!booking) return;
    if (navigator.share) {
      navigator.share({
        title: `Booking ${booking.bookingId.substring(0, 8)}`,
        text: `Track my parcel from ${booking.trip.departureCity} to ${booking.trip.destinationCity}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied",
        description: "Booking link copied to clipboard",
        variant: "default",
      });
    });
  };

  return (
    <main className="container max-w-md mx-auto px-4 py-8 md:py-12 lg:py-16 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
        {!isLoading && booking && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/booking/${booking.bookingId}`
                  ).then(() => {
                    toast({
                      title: "Link copied",
                      description: "Booking link copied to clipboard"
                    });
                  });
                }}
                className="cursor-pointer"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share booking
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push(`/booking/${booking.bookingId}/edit`)}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit booking
              </DropdownMenuItem>

              {booking.status !== "CANCELLED" && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={handleCancelBooking}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel booking
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!isLoading && booking && (
        <BookingDetails
          bookingId={booking.bookingId}
          customerName={booking.customerName}
          status={booking.status}
          bookedAt={booking.bookedAt}
          price={booking.price}
          trip={booking.trip}
          parcel={booking.parcel}
          timeline={booking.timeline}
          onTrackPackage={handleTrackPackage}
          onContactDriver={handleContactDriver}
          onShareBooking={handleShareBooking}
        />
      )}
    </main>
  );
}