"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Services
import { organizationService } from "@/app/services/organizationService";
import { userService } from "@/app/services/userService";
import { tripService } from "@/app/services/tripService";
import { fleetService } from "@/app/services/fleetService";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Users,
  Car,
  Route,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Clock,
  Star,
  Package,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Plus,
  Bell,
  Settings,
  Eye,
  BarChart3,
  Target,
  Navigation,
  FileText,
  Building,
  User,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react";

export default function UnifiedDashboardPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [activeTab, setActiveTab] = useState("overview");

  // Get current user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => userService.getCurrentUser(),
    enabled: sessionStatus === "authenticated",
  });

  // Organization-specific queries
  const { data: organizationData, isLoading: orgLoading } = useQuery({
    queryKey: ["current-organization"],
    queryFn: () => organizationService.getCurrentOrganization(),
    enabled: sessionStatus === "authenticated" && userData?.data?.role === "organization_admin",
  });

  const { data: fleetOverview, isLoading: fleetLoading } = useQuery({
    queryKey: ["fleet-overview"],
    queryFn: () => fleetService.getFleetOverview(),
    enabled: sessionStatus === "authenticated" && userData?.data?.role === "organization_admin",
  });

  const { data: orgTrips, isLoading: tripsLoading } = useQuery({
    queryKey: ["organization-trips-dashboard"],
    queryFn: () => organizationService.getTrips({ limit: 5 }),
    enabled: sessionStatus === "authenticated" && userData?.data?.role === "organization_admin",
  });

  // Individual driver queries
  const { data: driverTrips, isLoading: driverTripsLoading } = useQuery({
    queryKey: ["driver-trips"],
    queryFn: () => tripService.getTrips({ limit: 5 }),
    enabled: sessionStatus === "authenticated" && userData?.data?.role === "driver",
  });

  // Customer queries
  const { data: customerTrips, isLoading: customerTripsLoading } = useQuery({
    queryKey: ["customer-trips"],
    queryFn: () => tripService.getTrips({ limit: 5 }),
    enabled: sessionStatus === "authenticated" && userData?.data?.role === "customer",
  });

  if (sessionStatus === "loading" || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/dashboard");
    return null;
  }

  const user = userData?.data;
  const organization = organizationData?.data?.organization;
  const fleetStats = fleetOverview?.data?.stats;
  const recentOrgTrips = orgTrips?.data?.trips || [];
  const recentDriverTrips = driverTrips?.data?.trips || [];
  const recentCustomerTrips = customerTrips?.data?.trips || [];

  const userRole = user?.role;

  // Role-based dashboard components
  const renderOrganizationDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-blue-100">
              Manage your organization's fleet and trips
            </p>
            {organization && (
              <div className="flex items-center gap-2 mt-3">
                <Building className="h-5 w-5" />
                <span className="font-medium">{organization.businessName}</span>
                <Badge className="bg-white/20 text-white border-white/30">
                  {organization.verificationStatus.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => router.push("/organizations/trips/create")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Trip
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => router.push("/organizations/fleet/vehicles/add")}
            >
              <Car className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>

      {/* Organization Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Drivers</p>
                <p className="text-2xl font-bold">{fleetStats?.totalDrivers || 0}</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">{fleetStats?.activeDrivers || 0} active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Vehicles</p>
                <p className="text-2xl font-bold">{fleetStats?.activeVehicles || 0}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">of {fleetStats?.totalVehicles || 0} total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Route className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Trips</p>
                <p className="text-2xl font-bold">{fleetStats?.totalTrips || 0}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">{fleetStats?.completedTrips || 0} completed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Fleet Utilization</p>
                <p className="text-2xl font-bold">{fleetStats?.fleetUtilization || 0}%</p>
                <Progress value={fleetStats?.fleetUtilization || 0} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Trips
            </CardTitle>
            <CardDescription>
              Your organization's latest trips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrgTrips.slice(0, 3).map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Route className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {trip.departureCity} → {trip.destinationCity}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(trip.departureTime).toLocaleDateString()}</span>
                        <Badge className={trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {trip.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {recentOrgTrips.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No trips yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push("/organizations/trips/create")}
                  >
                    Create First Trip
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/organizations/trips/create")}
              >
                <Route className="h-6 w-6" />
                <span className="text-sm">Create Trip</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/organizations/fleet")}
              >
                <Car className="h-6 w-6" />
                <span className="text-sm">Manage Fleet</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/organizations/drivers")}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Drivers</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push("/organizations/fleet/maintenance")}
              >
                <Wrench className="h-6 w-6" />
                <span className="text-sm">Maintenance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDriverDashboard = () => (
    <div className="space-y-6">
      {/* Driver Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-green-100">
              Manage your trips and vehicle performance
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => router.push("/drivers/trips/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Button>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Route className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Trips</p>
                <p className="text-2xl font-bold">{recentDriverTrips.length}</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Active driver</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Rating</p>
                <p className="text-2xl font-bold">4.8</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">Average rating</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Earnings</p>
                <p className="text-2xl font-bold">€2,450</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12% this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Vehicle</p>
                <p className="text-2xl font-bold">Active</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">Toyota Camry</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDriverTrips.slice(0, 4).map((trip) => (
                <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Route className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {trip.departureCity} → {trip.destinationCity}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(trip.departureTime).toLocaleDateString()}</span>
                        <Badge className={trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {trip.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Toyota Camry</h4>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">License:</span>
                    <p className="font-medium">12345-A</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Capacity:</span>
                    <p className="font-medium">500kg</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Last Service:</span>
                    <p className="font-medium">2 weeks ago</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mileage:</span>
                    <p className="font-medium">45,230 km</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCustomerDashboard = () => (
    <div className="space-y-6">
      {/* Customer Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-purple-100">
              Book and track your parcels with ease
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => router.push("/search")}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Trips
          </Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Bookings</p>
                <p className="text-2xl font-bold">12</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">3 active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
                <p className="text-2xl font-bold">€450</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">This month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Route className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Deliveries</p>
                <p className="text-2xl font-bold">8</p>
                <div className="flex items-center gap-1 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Completed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Routes</p>
                <p className="text-2xl font-bold">3</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-slate-500">Favorite routes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCustomerTrips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {trip.departureCity} → {trip.destinationCity}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(trip.departureTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {trip.driver?.name || 'Driver assigned'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        {trip.vehicle?.type || 'Vehicle'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {trip.status}
                      </Badge>
                      {trip.price && (
                        <span className="text-sm font-medium">
                          {new Intl.NumberFormat('en-EU', {
                            style: 'currency',
                            currency: trip.price.currency || 'EUR'
                          }).format(trip.price.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {trip.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {recentCustomerTrips.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                <p className="text-sm mb-4">Start by searching for available trips</p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push("/search")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Trips
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Admin Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-red-100">
              System administration and analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Organizations</p>
                <p className="text-2xl font-bold">24</p>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+3 this week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                <p className="text-2xl font-bold">1,847</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12% growth</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Route className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Trips</p>
                <p className="text-2xl font-bold">156</p>
                <div className="flex items-center gap-1 text-sm">
                  <Navigation className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-600">In progress</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
                <p className="text-2xl font-bold">€45,230</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+8% this month</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Building className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Organization Registered</p>
                    <p className="text-xs text-slate-500">LogisticsPro Morocco - 2 hours ago</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Success</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">15 New User Signups</p>
                    <p className="text-xs text-slate-500">Last 24 hours</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Users</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">System Maintenance Scheduled</p>
                    <p className="text-xs text-slate-500">Tomorrow at 2:00 AM</p>
                  </div>
                </div>
                <Badge className="bg-orange-100 text-orange-800">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average Trip Duration</span>
                <span className="text-sm font-medium">4.2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Success Rate</span>
                <span className="text-sm font-medium text-green-600">94.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Average Rating</span>
                <span className="text-sm font-medium">4.7/5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Platform Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Role-based rendering
  const renderDashboard = () => {
    switch (userRole) {
      case 'organization_admin':
        return renderOrganizationDashboard();
      case 'organization_driver':
        return renderDriverDashboard();
      case 'driver':
        return renderDriverDashboard();
      case 'customer':
        return renderCustomerDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Dashboard Loading...</h2>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderDashboard()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}