"use client";

import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { MapPin, Search, Calendar, ChevronRight, Clock, Truck, RefreshCw, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateTripDialog } from "@/components/drivers/CreateTripDialog";
import { useEffect, useState } from "react";
import { driverService, Trip } from "@/lib/api/driver-service";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DriverTripsPage() {
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await driverService.getTrips(); // Fetch all/active trips by default or add filter logic
      setTrips(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch trips", err);
      setError("Failed to load trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchTrips();
    }
  }, [session]);

  const handleTripCreated = () => {
    fetchTrips(); // Refresh list after creation
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          {error}
          <Button variant="outline" size="sm" onClick={fetchTrips} className="bg-white/10 hover:bg-white/20 border-white/20 text-white ml-2">
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Trips</h1>
          <p className="text-slate-500">View and manage your scheduled deliveries.</p>
        </div>
        <CreateTripDialog onTripCreated={handleTripCreated} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search trips..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTrips} title="Refresh List"><RefreshCw className="w-4 h-4" /></Button>
          <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Date Range</Button>
          <Button variant="outline"><Truck className="w-4 h-4 mr-2" /> Status</Button>
        </div>
      </div>

      <DashboardCard title="Upcoming & Past Trips" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {trips.length > 0 ? trips.map((trip) => (
                <tr key={trip.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                        <span>{trip.fromLocation}</span>
                        <span className="text-slate-400">→</span>
                        <span>{trip.toLocation}</span>
                      </div>
                      <span className="text-xs text-slate-500 mt-1">Trip #{trip.id.substring(0, 8)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(trip.departureTime).toLocaleDateString()}</span>
                      <span className="text-slate-300">|</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {trip.duration || "--"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${trip.status === "completed" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30" :
                        trip.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" :
                          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                      }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No trips found. Create one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}