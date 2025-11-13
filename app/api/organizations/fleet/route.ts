import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createGoBackendClient } from '@/lib/api/go-backend-client';

// Query parameters schema for fleet endpoint
const FleetQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  vehicleStatus: z.enum(['active', 'maintenance', 'inactive']).optional(),
  driverStatus: z.enum(['active', 'inactive', 'on_trip']).optional(),
  sortBy: z.enum(['name', 'status', 'utilization', 'revenue']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Get current user from session/token
const getCurrentUser = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  if (!token) return null;

  return {
    id: token.sub || 'user-123',
    email: token.email || 'admin@testlogisticscompany.com',
    role: token.role || 'organization_admin',
    organizationId: token.organizationId || 'org-123',
  };
};

// Check if user has organization access
const hasOrganizationAccess = (user: any) => {
  return user && (
    user.role === 'organization_admin' ||
    user.role === 'organization_driver'
  );
};

// Mock fleet data
const mockFleetData = {
  overview: {
    totalVehicles: 10,
    activeVehicles: 8,
    vehiclesInMaintenance: 1,
    inactiveVehicles: 1,
    totalDrivers: 15,
    activeDrivers: 12,
    driversOnTrip: 8,
    availableDrivers: 4,
    totalTrips: 100,
    completedTrips: 95,
    activeTrips: 3,
    scheduledTrips: 2,
    averageUtilization: 75,
    totalRevenue: 150000,
    monthlyRevenue: 25000,
    averageTripRevenue: 1500,
    maintenanceCosts: 5000,
    fuelCosts: 12000,
    insuranceCosts: 3000,
  },
  vehicles: [
    {
      id: 'veh-1',
      type: 'truck',
      brand: 'Mercedes-Benz',
      model: 'Actros 1845',
      licensePlate: '1234-A-56',
      year: 2022,
      capacityWeightMin: 1000,
      capacityWeightMax: 25000,
      capacityVolumeMin: 10,
      capacityVolumeMax: 50,
      status: 'active',
      isAvailable: true,
      currentDriverId: 'driver-1',
      location: 'Casablanca',
      lastMaintenance: '2024-01-01T00:00:00Z',
      nextMaintenance: '2024-04-01T00:00:00Z',
      totalTrips: 25,
      totalDistance: 15000,
      averageFuelEfficiency: 8.5,
      maintenanceCost: 500,
      monthlyRevenue: 3500,
      utilization: 85,
      documents: {
        insurance: { status: 'valid', expiry: '2024-12-31' },
        registration: { status: 'valid', expiry: '2025-01-15' },
      },
    },
    {
      id: 'veh-2',
      type: 'van',
      brand: 'Ford',
      model: 'Transit',
      licensePlate: '5678-B-78',
      year: 2021,
      capacityWeightMin: 500,
      capacityWeightMax: 3500,
      capacityVolumeMin: 8,
      capacityVolumeMax: 25,
      status: 'active',
      isAvailable: false,
      currentDriverId: 'driver-2',
      location: 'Rabat',
      lastMaintenance: '2024-01-10T00:00:00Z',
      nextMaintenance: '2024-04-10T00:00:00Z',
      totalTrips: 18,
      totalDistance: 8500,
      averageFuelEfficiency: 12.0,
      maintenanceCost: 300,
      monthlyRevenue: 2200,
      utilization: 70,
      documents: {
        insurance: { status: 'valid', expiry: '2024-11-30' },
        registration: { status: 'valid', expiry: '2024-12-20' },
      },
    },
    {
      id: 'veh-3',
      type: 'truck',
      brand: 'Volvo',
      model: 'FH16',
      licensePlate: '9012-C-90',
      year: 2020,
      capacityWeightMin: 1500,
      capacityWeightMax: 30000,
      capacityVolumeMin: 15,
      capacityVolumeMax: 60,
      status: 'maintenance',
      isAvailable: false,
      currentDriverId: null,
      location: 'Workshop - Casablanca',
      lastMaintenance: '2024-01-20T00:00:00Z',
      nextMaintenance: '2024-02-15T00:00:00Z',
      totalTrips: 32,
      totalDistance: 22000,
      averageFuelEfficiency: 7.8,
      maintenanceCost: 1200,
      monthlyRevenue: 0,
      utilization: 0,
      documents: {
        insurance: { status: 'expiring', expiry: '2024-02-01' },
        registration: { status: 'valid', expiry: '2025-03-15' },
      },
    },
  ],
  drivers: [
    {
      id: 'driver-1',
      name: 'Mohammed Ali',
      email: 'mohammed.ali@testlogistics.com',
      phone: '+212600123456',
      status: 'active',
      isAvailable: false,
      currentVehicleId: 'veh-1',
      location: 'On route: Casablanca to Marrakech',
      totalTrips: 45,
      totalDistance: 25000,
      averageRating: 4.8,
      onTimePercentage: 95,
      monthlyTrips: 8,
      lastActiveAt: '2024-01-25T14:30:00Z',
      earnings: {
        monthly: 3500,
        total: 42000,
        averagePerTrip: 933,
      },
      documents: {
        license: { status: 'valid', expiry: '2025-06-30' },
        background: { status: 'cleared', date: '2023-12-01' },
      },
    },
    {
      id: 'driver-2',
      name: 'Fatima Zahra',
      email: 'fatima.zahra@testlogistics.com',
      phone: '+212600789012',
      status: 'active',
      isAvailable: false,
      currentVehicleId: 'veh-2',
      location: 'Delivering in Rabat area',
      totalTrips: 32,
      totalDistance: 18000,
      averageRating: 4.9,
      onTimePercentage: 98,
      monthlyTrips: 6,
      lastActiveAt: '2024-01-25T10:15:00Z',
      earnings: {
        monthly: 2800,
        total: 33600,
        averagePerTrip: 1050,
      },
      documents: {
        license: { status: 'valid', expiry: '2024-12-15' },
        background: { status: 'cleared', date: '2023-11-15' },
      },
    },
    {
      id: 'driver-3',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@testlogistics.com',
      phone: '+212600345678',
      status: 'active',
      isAvailable: true,
      currentVehicleId: null,
      location: 'Base - Casablanca',
      totalTrips: 28,
      totalDistance: 15000,
      averageRating: 4.7,
      onTimePercentage: 92,
      monthlyTrips: 5,
      lastActiveAt: '2024-01-25T09:00:00Z',
      earnings: {
        monthly: 2500,
        total: 30000,
        averagePerTrip: 893,
      },
      documents: {
        license: { status: 'valid', expiry: '2025-03-20' },
        background: { status: 'cleared', date: '2024-01-10' },
      },
    },
  ],
  alerts: [
    {
      id: 'alert-1',
      type: 'maintenance_due',
      severity: 'warning',
      title: 'Vehicle Maintenance Due',
      message: 'Volvo FH16 (9012-C-90) requires maintenance by February 15th',
      vehicleId: 'veh-3',
      actionRequired: true,
      createdAt: '2024-01-20T00:00:00Z',
    },
    {
      id: 'alert-2',
      type: 'document_expiry',
      severity: 'error',
      title: 'Insurance Expiring Soon',
      message: 'Vehicle insurance for Volvo FH16 expires on February 1st',
      vehicleId: 'veh-3',
      actionRequired: true,
      createdAt: '2024-01-22T00:00:00Z',
    },
    {
      id: 'alert-3',
      type: 'driver_performance',
      severity: 'info',
      title: 'Driver Performance Update',
      message: 'Mohammed Ali achieved 98% on-time performance this week',
      driverId: 'driver-1',
      actionRequired: false,
      createdAt: '2024-01-25T00:00:00Z',
    },
  ],
  analytics: {
    utilization: {
      vehicle: {
        current: 75,
        lastMonth: 72,
        change: 4.2,
        target: 85,
      },
      driver: {
        current: 80,
        lastMonth: 78,
        change: 2.6,
        target: 90,
      },
    },
    performance: {
      onTimeDelivery: {
        current: 94,
        lastMonth: 92,
        change: 2.2,
        target: 95,
      },
      fuelEfficiency: {
        current: 9.2,
        lastMonth: 8.8,
        change: 4.5,
        target: 10,
      },
    },
    financial: {
      revenue: {
        current: 25000,
        lastMonth: 23000,
        change: 8.7,
        target: 30000,
      },
      costs: {
        current: 8000,
        lastMonth: 7500,
        change: 6.7,
        target: 7000,
      },
    },
  },
};

/**
 * GET /api/organizations/fleet
 * Fetch fleet overview and analytics from Go backend
 */
export async function GET(request: NextRequest) {
  try {
    // Get NextAuth session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }

    // Check if user has organization access
    if (!hasOrganizationAccess(session.user)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Organization access required'
          }
        },
        { status: 403 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryResult = FleetQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!queryResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: 'Invalid query parameters',
            details: queryResult.error.errors
          }
        },
        { status: 400 }
      );
    }

      const { page, limit, vehicleStatus, driverStatus, sortBy, sortOrder } = queryResult.data;

    // For this demo, we'll use a mock organization ID
    const organizationId = session.user.organizationId || 'org-123';

    // Create Go backend client
    const goClient = createGoBackendClient({
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role || 'customer'
      },
      organizationId
    });

    // Fetch vehicles from Go backend
    const vehiclesResult = await goClient.getOrganizationVehicles(organizationId);

    // Since Go backend doesn't provide a direct fleet endpoint, we'll aggregate data
    let vehicles = vehiclesResult.success ? (vehiclesResult.data || []) : [];
    let drivers = []; // Go backend doesn't provide driver endpoint in this version

    // Filter vehicles based on status (map to Go backend status)
    if (vehicleStatus) {
      const goStatus = vehicleStatus === 'active' ? 'active' :
                     vehicleStatus === 'maintenance' ? 'maintenance' : 'inactive';
      vehicles = vehicles.filter(v => v.status === goStatus);
    }

    // Apply sorting (convert field names to match Go backend data)
    const sortVehicles = (vehicles: any[]) => {
      return vehicles.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case 'name':
            aValue = `${a.brand || ''} ${a.model || ''}`.trim();
            bValue = `${b.brand || ''} ${b.model || ''}`.trim();
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'utilization':
            aValue = a.utilizationRate || 0;
            bValue = b.utilizationRate || 0;
            break;
          case 'revenue':
            aValue = a.stats?.monthlyRevenue || 0;
            bValue = b.stats?.monthlyRevenue || 0;
            break;
          default:
            aValue = a.id;
            bValue = b.id;
        }

        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    };

    // Apply pagination
    const vehicleOffset = (page - 1) * limit;
    const driverOffset = (page - 1) * limit;

    const paginatedVehicles = sortVehicles(vehicles).slice(vehicleOffset, vehicleOffset + limit);
    const paginatedDrivers = drivers.slice(driverOffset, driverOffset + limit);

    // Calculate pagination info
    const vehiclePagination = {
      currentPage: page,
      totalPages: Math.ceil(vehicles.length / limit),
      totalItems: vehicles.length,
      itemsPerPage: limit,
      hasNextPage: vehicleOffset + limit < vehicles.length,
      hasPreviousPage: page > 1,
    };

    const driverPagination = {
      currentPage: page,
      totalPages: Math.ceil(drivers.length / limit),
      totalItems: drivers.length,
      itemsPerPage: limit,
      hasNextPage: driverOffset + limit < drivers.length,
      hasPreviousPage: page > 1,
    };

    // Calculate overview statistics from vehicles
    const overview = {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      vehiclesInMaintenance: vehicles.filter(v => v.status === 'maintenance').length,
      inactiveVehicles: vehicles.filter(v => v.status === 'inactive').length,
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === 'active').length,
      driversOnTrip: drivers.filter(d => d.status === 'on_trip').length,
      availableDrivers: drivers.filter(d => d.status === 'active' && !d.currentTripId).length,
      totalTrips: vehicles.reduce((sum, v) => sum + (v._count?.trips || 0), 0),
      completedTrips: Math.floor(vehicles.reduce((sum, v) => sum + (v._count?.trips || 0), 0) * 0.95), // Estimate
      activeTrips: vehicles.filter(v => v.status === 'active').length,
      scheduledTrips: vehicles.filter(v => v.isAvailable === false && v.status === 'active').length,
      averageRating: 4.8, // Mock since Go backend doesn't provide this
      totalRevenue: vehicles.reduce((sum, v) => sum + (v.stats?.monthlyRevenue || 0), 0),
      monthlyRevenue: vehicles.reduce((sum, v) => sum + (v.stats?.monthlyRevenue || 0), 0),
      maintenanceCosts: vehicles.reduce((sum, v) => sum + (v.stats?.maintenanceCosts || 0), 0),
      fuelCosts: 12000, // Mock since Go backend doesn't provide this
      insuranceCosts: 3000, // Mock since Go backend doesn't provide this
    };

    return NextResponse.json({
      success: true,
      data: {
        overview,
        vehicles: paginatedVehicles,
        drivers: paginatedDrivers,
        alerts: mockFleetData.alerts, // Keep mock alerts for now
        analytics: mockFleetData.analytics, // Keep mock analytics for now
        pagination: {
          vehicles: vehiclePagination,
          drivers: driverPagination,
        },
        filters: {
          applied: {
            vehicleStatus,
            driverStatus,
            sortBy,
            sortOrder,
          },
          available: {
            vehicleStatus: ['active', 'maintenance', 'inactive'],
            driverStatus: ['active', 'inactive', 'on_trip'],
            sortBy: ['name', 'status', 'utilization', 'revenue'],
            sortOrder: ['asc', 'desc'],
          },
        },
      },
    });

  } catch (error) {
    console.error('Get fleet data error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch fleet data',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations/fleet
 * Create fleet analytics report or perform bulk operations
 */
export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      );
    }

    // Only organization admins can perform fleet operations
    if (user.role !== 'organization_admin') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Organization admin privileges required'
          }
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'generate_report':
        return await generateFleetReport(data);
      case 'bulk_maintenance':
        return await scheduleBulkMaintenance(data);
      case 'optimize_routes':
        return await optimizeRoutes(data);
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: 'Invalid fleet action specified'
            }
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Fleet operation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'OPERATION_FAILED',
          message: 'Failed to perform fleet operation',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}

// Helper functions for different fleet operations
async function generateFleetReport(data: any) {
  const { reportType, dateRange, filters } = data;

  // Simulate report generation
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    success: true,
    data: {
      reportId: generateId(),
      type: reportType,
      generatedAt: new Date().toISOString(),
      downloadUrl: `/api/fleet/reports/${generateId()}/download`,
      summary: {
        totalRevenue: 150000,
        totalCosts: 20000,
        profitMargin: 86.7,
        totalTrips: 100,
        averageUtilization: 75,
      },
    },
    message: 'Fleet report generated successfully',
  });
}

async function scheduleBulkMaintenance(data: any) {
  const { vehicleIds, maintenanceType, scheduledDate } = data;

  // Simulate bulk maintenance scheduling
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    data: {
      scheduledVehicles: vehicleIds.length,
      maintenanceType,
      scheduledDate,
      estimatedCost: vehicleIds.length * 800,
      estimatedDuration: vehicleIds.length * 2, // hours
    },
    message: 'Bulk maintenance scheduled successfully',
  });
}

async function optimizeRoutes(data: any) {
  const { tripIds, optimizationType } = data;

  // Simulate route optimization
  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json({
    success: true,
    data: {
      optimizedTrips: tripIds.length,
      fuelSavings: 12.5,
      timeSavings: 8.3,
      optimizationType,
      recommendations: [
        'Combine trips ID-001 and ID-003 for better efficiency',
        'Adjust departure time for trip ID-002 to avoid traffic',
        'Use alternative route for trip ID-005 to reduce distance',
      ],
    },
    message: 'Route optimization completed successfully',
  });
}

// Helper function to generate IDs
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}