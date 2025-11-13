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
import { fleetService } from "@/app/services/fleetService";

// Types
import { OrganizationDriver, OrganizationVehicle } from "@/types/organization";

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
import {
  Loader2,
  Users,
  Car,
  UserPlus,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from "lucide-react";

export default function DriverManagementPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState<OrganizationDriver | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  // Get fleet drivers
  const { data: driversData, isLoading: driversLoading, error: driversError } = useQuery({
    queryKey: ["fleet-drivers", statusFilter],
    queryFn: () => fleetService.getFleetDrivers({
      status: statusFilter !== "all" ? statusFilter as any : undefined,
      includePerformance: true,
    }),
    enabled: sessionStatus === "authenticated",
  });

  // Get fleet vehicles for assignment
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["fleet-vehicles-available"],
    queryFn: () => fleetService.getFleetVehicles({
      status: "active",
    }),
    enabled: sessionStatus === "authenticated" && assignmentDialogOpen,
  });

  // Get current organization
  const { data: organizationData } = useQuery({
    queryKey: ["current-organization"],
    queryFn: () => organizationService.getCurrentOrganization(),
    enabled: sessionStatus === "authenticated",
  });

  // Invite driver mutation
  const inviteDriverMutation = useMutation({
    mutationFn: organizationService.inviteDriver,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Driver invited successfully!");
        queryClient.invalidateQueries({ queryKey: ["fleet-drivers"] });
        setAssignmentDialogOpen(false);
      } else {
        toast.error(response.error?.message || "Failed to invite driver");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to invite driver");
    },
  });

  // Update driver status mutation
  const updateDriverStatusMutation = useMutation({
    mutationFn: ({ driverId, status }: { driverId: string; status: OrganizationDriver['status'] }) =>
      organizationService.updateDriverStatus(driverId, status),
    onSuccess: () => {
      toast.success("Driver status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["fleet-drivers"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update driver status");
    },
  });

  // Assign vehicle to driver mutation
  const assignVehicleMutation = useMutation({
    mutationFn: ({ driverId, vehicleId }: { driverId: string; vehicleId: string }) =>
      fleetService.assignDriverToVehicle(vehicleId, driverId),
    onSuccess: () => {
      toast.success("Vehicle assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["fleet-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["fleet-vehicles"] });
      setAssignmentDialogOpen(false);
      setSelectedVehicleId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign vehicle");
    },
  });

  // Remove driver from organization mutation
  const removeDriverMutation = useMutation({
    mutationFn: (driverId: string) => organizationService.removeDriver(driverId),
    onSuccess: () => {
      toast.success("Driver removed from organization!");
      queryClient.invalidateQueries({ queryKey: ["fleet-drivers"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove driver");
    },
  });

  if (sessionStatus === "loading" || driversLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/organizations/fleet/drivers");
    return null;
  }

  if (driversError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load driver data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const drivers = driversData?.data?.drivers || [];
  const vehicles = vehiclesData?.data?.vehicles || [];
  const organization = organizationData?.data?.organization;

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDriverStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const averageRating = drivers.reduce((acc, d) => acc + (d.performanceRating || 0), 0) / drivers.length || 0;
  const totalTrips = drivers.reduce((acc, d) => acc + d.completedTrips, 0);

  const handleInviteDriver = (email: string, role: string, vehicleId?: string) => {
    inviteDriverMutation.mutate({
      email,
      role: role as 'organization_driver',
      vehicleId,
    });
  };

  const handleUpdateDriverStatus = (driverId: string, status: OrganizationDriver['status']) => {
    updateDriverStatusMutation.mutate({ driverId, status });
  };

  const handleAssignVehicle = (driverId: string) => {
    if (!selectedVehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    assignVehicleMutation.mutate({ driverId, vehicleId: selectedVehicleId });
  };

  const handleRemoveDriver = (driverId: string) => {
    if (window.confirm("Are you sure you want to remove this driver from the organization?")) {
      removeDriverMutation.mutate(driverId);
    }
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
                  Driver Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage your organization's drivers and assignments
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Invite Driver
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Driver</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join your organization as a driver
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inviteEmail">Email Address</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          placeholder="driver@example.com"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const email = (e.target as HTMLInputElement).value;
                              if (email) {
                                handleInviteDriver(email, 'organization_driver');
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inviteVehicle">Assign Vehicle (Optional)</Label>
                        <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          const emailInput = document.getElementById('inviteEmail') as HTMLInputElement;
                          const email = emailInput?.value;
                          if (email) {
                            handleInviteDriver(email, 'organization_driver', selectedVehicleId || undefined);
                            emailInput.value = '';
                            setSelectedVehicleId('');
                          }
                        }}
                        disabled={inviteDriverMutation.isPending}
                      >
                        {inviteDriverMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Invitation...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Invitation
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Drivers</p>
                    <p className="text-2xl font-bold">{drivers.length}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-600">{activeDrivers} active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Average Rating</p>
                    <p className={`text-2xl font-bold ${getPerformanceColor(averageRating)}`}>
                      {averageRating.toFixed(1)}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-slate-500">Rating</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed Trips</p>
                    <p className="text-2xl font-bold">{totalTrips}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-slate-500">Total</span>
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">Vehicles Assigned</p>
                    <p className="text-2xl font-bold">
                      {drivers.filter(d => d.currentVehicleId).length}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-slate-500">of {drivers.length} drivers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Driver Directory</CardTitle>
                      <CardDescription>
                        Manage your organization's drivers
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search drivers..."
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredDrivers.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDrivers.map((driver) => (
                        <motion.div
                          key={driver.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={driver.profileImage} alt={driver.name} />
                                <AvatarFallback>
                                  {driver.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{driver.name}</h3>
                                  <Badge className={getDriverStatusColor(driver.status)}>
                                    {driver.status}
                                  </Badge>
                                  {driver.isVerified && (
                                    <Badge variant="secondary" className="text-blue-600">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {driver.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {driver.phone}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Joined {new Date(driver.joinedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {driver.currentVehicle && (
                                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                    <Car className="h-4 w-4" />
                                    <span>{driver.currentVehicle.brand} {driver.currentVehicle.model}</span>
                                    <Badge variant="outline">{driver.currentVehicle.licensePlate}</Badge>
                                  </div>
                                )}
                                {driver.performance && (
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className={getPerformanceColor(driver.performanceRating || 0)}>
                                        {driver.performanceRating?.toFixed(1) || "N/A"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      <span>{driver.completedTrips} trips</span>
                                    </div>
                                    {driver.performance.totalRevenue > 0 && (
                                      <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-blue-600" />
                                        <span>${driver.performance.totalRevenue}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {driver.status === 'active' && !driver.currentVehicleId && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Car className="h-4 w-4 mr-1" />
                                      Assign Vehicle
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Assign Vehicle to {driver.name}</DialogTitle>
                                      <DialogDescription>
                                        Select a vehicle to assign to this driver
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>Select Vehicle</Label>
                                        <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Choose a vehicle" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {vehicles.map((vehicle) => (
                                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleAssignVehicle(driver.id)}
                                        disabled={!selectedVehicleId || assignVehicleMutation.isPending}
                                      >
                                        {assignVehicleMutation.isPending ? (
                                          <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Assigning...
                                          </>
                                        ) : (
                                          "Assign Vehicle"
                                        )}
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}

                              {driver.currentVehicleId && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    organizationService.unassignVehicleFromDriver(driver.id);
                                    queryClient.invalidateQueries({ queryKey: ["fleet-drivers"] });
                                  }}
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Unassign
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateDriverStatus(
                                  driver.id,
                                  driver.status === 'active' ? 'inactive' : 'active'
                                )}
                              >
                                {driver.status === 'active' ? (
                                  <UserX className="h-4 w-4 mr-1" />
                                ) : (
                                  <UserCheck className="h-4 w-4 mr-1" />
                                )}
                                {driver.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>

                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDriver(driver.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No drivers found</h3>
                      <p className="text-sm mb-4">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Invite your first driver to get started"}
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Driver
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Active Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {drivers.filter(d => d.currentVehicleId).map((driver) => (
                        <div key={driver.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {driver.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{driver.name}</h4>
                                <p className="text-sm text-slate-600">
                                  {driver.currentVehicle?.brand} {driver.currentVehicle?.model}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {driver.currentVehicle?.licensePlate}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-green-600">
                                Assigned
                              </Badge>
                              <p className="text-xs text-slate-500 mt-1">
                                Active
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {drivers.filter(d => d.currentVehicleId).length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No active vehicle assignments</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Available Vehicles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vehicles?.filter(v => !v.driverId).map((vehicle) => (
                        <div key={vehicle.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">
                                {vehicle.brand} {vehicle.model}
                              </h4>
                              <p className="text-sm text-slate-600">{vehicle.licensePlate}</p>
                              <p className="text-xs text-slate-500 capitalize">{vehicle.type}</p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <UserPlus className="h-4 w-4 mr-1" />
                                  Assign Driver
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Driver to {vehicle.brand} {vehicle.model}</DialogTitle>
                                  <DialogDescription>
                                    Choose a driver to assign this vehicle
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 max-h-60 overflow-y-auto">
                                  {drivers.filter(d => d.status === 'active' && !d.currentVehicleId).map((driver) => (
                                    <div
                                      key={driver.id}
                                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
                                      onClick={() => {
                                        fleetService.assignDriverToVehicle(vehicle.id, driver.id);
                                        queryClient.invalidateQueries({ queryKey: ["fleet-drivers"] });
                                        queryClient.invalidateQueries({ queryKey: ["fleet-vehicles"] });
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>
                                            {driver.name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium text-sm">{driver.name}</p>
                                          <p className="text-xs text-slate-500">{driver.email}</p>
                                        </div>
                                      </div>
                                      <Button size="sm">Assign</Button>
                                    </div>
                                  ))}
                                  {drivers.filter(d => d.status === 'active' && !d.currentVehicleId).length === 0 && (
                                    <p className="text-center text-slate-500 py-4">
                                      No available drivers
                                    </p>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                      {vehicles?.filter(v => !v.driverId).length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>All vehicles are assigned</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Performance Analytics</CardTitle>
                  <CardDescription>
                    Track driver performance and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4">Top Performers</h3>
                      <div className="space-y-3">
                        {drivers
                          .filter(d => d.performanceRating && d.performanceRating >= 4.0)
                          .sort((a, b) => (b.performanceRating || 0) - (a.performanceRating || 0))
                          .slice(0, 5)
                          .map((driver) => (
                            <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {driver.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{driver.name}</p>
                                  <p className="text-xs text-slate-500">{driver.completedTrips} trips</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-medium ${getPerformanceColor(driver.performanceRating || 0)}`}>
                                  ⭐ {driver.performanceRating?.toFixed(1)}
                                </div>
                                {driver.performance?.totalRevenue && (
                                  <p className="text-xs text-slate-500">
                                    ${driver.performance.totalRevenue}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Performance Summary</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {averageRating.toFixed(1)}
                            </div>
                            <div className="text-sm text-slate-600">Avg Rating</div>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {totalTrips}
                            </div>
                            <div className="text-sm text-slate-600">Total Trips</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Active Drivers</span>
                            <span className="text-sm font-medium">{activeDrivers} / {drivers.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Verified Drivers</span>
                            <span className="text-sm font-medium">
                              {drivers.filter(d => d.isVerified).length} / {drivers.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Vehicles Assigned</span>
                            <span className="text-sm font-medium">
                              {drivers.filter(d => d.currentVehicleId).length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}