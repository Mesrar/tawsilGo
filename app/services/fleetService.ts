import { apiClient, ApiResponse } from "@/lib/api/api-client";
import {
  OrganizationVehicle,
  FleetSearchParams,
  VehicleAvailability,
  MaintenanceRecord,
  VehicleAnalytics,
} from "@/types/vehicle";
import {
  OrganizationDriver,
  OrganizationStats,
  OrganizationTrip,
} from "@/types/organization";

/**
 * Service to manage fleet operations for organizations
 * Provides comprehensive fleet management and analytics
 */
export const fleetService = {
  /**
   * Get organization fleet overview
   */
  async getFleetOverview(
    params?: {
      page?: number;
      limit?: number;
      vehicleStatus?: string;
      driverStatus?: string;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<ApiResponse<{
    overview: {
      totalVehicles: number;
      activeVehicles: number;
      vehiclesInMaintenance: number;
      inactiveVehicles: number;
      totalDrivers: number;
      activeDrivers: number;
      driversOnTrip: number;
      availableDrivers: number;
      totalTrips: number;
      completedTrips: number;
      activeTrips: number;
      scheduledTrips: number;
      averageUtilization: number;
      totalRevenue: number;
      monthlyRevenue: number;
      maintenanceCosts: number;
      fuelCosts: number;
      insuranceCosts: number;
    };
    vehicles: OrganizationVehicle[];
    drivers: any[];
    alerts: any[];
    analytics: any;
    pagination: {
      vehicles: any;
      drivers: any;
    };
    filters: {
      applied: any;
      available: any;
    };
  }>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<{
      overview: {
        totalVehicles: number;
        activeVehicles: number;
        vehiclesInMaintenance: number;
        inactiveVehicles: number;
        totalDrivers: number;
        activeDrivers: number;
        driversOnTrip: number;
        availableDrivers: number;
        totalTrips: number;
        completedTrips: number;
        activeTrips: number;
        scheduledTrips: number;
        averageUtilization: number;
        totalRevenue: number;
        monthlyRevenue: number;
        maintenanceCosts: number;
        fuelCosts: number;
        insuranceCosts: number;
      };
      vehicles: OrganizationVehicle[];
      drivers: any[];
      alerts: any[];
      analytics: any;
      pagination: {
        vehicles: any;
        drivers: any;
      };
      filters: {
        applied: any;
        available: any;
      };
    }>(`/api/organizations/fleet?${queryParams.toString()}`);
  },

  /**
   * Get fleet vehicles with detailed information
   */
  async getFleetVehicles(
    params: FleetSearchParams & {
      includeAnalytics?: boolean;
      includeMaintenance?: boolean;
      includeDocuments?: boolean;
    }
  ): Promise<ApiResponse<{
    vehicles: Array<OrganizationVehicle & {
      analytics?: VehicleAnalytics;
      upcomingMaintenance?: MaintenanceRecord;
      expiringDocuments?: number;
      currentTrip?: OrganizationTrip;
      driver?: OrganizationDriver;
    }>;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    summary: {
      totalVehicles: number;
      activeVehicles: number;
      averageUtilization: number;
      totalValue: number;
    };
  }>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    return apiClient.get<{
      vehicles: Array<OrganizationVehicle & {
        analytics?: VehicleAnalytics;
        upcomingMaintenance?: MaintenanceRecord;
        expiringDocuments?: number;
        currentTrip?: OrganizationTrip;
        driver?: OrganizationDriver;
      }>;
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
      summary: {
        totalVehicles: number;
        activeVehicles: number;
        averageUtilization: number;
        totalValue: number;
      };
    }>(`/api/fleet/current/vehicles?${queryParams.toString()}`);
  },

  /**
   * Get fleet drivers with their current assignments
   */
  async getFleetDrivers(
    params?: {
      status?: OrganizationDriver['status'];
      vehicleId?: string;
      includePerformance?: boolean;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<{
    drivers: Array<OrganizationDriver & {
      currentVehicle?: OrganizationVehicle;
      currentTrip?: OrganizationTrip;
      performance?: {
        completedTrips: number;
        averageRating: number;
        onTimePerformance: number;
        efficiency: number;
        totalRevenue: number;
      };
    }>;
    total: number;
    page: number;
    limit: number;
    summary: {
      totalDrivers: number;
      activeDrivers: number;
      driversOnTrip: number;
      averageRating: number;
    };
  }>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<{
      drivers: Array<OrganizationDriver & {
        currentVehicle?: OrganizationVehicle;
        currentTrip?: OrganizationTrip;
        performance?: {
          completedTrips: number;
          averageRating: number;
          onTimePerformance: number;
          efficiency: number;
          totalRevenue: number;
        };
      }>;
      total: number;
      page: number;
      limit: number;
      summary: {
        totalDrivers: number;
        activeDrivers: number;
        driversOnTrip: number;
        averageRating: number;
      };
    }>(`/api/fleet/current/drivers?${queryParams.toString()}`);
  },

  /**
   * Add vehicle to fleet
   */
  async addVehicleToFleet(
    data: {
      type: OrganizationVehicle['type'];
      brand: string;
      model: string;
      year: number;
      licensePlate: string;
      color?: string;
      capacity: OrganizationVehicle['capacity'];
      features: string[];
      purchaseDate?: string;
      purchasePrice?: number;
      insuranceProvider?: string;
      policyNumber?: string;
    }
  ): Promise<ApiResponse<{ vehicle: OrganizationVehicle; message: string }>> {
    return apiClient.post<{ vehicle: OrganizationVehicle; message: string }>(
      "/api/fleet/current/vehicles",
      data
    );
  },

  /**
   * Bulk add vehicles to fleet
   */
  async bulkAddVehicles(
    vehicles: Array<{
      type: OrganizationVehicle['type'];
      brand: string;
      model: string;
      year: number;
      licensePlate: string;
      capacity: OrganizationVehicle['capacity'];
      features: string[];
    }>
  ): Promise<ApiResponse<{
    successful: Array<{ vehicle: OrganizationVehicle; index: number }>;
    failed: Array<{ index: number; error: string; data: any }>;
    message: string;
  }>> {
    return apiClient.post<{
      successful: Array<{ vehicle: OrganizationVehicle; index: number }>;
      failed: Array<{ index: number; error: string; data: any }>;
      message: string;
    }>("/api/fleet/current/vehicles/bulk", { vehicles });
  },

  /**
   * Assign driver to vehicle
   */
  async assignDriverToVehicle(
    vehicleId: string,
    driverId: string,
    assignmentType: 'permanent' | 'temporary' = 'permanent',
    temporaryUntil?: string
  ): Promise<ApiResponse<{
    vehicle: OrganizationVehicle;
    driver: OrganizationDriver;
    message: string;
  }>> {
    return apiClient.post<{
      vehicle: OrganizationVehicle;
      driver: OrganizationDriver;
      message: string;
    }>(`/api/fleet/current/vehicles/${vehicleId}/assign-driver`, {
      driverId,
      assignmentType,
      temporaryUntil,
    });
  },

  /**
   * Unassign driver from vehicle
   */
  async unassignDriverFromVehicle(
    vehicleId: string,
    reason?: string
  ): Promise<ApiResponse<{
    vehicle: OrganizationVehicle;
    driver: OrganizationDriver;
    message: string;
  }>> {
    return apiClient.post<{
      vehicle: OrganizationVehicle;
      driver: OrganizationDriver;
      message: string;
    }>(`/api/fleet/current/vehicles/${vehicleId}/unassign-driver`, { reason });
  },

  /**
   * Get fleet utilization report
   */
  async getFleetUtilizationReport(
    period: {
      start: string;
      end: string;
    },
    groupBy?: 'vehicle' | 'driver' | 'day' | 'week' | 'month'
  ): Promise<ApiResponse<{
    summary: {
      totalVehicles: number;
      activeVehicles: number;
      averageUtilization: number;
      totalRevenue: number;
      totalDistance: number;
      totalOperatingHours: number;
    };
    utilizationData: Array<{
      period: string;
      utilization: number;
      revenue: number;
      distance: number;
      activeVehicles: number;
    }>;
    topPerformers: Array<{
      id: string;
      name: string;
      type: 'vehicle' | 'driver';
      utilization: number;
      revenue: number;
      rating?: number;
    }>;
    underperformers: Array<{
      id: string;
      name: string;
      type: 'vehicle' | 'driver';
      utilization: number;
      issues: string[];
    }>;
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('start', period.start);
    queryParams.append('end', period.end);
    if (groupBy) {
      queryParams.append('groupBy', groupBy);
    }

    return apiClient.get<{
      summary: {
        totalVehicles: number;
        activeVehicles: number;
        averageUtilization: number;
        totalRevenue: number;
        totalDistance: number;
        totalOperatingHours: number;
      };
      utilizationData: Array<{
        period: string;
        utilization: number;
        revenue: number;
        distance: number;
        activeVehicles: number;
      }>;
      topPerformers: Array<{
        id: string;
        name: string;
        type: 'vehicle' | 'driver';
        utilization: number;
        revenue: number;
        rating?: number;
      }>;
      underperformers: Array<{
        id: string;
        name: string;
        type: 'vehicle' | 'driver';
        utilization: number;
        issues: string[];
      }>;
    }>(`/api/fleet/current/utilization?${queryParams.toString()}`);
  },

  /**
   * Get fleet cost analysis
   */
  async getFleetCostAnalysis(
    period: {
      start: string;
      end: string;
    }
  ): Promise<ApiResponse<{
    totalCosts: {
      maintenance: number;
      fuel: number;
      insurance: number;
      depreciation: number;
      other: number;
      total: number;
    };
    costsByVehicle: Array<{
      vehicle: OrganizationVehicle;
      totalCost: number;
      maintenanceCost: number;
      fuelCost: number;
      costPerKm: number;
      costPerHour: number;
      revenue: number;
      profit: number;
    }>;
    costTrends: Array<{
      period: string;
      maintenanceCost: number;
      fuelCost: number;
      totalCost: number;
      revenue: number;
    }>;
    recommendations: Array<{
      type: 'maintenance' | 'replacement' | 'utilization';
      vehicleId: string;
      description: string;
      potentialSavings: number;
      priority: 'high' | 'medium' | 'low';
    }>;
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('start', period.start);
    queryParams.append('end', period.end);

    return apiClient.get<{
      totalCosts: {
        maintenance: number;
        fuel: number;
        insurance: number;
        depreciation: number;
        other: number;
        total: number;
      };
      costsByVehicle: Array<{
        vehicle: OrganizationVehicle;
        totalCost: number;
        maintenanceCost: number;
        fuelCost: number;
        costPerKm: number;
        costPerHour: number;
        revenue: number;
        profit: number;
      }>;
      costTrends: Array<{
        period: string;
        maintenanceCost: number;
        fuelCost: number;
        totalCost: number;
        revenue: number;
      }>;
      recommendations: Array<{
        type: 'maintenance' | 'replacement' | 'utilization';
        vehicleId: string;
        description: string;
        potentialSavings: number;
        priority: 'high' | 'medium' | 'low';
      }>;
    }>(`/api/fleet/current/cost-analysis?${queryParams.toString()}`);
  },

  /**
   * Schedule fleet maintenance
   */
  async scheduleFleetMaintenance(
    data: {
      vehicleIds: string[];
      maintenanceType: MaintenanceRecord['type'];
      description: string;
      scheduledDate: string;
      estimatedCost?: number;
      notes?: string;
      provider?: string;
    }
  ): Promise<ApiResponse<{
    scheduledMaintenance: Array<{
      vehicle: OrganizationVehicle;
      maintenanceRecord: MaintenanceRecord;
    }>;
    conflicts: Array<{
      vehicleId: string;
      conflict: string;
      suggestedAlternative?: string;
    }>;
    message: string;
  }>> {
    return apiClient.post<{
      scheduledMaintenance: Array<{
        vehicle: OrganizationVehicle;
        maintenanceRecord: MaintenanceRecord;
      }>;
      conflicts: Array<{
        vehicleId: string;
        conflict: string;
        suggestedAlternative?: string;
      }>;
      message: string;
    }>("/api/fleet/current/maintenance/schedule-bulk", data);
  },

  /**
   * Get fleet maintenance schedule
   */
  async getFleetMaintenanceSchedule(
    period: {
      start: string;
      end: string;
    },
    status?: 'scheduled' | 'overdue' | 'completed' | 'all'
  ): Promise<ApiResponse<{
    schedule: Array<{
      vehicle: OrganizationVehicle;
      maintenanceRecords: MaintenanceRecord[];
      conflicts: Array<{
        type: 'time_conflict' | 'vehicle_unavailable';
        details: string;
      }>;
    }>;
    summary: {
      totalScheduled: number;
      totalOverdue: number;
      estimatedCost: number;
      vehiclesAffected: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    queryParams.append('start', period.start);
    queryParams.append('end', period.end);
    if (status) {
      queryParams.append('status', status);
    }

    return apiClient.get<{
      schedule: Array<{
        vehicle: OrganizationVehicle;
        maintenanceRecords: MaintenanceRecord[];
        conflicts: Array<{
          type: 'time_conflict' | 'vehicle_unavailable';
          details: string;
        }>;
      }>;
      summary: {
        totalScheduled: number;
        totalOverdue: number;
        estimatedCost: number;
        vehiclesAffected: number;
      };
    }>(`/api/fleet/current/maintenance/schedule?${queryParams.toString()}`);
  },

  /**
   * Optimize fleet assignments
   */
  async optimizeFleetAssignments(
    constraints: {
      maxHoursPerDriver?: number;
      maxVehiclesPerDriver?: number;
      vehiclePreferences?: Array<{
        driverId: string;
        preferredVehicleTypes: string[];
        avoidedVehicleTypes: string[];
      }>;
      availabilityConstraints?: Array<{
        vehicleId: string;
        unavailablePeriods: Array<{
          start: string;
          end: string;
          reason: string;
        }>;
      }>;
    }
  ): Promise<ApiResponse<{
    recommendations: Array<{
      type: 'assignment' | 'reassignment' | 'maintenance' | 'utilization';
      description: string;
      impact: {
        efficiency: number;
        cost: number;
        satisfaction: number;
      };
      implementation: {
        steps: string[];
        estimatedTime: string;
        requirements: string[];
      };
    }>;
    summary: {
      expectedImprovement: number;
      totalSavings: number;
      implementationComplexity: 'low' | 'medium' | 'high';
    };
  }>> {
    return apiClient.post<{
      recommendations: Array<{
        type: 'assignment' | 'reassignment' | 'maintenance' | 'utilization';
        description: string;
        impact: {
          efficiency: number;
          cost: number;
          satisfaction: number;
        };
        implementation: {
          steps: string[];
          estimatedTime: string;
          requirements: string[];
        };
      }>;
      summary: {
        expectedImprovement: number;
        totalSavings: number;
        implementationComplexity: 'low' | 'medium' | 'high';
      };
    }>("/api/fleet/current/optimize", constraints);
  },

  /**
   * Get fleet alerts and notifications
   */
  async getFleetAlerts(
    severity?: 'low' | 'medium' | 'high' | 'critical',
    type?: 'maintenance' | 'documents' | 'performance' | 'utilization' | 'safety'
  ): Promise<ApiResponse<{
    alerts: Array<{
      id: string;
      type: 'maintenance' | 'documents' | 'performance' | 'utilization' | 'safety';
      severity: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      affectedEntity: {
        type: 'vehicle' | 'driver';
        id: string;
        name: string;
      };
      actionRequired: boolean;
      dueDate?: string;
      recommendations: string[];
      createdAt: string;
    }>;
    summary: {
      total: number;
      bySeverity: Record<string, number>;
      byType: Record<string, number>;
      actionRequired: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (severity) queryParams.append('severity', severity);
    if (type) queryParams.append('type', type);

    return apiClient.get<{
      alerts: Array<{
        id: string;
        type: 'maintenance' | 'documents' | 'performance' | 'utilization' | 'safety';
        severity: 'low' | 'medium' | 'high' | 'critical';
        title: string;
        description: string;
        affectedEntity: {
          type: 'vehicle' | 'driver';
          id: string;
          name: string;
        };
        actionRequired: boolean;
        dueDate?: string;
        recommendations: string[];
        createdAt: string;
      }>;
      summary: {
        total: number;
        bySeverity: Record<string, number>;
        byType: Record<string, number>;
        actionRequired: number;
      };
    }>(`/api/fleet/current/alerts?${queryParams.toString()}`);
  },

  /**
   * Export fleet data
   */
  async exportFleetData(
    format: 'csv' | 'excel' | 'pdf',
    data: {
      includeVehicles: boolean;
      includeDrivers: boolean;
      includeMaintenance: boolean;
      includeAnalytics: boolean;
      dateRange?: {
        start: string;
        end: string;
      };
    }
  ): Promise<Blob> {
    const response = await apiClient.fetch(`/api/fleet/current/export?format=${format}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to export fleet data');
    }

    return response.blob();
  },
};