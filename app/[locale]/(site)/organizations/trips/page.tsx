"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Services
import { organizationService } from "@/app/services/organizationService";

// Types
import { OrganizationTrip } from "@/types/organization";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Route,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  User,
  Car,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal,
  Navigation,
  Package,
  Users,
  BarChart3,
  FileText,
  Bell
} from "lucide-react";

export default function OrganizationTripsPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [selectedTrip, setSelectedTrip] = useState<OrganizationTrip | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Get organization trips
  const { data: tripsData, isLoading: tripsLoading, error: tripsError } = useQuery({
    queryKey: ["organization-trips", activeTab, statusFilter, driverFilter],
    queryFn: () => organizationService.getTrips({
      status: activeTab === "all" ? undefined : activeTab as OrganizationTrip['status'],
      driverId: driverFilter !== "all" ? driverFilter : undefined,
    }),
    enabled: sessionStatus === "authenticated",
  });

  // Get organization drivers for filtering
  const { data: driversData } = useQuery({
    queryKey: ["fleet-drivers"],
    queryFn: () => organizationService.getDrivers(),
    enabled: sessionStatus === "authenticated",
  });

  // Cancel trip mutation
  const cancelTripMutation = useMutation({
    mutationFn: ({ tripId, reason }: { tripId: string; reason: string }) =>
      organizationService.cancelTrip(tripId, reason),
    onSuccess: () => {
      toast.success("Trip cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["organization-trips"] });
      setCancelDialogOpen(false);
      setCancelReason("");
      setSelectedTrip(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel trip");
    },
  });

  // Update trip mutation
  const updateTripMutation = useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: any }) =>
      organizationService.updateTrip(tripId, data),
    onSuccess: () => {
      toast.success("Trip updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["organization-trips"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update trip");
    },
  });

  if (sessionStatus === "loading" || tripsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/organizations/trips");
    return null;
  }

  if (tripsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load trip data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const trips = tripsData?.data?.trips || [];
  const drivers = driversData?.data || [];
  const total = tripsData?.data?.total || 0;

  const filteredTrips = trips.filter(trip => {
    const matchesSearch =
      trip.departureCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    const matchesDriver = driverFilter === "all" || trip.driverId === driverFilter;
    return matchesSearch && matchesStatus && matchesDriver;
  });

  const getTripStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTripStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'in_progress': return <Navigation className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const activeTrips = trips.filter(t => t.status === 'scheduled' || t.status === 'in_progress').length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const cancelledTrips = trips.filter(t => t.status === 'cancelled').length;
  const totalRevenue = trips.reduce((acc, trip) => acc + (trip.price?.basePrice || 0), 0);

  const handleCancelTrip = () => {
    if (!selectedTrip || !cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    cancelTripMutation.mutate({
      tripId: selectedTrip.id,
      reason: cancelReason.trim(),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Organization Trips
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage your organization's trips and schedules
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  onClick={() => router.push("/organizations/trips/create")}
                >
                  <Plus className="h-4 w-4" />
                  Create Trip
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Route className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Trips</p>
                    <p className="text-2xl font-bold">{total}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-600">{activeTrips} active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                    <p className="text-2xl font-bold">{completedTrips}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-slate-500">success rate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Cancelled</p>
                    <p className="text-2xl font-bold">{cancelledTrips}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span className="text-slate-500">cancellations</span>
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="h-3 w-3 text-purple-600" />
                      <span className="text-slate-500">all trips</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Trips</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Trips Management</CardTitle>
                      <CardDescription>
                        View and manage your organization's trips
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search trips..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={driverFilter} onValueChange={setDriverFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Drivers</SelectItem>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredTrips.length > 0 ? (
                    <div className="space-y-4">
                      {filteredTrips.map((trip) => (
                        <motion.div
                          key={trip.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Route className="h-6 w-6 text-slate-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">
                                    {trip.departureCity} → {trip.destinationCity}
                                  </h3>
                                  <Badge className={getTripStatusColor(trip.status)}>
                                    {getTripStatusIcon(trip.status)}
                                    <span className="ml-1">{trip.status.replace('_', ' ')}</span>
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {trip.departureCountry} → {trip.destinationCountry}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(trip.departureTime)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  {trip.driver && (
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span>{trip.driver.name}</span>
                                    </div>
                                  )}
                                  {trip.vehicle && (
                                    <div className="flex items-center gap-1">
                                      <Car className="h-3 w-3" />
                                      <span>{trip.vehicle.brand} {trip.vehicle.model}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {trip.vehicle.licensePlate}
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    <span>Capacity: {trip.totalCapacity}kg</span>
                                  </div>
                                  {trip.price && (
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      <span>{formatCurrency(trip.price.basePrice, trip.price.currency)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {trip.status === 'scheduled' && (
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              )}
                              {trip.status === 'scheduled' && (
                                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => setSelectedTrip(trip)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Cancel Trip</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to cancel this trip? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="cancelReason">Reason for cancellation *</Label>
                                        <Textarea
                                          id="cancelReason"
                                          value={cancelReason}
                                          onChange={(e) => setCancelReason(e.target.value)}
                                          placeholder="Please provide a reason for cancelling this trip..."
                                          rows={3}
                                        />
                                      </div>
                                      <div className="flex justify-end gap-3">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setCancelDialogOpen(false);
                                            setCancelReason("");
                                            setSelectedTrip(null);
                                          }}
                                        >
                                          Keep Trip
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={handleCancelTrip}
                                          disabled={cancelTripMutation.isPending}
                                        >
                                          {cancelTripMutation.isPending ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Cancelling...
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="mr-2 h-4 w-4" />
                                              Cancel Trip
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Route className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No trips found</h3>
                      <p className="text-sm mb-4">
                        {searchTerm || statusFilter !== "all" || driverFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Create your first trip to get started"}
                      </p>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => router.push("/organizations/trips/create")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Trip
                      </Button>
                    </div>
                  )}

                  {total > 0 && (
                    <div className="mt-6 pt-4 border-t text-center text-sm text-slate-500">
                      Showing {filteredTrips.length} of {total} trips
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}