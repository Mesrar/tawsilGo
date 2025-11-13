"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// Services
import { fleetService } from "@/app/services/fleetService";
import { organizationService } from "@/app/services/organizationService";

// Types
import { OrganizationVehicle, OrganizationDriver } from "@/types/organization";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2,
  Car,
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  MapPin,
  Settings,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";

export default function FleetManagementPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");

  // Get fleet overview
  const { data: fleetOverview, isLoading: overviewLoading, error: overviewError } = useQuery({
    queryKey: ["fleet-overview"],
    queryFn: () => fleetService.getFleetOverview(),
    enabled: sessionStatus === "authenticated",
  });

  // Get fleet vehicles
  const { data: fleetData, isLoading: vehiclesLoading, error: vehiclesError } = useQuery({
    queryKey: ["fleet-vehicles", statusFilter, vehicleTypeFilter],
    queryFn: () => fleetService.getFleetVehicles({
      status: statusFilter !== "all" ? statusFilter as any : undefined,
      type: vehicleTypeFilter !== "all" ? vehicleTypeFilter as any : undefined,
      includeAnalytics: true,
      includeMaintenance: true,
    }),
    enabled: sessionStatus === "authenticated",
  });

  // Get fleet drivers
  const { data: driversData, isLoading: driversLoading } = useQuery({
    queryKey: ["fleet-drivers"],
    queryFn: () => fleetService.getFleetDrivers({
      includePerformance: true,
    }),
    enabled: sessionStatus === "authenticated",
  });

  // Get fleet alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ["fleet-alerts"],
    queryFn: () => fleetService.getFleetAlerts(),
    enabled: sessionStatus === "authenticated",
  });

  if (sessionStatus === "loading" || overviewLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/organizations/fleet");
    return null;
  }

  if (overviewError || vehiclesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load fleet data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const overview = fleetOverview?.data;
  const vehicles = fleetData?.data?.vehicles || [];
  const drivers = driversData?.data?.drivers || [];
  const alerts = alertsData?.data?.alerts || [];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = vehicleTypeFilter === "all" || vehicle.type === vehicleTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'verification_pending': return 'bg-blue-100 text-blue-800';
      case 'verification_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                  Fleet Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage your organization's vehicles and drivers
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          {overview && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Vehicles</p>
                      <p className="text-2xl font-bold">{overview.stats.totalVehicles}</p>
                      <div className="flex items-center gap-1 text-sm">
                        {overview.stats.activeVehicles > 0 ? (
                          <>
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">{overview.stats.activeVehicles} active</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">No active vehicles</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Drivers</p>
                      <p className="text-2xl font-bold">{overview.stats.totalDrivers}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-slate-500">{overview.stats.activeDrivers} active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">In Maintenance</p>
                      <p className="text-2xl font-bold">{overview.stats.vehiclesInMaintenance}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-slate-500">{overview.upcomingMaintenance?.length || 0} upcoming</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Fleet Utilization</p>
                      <p className="text-2xl font-bold">{overview.stats.fleetUtilization}%</p>
                      <Progress value={overview.stats.fleetUtilization} className="mt-2 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Alerts Section */}
          {alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Fleet Alerts ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.slice(0, 6).map((alert) => (
                    <Alert key={alert.id} className={getAlertSeverityColor(alert.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-xs mt-1 opacity-90">{alert.description}</div>
                        {alert.dueDate && (
                          <div className="flex items-center gap-1 text-xs mt-2">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(alert.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
                {alerts.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Alerts ({alerts.length - 6} more)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {overview?.recentActivity?.length > 0 ? (
                      <div className="space-y-4">
                        {overview.recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                              {activity.type.includes('maintenance') && <Wrench className="h-4 w-4" />}
                              {activity.type.includes('trip') && <Car className="h-4 w-4" />}
                              {activity.type.includes('vehicle') && <Plus className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <p className="text-xs text-slate-500">
                                {activity.vehicleOrDriverName} • {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Vehicle Type Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {overview?.vehiclesByType?.length > 0 ? (
                      <div className="space-y-4">
                        {overview.vehiclesByType.map((type) => (
                          <div key={type.type} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">
                                {type.type.replace('_', ' ')}
                              </span>
                              <span className="text-sm text-slate-500">
                                {type.count} vehicles • {type.utilization}% utilization
                              </span>
                            </div>
                            <Progress value={type.utilization} className="h-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No vehicles in fleet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Fleet Vehicles</CardTitle>
                      <CardDescription>
                        Manage your organization's vehicle fleet
                      </CardDescription>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search vehicles..."
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
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredVehicles.length > 0 ? (
                    <div className="space-y-4">
                      {filteredVehicles.map((vehicle) => (
                        <motion.div
                          key={vehicle.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                <Car className="h-6 w-6 text-slate-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">
                                    {vehicle.brand} {vehicle.model}
                                  </h3>
                                  <Badge className={getVehicleStatusColor(vehicle.status)}>
                                    {vehicle.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                  <span>{vehicle.year}</span>
                                  <span>•</span>
                                  <span>{vehicle.licensePlate}</span>
                                  <span>•</span>
                                  <span className="capitalize">{vehicle.type}</span>
                                </div>
                                {vehicle.driver && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {vehicle.driver.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-slate-600">
                                      {vehicle.driver.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {vehicle.upcomingMaintenance && (
                                <Badge variant="outline" className="text-yellow-600">
                                  <Wrench className="h-3 w-3 mr-1" />
                                  Maintenance Due
                                </Badge>
                              )}
                              {vehicle.expiringDocuments && vehicle.expiringDocuments > 0 && (
                                <Badge variant="outline" className="text-orange-600">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {vehicle.expiringDocuments} docs expiring
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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
                      <Car className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
                      <p className="text-sm mb-4">
                        {searchTerm || statusFilter !== "all" || vehicleTypeFilter !== "all"
                          ? "Try adjusting your filters"
                          : "Add your first vehicle to get started"}
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Drivers Tab */}
            <TabsContent value="drivers">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Drivers</CardTitle>
                  <CardDescription>
                    Manage your organization's drivers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {drivers.length > 0 ? (
                    <div className="space-y-4">
                      {drivers.map((driver) => (
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
                                  <Badge className={
                                    driver.status === 'active' ? 'bg-green-100 text-green-800' :
                                    driver.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                  }>
                                    {driver.status}
                                  </Badge>
                                  {driver.isVerified && (
                                    <Badge variant="secondary" className="text-blue-600">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                  <span>{driver.email}</span>
                                  <span>•</span>
                                  <span>{driver.phone}</span>
                                  <span>•</span>
                                  <span>{driver.completedTrips} trips</span>
                                </div>
                                {driver.currentVehicle && (
                                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                                    <Car className="h-4 w-4" />
                                    <span>{driver.currentVehicle.brand} {driver.currentVehicle.model}</span>
                                    <span>({driver.currentVehicle.licensePlate})</span>
                                  </div>
                                )}
                                {driver.performance && (
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3 text-green-600" />
                                      <span>Rating: {driver.performance.averageRating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3 text-blue-600" />
                                      <span>Revenue: ${driver.performance.totalRevenue}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                View Details
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
                      <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No drivers in fleet</h3>
                      <p className="text-sm mb-4">Invite drivers to join your organization</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Invite Driver
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Upcoming Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {overview?.upcomingMaintenance?.length > 0 ? (
                      <div className="space-y-4">
                        {overview.upcomingMaintenance.map((item, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{item.vehicle.brand} {item.vehicle.model}</h4>
                                <p className="text-sm text-slate-600">{item.vehicle.licensePlate}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm">
                                  <Badge variant="outline">
                                    {item.maintenanceRecord.type}
                                  </Badge>
                                  <span className="text-slate-500">
                                    {item.maintenanceRecord.description}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-medium ${
                                  item.daysUntilDue <= 3 ? 'text-red-600' :
                                  item.daysUntilDue <= 7 ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {item.daysUntilDue === 0 ? 'Today' :
                                   item.daysUntilDue === 1 ? 'Tomorrow' :
                                   `${item.daysUntilDue} days`}
                                </div>
                                <p className="text-xs text-slate-500">
                                  {new Date(item.maintenanceRecord.scheduledDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No upcoming maintenance scheduled</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {overview ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {overview.stats.monthlyMaintenanceCost}
                            </div>
                            <div className="text-sm text-slate-600">Monthly Cost</div>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {overview.stats.vehiclesInMaintenance}
                            </div>
                            <div className="text-sm text-slate-600">In Maintenance</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Vehicle Age Average</span>
                            <span className="text-sm font-medium">{overview.stats.averageVehicleAge} years</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Fleet Availability</span>
                            <span className="text-sm font-medium text-green-600">
                              {Math.round((overview.stats.activeVehicles / overview.stats.totalVehicles) * 100)}%
                            </span>
                          </div>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Maintenance
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}