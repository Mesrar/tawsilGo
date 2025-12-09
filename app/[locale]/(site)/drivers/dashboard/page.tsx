"use client";

import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { Truck, MapPin, Calendar, Clock, Star, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { driverService, DriverProfile, Trip } from "@/lib/api/driver-service";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function DriverDashboard() {
  const t = useTranslations("driverDashboard");
  const { data: session } = useSession();

  // React Query Hooks
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['driver-profile', session?.user?.id],
    queryFn: () => driverService.getProfile(session?.user?.id!),
    enabled: !!session?.user?.id,
  });

  const { data: activeTrips = [], isLoading: isActiveTripsLoading } = useQuery({
    queryKey: ['driver-trips', 'active'],
    queryFn: () => driverService.getTrips('active'),
    enabled: !!session?.user?.id,
  });

  const { data: scheduledTrips = [], isLoading: isScheduledTripsLoading } = useQuery({
    queryKey: ['driver-trips', 'scheduled'],
    queryFn: () => driverService.getTrips('scheduled'),
    enabled: !!session?.user?.id,
  });

  const loading = isProfileLoading || isActiveTripsLoading || isScheduledTripsLoading;
  const upcomingTripsCount = scheduledTrips.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("welcomeBack")}, {profile?.firstName || session?.user?.name?.split(" ")[0] || "Driver"}!
          </h1>
          <p className="text-slate-500 font-medium">
            {activeTrips.length > 0 ? "You have an active trip." : "You are currently available."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${(!profile || profile?.status === 'active' || profile?.status === 'verified') ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">{profile?.status || "Online"}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatWidget
          title="Current Trips"
          value={activeTrips.length.toString()}
          icon={<Truck className="h-6 w-6" />}
          trend={{ value: `${upcomingTripsCount} upcoming`, direction: "neutral" }}
          description="Active deliveries"
          color="blue"
        />
        <StatWidget
          title="Rating"
          value={profile?.rating?.toFixed(1) || "4.9"}
          icon={<Star className="h-6 w-6" />}
          trend={{ value: 0.1, direction: "up" }}
          description="Last 30 days"
          color="yellow"
        />
        <StatWidget
          title="Total Trips"
          value={profile?.totalTrips?.toString() || "156"}
          icon={<MapPin className="h-6 w-6" />}
          trend={{ value: 12, direction: "up" }}
          description="Lifetime trips"
          color="green"
        />
        <StatWidget
          title="Performance"
          value="98%"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 2, direction: "up" }}
          description="On-time delivery"
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Trip Status */}
        <div className="lg:col-span-2">
          <DashboardCard title="Active Trips" className="h-full">
            {activeTrips.length > 0 ? (
              <div className="space-y-6">
                {activeTrips.map((trip: Trip) => (
                  <div key={trip.id} className="relative pl-8 pb-8 last:pb-0 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                    <div className="mb-1 text-sm font-semibold text-blue-600">On Route</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {trip.fromLocation} <span className="text-slate-400 mx-2">→</span> {trip.toLocation}
                    </h3>
                    <p className="text-slate-500 mb-4">Trip #{trip.id.substring(0, 8)}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>Est. Arrival: {trip.arrivalTime ? new Date(trip.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Calculating...'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.price} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Truck className="h-12 w-12 mb-4 text-slate-300" />
                <p>No active trips at the moment.</p>
                <Button variant="link" className="mt-2 text-blue-600">Check schedule</Button>
              </div>
            )}

          </DashboardCard>
        </div>

        {/* Vehicle Status */}
        <div className="lg:col-span-1">
          <DashboardCard title="My Vehicle" className="h-full">
            {profile?.vehicles && profile.vehicles.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{profile.vehicles[0].model || "Vehicle"}</div>
                      <div className="text-xs text-slate-500">{profile.vehicles[0].plateNumber || "No Plate"}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Next Service</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">In 2,500 km</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Volvo FH16</div>
                      <div className="text-xs text-slate-500">No Plate</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Fuel Level</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">75%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
