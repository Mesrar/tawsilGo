"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import {
  Loader2,
  User,
  MapPin,
  Settings,
  Package,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Calendar,
  Clock,
  DollarSign,
  Truck,
  Bell,
  LogOut,
  Shield,
  CreditCard,
  AlertCircle,
  Plus,
  Filter,
  ArrowUpDown,
  CheckCircle,
  X,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SegmentedTabs } from "./SegmentedTabs";

// Existing profile schema - validation will be handled by form with dynamic messages
const createProfileSchema = (t: any) => z.object({
  firstName: z.string().min(2, t('validation.firstNameMin')),
  lastName: z.string().min(2, t('validation.lastNameMin')),
  email: z.string().email(t('validation.invalidEmail')),
  phone: z.string().min(10, t('validation.phoneMin')),
  address: z.string().min(10, t('validation.addressMin')),
});

// For type inference without translations
const profileSchemaBase = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(10),
});

type ProfileFormValues = z.infer<typeof profileSchemaBase>;

// Define booking type
interface Booking {
  bookingId: string;
  tripId: string;
  parcelId: string;
  customerName: string;
  parcelWeight: number;
  status: string;
  bookedAt: string;
  price: number;
  pickupPoint: string;
  deliveryPoint: string;
  pickupTime: string | null;
  deliveryTime: string | null;
  // Additional fields that might be in the response
  departureLocation?: string;
  arrivalLocation?: string;
  departureDate?: string;
  arrivalDate?: string;
  customerEmail?: string;
}

interface PaginatedBookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface OrdersTabProps {
  isLoading: boolean;
  bookings: PaginatedBookingsResponse | undefined;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  activeFilter: string | undefined;
  setFilter: (filter: string | undefined) => void;
}

export function OrdersTab({
  isLoading,
  bookings,
  error,
  totalPages,
  currentPage,
  setPage,
  activeFilter,
  setFilter,
}: OrdersTabProps) {
  const t = useTranslations('profile.orders');

  const bookingsData = bookings?.bookings || [];
  console.log("Bookings data:", bookingsData);
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">(
    "newest"
  );

  // Change sort order handler
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "paid":
        return <Check className="h-3.5 w-3.5" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "cancelled":
        return <X className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  // Get order status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-500";
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "blue";
      case "paid":
        return "success";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between sticky top-0 pt-2 pb-4 z-10 bg-background">
        <h2 className="text-xl font-semibold">{t('title')}</h2>

        <div className="flex gap-3">
          {/* Filter button with dropdown */}
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 gap-2 border-slate-200 shadow-sm"
            onClick={() => {
              // This would be a Sheet component in production
              const nextFilter = !activeFilter ? "pending" : undefined;
              setFilter(nextFilter);
            }}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">
              {activeFilter ? `${t('filter')}: ${activeFilter}` : t('filter')}
            </span>
            <span className="sm:hidden">
              {activeFilter ? activeFilter : t('allOrders')}
            </span>
          </Button>

          {/* Sort button */}
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-4 gap-2 border-slate-200 shadow-sm"
            onClick={toggleSortOrder}
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{t('sort')}: {sortOrder === "newest" ? t('sortNewest') : t('sortOldest')}</span>
            <span className="sm:hidden">
              {sortOrder === "newest" ? t('sortNewest') : t('sortOldest')}
            </span>
          </Button>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex overflow-x-auto py-2 -mx-4 px-4 gap-2 snap-x hide-scrollbar">
        <Button
          variant={activeFilter === undefined ? "default" : "outline"}
          size="sm"
          className="h-9 px-4 flex-shrink-0 snap-start"
          onClick={() => setFilter(undefined)}
        >
          {t('allOrders')}
        </Button>
        <Button
          variant={activeFilter === "pending" ? "default" : "outline"}
          size="sm"
          className="h-9 px-4 flex-shrink-0 snap-start"
          onClick={() => setFilter("pending")}
        >
          {t('pending')}
        </Button>
        <Button
          variant={activeFilter === "paid" ? "default" : "outline"}
          size="sm"
          className="h-9 px-4 flex-shrink-0 snap-start"
          onClick={() => setFilter("paid")}
        >
          {t('paid')}
        </Button>
        <Button
          variant={activeFilter === "confirmed" ? "default" : "outline"}
          size="sm"
          className="h-9 px-4 flex-shrink-0 snap-start"
          onClick={() => setFilter("confirmed")}
        >
          {t('confirmed')}
        </Button>
        <Button
          variant={activeFilter === "cancelled" ? "default" : "outline"}
          size="sm"
          className="h-9 px-4 flex-shrink-0 snap-start"
          onClick={() => setFilter("cancelled")}
        >
          {t('cancelled')}
        </Button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-20 w-full rounded-lg mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('errorLoading')}</AlertTitle>
          <AlertDescription>
            {t('errorDescription')}
          </AlertDescription>
          <Button
            className="mt-3 w-full"
            onClick={() => window.location.reload()}
          >
            {t('tryAgain')}
          </Button>
        </Alert>
      )}

      {/* Empty state */}
      {!isLoading && !error && bookingsData.length === 0 && (
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 text-center my-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-pulse" />
              <Package className="h-12 w-12 text-primary relative" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">{t('noOrders')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs mx-auto">
            {activeFilter
              ? t('noFilteredOrders', { status: activeFilter })
              : t('noOrdersDescription')}
          </p>
          <Button asChild>
            <Link href="/booking" className="gap-2">
              <Plus className="h-4 w-4" />
              {t('bookDelivery')}
            </Link>
          </Button>
        </div>
      )}

      {/* Order cards list */}
      {bookingsData.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {bookingsData.map((booking) => (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 relative">
                  {/* Colorful status bar */}
                  <div
                    className={cn(
                      "h-1.5 w-full",
                      getStatusColor(booking.status)
                    )}
                  />

                  <div className="p-4">
                    {/* Order header with status and price */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge
                          className={cn(
                            "px-2.5 py-0.5 capitalize flex items-center gap-1 mb-1",
                            `bg-${getStatusBadgeVariant(booking.status)}-100 text-${getStatusBadgeVariant(booking.status)}-700 dark:bg-${getStatusBadgeVariant(booking.status)}-900 dark:text-${getStatusBadgeVariant(booking.status)}-300`
                          )}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.toLowerCase()}
                        </Badge>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {format(
                            new Date(booking.bookedAt),
                            "MMM d, yyyy • h:mm a"
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          €{booking.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Order #{booking.bookingId.substring(0, 8)}
                        </p>
                      </div>
                    </div>

                    {/* Order details card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
                      {/* If pickup/delivery points are available */}
                      {booking.pickupPoint || booking.deliveryPoint ? (
                        <div className="relative pl-6 border-l border-dashed border-slate-300 dark:border-slate-700 py-1">
                          {/* Pickup point */}
                          <div className="absolute top-0 left-0 transform -translate-x-1/2 h-3 w-3 rounded-full bg-green-500" />
                          <div className="mb-4">
                            <p className="font-medium text-sm">
                              {booking.pickupPoint ||
                                "Pickup location not specified"}
                            </p>
                            {booking.pickupTime && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {format(
                                  new Date(booking.pickupTime),
                                  "MMM d • h:mm a"
                                )}
                              </p>
                            )}
                          </div>

                          {/* Delivery point */}
                          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 h-3 w-3 rounded-full bg-red-500" />
                          <div>
                            <p className="font-medium text-sm">
                              {booking.deliveryPoint ||
                                "Delivery location not specified"}
                            </p>
                            {booking.deliveryTime && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {format(
                                  new Date(booking.deliveryTime),
                                  "MMM d • h:mm a"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Alternative view when locations aren't available */
                        <div className="flex flex-col gap-2">
                          {/* Parcel details */}
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                              <span className="font-medium">
                                {booking.parcelWeight} kg
                              </span>{" "}
                              parcel
                            </span>
                          </div>

                          {/* Booking date */}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                              Booked on{" "}
                              {format(
                                new Date(booking.bookedAt),
                                "MMMM d, yyyy"
                              )}
                            </span>
                          </div>

                          {/* Payment status */}
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                              {booking.status.toLowerCase() === "paid"
                                ? "Payment completed"
                                : "Payment pending"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer with action button */}
                    <div className="flex items-center justify-between pt-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 dark:bg-slate-800 text-xs font-normal px-2.5 py-0.5 border-slate-200 dark:border-slate-700"
                      >
                        <Package className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        {booking.parcelWeight} kg
                      </Badge>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="font-medium border-slate-200 dark:border-slate-700 h-9 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Link
                          href={`/booking/${booking.bookingId}`}
                          className="gap-1"
                        >
                          {t('viewDetails')}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination controls */}
      {!isLoading && !error && bookingsData.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-slate-200 dark:border-slate-700"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="text-sm font-medium">
            {t('page')} {currentPage} {t('of')} {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-slate-200 dark:border-slate-700"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  );
}

// Function to fetch bookings
const fetchUserBookings = async (
  page: number,
  limit: number,
  status?: string
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (status) params.append("status", status);

  const response = await fetch(
    `/api/user/bookings/parcels?${params.toString()}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
};

// Helper to get status badge color
const getStatusColor = (
  status: string
): "default" | "secondary" | "destructive" | "outline" | "success" => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "paid":
      return "success";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return <CheckCircle className="h-3.5 w-3.5" />;
    case "pending":
      return <Clock className="h-3.5 w-3.5" />;
    case "completed":
      return <CheckCircle className="h-3.5 w-3.5" />;
    case "cancelled":
      return <X className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

// Reusable card skeleton for loading states
function BookingCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton className="h-6 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-20 w-full rounded-md my-2" />
      <div className="flex justify-between mt-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}

// Bookings list component - separated for better organization
function BookingsList({
  bookingsData,
  isLoadingBookings,
  bookingsError,
  setBookingsPage,
  bookingsFilter,
  setBookingsFilter,
}: {
  bookingsData: PaginatedBookingsResponse | undefined;
  isLoadingBookings: boolean;
  bookingsError: Error | null;
  setBookingsPage: React.Dispatch<React.SetStateAction<number>>;
  bookingsFilter: string | undefined;
  setBookingsFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  const showFilterMenu = () => {
    // This would be implemented with a Sheet or DropdownMenu component
  };

  return (
    <div className="space-y-4">
      {/* Mobile-friendly filter controls */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-background pt-2 pb-3 z-10">
        <h3 className="text-lg font-medium">Your Bookings</h3>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 border-slate-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className={!bookingsFilter ? "bg-accent/50" : ""}
                onClick={() => setBookingsFilter(undefined)}
              >
                All Bookings
              </DropdownMenuItem>
              <DropdownMenuItem
                className={bookingsFilter === "confirmed" ? "bg-accent/50" : ""}
                onClick={() => setBookingsFilter("confirmed")}
              >
                Confirmed Only
              </DropdownMenuItem>
              <DropdownMenuItem
                className={bookingsFilter === "pending" ? "bg-accent/50" : ""}
                onClick={() => setBookingsFilter("pending")}
              >
                Pending Only
              </DropdownMenuItem>
              <DropdownMenuItem
                className={bookingsFilter === "completed" ? "bg-accent/50" : ""}
                onClick={() => setBookingsFilter("completed")}
              >
                Completed Only
              </DropdownMenuItem>
              <DropdownMenuItem
                className={bookingsFilter === "cancelled" ? "bg-accent/50" : ""}
                onClick={() => setBookingsFilter("cancelled")}
              >
                Cancelled Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 border-slate-200"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </Button>
        </div>
      </div>

      {/* Status filter pills - horizontal scrollable for mobile */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2 snap-x hide-scrollbar">
        <Button
          variant={bookingsFilter === undefined ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0 snap-start"
          onClick={() => setBookingsFilter(undefined)}
        >
          All
        </Button>
        <Button
          variant={bookingsFilter === "confirmed" ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0 snap-start"
          onClick={() => setBookingsFilter("confirmed")}
        >
          Confirmed
        </Button>
        <Button
          variant={bookingsFilter === "pending" ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0 snap-start"
          onClick={() => setBookingsFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={bookingsFilter === "completed" ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0 snap-start"
          onClick={() => setBookingsFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={bookingsFilter === "cancelled" ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0 snap-start"
          onClick={() => setBookingsFilter("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      {isLoadingBookings ? (
        // Skeleton loading state
        <>
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </>
      ) : bookingsError ? (
        // Error state
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading bookings</AlertTitle>
          <AlertDescription>
            Please try again or contact customer support if the problem
            persists.
          </AlertDescription>
          <Button
            className="mt-2 w-full"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Alert>
      ) : !bookingsData || bookingsData.bookings.length === 0 ? (
        // Empty state
        <div className="text-center py-8 rounded-lg border bg-card">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">No bookings found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {bookingsFilter
              ? `No ${bookingsFilter} bookings found. Try a different filter.`
              : "You haven't made any bookings yet."}
          </p>
          <Button
            className="mt-2"
            onClick={() => (window.location.href = "/booking")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Book a Delivery
          </Button>
        </div>
      ) : (
        <>
          {/* Bookings list with improved mobile layout */}
          <div className="space-y-4">
            {bookingsData.bookings.map((booking: Booking) => (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    {/* Status indicator bar at top of card */}
                    <div
                      className={cn(
                        "h-1 w-full",
                        booking.status.toLowerCase() === "confirmed" &&
                        "bg-green-500",
                        booking.status.toLowerCase() === "pending" &&
                        "bg-amber-500",
                        booking.status.toLowerCase() === "completed" &&
                        "bg-blue-500",
                        booking.status.toLowerCase() === "cancelled" &&
                        "bg-red-500"
                      )}
                    />

                    <div className="p-4">
                      {/* Header with status and price */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Badge
                            variant={getStatusColor(booking.status)}
                            className="px-2.5 py-0.5 capitalize flex items-center gap-1"
                          >
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </Badge>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {format(new Date(booking.bookedAt), "dd MMM yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-base">
                            €{booking.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {booking.bookingId.substring(0, 8)}
                          </p>
                        </div>
                      </div>

                      {/* Route visualization - improved for mobile */}
                      <div className="my-4 relative pl-6 border-l border-dashed border-slate-200">
                        <div className="absolute left-0 top-0 transform -translate-x-1/2 bg-green-500 w-3 h-3 rounded-full"></div>
                        <div className="mb-4">
                          <p className="font-medium text-sm">
                            {booking.pickupPoint ||
                              booking.departureLocation ||
                              "N/A"}
                          </p>
                          {booking.pickupTime && (
                            <p className="text-xs text-muted-foreground">
                              Pickup:{" "}
                              {format(
                                new Date(booking.pickupTime),
                                "dd MMM HH:mm"
                              )}
                            </p>
                          )}
                        </div>

                        <div className="absolute left-0 bottom-0 transform -translate-x-1/2 bg-red-500 w-3 h-3 rounded-full"></div>
                        <div>
                          <p className="font-medium text-sm">
                            {booking.deliveryPoint ||
                              booking.arrivalLocation ||
                              "N/A"}
                          </p>
                          {booking.deliveryTime && (
                            <p className="text-xs text-muted-foreground">
                              Delivery:{" "}
                              {format(
                                new Date(booking.deliveryTime),
                                "dd MMM HH:mm"
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Details and action section */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          {booking.parcelWeight > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 font-normal"
                            >
                              {booking.parcelWeight} kg
                            </Badge>
                          )}

                          <Badge
                            variant="outline"
                            className="bg-slate-50 font-normal flex items-center"
                          >
                            <Package className="h-3 w-3 mr-1" />
                            Parcel
                          </Badge>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200"
                          asChild
                        >
                          <Link href={`/booking/${booking.bookingId}`}>
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile-friendly pagination */}
          {bookingsData && bookingsData.pages > 1 && (
            <div className="flex items-center justify-between py-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 h-9 w-9 p-0"
                onClick={() => setBookingsPage((prev) => Math.max(1, prev - 1))}
                disabled={bookingsData.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              <span className="text-sm">
                Page{" "}
                <strong>
                  {bookingsData.page} of {bookingsData.pages}
                </strong>
              </span>

              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 h-9 w-9 p-0"
                onClick={() =>
                  setBookingsPage((prev) =>
                    Math.min(bookingsData.pages, prev + 1)
                  )
                }
                disabled={bookingsData.page === bookingsData.pages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Mini Card for mobile optimization
function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
}

interface CustomerProfileProps {
  defaultTab?: "personal" | "orders" | "settings";
}

export function CustomerProfile({ defaultTab = "personal" }: CustomerProfileProps) {
  const t = useTranslations('profile');
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [customerData, setCustomerData] =
    React.useState<ProfileFormValues | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [isMobile, setIsMobile] = React.useState(false);

  // State for bookings pagination
  const [bookingsPage, setBookingsPage] = React.useState(1);
  const [bookingsLimit] = React.useState(5);
  const [bookingsFilter, setBookingsFilter] = React.useState<
    string | undefined
  >(undefined);

  // Check for mobile viewport on mount
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Profile form initialization
  const profileSchema = React.useMemo(() => createProfileSchema(t), [t]);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Fetch user data
  React.useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch("/api/user/me", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const responseData = await response.json();

        // Check if the data is in the expected format with nested 'data' property
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response format from API");
        }

        const userData = responseData.data;

        // Map the API response to the ProfileFormValues structure
        const profile: ProfileFormValues = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        };

        setCustomerData(profile);

        // Reset form with the loaded data
        form.reset(profile);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('errorLoading');
        setError(errorMessage);
        toast({
          title: t('errorLoading'),
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    fetchCustomerData();
  }, [toast]);

  // Fetch bookings data when Orders tab is active
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings", bookingsPage, bookingsLimit, bookingsFilter],
    queryFn: () =>
      fetchUserBookings(bookingsPage, bookingsLimit, bookingsFilter),
    enabled: activeTab === "orders",
  });

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t('profileUpdated'),
        description: t('profileUpdatedDescription'),
      });
    }, 1000);
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "personal" | "orders" | "settings");
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    toast({
      title: t('loggedOut'),
      description: t('loggedOutDescription'),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-100/40 dark:bg-teal-900/10 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {error && (
          <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full blur-md opacity-20" />
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white dark:border-slate-900 shadow-xl">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Customer" />
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {customerData?.firstName?.charAt(0) || "C"}
                    {customerData?.lastName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full" />
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {customerData?.firstName || ""} {customerData?.lastName || ""}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  {customerData?.email || ""}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mt-2 md:mt-0">
              <Button
                variant="outline"
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4 text-slate-500" />
                {t('logOut')}
              </Button>
              <Button
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg shadow-slate-200 dark:shadow-none transition-all duration-300"
              >
                {t('editProfile')}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-4 z-30 mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-white/20 dark:border-slate-800 ring-1 ring-black/5">
            {isMobile ? (
              <SegmentedTabs
                options={[
                  {
                    value: "personal",
                    label: t('tabs.personal'),
                    icon: <User className="h-4 w-4" />,
                  },
                  {
                    value: "orders",
                    label: t('tabs.orders'),
                    icon: <Package className="h-4 w-4" />,
                  },
                  {
                    value: "settings",
                    label: t('tabs.settings'),
                    icon: <Settings className="h-4 w-4" />,
                  },
                ]}
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as "personal" | "orders" | "settings")}
                className="w-full"
              />
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-3 h-12 bg-transparent p-0 gap-2">
                  <TabsTrigger
                    value="personal"
                    className="h-full rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    {t('tabs.personal')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="h-full rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    {t('tabs.orders')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="h-full rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    {t('tabs.settings')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white/70 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500" />
                <CardHeader className="pb-8 pt-8 px-6 md:px-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                      {t('personalInfo')}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-slate-500 dark:text-slate-400 ml-12">
                    {t('personalInfoDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 md:px-10 pb-10">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">{t('firstName')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('firstName')}
                                  {...field}
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">{t('lastName')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('lastName')}
                                  {...field}
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">{t('email')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('email')}
                                  {...field}
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">{t('phone')}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('phone')}
                                  {...field}
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">{t('address')}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t('address')}
                                {...field}
                                className="min-h-32 resize-none bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t('updating')}
                            </>
                          ) : (
                            <>{t('saveChanges')}</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <OrdersTab
                bookings={bookingsData}
                isLoading={isLoadingBookings}
                error={bookingsError as Error | null}
                totalPages={bookingsData?.pages || 0}
                currentPage={bookingsPage}
                setPage={setBookingsPage}
                activeFilter={bookingsFilter}
                setFilter={setBookingsFilter}
              />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Account Settings */}
              <div className="space-y-6">
                <InfoCard
                  title={t('settings.accountSettings')}
                  icon={<Settings className="h-5 w-5 text-blue-600" />}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between group">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{t('settings.emailNotifications')}</p>
                        <p className="text-sm text-slate-500">{t('settings.emailNotificationsDescription')}</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                    </div>
                    <Separator className="bg-slate-100 dark:bg-slate-800" />
                    <div className="flex items-center justify-between group">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{t('settings.marketingEmails')}</p>
                        <p className="text-sm text-slate-500">{t('settings.marketingEmailsDescription')}</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-blue-600" />
                    </div>
                    <Separator className="bg-slate-100 dark:bg-slate-800" />
                    <div className="flex items-center justify-between group">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{t('settings.smsNotifications')}</p>
                        <p className="text-sm text-slate-500">{t('settings.smsNotificationsDescription')}</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
                    </div>
                  </div>
                </InfoCard>

                <InfoCard
                  title={t('settings.privacySettings')}
                  icon={<Shield className="h-5 w-5 text-teal-600" />}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between group">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-teal-600 transition-colors">{t('settings.dataSharing')}</p>
                        <p className="text-sm text-slate-500">{t('settings.dataSharingDescription')}</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-teal-600" />
                    </div>
                    <Separator className="bg-slate-100 dark:bg-slate-800" />
                    <div className="flex items-center justify-between group">
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-teal-600 transition-colors">{t('settings.locationTracking')}</p>
                        <p className="text-sm text-slate-500">{t('settings.locationTrackingDescription')}</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-teal-600" />
                    </div>
                  </div>
                </InfoCard>
              </div>

              {/* Danger Zone */}
              <div className="space-y-6">
                <InfoCard
                  title={t('settings.accountActions')}
                  icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
                >
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 transition-colors hover:bg-amber-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-md">
                          <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h4 className="font-semibold text-amber-900 dark:text-amber-400">{t('settings.passwordManagement')}</h4>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-500 ml-10">
                        {t('settings.passwordManagementDescription')}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 transition-colors hover:bg-blue-100/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md">
                          <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-400">{t('settings.dataExport')}</h4>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-500 ml-10">
                        {t('settings.dataExportDescription')}
                      </p>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full h-12 rounded-xl mt-4 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logOut')}
                    </Button>
                  </div>
                </InfoCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

