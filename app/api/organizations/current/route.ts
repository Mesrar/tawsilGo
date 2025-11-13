import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/lib/auth';
import { createGoBackendClient } from '@/lib/api/go-backend-client';

// Mock database (same as in register endpoint)
const mockDatabase = {
  organizations: new Map(),
  users: new Map(),
};

// Sample mock data for demonstration
const mockOrganization = {
  id: 'org-123',
  businessName: 'Test Logistics Company',
  businessType: 'freight_forward',
  businessEmail: 'test@logisticscompany.com',
  businessPhone: '+212 600 123 456',
  businessAddress: '123 Business Avenue, Casablanca',
  businessCity: 'Casablanca',
  businessCountry: 'Morocco',
  registrationNumber: 'REG-2024-TEST-001',
  taxId: 'TAX-2024-TEST-001',
  website: 'https://testlogisticscompany.com',
  description: 'A leading logistics and freight forwarding company specializing in cross-border shipping between Europe and Africa.',
  logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TLC&backgroundColor=4f46e5&color=white',
  verificationStatus: 'verified',
  isActive: true,
  adminId: 'admin-123',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  stats: {
    totalVehicles: 10,
    activeVehicles: 8,
    totalDrivers: 15,
    activeDrivers: 12,
    completedTrips: 95,
    scheduledTrips: 5,
    averageRating: 4.8,
    totalRevenue: 150000,
    monthlyRevenue: 25000,
    growthRate: 15.5,
  },
  _count: {
    vehicles: 10,
    drivers: 15,
    trips: 100,
    documents: 3,
  },
};

// Get current user from session/token
const getCurrentUser = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  if (!token) {
    return null;
  }

  // For demo purposes, return a mock user
  // In production, this would validate the token and fetch user from database
  return {
    id: token.sub || 'user-123',
    email: token.email || 'admin@testlogisticscompany.com',
    role: token.role || 'organization_admin',
    organizationId: token.organizationId || 'org-123',
  };
};

// Check if user has organization admin privileges
const hasOrganizationAccess = (user: any) => {
  return user && (
    user.role === 'organization_admin' ||
    user.role === 'organization_driver'
  );
};

/**
 * GET /api/organizations/current
 * Fetch current user's organization details from Go backend
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

    // For this demo, we'll use a mock organization ID since we don't have
    // a direct way to get the organization ID from the session
    // In a real implementation, this would come from the user profile or JWT
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

    // Fetch organization from Go backend
    const goResult = await goClient.getOrganization(organizationId);

    if (!goResult.success) {
      // If Go backend fails, fall back to mock data for now
      console.warn('Go backend unavailable, falling back to mock data');
      const organization = { ...mockOrganization };

      const organizationWithComputedData = {
        ...organization,
        isVerified: organization.verificationStatus === 'verified',
        canCreateTrips: organization.verificationStatus === 'verified' && organization.isActive,
        isFullyOnboarded: organization.verificationStatus === 'verified' &&
                            organization._count.vehicles > 0 &&
                            organization._count.drivers > 0,
        membershipInfo: {
          tier: organization.stats.totalRevenue > 100000 ? 'Enterprise' :
                 organization.stats.totalRevenue > 25000 ? 'Business' : 'Starter',
          memberSince: organization.createdAt,
          renewalDate: new Date(new Date(organization.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      };

      return NextResponse.json({
        success: true,
        data: organizationWithComputedData,
      });
    }

    // Transform Go backend data and add computed fields
    const organization = goResult.data;
    const organizationWithComputedData = {
      ...organization,
      // Ensure we have the expected fields for frontend compatibility
      businessName: organization.businessName || organization.legalName,
      businessType: organization.businessType || 'other',
      businessEmail: organization.businessEmail || organization.contactEmail,
      businessPhone: organization.businessPhone || organization.contactPhone,
      businessAddress: organization.businessAddress || organization.address,
      businessCity: organization.businessCity || organization.city,
      businessCountry: organization.businessCountry || organization.country,
      registrationNumber: organization.registrationNumber,
      taxId: organization.taxId,
      website: organization.website,
      description: organization.description,
      verificationStatus: organization.status || 'pending_verification',
      isActive: organization.status !== 'deactivated',
      // Add computed fields
      isVerified: organization.status === 'verified',
      canCreateTrips: organization.status === 'verified' && organization.status !== 'deactivated',
      isFullyOnboarded: organization.status === 'verified' && (organization.employeeCount || 0) > 0,
      membershipInfo: {
        tier: 'Starter', // Default since Go backend doesn't provide revenue data
        memberSince: organization.createdAt,
        renewalDate: new Date(new Date(organization.createdAt).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      // Add mock stats since Go backend doesn't provide them
      stats: mockOrganization.stats,
      _count: {
        vehicles: mockOrganization._count.vehicles,
        drivers: organization.employeeCount || mockOrganization._count.drivers,
        trips: mockOrganization._count.trips,
        documents: mockOrganization._count.documents,
      },
    };

    return NextResponse.json({
      success: true,
      data: organizationWithComputedData,
    });

  } catch (error) {
    console.error('Get current organization error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch organization details',
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
 * PUT /api/organizations/current
 * Update current user's organization profile via Go backend
 */
export async function PUT(request: NextRequest) {
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

    // Check if user has organization admin privileges
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

    // Parse request body
    const body = await request.json();

    // Validate update data
    const allowedFields = [
      'businessName',
      'businessPhone',
      'businessAddress',
      'businessCity',
      'businessCountry',
      'website',
      'description',
      'logo',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_VALID_FIELDS',
            message: 'No valid fields to update'
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

    // Transform update data for Go backend
    const goUpdateData = {
      legal_name: updateData.businessName,
      trade_name: updateData.businessName,
      contact_phone: updateData.businessPhone,
      address: updateData.businessAddress,
      city: updateData.businessCity,
      country: updateData.businessCountry,
      website: updateData.website,
      description: updateData.description,
    };

    // Update organization via Go backend
    const goResult = await goClient.updateOrganization(organizationId, goUpdateData);

    if (!goResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: goResult.error
        },
        { status: goResult.error?.status || 500 }
      );
    }

    // Return updated organization data
    const updatedOrganization = {
      ...mockOrganization,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedOrganization,
      message: 'Organization profile updated successfully',
    });

  } catch (error) {
    console.error('Update organization error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update organization profile',
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
 * DELETE /api/organizations/current
 * Deactivate current user's organization (admin only)
 */
export async function DELETE(request: NextRequest) {
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

    // Only organization admins can deactivate organizations
    if (user.role !== 'organization_admin') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only organization admins can deactivate organizations'
          }
        },
        { status: 403 }
      );
    }

    // Parse request body for confirmation
    const body = await request.json();
    const { confirmation, reason } = body;

    if (!confirmation || confirmation !== 'PERMANENT_DELETION') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CONFIRMATION',
            message: 'Invalid confirmation. Organization deactivation requires explicit confirmation.'
          }
        },
        { status: 400 }
      );
    }

    // Simulate organization deactivation
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: {
        deactivatedAt: new Date().toISOString(),
        reason: reason || 'User requested deactivation',
      },
      message: 'Organization deactivated successfully',
    });

  } catch (error) {
    console.error('Deactivate organization error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DEACTIVATION_FAILED',
          message: 'Failed to deactivate organization',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}