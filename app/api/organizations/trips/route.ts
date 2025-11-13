import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { createGoBackendClient } from '@/lib/api/go-backend-client';

// Validation schemas
const TripQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  status: z.enum(['scheduled', 'active', 'completed', 'cancelled', 'delayed']).optional(),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  departureCity: z.string().optional(),
  destinationCity: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['departureTime', 'revenue', 'status', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const CreateTripSchema = z.object({
  departureCountry: z.string().min(1, 'Departure country is required'),
  departureCity: z.string().min(1, 'Departure city is required'),
  departureAddress: z.string().min(5, 'Departure address is required'),
  destinationCountry: z.string().min(1, 'Destination country is required'),
  destinationCity: z.string().min(1, 'Destination city is required'),
  destinationAddress: z.string().min(5, 'Destination address is required'),
  departureTime: z.string(),
  arrivalTime: z.string(),
  basePrice: z.number().min(0),
  pricePerKg: z.number().min(0),
  minimumPrice: z.number().min(0),
  currency: z.string().default('EUR'),
  totalCapacity: z.number().min(1),
  notes: z.string().optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
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

// Mock trip data
const mockTrips = [
  {
    id: 'trip-1',
    organizationId: 'org-123',
    driverId: 'driver-1',
    vehicleId: 'veh-1',
    departureCountry: 'Morocco',
    departureCity: 'Casablanca',
    departureAddress: '123 Route d\'El Jadida, Casablanca',
    destinationCountry: 'France',
    destinationCity: 'Paris',
    destinationAddress: '456 Avenue des Champs-Élysées, Paris',
    departureTime: '2024-02-01T10:00:00Z',
    arrivalTime: '2024-02-03T14:00:00Z',
    basePrice: 500,
    pricePerKg: 2.5,
    minimumPrice: 50,
    currency: 'EUR',
    totalCapacity: 1000,
    remainingCapacity: 750,
    status: 'scheduled',
    notes: 'Express delivery service',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    revenue: {
      current: 625,
      potential: 750,
      utilization: 75,
    },
    driver: {
      id: 'driver-1',
      name: 'Mohammed Ali',
      email: 'mohammed.ali@testlogistics.com',
      phone: '+212600123456',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed&backgroundColor=4f46e5&color=white',
    },
    vehicle: {
      id: 'veh-1',
      brand: 'Mercedes-Benz',
      model: 'Actros 1845',
      licensePlate: '1234-A-56',
      type: 'truck',
      capacity: 1000,
    },
    bookings: [
      {
        id: 'booking-1',
        customerId: 'customer-1',
        weight: 250,
        price: 875.5,
        status: 'confirmed',
        createdAt: '2024-01-26T15:30:00Z',
      },
    ],
  },
  {
    id: 'trip-2',
    organizationId: 'org-123',
    driverId: 'driver-2',
    vehicleId: 'veh-2',
    departureCountry: 'Morocco',
    departureCity: 'Rabat',
    departureAddress: '789 Avenue Mohammed V, Rabat',
    destinationCountry: 'Spain',
    destinationCity: 'Barcelona',
    destinationAddress: '321 La Rambla, Barcelona',
    departureTime: '2024-02-05T14:00:00Z',
    arrivalTime: '2024-02-07T18:00:00Z',
    basePrice: 400,
    pricePerKg: 3,
    minimumPrice: 45,
    currency: 'EUR',
    totalCapacity: 800,
    remainingCapacity: 600,
    status: 'active',
    notes: 'Regular freight service',
    createdAt: '2024-01-26T12:00:00Z',
    updatedAt: '2024-01-26T12:00:00Z',
    revenue: {
      current: 600,
      potential: 720,
      utilization: 75,
    },
    driver: {
      id: 'driver-2',
      name: 'Fatima Zahra',
      email: 'fatima.zahra@testlogistics.com',
      phone: '+212600789012',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&backgroundColor=ec4899&color=white',
    },
    vehicle: {
      id: 'veh-2',
      brand: 'Ford',
      model: 'Transit',
      licensePlate: '5678-B-78',
      type: 'van',
      capacity: 800,
    },
    bookings: [
      {
        id: 'booking-2',
        customerId: 'customer-2',
        weight: 200,
        price: 700,
        status: 'confirmed',
        createdAt: '2024-01-27T09:15:00Z',
      },
    ],
  },
  {
    id: 'trip-3',
    organizationId: 'org-123',
    driverId: null,
    vehicleId: 'veh-3',
    departureCountry: 'Morocco',
    departureCity: 'Marrakech',
    departureAddress: '456 Avenue Mohamed VI, Marrakech',
    destinationCountry: 'Germany',
    destinationCity: 'Frankfurt',
    destinationAddress: '789 Main Street, Frankfurt',
    departureTime: '2024-02-10T09:00:00Z',
    arrivalTime: '2024-02-12T16:00:00Z',
    basePrice: 600,
    pricePerKg: 2,
    minimumPrice: 55,
    currency: 'EUR',
    totalCapacity: 1200,
    remainingCapacity: 1200,
    status: 'scheduled',
    notes: 'Heavy freight service, needs experienced driver',
    createdAt: '2024-01-28T11:00:00Z',
    updatedAt: '2024-01-28T11:00:00Z',
    revenue: {
      current: 0,
      potential: 800,
      utilization: 0,
    },
    driver: null,
    vehicle: {
      id: 'veh-3',
      brand: 'Volvo',
      model: 'FH16',
      licensePlate: '9012-C-90',
      type: 'truck',
      capacity: 1200,
    },
    bookings: [],
  },
];

// Mock drivers and vehicles for assignment
const mockDrivers = [
  {
    id: 'driver-1',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@testlogistics.com',
    status: 'active',
    currentTripId: 'trip-1',
    averageRating: 4.8,
  },
  {
    id: 'driver-2',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@testlogistics.com',
    status: 'active',
    currentTripId: 'trip-2',
    averageRating: 4.9,
  },
  {
    id: 'driver-3',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@testlogistics.com',
    status: 'active',
    currentTripId: null,
    averageRating: 4.7,
  },
];

const mockVehicles = [
  {
    id: 'veh-1',
    brand: 'Mercedes-Benz',
    model: 'Actros 1845',
    licensePlate: '1234-A-56',
    type: 'truck',
    capacity: 1000,
    status: 'active',
    currentTripId: 'trip-1',
  },
  {
    id: 'veh-2',
    brand: 'Ford',
    model: 'Transit',
    licensePlate: '5678-B-78',
    type: 'van',
    capacity: 800,
    status: 'active',
    currentTripId: 'trip-2',
  },
  {
    id: 'veh-3',
    brand: 'Volvo',
    model: 'FH16',
    licensePlate: '9012-C-90',
    type: 'truck',
    capacity: 1200,
    status: 'maintenance',
    currentTripId: null,
  },
];

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

/**
 * GET /api/organizations/trips
 * List organization trips with filtering and pagination from Go backend
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
    const queryResult = TripQuerySchema.safeParse(Object.fromEntries(searchParams));

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

    const { page, limit, status, driverId, vehicleId, departureCity, destinationCity, sortBy, sortOrder } = queryResult.data;

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

    // Fetch trips from Go backend
    const tripsResult = await goClient.getOrganizationTrips(organizationId, {
      page,
      limit,
      status: status === 'cancelled' ? 'cancelled' :
              status === 'completed' ? 'completed' :
              status === 'active' ? 'in_progress' :
              status === 'scheduled' ? 'pending' : status
    });

    let trips = tripsResult.success ? (tripsResult.data?.trips || tripsResult.data || []) : [];

    // If Go backend fails, fall back to mock data for now
    if (!tripsResult.success) {
      console.warn('Go backend unavailable, falling back to mock data');
      trips = mockTrips;
    }

    // Filter trips further if needed (for fields not supported by Go backend)
    let filteredTrips = [...trips];

    if (driverId) {
      filteredTrips = filteredTrips.filter(t => t.driverId === driverId);
    }

    if (vehicleId) {
      filteredTrips = filteredTrips.filter(t => t.vehicleId === vehicleId);
    }

    if (departureCity) {
      filteredTrips = filteredTrips.filter(t =>
        t.departureCity && t.departureCity.toLowerCase().includes(departureCity.toLowerCase())
      );
    }

    if (destinationCity) {
      filteredTrips = filteredTrips.filter(t =>
        t.destinationCity && t.destinationCity.toLowerCase().includes(destinationCity.toLowerCase())
      );
    }

    // Sort trips (convert field names to match Go backend data)
    const sortTrips = (trips: any[]) => {
      return trips.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case 'departureTime':
            aValue = new Date(a.departureTime || a.scheduled_departure || '').getTime();
            bValue = new Date(b.departureTime || b.scheduled_departure || '').getTime();
            break;
          case 'revenue':
            aValue = a.revenue?.current || a.totalRevenue || 0;
            bValue = b.revenue?.current || b.totalRevenue || 0;
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt || '').getTime();
            bValue = new Date(b.createdAt || '').getTime();
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

    // Apply sorting and pagination
    const sortedTrips = sortTrips(filteredTrips);
    const offset = (page - 1) * limit;
    const paginatedTrips = sortedTrips.slice(offset, offset + limit);

    // Calculate pagination
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(filteredTrips.length / limit),
      totalItems: filteredTrips.length,
      itemsPerPage: limit,
      hasNextPage: offset + limit < filteredTrips.length,
      hasPreviousPage: page > 1,
    };

    // Calculate statistics from trips
    const stats = {
      totalTrips: trips.length,
      scheduledTrips: trips.filter(t => t.status === 'pending' || t.status === 'scheduled').length,
      activeTrips: trips.filter(t => t.status === 'in_progress' || t.status === 'active').length,
      completedTrips: trips.filter(t => t.status === 'completed').length,
      cancelledTrips: trips.filter(t => t.status === 'cancelled').length,
      totalRevenue: trips.reduce((sum, t) => sum + (t.revenue?.current || t.totalRevenue || 0), 0),
      totalCapacity: trips.reduce((sum, t) => sum + (t.totalCapacity || t.capacity || 0), 0),
      averageUtilization: trips.reduce((sum, t) => sum + (t.revenue?.utilization || t.utilization || 0), 0) / Math.max(trips.length, 1),
    };

    return NextResponse.json({
      success: true,
      data: {
        trips: paginatedTrips,
        pagination,
        stats,
        filters: {
          applied: { status, driverId, vehicleId, departureCity, destinationCity, sortBy, sortOrder },
          available: {
            status: ['scheduled', 'active', 'completed', 'cancelled', 'delayed'],
            sortBy: ['departureTime', 'revenue', 'status', 'createdAt'],
            sortOrder: ['asc', 'desc'],
          },
        },
      },
    });

  } catch (error) {
    console.error('Get trips error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch trips',
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
 * POST /api/organizations/trips
 * Create a new trip via Go backend
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

    // Only organization admins can create trips
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
    const validationResult = CreateTripSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid trip data',
            details: validationResult.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        },
        { status: 400 }
      );
    }

    const tripData = validationResult.data;

    // Validate dates
    const departureTime = new Date(tripData.departureTime);
    const arrivalTime = new Date(tripData.arrivalTime);

    if (arrivalTime <= departureTime) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_DATES',
            message: 'Arrival time must be after departure time'
          }
        },
        { status: 400 }
      );
    }

    // Validate capacity
    if (tripData.totalCapacity < 1) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CAPACITY',
            message: 'Total capacity must be at least 1'
          }
        },
        { status: 400 }
      );
    }

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

    // Create trip via Go backend
    const goResult = await goClient.createOrganizationTrip(organizationId, {
      ...tripData,
      status: 'pending', // Map to Go backend status
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
    const createdTrip = goResult.data;

    return NextResponse.json({
      success: true,
      data: createdTrip,
      message: 'Trip created successfully',
    });

  } catch (error) {
    console.error('Create trip error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: 'Failed to create trip',
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
 * PUT /api/organizations/trips
 * Bulk update trips
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
    const { tripIds, action, data } = body;

    if (!tripIds || !Array.isArray(tripIds) || tripIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TRIPS',
            message: 'Valid trip IDs array is required'
          }
        },
        { status: 400 }
      );
    }

    // Simulate bulk operation
    await new Promise(resolve => setTimeout(resolve, 400));

    const updatedTrips = tripIds.map(id => ({
      id,
      status: action === 'cancel' ? 'cancelled' : action === 'complete' ? 'completed' : 'updated',
      updatedAt: new Date().toISOString(),
      ...data,
    }));

    return NextResponse.json({
      success: true,
      data: {
        updatedTrips,
        count: tripIds.length,
        action,
      },
      message: `${tripIds.length} trips ${action}d successfully`,
    });

  } catch (error) {
    console.error('Bulk update trips error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BULK_UPDATE_FAILED',
          message: 'Failed to update trips',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}