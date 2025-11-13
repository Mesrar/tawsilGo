"use client";

import { AvailabilityToggle } from "@/components/Driver/availability-toggle";
import { TodayStats } from "@/components/Driver/today-stats";
import { QuickActions } from "@/components/Driver/quick-actions";
import { EarningsChart } from "@/components/Driver/earnings-chart-simple";
import { PerformanceCard } from "@/components/Driver/performance-card";
import { ActiveOrdersList } from "@/components/Driver/active-orders-list";
import { EarningsOptimizer } from "@/components/Driver/EarningsOptimizer";
import { ActiveTripCommandCenter } from "@/components/Driver/ActiveTripCommandCenter";
import { QuickScanFAB } from "@/components/Driver/QuickScanFAB";
import { MultiCurrencyDashboard } from "@/components/Driver/MultiCurrencyDashboard";
import { BorderIntelligence } from "@/components/Driver/BorderIntelligence";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Trip } from "@/types/trip";

async function getDriverTrips(): Promise<Trip[]> {
  const response = await fetch("/api/driver/trips", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  const data = await response.json();

  // Defensive check: ensure we always return an array
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.trips)) {
    return data.trips;
  }

  console.warn("Unexpected trips data structure:", data);
  return [];
}

export default function Dashboard() {
  const handleAvailabilityToggle = (available: boolean) => {
    // TODO: Connect to driver service API to update availability
    console.log("Availability changed:", available);
  };

  // Fetch driver trips
  const { data: trips = [], isLoading } = useQuery<Trip[]>({
    queryKey: ["driver-trips"],
    queryFn: getDriverTrips,
    staleTime: 30000, // 30 seconds
  });

  // Ensure trips is always an array (defensive programming)
  const safeTrips = Array.isArray(trips) ? trips : [];

  // Find active trip (IN_PROGRESS or ACTIVE status)
  const activeTrip = safeTrips.find(
    (trip) => trip.status === "IN_PROGRESS" || trip.status === "ACTIVE"
  );

  // Get upcoming trips (SCHEDULED status)
  const upcomingTrips = safeTrips.filter((trip) => trip.status === "SCHEDULED");

  return (
    <>
      <div className="space-y-8">
        {/* Active Trip Command Center - Priority Display */}
        {activeTrip && (
          <ActiveTripCommandCenter
            trip={activeTrip}
            onNavigate={() => {
              const url = `https://www.google.com/maps/dir/?api=1&origin=${activeTrip.dapartPoint.lat},${activeTrip.dapartPoint.lng}&destination=${activeTrip.arrivalPoint.lat},${activeTrip.arrivalPoint.lng}&travelmode=driving`;
              window.open(url, "_blank");
            }}
            onScanParcel={() => {
              window.location.href = "/drivers/dashboard/check-parcel?tab=qr";
            }}
            onContactSupport={() => {
              // TODO: Implement support contact
              console.log("Contact support");
            }}
            onReportIssue={() => {
              // TODO: Implement issue reporting
              console.log("Report issue");
            }}
          />
        )}

        {/* Hero Section with Availability */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, Driver!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Here's your dashboard overview for today
            </p>
          </div>

          {/* Availability Toggle - More Prominent */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <AvailabilityToggle
                isAvailable={false}
                onToggle={handleAvailabilityToggle}
              />
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Earnings Optimizer - Revenue Focus */}
        {upcomingTrips.length > 0 && (
          <>
            <EarningsOptimizer trips={upcomingTrips} />
            <Separator className="my-6" />
          </>
        )}

        {/* Cross-Border Intelligence - Phase 3 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Cross-Border Intelligence
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time border and currency information for Europe-Morocco routes
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Multi-Currency Dashboard */}
            <div className="md:col-span-1">
              <MultiCurrencyDashboard eurBalance={1250.50} madBalance={8500.00} />
            </div>

            {/* Border Intelligence */}
            <div className="md:col-span-1">
              <BorderIntelligence />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Performance Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Today's Performance
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your earnings and activity
            </p>
          </div>

          {/* Today's Stats */}
          <TodayStats />

          {/* Detailed Analytics Grid */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {/* Earnings Chart - Emphasized */}
            <div className="md:col-span-1">
              <EarningsChart />
            </div>

            {/* Performance Card */}
            <div className="md:col-span-1">
              <PerformanceCard />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Actions & Orders Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">
              Manage your trips and deliveries
            </p>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Active Orders - Full Width */}
          <div className="mt-6">
            <ActiveOrdersList />
          </div>
        </div>
      </div>

      {/* Quick Scan FAB - Always Available */}
      <QuickScanFAB />
    </>
  );
}

