"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { z } from "zod";

// Services
import { fleetService } from "@/app/services/fleetService";
import { vehicleService } from "@/app/services/vehicleService";

// Types
import { OrganizationVehicle, MaintenanceRecord } from "@/types/vehicle";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Wrench,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Car,
  DollarSign,
  FileText,
  Bell,
  TrendingUp,
  Settings,
  Eye,
  Edit,
  MoreHorizontal,
  AlertCircle,
  Info
} from "lucide-react";

// Validation schema for maintenance scheduling
const maintenanceSchema = z.object({
  vehicleIds: z.array(z.string()).min(1, "Select at least one vehicle"),
  maintenanceType: z.enum(["routine", "repair", "inspection", "emergency"]),
  description: z.string().min(1, "Description is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  estimatedCost: z.number().optional(),
  notes: z.string().optional(),
  provider: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

const maintenanceTypes = [
  { value: "routine", label: "Routine Maintenance", description: "Regular scheduled maintenance" },
  { value: "repair", label: "Repair", description: "Fixing a specific issue" },
  { value: "inspection", label: "Inspection", description: "Vehicle inspection or check-up" },
  { value: "emergency", label: "Emergency", description: "Urgent repair needed" },
];

export default function MaintenanceManagementPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("schedule");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Maintenance form
  const maintenanceForm = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicleIds: [],
      maintenanceType: "routine",
      description: "",
      scheduledDate: "",
      estimatedCost: undefined,
      notes: "",
      provider: "",
    },
  });

  // Get fleet overview with maintenance info
  const { data: fleetOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ["fleet-overview"],
    queryFn: () => fleetService.getFleetOverview(),
    enabled: sessionStatus === "authenticated",
  });

  // Get fleet vehicles
  const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
    queryKey: ["fleet-vehicles"],
    queryFn: () => fleetService.getFleetVehicles({
      includeMaintenance: true,
    }),
    enabled: sessionStatus === "authenticated",
  });

  // Get maintenance schedule
  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ["maintenance-schedule"],
    queryFn: () => fleetService.getFleetMaintenanceSchedule({
      start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      end: new Date(new Date().setDate(new Date().getDate() + 90)).toISOString().split('T')[0],
      status: "all",
    }),
    enabled: sessionStatus === "authenticated",
  });

  // Get fleet alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ["fleet-alerts"],
    queryFn: () => fleetService.getFleetAlerts("medium"),
    enabled: sessionStatus === "authenticated",
  });

  // Schedule maintenance mutation
  const scheduleMaintenanceMutation = useMutation({
    mutationFn: fleetService.scheduleFleetMaintenance,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Maintenance scheduled successfully!");
        queryClient.invalidateQueries({ queryKey: ["maintenance-schedule"] });
        queryClient.invalidateQueries({ queryKey: ["fleet-overview"] });
        setScheduleDialogOpen(false);
        maintenanceForm.reset();
        setSelectedVehicles([]);
      } else {
        toast.error(response.error?.message || "Failed to schedule maintenance");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to schedule maintenance");
    },
  });

  // Add maintenance record mutation
  const addMaintenanceMutation = useMutation({
    mutationFn: ({ vehicleId, data }: { vehicleId: string; data: any }) =>
      vehicleService.addMaintenanceRecord(vehicleId, data),
    onSuccess: () => {
      toast.success("Maintenance record added successfully!");
      queryClient.invalidateQueries({ queryKey: ["fleet-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-schedule"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add maintenance record");
    },
  });

  if (sessionStatus === "loading" || overviewLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    router.push("/auth/signin?callbackUrl=/organizations/fleet/maintenance");
    return null;
  }

  const overview = fleetOverview?.data;
  const vehicles = vehiclesData?.data?.vehicles || [];
  const schedule = scheduleData?.data;
  const alerts = alertsData?.data?.alerts || [];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingMaintenance = overview?.upcomingMaintenance || [];
  const vehiclesNeedingAttention = filteredVehicles.filter(v => v.upcomingMaintenance || (v.expiringDocuments && v.expiringDocuments > 0));

  const handleScheduleMaintenance = async (data: MaintenanceFormData) => {
    try {
      await scheduleMaintenanceMutation.mutateAsync({
        ...data,
        vehicleIds: selectedVehicles,
      });
    } catch (error) {
      console.error("Error scheduling maintenance:", error);
    }
  };

  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'routine': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-orange-100 text-orange-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'text-red-600 bg-red-50';
    if (days <= 7) return 'text-yellow-600 bg-yellow-50';
    if (days <= 14) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
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
                  Fleet Maintenance
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Schedule and manage vehicle maintenance
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setCalendarDialogOpen(true)}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Calendar View
                </Button>
                <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Schedule Maintenance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Schedule Fleet Maintenance</DialogTitle>
                      <DialogDescription>
                        Schedule maintenance for multiple vehicles at once
                      </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...maintenanceForm}>
                      <form onSubmit={maintenanceForm.handleSubmit(handleScheduleMaintenance)} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Select Vehicles *</Label>
                            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                              {filteredVehicles.map((vehicle) => (
                                <div key={vehicle.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={vehicle.id}
                                    checked={selectedVehicles.includes(vehicle.id)}
                                    onCheckedChange={() => handleVehicleSelection(vehicle.id)}
                                  />
                                  <Label htmlFor={vehicle.id} className="flex-1 text-sm font-normal cursor-pointer">
                                    {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {selectedVehicles.length === 0 && (
                              <p className="text-sm text-red-600">Please select at least one vehicle</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="maintenanceType">Maintenance Type *</Label>
                              <Select
                                value={maintenanceForm.watch("maintenanceType")}
                                onValueChange={(value) => maintenanceForm.setValue("maintenanceType", value as any)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {maintenanceTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div>
                                        <div className="font-medium">{type.label}</div>
                                        <div className="text-xs text-slate-500">{type.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                              <Input
                                id="scheduledDate"
                                type="date"
                                {...maintenanceForm.register("scheduledDate")}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              {...maintenanceForm.register("description")}
                              placeholder="Describe the maintenance work needed..."
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="estimatedCost">Estimated Cost</Label>
                              <Input
                                id="estimatedCost"
                                type="number"
                                {...maintenanceForm.register("estimatedCost", { valueAsNumber: true })}
                                placeholder="0.00"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="provider">Service Provider</Label>
                              <Input
                                id="provider"
                                {...maintenanceForm.register("provider")}
                                placeholder="Service provider name"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                              id="notes"
                              {...maintenanceForm.register("notes")}
                              placeholder="Any additional notes or requirements..."
                              rows={2}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setScheduleDialogOpen(false);
                              maintenanceForm.reset();
                              setSelectedVehicles([]);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={scheduleMaintenanceMutation.isPending || selectedVehicles.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {scheduleMaintenanceMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Scheduling...
                              </>
                            ) : (
                              "Schedule Maintenance"
                            )}
                          </Button>
                        </div>
                      </form>
                    </FormProvider>
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
                    <Wrench className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">In Maintenance</p>
                    <p className="text-2xl font-bold">{overview?.stats.vehiclesInMaintenance || 0}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-slate-500">
                        {upcomingMaintenance?.length || 0} upcoming
                      </span>
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed This Month</p>
                    <p className="text-2xl font-bold">{overview?.stats.monthlyMaintenanceCost || 0}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-slate-500">cost</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Urgent Maintenance</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {upcomingMaintenance.filter(m => m.daysUntilDue <= 7).length}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-orange-600" />
                      <span className="text-slate-500">due soon</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Fleet Availability</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(((overview?.stats.activeVehicles || 0) / (overview?.stats.totalVehicles || 1)) * 100)}%
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-slate-500">vehicles available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Upcoming Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingMaintenance.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingMaintenance
                          .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
                          .map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`border rounded-lg p-4 ${getUrgencyColor(item.daysUntilDue)}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {item.vehicle.brand} {item.vehicle.model}
                                </h4>
                                <p className="text-sm text-slate-600">{item.vehicle.licensePlate}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={getMaintenanceTypeColor(item.maintenanceRecord.type)}>
                                    {item.maintenanceRecord.type}
                                  </Badge>
                                  <span className="text-sm text-slate-600">
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
                                {item.maintenanceRecord.estimatedCost && (
                                  <p className="text-xs text-slate-600 mt-1">
                                    ${item.maintenanceRecord.estimatedCost}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
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
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Vehicles Needing Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vehiclesNeedingAttention.length > 0 ? (
                      <div className="space-y-4">
                        {vehiclesNeedingAttention.map((vehicle) => (
                          <div key={vehicle.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">
                                  {vehicle.brand} {vehicle.model}
                                </h4>
                                <p className="text-sm text-slate-600">{vehicle.licensePlate}</p>
                                <div className="mt-2 space-y-1">
                                  {vehicle.upcomingMaintenance && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Wrench className="h-3 w-3 text-orange-600" />
                                      <span>Maintenance due soon</span>
                                    </div>
                                  )}
                                  {vehicle.expiringDocuments && vehicle.expiringDocuments > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <FileText className="h-3 w-3 text-orange-600" />
                                      <span>{vehicle.expiringDocuments} documents expiring</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Schedule
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>All vehicles are in good condition</p>
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
                      <CardTitle>Vehicle Maintenance Status</CardTitle>
                      <CardDescription>
                        Overview of maintenance status for all vehicles
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
                                  <Badge variant="outline">{vehicle.licensePlate}</Badge>
                                  <Badge className={
                                    vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                    vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {vehicle.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                  <span>{vehicle.year}</span>
                                  <span>•</span>
                                  <span className="capitalize">{vehicle.type}</span>
                                  {vehicle.lastMaintenanceDate && (
                                    <>
                                      <span>•</span>
                                      <span>Last maintenance: {new Date(vehicle.lastMaintenanceDate).toLocaleDateString()}</span>
                                    </>
                                  )}
                                </div>
                                {vehicle.nextMaintenanceDate && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Wrench className="h-3 w-3 text-orange-600" />
                                    <span className="text-sm">
                                      Next maintenance: {new Date(vehicle.nextMaintenanceDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {vehicle.upcomingMaintenance && (
                                <Badge variant="outline" className="text-orange-600">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Maintenance Due
                                </Badge>
                              )}
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-1" />
                                Schedule
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
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
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your filters"
                          : "No vehicles in your fleet yet"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                  <CardDescription>
                    View past maintenance records and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Maintenance History</h3>
                    <p className="text-sm mb-4">View completed maintenance records and costs</p>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Maintenance Alerts
                  </CardTitle>
                  <CardDescription>
                    System-generated alerts for maintenance and vehicle issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {alerts.length > 0 ? (
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <Alert key={alert.id} className={
                          alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                          alert.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                          'border-blue-200 bg-blue-50'
                        }>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="font-medium">{alert.title}</div>
                            <div className="text-sm mt-1">{alert.description}</div>
                            <div className="flex items-center gap-2 mt-2 text-xs">
                              <span>Vehicle: {alert.affectedEntity.name}</span>
                              {alert.dueDate && (
                                <>
                                  <span>•</span>
                                  <span>Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No active alerts</h3>
                      <p className="text-sm">All systems are operating normally</p>
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