# TawsilGo Multi-Profile Trip Management System - Integration Guide

## Overview

This guide covers the complete integration of the multi-profile trip management system that allows individual drivers and organizations to coexist on the TawsilGo platform.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Installation & Setup](#installation--setup)
3. [Configuration](#configuration)
4. [User Roles & Permissions](#user-roles--permissions)
5. [API Integration](#api-integration)
6. [Database Schema](#database-schema)
7. [Testing Guide](#testing-guide)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## System Architecture

### Multi-Profile Structure

The system supports four main user profiles:

1. **Individual Drivers** - Independent operators managing their own vehicles and trips
2. **Organization Admins** - Business administrators managing fleets and teams
3. **Organization Drivers** - Drivers employed by organizations
4. **Customers** - End users booking and tracking parcels

### Component Architecture

```
├── app/
│   ├── [locale]/(site)/
│   │   ├── organizations/          # Organization-specific pages
│   │   │   ├── register/           # Organization registration
│   │   │   ├── profile/            # Organization profile management
│   │   │   ├── fleet/              # Fleet management
│   │   │   │   ├── index.tsx        # Fleet overview
│   │   │   │   ├── vehicles/         # Vehicle management
│   │   │   │   ├── drivers/          # Driver management
│   │   │   │   └── maintenance/     # Maintenance scheduling
│   │   │   └── trips/              # Organization trips
│   │   │       ├── create/        # Trip creation
│   │   │       └── index.tsx       # Trip dashboard
│   │   ├── drivers/                # Individual driver pages
│   │   └── dashboard/               # Unified dashboard
│   ├── services/
│   │   ├── organizationService.ts
│   │   ├── vehicleService.ts
│   │   ├── fleetService.ts
│   │   ├── userService.ts
│   │   └── tripService.ts
│   └── types/
│       ├── organization.ts
│       ├── vehicle.ts
│       └── user.ts
```

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database with Prisma ORM
- NextAuth.js for authentication
- React Query for data management
- Tailwind CSS for styling

### Environment Variables

Create `.env.local` with the following variables:

```bash
# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# API Endpoints
VERIFY_API_URL=http://localhost:8085
PARCEL_API_URL=http://localhost:8085
PAYMENT_API_URL=http://localhost:8086

# Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/tawsgo_db
```

### Installation Commands

```bash
# Clone the repository
git clone <repository-url>
cd tawsilgo-app

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Configuration

### Authentication Configuration

The system uses NextAuth.js with role-based authentication. Configure `pages/api/auth/[...nextauth].ts`:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "@/lib/auth-config";

export default NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Authentication logic for individual drivers, organization admins, and customers
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
```

### Middleware Configuration

Update `middleware.ts` to handle role-based route protection:

```typescript
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const pathname = request.nextUrl.pathname;

  // Organization routes protection
  if (pathname.startsWith("/organizations")) {
    if (!session || !["organization_admin", "organization_driver"].includes(session.role?.toLowerCase() || "")) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Driver routes protection
  if (pathname.startsWith("/drivers")) {
    if (!session || session.role?.toLowerCase() !== "driver") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Customer routes protection
  if (pathname.startsWith("/users")) {
    if (!session || session.role?.toLowerCase() !== "customer") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }
}
```

## User Roles & Permissions

### Role Definitions

#### Individual Driver (`driver`)
- **Permissions**: Manage own vehicles, create trips, view earnings
- **Features**: Vehicle management, trip creation, performance tracking
- **Routes**: `/drivers/*`, `/dashboard`

#### Organization Admin (`organization_admin`)
- **Permissions**: Full organization management, fleet operations, team management
- **Features**: Organization profile, fleet management, driver management, trip creation
- **Routes**: `/organizations/*`, `/dashboard`

#### Organization Driver (`organization_driver`)
- **Permissions**: Assigned trip management, vehicle status updates, performance reporting
- **Features**: Assigned trips, vehicle status, performance metrics
- **Routes**: `/organizations/*`, `/dashboard`

#### Customer (`customer`)
- **Permissions**: Book trips, track parcels, manage bookings
- **Features**: Trip search, booking management, parcel tracking
- **Routes**: `/users/*`, `/dashboard`

### Permission Matrix

| Feature | Individual Driver | Organization Admin | Organization Driver | Customer |
|---------|-------------------|-------------------|-------------------|---------|
| Vehicle Management | ✅ (own vehicles) | ✅ (fleet) | ❌ | ❌ |
| Trip Creation | ✅ | ✅ | ❌ | ❌ |
| Fleet Analytics | ❌ | ✅ | ✅ (limited) | ❌ |
| Driver Management | ❌ | ✅ | ✅ (self) | ❌ |
| Booking | ❌ | ❌ | ❌ | ✅ |
| Parcel Tracking | ❌ | ❌ | ✅ (own) | ✅ |

## API Integration

### Service Layer Pattern

All API interactions go through service layers:

```typescript
// Example: Organization Service
import { apiClient } from "@/lib/api/api-client";

export const organizationService = {
  async register(data: OrganizationRegistrationRequest) {
    return apiClient.post<OrganizationRegistrationResponse>(
      "/api/organizations/register",
      data,
      { requireAuth: false }
    );
  },

  async getCurrentOrganization() {
    return apiClient.get<OrganizationDetailsResponse>(
      "/api/organizations/current"
    );
  },

  async getTrips(params?: GetTripsParams) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<TripsResponse>(
      `/api/organizations/trips?${queryParams.toString()}`
    );
  },
};
```

### API Client Configuration

The `lib/api/api-client.ts` provides:

- Automatic JWT token injection
- Token refresh on 401/403 errors
- Request queuing during token refresh
- Consistent error handling
- Type-safe responses

## Database Schema

### Key Tables

#### Organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  registration_number VARCHAR(100),
  tax_id VARCHAR(100),
  website VARCHAR(255),
  description TEXT,
  logo VARCHAR(255),
  verification_status VARCHAR(20) DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  admin_id UUID NOT NULL
);
```

#### Organization Vehicles
```sql
CREATE TABLE organization_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  type VARCHAR(50) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  license_plate VARCHAR(50) NOT NULL UNIQUE,
  year INTEGER NOT NULL,
  capacity_weight_min INTEGER NOT NULL,
  capacity_weight_max INTEGER NOT NULL,
  capacity_volume_min NUMERIC(10,2) NOT NULL,
  capacity_volume_max NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Organization Drivers
```sql
CREATE TABLE organization_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  role VARCHAR(50) DEFAULT 'organization_driver',
  status VARCHAR(20) DEFAULT 'active',
  is_verified BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP,
  current_vehicle_id UUID REFERENCES organization_vehicles(id)
);
```

#### Organization Trips
```sql
CREATE TABLE organization_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  driver_id UUID REFERENCES organization_drivers(id),
  vehicle_id UUID REFERENCES organization_vehicles(id),
  departure_country VARCHAR(100) NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  departure_city VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  departure_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  minimum_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  total_capacity INTEGER NOT NULL,
  remaining_capacity INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing Guide

### Unit Testing

```typescript
// Example: Testing organization service
import { organizationService } from "@/app/services/organizationService";

describe('organizationService', () => {
  it('should register a new organization', async () => {
    const mockData = {
      businessName: 'Test Logistics',
      businessType: 'freight_forward',
      email: 'test@example.com',
      // ... other required fields
    };

    const result = await organizationService.register(mockData);

    expect(result.success).toBe(true);
    expect(result.data.organization.businessName).toBe('Test Logistics');
  });

  it('should handle registration validation errors', async () => {
    const invalidData = {
      businessName: '',
      // Invalid data
    };

    await expect(organizationService.register(invalidData))
      .rejects.toThrow();
  });
});
```

### Integration Testing

```typescript
// Example: Testing complete organization workflow
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrganizationRegistrationPage } from '@/app/[locale]/(site)/organizations/register/page';

describe('Organization Registration Workflow', () => {
  it('should complete full registration flow', async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <OrganizationRegistrationPage />
      </QueryClientProvider>
    );

    // Step 1: Business Information
    await screen.findByLabelText(/Business Name/i);
    fireEvent.change(screen.getByLabelText(/Business Name/i), {
      target: { value: 'Test Logistics' }
    });

    // Continue through all steps...

    // Final verification
    await waitFor(() => {
      expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
    });
  });
});
```

### End-to-End Testing

```typescript
// Example: Playwright E2E test
import { test, expect } from '@playwright/test';

test.describe('Multi-Profile System', () => {
  test('organization admin can manage fleet', async ({ page }) => {
    // Login as organization admin
    await page.goto('/auth/signin');
    await page.fill('[placeholder="Email"]', 'admin@testorg.com');
    await page.fill('[placeholder="Password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to fleet management
    await page.goto('/organizations/fleet');
    await expect(page.locator('h1')).toContainText('Fleet Management');

    // Add a vehicle
    await page.click('text=Add Vehicle');
    await page.fill('[placeholder="Brand"]', 'Toyota');
    await page.fill('[placeholder="Model"]', 'Camry');
    await page.click('button[type="submit"]');

    // Verify vehicle was added
    await expect(page.locator('text=Toyota Camry')).toBeVisible();
  });

  test('customer can book trip', async ({ page }) => {
    // Login as customer
    await page.goto('/auth/signin');
    await page.fill('[placeholder="Email"]', 'customer@example.com');
    await page.fill('[placeholder="Password"] => 'password123');
    await page.click('button[type="submit"]');

    // Search for trips
    await page.goto('/search');
    await page.fill('[placeholder="From"]', 'Casablanca');
    await page.fill('[placeholder="To"]', 'Paris');
    await page.click('button[type="submit"]');

    // Book a trip
    await page.click('text=Book', { first: true });
    await page.click('text=Confirm Booking');

    // Verify booking was created
    await expect(page.locator('text=Booking Successful')).toBeVisible();
  });
});
```

## Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start

# Generate static build (if needed)
npm run build
```

### Environment Setup

#### Docker Deployment

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: tawsgo_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Performance Optimization

#### Build Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: true,
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
```

#### Caching Strategy
```typescript
// lib/api/api-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});
```

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```bash
# Clear NextAuth session
npm run clean
rm -rf .next
npm run dev
```

#### 2. Database Connection Issues
```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Run migrations
npx prisma migrate dev
```

#### 3. Build Errors
```bash
# Clear build cache
npm run clean
npm run build

# Check for TypeScript errors
npm run lint
```

#### 4. Permission Errors
```typescript
// Check user role in session
console.log('User role:', session?.user?.role);

// Verify middleware configuration
console.log('Path:', request.nextUrl.pathname);
```

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=1 npm run dev
```

### Health Checks

Create health check endpoint:

```typescript
// pages/api/health.ts
export default function handler(req, res) {
  try {
    // Check database connection
    // Check API endpoints
    // Check authentication
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
}
```

## Monitoring and Analytics

### Performance Monitoring

```typescript
// lib/monitoring.ts
export const performanceMetrics = {
  trackPageView: (page: string) => {
    // Page view tracking
  },
  trackUserAction: (action: string, data?: any) => {
    // User action tracking
  },
  trackPerformance: (metric: string, value: number) => {
    // Performance tracking
  },
};
```

### Error Tracking

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Security Considerations

### API Security
- JWT token validation on all endpoints
- Rate limiting for sensitive operations
- Input validation and sanitization
- CORS configuration
- HTTPS enforcement in production

### Data Protection
- GDPR compliance
- Data encryption at rest and in transit
- Regular security audits
- User consent management

### Access Control
- Role-based permissions
- Multi-factor authentication
- Session management
- Audit logging

## Support

For support and questions regarding the multi-profile system:

1. Check this documentation for common issues
2. Review the codebase for implementation details
3. Test in a staging environment before production deployment
4. Monitor system performance after deployment

## Version History

- **v1.0.0** - Initial release with full multi-profile support
- **v1.1.0** - Enhanced mobile responsiveness
- **v1.2.0** - Advanced analytics and reporting
- **v1.3.0** - Performance optimizations and bug fixes

---

**Note**: This guide is continuously updated as the system evolves. For the most recent information, always refer to the latest version of this documentation.