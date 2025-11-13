import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OrganizationRegistrationRequest } from '@/types/organization';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createGoBackendClient, GoBackendClient } from '@/lib/api/go-backend-client';

// Validation schema for organization registration
const OrganizationRegistrationSchema = z.object({
  // Business Information
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(['freight_forward', 'moving_company', 'ecommerce', 'corporate', 'logistics_provider', 'other']),
  businessEmail: z.string().email('Please enter a valid business email'),
  businessPhone: z.string().regex(/^\+?\d{10,15}$/, 'Please enter a valid phone number'),
  businessAddress: z.string().min(10, 'Address must be at least 10 characters'),
  businessCity: z.string().min(2, 'City must be at least 2 characters'),
  businessCountry: z.string().min(2, 'Country must be at least 2 characters'),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  description: z.string().optional(),

  // Admin Account Information
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Please enter a valid admin email'),
  adminPhone: z.string().regex(/^\+?\d{10,15}$/, 'Please enter a valid admin phone number'),
  adminPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  // Terms and conditions
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy'),
});

// Type for validated registration data
type ValidatedRegistrationData = z.infer<typeof OrganizationRegistrationSchema>;

// Mock database for demonstration (replace with actual database calls)
const mockDatabase = {
  organizations: new Map(),
  users: new Map(),
  documents: new Map(),
};

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Check if email already exists
const checkEmailExists = async (email: string): Promise<boolean> => {
  // Simulate database check
  await new Promise(resolve => setTimeout(resolve, 100));
  return Array.from(mockDatabase.users.values()).some((user: any) => user.email === email);
};

// Create organization record
const createOrganization = async (data: ValidatedRegistrationData) => {
  const organizationId = generateId();
  const adminId = generateId();

  // Create organization record
  const organization = {
    id: organizationId,
    businessName: data.businessName,
    businessType: data.businessType,
    businessEmail: data.businessEmail,
    businessPhone: data.businessPhone,
    businessAddress: data.businessAddress,
    businessCity: data.businessCity,
    businessCountry: data.businessCountry,
    registrationNumber: data.registrationNumber,
    taxId: data.taxId,
    website: data.website,
    description: data.description,
    verificationStatus: 'pending',
    isActive: true,
    adminId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Create admin user record
  const adminUser = {
    id: adminId,
    firstName: data.adminFirstName,
    lastName: data.adminLastName,
    email: data.adminEmail,
    phone: data.adminPhone,
    role: 'organization_admin',
    organizationId,
    isActive: false, // Will be activated after email verification
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Store in mock database
  mockDatabase.organizations.set(organizationId, organization);
  mockDatabase.users.set(adminId, adminUser);

  return { organization, admin: adminUser };
};

// Send verification email (mock implementation)
const sendVerificationEmail = async (email: string, name: string) => {
  // Simulate email sending
  console.log(`Sending verification email to ${email}`);
  await new Promise(resolve => setTimeout(resolve, 500));

  // Generate verification token
  const verificationToken = generateId();
  return {
    success: true,
    verificationToken,
    verificationUrl: `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`,
  };
};

/**
 * POST /api/organizations/register
 * Register a new organization by proxying to Go backend
 */
export async function POST(request: NextRequest) {
  try {
    // Get NextAuth session (optional for registration)
    const session = await getServerSession(authOptions);

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationResult = OrganizationRegistrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid registration data',
            details: validationResult.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create Go backend client with session info (if available)
    const goClient = createGoBackendClient(session ? {
      user: {
        id: session.user.id || 'temp-user-id',
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role || 'customer'
      }
    } : undefined);

    // Call Go backend to register organization
    const goResult = await goClient.registerOrganization({
      businessName: data.businessName,
      businessType: data.businessType,
      businessEmail: data.businessEmail,
      businessPhone: data.businessPhone,
      businessAddress: data.businessAddress,
      businessCity: data.businessCity,
      businessCountry: data.businessCountry,
      registrationNumber: data.registrationNumber,
      taxId: data.taxId,
      website: data.website,
      description: data.description,
      adminFirstName: data.adminFirstName,
      adminLastName: data.adminLastName,
      adminEmail: data.adminEmail,
      adminPhone: data.adminPhone,
      adminPassword: data.adminPassword,
      acceptTerms: data.acceptTerms,
      acceptPrivacy: data.acceptPrivacy
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

    // Generate verification token (mock implementation since Go backend doesn't handle this)
    const verificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Transform Go backend response to frontend format
    const organization = goResult.data;
    const responseData = {
      organization: {
        id: organization.id,
        businessName: organization.businessName,
        businessType: organization.businessType,
        businessEmail: organization.businessEmail,
        verificationStatus: organization.status || 'pending_verification',
        createdAt: organization.createdAt,
      },
      admin: {
        id: `admin-${organization.id}`, // Generate admin ID since Go backend doesn't return it
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        email: data.adminEmail,
        role: 'organization_admin',
        createdAt: new Date().toISOString(),
      },
      verification: {
        success: true,
        verificationToken,
        verificationUrl: `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`,
      },
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Organization registered successfully. Please check your email for verification.',
    });

  } catch (error) {
    console.error('Organization registration error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to register organization',
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
 * GET /api/organizations/register
 * Check if an email is available for registration
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const type = searchParams.get('type'); // 'business' or 'admin'

    if (!email || !type) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Email and type parameters are required'
          }
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = z.string().email().safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please enter a valid email address'
          }
        },
        { status: 400 }
      );
    }

    // Check if email exists
    const emailExists = await checkEmailExists(emailValidation.data);

    return NextResponse.json({
      success: true,
      data: {
        email: emailValidation.data,
        type,
        available: !emailExists,
        message: emailExists
          ? 'This email is already registered'
          : 'This email is available for registration',
      }
    });

  } catch (error) {
    console.error('Email availability check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHECK_FAILED',
          message: 'Failed to check email availability',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },
      { status: 500 }
    );
  }
}