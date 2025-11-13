import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';

// Validation schemas
const UpdateVehicleSchema = z.object({
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  capacityWeightMin: z.number().min(0).optional(),
  capacityWeightMax: z.number().min(0).optional(),
  capacityVolumeMin: z.number().min(0).optional(),
  capacityVolumeMax: z.number().min(0).optional(),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
  features: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
});

const MaintenanceRecordSchema = z.object({
  type: z.enum(['routine', 'repair', 'inspection', 'tire_change', 'oil_change', 'other']),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  cost: z.number().min(0),
  odometerReading: z.number().min(0),
  nextMaintenanceOdometer: z.number().min(0).optional(),
  performedBy: z.string().min(1, 'Performed by is required'),
  notes: z.string().optional(),
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

// Mock vehicle data
const mockVehicle = {
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
  documents: [
    {
      id: 'doc-1',
      type: 'insurance',
      url: 'https://example.com/insurance.pdf',
      filename: 'insurance-policy.pdf',
      uploadedAt: '2024-01-01T00:00:00Z',
      expiryDate: '2024-12-31',
      status: 'valid',
    },
    {
      id: 'doc-2',
      type: 'registration',
      url: 'https://example.com/registration.pdf',
      filename: 'vehicle-registration.pdf',
      uploadedAt: '2024-01-01T00:00:00Z',
      expiryDate: '2025-01-15',
      status: 'valid',
    },
  ],
  maintenanceRecords: [
    {
      id: 'maint-1',
      type: 'routine',
      description: 'Regular oil change and filter replacement',
      cost: 300,
      odometerReading: 12000,
      nextMaintenanceOdometer: 15000,
      performedBy: 'Mercedes Service Center',
      performedAt: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'maint-2',
      type: 'repair',
      description: 'Brake pad replacement',
      cost: 800,
      odometerReading: 14000,
      performedBy: 'Auto Repair Shop',
      performedAt: '2024-01-15T00:00:00Z',
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'maint-3',
      type: 'inspection',
      description: 'Annual safety inspection',
      cost: 400,
      odometerReading: 15000,
      performedBy: 'Government Inspection Center',
      performedAt: '2024-01-20T00:00:00Z',
      createdAt: '2024-01-20T00:00:00Z',
    },
  ],
};

/**
 * GET /api/organizations/vehicles/[id]
 * Get vehicle details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    if (!hasOrganizationAccess(user)) {
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

    const { id } = await params;

    // In a real implementation, fetch from database
    // For demo, return mock data if ID matches
    if (id === 'veh-1') {
      return NextResponse.json({
        success: true,
        data: mockVehicle,
      });
    }

    // Vehicle not found
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VEHICLE_NOT_FOUND',
          message: 'Vehicle not found'
        }
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Get vehicle error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch vehicle details',
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
 * PUT /api/organizations/vehicles/[id]
 * Update vehicle details
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Only organization admins can update vehicles
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

    const { id } = await params;
    const body = await request.json();
    const validationResult = UpdateVehicleSchema.safeParse(body);

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

    // Check if vehicle exists
    if (id !== 'veh-1') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VEHICLE_NOT_FOUND',
            message: 'Vehicle not found'
          }
        },
        { status: 404 }
      );
    }

    const updateData = validationResult.data;

    // Simulate database update
    await new Promise(resolve => setTimeout(resolve, 200));

    const updatedVehicle = {
      ...mockVehicle,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
      message: 'Vehicle updated successfully',
    });

  } catch (error) {
    console.error('Update vehicle error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update vehicle',
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
 * DELETE /api/organizations/vehicles/[id]
 * Delete a vehicle
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Only organization admins can delete vehicles
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

    const { id } = await params;

    // Check if vehicle exists
    if (id !== 'veh-1') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VEHICLE_NOT_FOUND',
            message: 'Vehicle not found'
          }
        },
        { status: 404 }
      );
    }

    // Check if vehicle has active trips
    if (mockVehicle.isAvailable === false) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VEHICLE_IN_USE',
            message: 'Cannot delete vehicle that is currently in use'
          }
        },
        { status: 409 }
      );
    }

    // Simulate database deletion
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: {
        deletedVehicle: {
          id: mockVehicle.id,
          brand: mockVehicle.brand,
          model: mockVehicle.model,
          licensePlate: mockVehicle.licensePlate,
        },
        deletedAt: new Date().toISOString(),
      },
      message: 'Vehicle deleted successfully',
    });

  } catch (error) {
    console.error('Delete vehicle error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETION_FAILED',
          message: 'Failed to delete vehicle',
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
 * POST /api/organizations/vehicles/[id]/maintenance
 * Add maintenance record to vehicle
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Both admins and drivers can add maintenance records
    if (!hasOrganizationAccess(user)) {
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

    const { id } = await params;
    const body = await request.json();
    const validationResult = MaintenanceRecordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid maintenance data',
            details: validationResult.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        },
        { status: 400 }
      );
    }

    // Check if vehicle exists
    if (id !== 'veh-1') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VEHICLE_NOT_FOUND',
            message: 'Vehicle not found'
          }
        },
        { status: 404 }
      );
    }

    const maintenanceData = validationResult.data;

    // Create maintenance record
    const newMaintenanceRecord = {
      id: `maint-${Date.now()}`,
      vehicleId: id,
      ...maintenanceData,
      performedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Simulate database insertion
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: newMaintenanceRecord,
      message: 'Maintenance record added successfully',
    });

  } catch (error) {
    console.error('Add maintenance record error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MAINTENANCE_FAILED',
          message: 'Failed to add maintenance record',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}