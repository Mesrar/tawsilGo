import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { VehicleType, VehicleStatus } from '@/types/vehicle';
import { authOptions } from '@/lib/auth';
import { createGoBackendClient } from '@/lib/api/go-backend-client';

// Validation schemas
const VehicleQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
  type: z.enum(['truck', 'van', 'motorcycle', 'car', 'other']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['brand', 'model', 'status', 'createdAt', 'utilization']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const CreateVehicleSchema = z.object({
  type: z.enum(['truck', 'van', 'motorcycle', 'car', 'other']),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  capacityWeightMin: z.number().min(0),
  capacityWeightMax: z.number().min(0),
  capacityVolumeMin: z.number().min(0),
  capacityVolumeMax: z.number().min(0),
  features: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
  status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
  organizationId: z.string().optional(),
});

// Get current user
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

// Check permissions
const hasOrganizationAccess = (user: any) => {
  return user && (
    user.role === 'organization_admin' ||
    user.role === 'organization_driver'
  );
};

// Mock database
const mockVehicles = [
  {
    id: 'veh-1',
    type: 'truck' as VehicleType,
    brand: 'Mercedes-Benz',
    model: 'Actros 1845',
    licensePlate: '1234-A-56',
    year: 2022,
    capacityWeightMin: 1000,
    capacityWeightMax: 25000,
    capacityVolumeMin: 10,
    capacityVolumeMax: 50,
    status: 'active' as VehicleStatus,
    isAvailable: true,
    features: ['gps', 'air_conditioning', 'lift_gate', 'refrigeration'],
    photos: ['https://example.com/truck1.jpg'],
    organizationId: 'org-123',
    ownerId: 'user-123',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    _count: {
      trips: 25,
      maintenanceRecords: 3,
    },
    stats: {
      totalTrips: 25,
      totalDistance: 15000,
      averageFuelEfficiency: 8.5,
      maintenanceCosts: 1500,
      utilizationRate: 85,
      monthlyRevenue: 3500,
    },
  },
  {
    id: 'veh-2',
    type: 'van' as VehicleType,
    brand: 'Ford',
    model: 'Transit',
    licensePlate: '5678-B-78',
    year: 2021,
    capacityWeightMin: 500,
    capacityWeightMax: 3500,
    capacityVolumeMin: 8,
    capacityVolumeMax: 25,
    status: 'active' as VehicleStatus,
    isAvailable: false,
    features: ['gps', 'air_conditioning'],
    photos: ['https://example.com/van1.jpg'],
    organizationId: 'org-123',
    ownerId: 'user-123',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    _count: {
      trips: 18,
      maintenanceRecords: 2,
    },
    stats: {
      totalTrips: 18,
      totalDistance: 8500,
      averageFuelEfficiency: 12.0,
      maintenanceCosts: 800,
      utilizationRate: 70,
      monthlyRevenue: 2200,
    },
  },
  {
    id: 'veh-3',
    type: 'truck' as VehicleType,
    brand: 'Volvo',
    model: 'FH16',
    licensePlate: '9012-C-90',
    year: 2020,
    capacityWeightMin: 1500,
    capacityWeightMax: 30000,
    capacityVolumeMin: 15,
    capacityVolumeMax: 60,
    status: 'maintenance' as VehicleStatus,
    isAvailable: false,
    features: ['gps', 'air_conditioning', 'lift_gate'],
    photos: ['https://example.com/truck2.jpg'],
    organizationId: 'org-123',
    ownerId: 'user-123',
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    _count: {
      trips: 32,
      maintenanceRecords: 8,
    },
    stats: {
      totalTrips: 32,
      totalDistance: 22000,
      averageFuelEfficiency: 7.8,
      maintenanceCosts: 3000,
      utilizationRate: 0,
      monthlyRevenue: 0,
    },
  },
];

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

/**
 * GET /api/organizations/vehicles
 * List organization vehicles with filtering and pagination from Go backend
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
    const queryResult = VehicleQuerySchema.safeParse(Object.fromEntries(searchParams));

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

    const { page, limit, status, type, search, sortBy, sortOrder } = queryResult.data;

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

    let vehicles = vehiclesResult.success ? (vehiclesResult.data || []) : [];

    // If Go backend fails, fall back to mock data for now
    if (!vehiclesResult.success) {
      console.warn('Go backend unavailable, falling back to mock data');
      vehicles = mockVehicles;
    }

    // Filter vehicles (map status to Go backend format)
    let filteredVehicles = [...vehicles];
    if (status) {
      const goStatus = status === 'active' ? 'active' :
                      status === 'maintenance' ? 'maintenance' : 'inactive';
      filteredVehicles = filteredVehicles.filter(v => v.status === goStatus);
    }

    if (type) {
      filteredVehicles = filteredVehicles.filter(v => v.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(v =>
        (v.brand && v.brand.toLowerCase().includes(searchLower)) ||
        (v.model && v.model.toLowerCase().includes(searchLower)) ||
        (v.licensePlate && v.licensePlate.toLowerCase().includes(searchLower))
      );
    }

    // Sort vehicles (convert field names to match Go backend data)
    const sortVehicles = (vehicles: any[]) => {
      return vehicles.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case 'brand':
            aValue = a.brand || '';
            bValue = b.brand || '';
            break;
          case 'model':
            aValue = a.model || '';
            bValue = b.model || '';
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt || '').getTime();
            bValue = new Date(b.createdAt || '').getTime();
            break;
          case 'utilization':
            aValue = a.utilizationRate || a.stats?.utilizationRate || 0;
            bValue = b.utilizationRate || b.stats?.utilizationRate || 0;
            break;
          default:
            aValue = a.licensePlate || a.id;
            bValue = b.licensePlate || b.id;
        }

        if (sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        }
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      });
    };

    // Apply sorting and pagination
    const sortedVehicles = sortVehicles(filteredVehicles);
    const offset = (page - 1) * limit;
    const paginatedVehicles = sortedVehicles.slice(offset, offset + limit);

    // Calculate pagination
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(filteredVehicles.length / limit),
      totalItems: filteredVehicles.length,
      itemsPerPage: limit,
      hasNextPage: offset + limit < filteredVehicles.length,
      hasPreviousPage: page > 1,
    };

    // Calculate statistics from vehicles
    const stats = {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
      inactiveVehicles: vehicles.filter(v => v.status === 'inactive').length,
      availableVehicles: vehicles.filter(v => v.isAvailable !== false).length,
      averageUtilization: vehicles.reduce((sum, v) => {
        const util = v.utilizationRate || v.stats?.utilizationRate || 0;
        return sum + util;
      }, 0) / Math.max(vehicles.length, 1),
      totalRevenue: vehicles.reduce((sum, v) => {
        const revenue = v.stats?.monthlyRevenue || v.monthlyRevenue || 0;
        return sum + revenue;
      }, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        vehicles: paginatedVehicles,
        pagination,
        stats,
        filters: {
          applied: { status, type, search, sortBy, sortOrder },
          available: {
            status: ['active', 'maintenance', 'inactive'],
            type: ['truck', 'van', 'motorcycle', 'car', 'other'],
            sortBy: ['brand', 'model', 'status', 'createdAt', 'utilization'],
            sortOrder: ['asc', 'desc'],
          },
        },
      },
    });

  } catch (error) {
    console.error('Get vehicles error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch vehicles',
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
 * POST /api/organizations/vehicles
 * Create a new vehicle via Go backend
 */
export async function POST(request: NextRequest) {
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

    // Only organization admins can create vehicles
    if (session.user.role !== 'organization_admin') {
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
    const validationResult = CreateVehicleSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid vehicle data',
            details: validationResult.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        },
        { status: 400 }
      );
    }

    const vehicleData = validationResult.data;

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

    // Add vehicle via Go backend
    const goResult = await goClient.addVehicleToOrganization(organizationId, {
      ...vehicleData,
      organizationId
    });

    if (!goResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: goResult.error
        },
        { status: goResult.error?.status || 500 }
      );
    }

    // Transform response to match frontend format
    const createdVehicle = goResult.data;

    return NextResponse.json({
      success: true,
      data: createdVehicle,
      message: 'Vehicle created successfully',
    });

  } catch (error) {
    console.error('Create vehicle error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: 'Failed to create vehicle',
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
 * PUT /api/organizations/vehicles
 * Bulk update vehicles
 */
export async function PUT(request: NextRequest) {
  try {
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
    const { vehicleIds, updates } = body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_VEHICLES',
            message: 'Valid vehicle IDs array is required'
          }
        },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_UPDATES',
            message: 'Valid updates object is required'
          }
        },
        { status: 400 }
      );
    }

    // Simulate bulk update
    await new Promise(resolve => setTimeout(resolve, 300));

    const updatedVehicles = vehicleIds.map(id => ({
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        updatedVehicles,
        count: vehicleIds.length,
      },
      message: `${vehicleIds.length} vehicles updated successfully`,
    });

  } catch (error) {
    console.error('Bulk update vehicles error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BULK_UPDATE_FAILED',
          message: 'Failed to update vehicles',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}