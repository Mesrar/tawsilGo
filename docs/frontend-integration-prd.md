# Frontend Integration PRD: Multi-Profile Trip Management System

**Document Version:** 2.0
**Date:** October 29, 2025
**Last Updated:** October 29, 2025
**Author:** Backend Team
**Target Audience:** Frontend Development Team

---

## Executive Summary

SirAPI now supports **two distinct user profiles** for trip management:

1. **Individual Drivers** - Independent operators who manage their own trips and vehicles
2. **Bus Companies / Organizations** - Companies that manage fleets of vehicles with full trip management

This PRD outlines how the frontend should integrate with the backend APIs to support both profiles through a **unified dashboard interface** with role-based feature visibility.

### ✅ Status Update (v2.0)
**Organizations can now fully create and manage trips!** The backend implementation is complete and production-ready. This document has been updated to reflect all available functionality.

---

## 1. User Profiles Overview

### 1.1 Individual Driver Profile

**Description:** A single driver who owns/operates their own vehicle(s).

**Capabilities:**
- ✅ Authenticate with JWT (RoleDriver)
- ✅ Create trips for their routes
- ✅ Update trip details (departure, destination, capacity, stops)
- ✅ Cancel trips (soft delete via status change)
- ✅ List personal trips with filtering
- ✅ Add/update/remove stops on trips
- ✅ Manage vehicle information

**Key Characteristics:**
- Operates independently
- One-to-one relationship: Driver → Trip
- Full autonomy over their trips

### 1.2 Organization Profile (Bus Companies)

**Description:** A registered company that owns multiple vehicles and potentially employs multiple drivers.

**Full Capabilities:**
- ✅ Register organization with business details
- ✅ Upload verification documents
- ✅ Manage fleet (add/view vehicles)
- ✅ Assign drivers as employees
- ✅ View organization profile and fleet
- ✅ **NEW:** Create trips with optional vehicle assignment
- ✅ **NEW:** Update and cancel organization trips
- ✅ **NEW:** Assign organization drivers to trips
- ✅ **NEW:** View trip history by organization
- ✅ **NEW:** View trip history by specific vehicle
- ✅ **NEW:** Vehicle availability validation (prevents double-booking)

**Key Characteristics:**
- Centralized management
- Owns multiple vehicles (VAN, TRUCK, BUS)
- Employs multiple drivers
- Requires admin verification before operations
- **Vehicle capacity constraints enforced per type**
- **Automatic conflict detection for vehicle scheduling**

---

## 2. Authentication & Authorization

### 2.1 Authentication Flow

**Base URL:** `http://localhost:8082` (auth-service)

#### Step 1: User Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "driver@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "driver@example.com",
    "name": "John Doe",
    "role": "Driver"
  },
  "expires_at": "2025-10-29T14:00:00Z"
}
```

#### Step 2: Store JWT Token

```javascript
// Frontend should store the token
localStorage.setItem('authToken', response.token);
localStorage.setItem('userRole', response.user.role);
localStorage.setItem('userId', response.user.id);
```

#### Step 3: Include Token in API Calls

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Role-Based Access

| Role | Description | Access Level |
|------|-------------|--------------|
| `Driver` | Individual driver | Trip CRUD, personal vehicle management |
| `Enterprise` | Organization user | Organization profile, fleet management (trips N/A) |
| `Admin` | System administrator | All operations, verification |
| `Customer` | End user | Search trips, create bookings |

### 2.3 JWT Claims Structure

The JWT contains:
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "driver@example.com",
  "role": "Driver",
  "exp": 1735478400
}
```

**Frontend Usage:**
- Use `user_id` for API calls requiring driver/organization ID
- Check `role` to show/hide features
- Validate `exp` to handle token expiration

---

## 3. Trip Management

**Base URL:** `http://localhost:8085` (parcel-service)

This section covers trip management for both individual drivers and organizations.

### 3.1 Create Trip

**Endpoint:** `POST /api/v1/driver/trips`
**Auth Required:** Yes (JWT + RoleDriver)

**Request:**
```json
{
  "departure_address": "123 Main St, New York, NY",
  "destination_address": "456 Market St, Los Angeles, CA",
  "departure_city": "New York",
  "departure_country": "USA",
  "destination_city": "Los Angeles",
  "destination_country": "USA",
  "departure_point": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "destination_point": {
    "latitude": 34.0522,
    "longitude": -118.2437
  },
  "departure_time": "2025-11-01T10:00:00Z",
  "total_capacity": 500.0,
  "pricing_model": {
    "base_price": 50.0,
    "per_kg_price": 0.5,
    "currency": "USD"
  }
}
```

**Response:**
```json
{
  "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  "departure_address": "123 Main St, New York, NY",
  "destination_address": "456 Market St, Los Angeles, CA",
  "departure_city": "New York",
  "destination_city": "Los Angeles",
  "departure_time": "2025-11-01T10:00:00Z",
  "arrival_time": "2025-11-02T14:30:00Z",
  "total_capacity": 500.0,
  "remaining_capacity": 500.0,
  "estimated_distance": 4489.2,
  "estimated_duration": 2610,
  "status": "planned",
  "driver_reference": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "driver@example.com"
  },
  "created_at": "2025-10-28T15:00:00Z",
  "updated_at": "2025-10-28T15:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Trip created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Invalid/missing JWT token
- `403 Forbidden` - User doesn't have Driver role

**Frontend Implementation:**
```javascript
async function createTrip(tripData) {
  const response = await fetch('http://localhost:8085/api/v1/driver/trips', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tripData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create trip');
  }

  return await response.json();
}
```

### 3.2 List Driver's Trips

**Endpoint:** `GET /api/v1/driver/trips`
**Auth Required:** Yes (JWT + RoleDriver)

**Query Parameters:**
- `status` (optional) - Filter by status: `planned`, `scheduled`, `active`, `completed`, `cancelled`
- `page` (optional) - Page number (default: 1)
- `page_size` (optional) - Results per page (default: 10)

**Example:**
```bash
GET /api/v1/driver/trips?status=planned&page=1&page_size=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "trips": [
    {
      "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "departure_city": "New York",
      "destination_city": "Los Angeles",
      "departure_time": "2025-11-01T10:00:00Z",
      "status": "planned",
      "total_capacity": 500.0,
      "remaining_capacity": 500.0,
      "bookings_count": 0
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 10,
    "total_count": 15,
    "total_pages": 2
  }
}
```

**UI Suggestion:**
- Display trips in a table/card view
- Add status badges with colors:
  - `planned` - Blue
  - `scheduled` - Yellow
  - `active` - Green
  - `completed` - Gray
  - `cancelled` - Red
- Show capacity bar: `remaining / total`
- Add quick actions: Edit, Cancel, View Details

### 3.3 Update Trip

**Endpoint:** `PUT /api/v1/driver/trips/:id`
**Auth Required:** Yes (JWT + RoleDriver)

**Request:**
```json
{
  "departure_time": "2025-11-01T12:00:00Z",
  "total_capacity": 600.0,
  "pricing_model": {
    "base_price": 60.0,
    "per_kg_price": 0.6,
    "currency": "USD"
  }
}
```

**Response:**
```json
{
  "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  "departure_time": "2025-11-01T12:00:00Z",
  "total_capacity": 600.0,
  "remaining_capacity": 600.0,
  "updated_at": "2025-10-28T16:00:00Z"
}
```

**Validation Rules:**
- Cannot update trips with status `active` or `completed`
- Cannot reduce `total_capacity` below current bookings
- `departure_time` must be in the future

**Error Example:**
```json
{
  "error": "Cannot update trip with status 'active'"
}
```

### 3.4 Cancel Trip (Soft Delete)

**Endpoint:** `PUT /api/v1/driver/trips/:id`
**Auth Required:** Yes (JWT + RoleDriver)

**Request:**
```json
{
  "status": "cancelled"
}
```

**Response:**
```json
{
  "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  "status": "cancelled",
  "updated_at": "2025-10-28T16:30:00Z"
}
```

**Important:**
- This is a **soft delete** - trip remains in database
- Status changes from current state to `cancelled`
- Cannot cancel trips with existing bookings (backend will return error)
- Cannot undo cancellation (permanent)

**UI Flow:**
1. User clicks "Cancel Trip" button
2. Show confirmation dialog: "Are you sure? This cannot be undone."
3. If confirmed, send PUT request with `status: "cancelled"`
4. Update trip list to show cancelled status
5. Show success message: "Trip cancelled successfully"

### 3.5 Add Stop to Trip

**Endpoint:** `POST /api/v1/driver/trips/:id/stops`
**Auth Required:** Yes (JWT + RoleDriver)

**Request:**
```json
{
  "address": "789 Transit Ave, Chicago, IL",
  "city": "Chicago",
  "country": "USA",
  "location": {
    "latitude": 41.8781,
    "longitude": -87.6298
  },
  "sequence": 1,
  "estimated_arrival": "2025-11-01T18:00:00Z",
  "stop_type": "pickup"
}
```

**Response:**
```json
{
  "id": "stop-uuid-here",
  "address": "789 Transit Ave, Chicago, IL",
  "city": "Chicago",
  "sequence": 1,
  "stop_type": "pickup",
  "status": "planned",
  "estimated_arrival": "2025-11-01T18:00:00Z"
}
```

**Stop Types:**
- `pickup` - Pick up parcels
- `delivery` - Deliver parcels
- `rest` - Rest/refuel stop

### 3.6 Get Trip Details

**Endpoint:** `GET /api/v1/driver/trips/:id/details`
**Auth Required:** Yes (JWT + RoleDriver)

**Response:**
```json
{
  "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
  "departure_address": "123 Main St, New York, NY",
  "destination_address": "456 Market St, Los Angeles, CA",
  "departure_time": "2025-11-01T10:00:00Z",
  "arrival_time": "2025-11-02T14:30:00Z",
  "status": "planned",
  "total_capacity": 500.0,
  "remaining_capacity": 350.0,
  "stops": [
    {
      "id": "stop-1",
      "city": "Chicago",
      "sequence": 1,
      "stop_type": "pickup",
      "estimated_arrival": "2025-11-01T18:00:00Z"
    }
  ],
  "bookings": [
    {
      "id": "booking-1",
      "customer_name": "Jane Smith",
      "parcel_weight": 150.0,
      "status": "confirmed"
    }
  ],
  "pricing_model": {
    "base_price": 50.0,
    "per_kg_price": 0.5,
    "currency": "USD"
  },
  "driver_reference": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe"
  }
}
```

---

## 3.8 Organization Trip Management (NEW)

**Base URL:** `http://localhost:8085` (parcel-service)

Organizations can now create and manage trips with additional features like vehicle assignment and driver assignment.

### 3.8.1 Create Organization Trip

**Endpoint:** `POST /api/v1/organizations/:orgId/trips`
**Auth Required:** Yes (JWT + organization member)

**Request:**
```json
{
  "origin": "123 Main St, Paris, France",
  "destination": "456 Market St, Lyon, France",
  "departureTime": "2025-11-01T10:00:00Z",
  "capacity": 2500.0,
  "price": {
    "basePrice": 200.0,
    "pricePerKg": 0.8,
    "currency": "EUR"
  },
  "vehicleId": "v1234567-89ab-cdef-0123-456789abcdef",
  "stops": []
}
```

**Response:**
```json
{
  "id": "t1234567-89ab-cdef-0123-456789abcdef",
  "departureAddress": "123 Main St, Paris, France",
  "destinationAddress": "456 Market St, Lyon, France",
  "departureCity": "Paris",
  "departureCountry": "France",
  "destinationCity": "Lyon",
  "destinationCountry": "France",
  "departureTime": "2025-11-01T10:00:00Z",
  "arrivalTime": "2025-11-01T15:30:00Z",
  "totalCapacity": 2500.0,
  "remainingCapacity": 2500.0,
  "status": "scheduled",
  "estimatedDistance": 465.5,
  "estimatedDuration": 330,
  "ownerType": "ORGANIZATION",
  "organizationId": "org12345-89ab-cdef-0123-456789abcdef",
  "vehicleId": "v1234567-89ab-cdef-0123-456789abcdef",
  "createdByUserId": "u1234567-89ab-cdef-0123-456789abcdef"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8085/api/v1/organizations/org12345-89ab-cdef-0123-456789abcdef/trips \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "123 Main St, Paris, France",
    "destination": "456 Market St, Lyon, France",
    "departureTime": "2025-11-01T10:00:00Z",
    "capacity": 2500.0,
    "price": {
      "basePrice": 200.0,
      "pricePerKg": 0.8,
      "currency": "EUR"
    },
    "vehicleId": "v1234567-89ab-cdef-0123-456789abcdef"
  }'
```

**Validations Performed:**
- ✅ Organization exists and is verified
- ✅ User is a member of the organization
- ✅ Vehicle belongs to the organization (if provided)
- ✅ Vehicle is available for the time slot (no conflicts)
- ✅ Capacity does not exceed vehicle max capacity
- ✅ Addresses are geocodable

### 3.8.2 List Organization Trips

**Endpoint:** `GET /api/v1/organizations/:orgId/trips?page=1&limit=20&status=scheduled`
**Auth Required:** Yes (JWT + organization member)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional): scheduled, in_progress, completed, cancelled

**Response:**
```json
{
  "trips": [
    {
      "id": "t1234567-89ab-cdef-0123-456789abcdef",
      "departureCity": "Paris",
      "destinationCity": "Lyon",
      "departureTime": "2025-11-01T10:00:00Z",
      "status": "scheduled",
      "ownerType": "ORGANIZATION",
      "organizationId": "org12345-89ab-cdef-0123-456789abcdef",
      "vehicleId": "v1234567-89ab-cdef-0123-456789abcdef",
      "totalCapacity": 2500.0,
      "remainingCapacity": 2500.0
    }
  ],
  "pagination": {
    "page": 1,
    "totalItems": 45,
    "totalPages": 3,
    "currentPage": 1,
    "lastPage": 3
  }
}
```

### 3.8.3 Get Organization Trip by ID

**Endpoint:** `GET /api/v1/organizations/:orgId/trips/:tripId`
**Auth Required:** Yes (JWT + organization member)

**Response:** Same as Create Organization Trip response

### 3.8.4 Update Organization Trip

**Endpoint:** `PUT /api/v1/organizations/:orgId/trips/:tripId`
**Auth Required:** Yes (JWT + organization member)

**Request:**
```json
{
  "capacity": 3000.0,
  "status": "in_progress"
}
```

**Response:** Updated trip object

### 3.8.5 Cancel Organization Trip

**Endpoint:** `POST /api/v1/organizations/:orgId/trips/:tripId/cancel`
**Auth Required:** Yes (JWT + organization member)

**Request:**
```json
{
  "reason": "Vehicle maintenance required"
}
```

**Response:**
```json
{
  "message": "trip cancelled successfully",
  "tripId": "t1234567-89ab-cdef-0123-456789abcdef"
}
```

### 3.8.6 Assign Driver to Trip

**Endpoint:** `POST /api/v1/organizations/:orgId/trips/:tripId/assign-driver`
**Auth Required:** Yes (JWT + organization member)

**Request:**
```json
{
  "driverId": "d1234567-89ab-cdef-0123-456789abcdef"
}
```

**Response:**
```json
{
  "message": "driver assigned successfully",
  "tripId": "t1234567-89ab-cdef-0123-456789abcdef",
  "driverId": "d1234567-89ab-cdef-0123-456789abcdef"
}
```

**Validation:**
- ✅ Driver is a member/employee of the organization

### 3.8.7 Get Trips by Vehicle

**Endpoint:** `GET /api/v1/vehicles/:vehicleId/trips?page=1&limit=20&status=scheduled`
**Auth Required:** Yes (JWT)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional): scheduled, in_progress, completed, cancelled

**Response:** Same format as List Organization Trips

**Use Case:** View all past and upcoming trips for a specific vehicle in the fleet

---

## 4. Organization Profile Management

**Base URL:** `http://localhost:8084` (driver-service)

### 4.1 Register Organization

**Endpoint:** `POST /api/v1/organizations`
**Auth Required:** No (public registration)

**Request:**
```json
{
  "legal_name": "Fast Truck Transport Inc",
  "trade_name": "FastTruck",
  "registration_number": "TRUCK-2025-001",
  "tax_id": "TAX987654321",
  "organization_type": "TRANSPORT_COMPANY",
  "contact_email": "contact@fasttruck.com",
  "contact_phone": "+1-555-9876",
  "address": "456 Logistics Blvd",
  "city": "Los Angeles",
  "country": "USA",
  "postal_code": "90001",
  "latitude": 34.0522,
  "longitude": -118.2437
}
```

**Organization Types:**
- `BUS_COMPANY` - Bus transport company
- `TRANSPORT_COMPANY` - General trucking/logistics
- `LOGISTICS` - Full-service logistics provider

**Response:**
```json
{
  "id": "972f75a8-e7e0-47cb-a34e-adc9b9058224",
  "legal_name": "Fast Truck Transport Inc",
  "trade_name": "FastTruck",
  "registration_number": "TRUCK-2025-001",
  "organization_type": "TRANSPORT_COMPANY",
  "status": "pending_verification",
  "contact_email": "contact@fasttruck.com",
  "headquarters_location": {
    "latitude": 34.0522,
    "longitude": -118.2437
  },
  "employee_count": 0,
  "created_at": "2025-10-28T14:47:38Z"
}
```

**Status Flow:**
1. `pending_verification` - Initial state after registration
2. `verified` - Admin approved (can add vehicles/drivers)
3. `suspended` - Temporarily disabled
4. `deactivated` - Permanently disabled

### 4.2 Get Organization Details

**Endpoint:** `GET /api/v1/organizations/:id`
**Auth Required:** No (public info)

**Response:**
```json
{
  "id": "972f75a8-e7e0-47cb-a34e-adc9b9058224",
  "legal_name": "Fast Truck Transport Inc",
  "trade_name": "FastTruck",
  "status": "verified",
  "city": "Los Angeles",
  "vehicles": [
    {
      "id": "vehicle-1",
      "name": "Heavy Duty Truck #1",
      "type": "TRUCK",
      "plate_number": "TRUCK-001-CA"
    },
    {
      "id": "vehicle-2",
      "name": "Cargo Van #2",
      "type": "VAN",
      "plate_number": "VAN-002-CA"
    }
  ],
  "employee_count": 3,
  "verified_at": "2025-10-28T14:48:58Z"
}
```

### 4.3 Add Vehicle to Fleet

**Endpoint:** `POST /api/v1/organizations/:id/vehicles`
**Auth Required:** Yes (JWT + organization ownership)

⚠️ **Note:** This endpoint requires authentication but current implementation may need refinement for organization-level auth.

**Request:**
```json
{
  "name": "Heavy Duty Truck #1",
  "type": "TRUCK",
  "plate_number": "TRUCK-001-CA",
  "manufacture_year": 2023,
  "model": "Freightliner Cascadia",
  "color": "White",
  "max_weight": 12000,
  "max_volume": 80,
  "max_packages": 50
}
```

**Vehicle Types & Capacity Rules:**

| Type | Min Weight (kg) | Max Weight (kg) | Min Packages | Max Packages |
|------|----------------|----------------|--------------|--------------|
| `VAN` | 50 | 3,000 | 1 | 15 |
| `TRUCK` | 500 | 15,000 | 10 | 100 |
| `BUS` | 100 | 500 | 5 | 50 |

**Validation:**
- `type` must be one of: `VAN`, `TRUCK`, `BUS`
- `max_weight` must be within type's range
- `max_packages` must be within type's range
- `plate_number` must be unique across all vehicles

**Response:**
```json
{
  "id": "500d72aa-a376-4cc4-8210-8076fc0827f2",
  "name": "Heavy Duty Truck #1",
  "type": "TRUCK",
  "plate_number": "TRUCK-001-CA",
  "owner_type": "ORGANIZATION",
  "organization_id": "972f75a8-e7e0-47cb-a34e-adc9b9058224"
}
```

**Error Example:**
```json
{
  "error": "invalid weight capacity for TRUCK: 20000.00 kg. Must be between 500.00 and 15000.00 kg"
}
```

### 4.4 List Organizations

**Endpoint:** `GET /api/v1/organizations`
**Auth Required:** No (public list)

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Results per page (default: 10)
- `status` - Filter by status (optional)

**Response:**
```json
{
  "data": [
    {
      "id": "org-1",
      "legal_name": "Express Bus Lines LLC",
      "organization_type": "BUS_COMPANY",
      "status": "verified",
      "city": "New York",
      "vehicle_count": 5,
      "employee_count": 12
    }
  ],
  "total_count": 2,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

---

## 5. Data Models for Frontend

### 5.1 Trip Model

```typescript
interface Trip {
  id: string;
  departure_address: string;
  destination_address: string;
  departure_city: string;
  departure_country: string;
  destination_city: string;
  destination_country: string;
  departure_point: GeoPoint;
  destination_point: GeoPoint;
  departure_time: string; // ISO 8601 datetime
  arrival_time?: string;
  total_capacity: number;
  remaining_capacity: number;
  estimated_distance: number;
  estimated_duration: number;
  status: TripStatus;
  pricing_model: PricingModel;
  driver_reference: UserReference;
  stops?: Stop[];
  bookings?: Booking[];
  created_at: string;
  updated_at: string;
}

type TripStatus = 'planned' | 'scheduled' | 'active' | 'completed' | 'cancelled';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

interface PricingModel {
  base_price: number;
  per_kg_price: number;
  currency: string;
}

interface UserReference {
  id: string;
  name: string;
  email: string;
}
```

### 5.2 Organization Model

```typescript
interface Organization {
  id: string;
  legal_name: string;
  trade_name?: string;
  registration_number: string;
  tax_id?: string;
  organization_type: OrganizationType;
  status: OrganizationStatus;
  contact_email: string;
  contact_phone: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  headquarters_location: GeoPoint;
  vehicles?: Vehicle[];
  documents?: OrganizationDocument[];
  employee_count: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

type OrganizationType = 'BUS_COMPANY' | 'TRANSPORT_COMPANY' | 'LOGISTICS';
type OrganizationStatus = 'pending_verification' | 'verified' | 'suspended' | 'deactivated';
```

### 5.3 Vehicle Model

```typescript
interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  plate_number: string;
  manufacture_year?: number;
  model?: string;
  color?: string;
  max_weight: number;
  max_volume: number;
  max_packages: number;
  owner_type: 'INDIVIDUAL' | 'ORGANIZATION';
  organization_id?: string;
}

type VehicleType = 'VAN' | 'TRUCK' | 'BUS';
```

### 5.4 Stop Model

```typescript
interface Stop {
  id: string;
  address: string;
  city: string;
  country: string;
  location: GeoPoint;
  sequence: number;
  estimated_arrival: string;
  actual_arrival?: string;
  stop_type: 'pickup' | 'delivery' | 'rest';
  status: 'planned' | 'reached' | 'completed';
}
```

---

## 6. User Flows

### 6.1 Individual Driver: Create & Manage Trip

```mermaid
sequenceDiagram
    participant U as Driver User
    participant F as Frontend
    participant A as Auth Service
    participant P as Parcel Service

    U->>F: Login with credentials
    F->>A: POST /auth/login
    A->>F: Return JWT + user info
    F->>F: Store JWT & role

    U->>F: Click "Create Trip"
    F->>F: Show trip creation form
    U->>F: Fill trip details + submit
    F->>P: POST /driver/trips (with JWT)
    P->>P: Validate JWT & role
    P->>P: Create trip with driver_id
    P->>F: Return created trip
    F->>U: Show success & trip details

    U->>F: Navigate to "My Trips"
    F->>P: GET /driver/trips (with JWT)
    P->>F: Return driver's trips
    F->>U: Display trip list

    U->>F: Click "Cancel" on a trip
    F->>U: Show confirmation dialog
    U->>F: Confirm cancellation
    F->>P: PUT /driver/trips/:id (status: cancelled)
    P->>F: Return updated trip
    F->>U: Update list, show cancelled status
```

### 6.2 Organization: Register & Manage Fleet

```mermaid
sequenceDiagram
    participant U as Org User
    participant F as Frontend
    participant D as Driver Service
    participant A as Admin

    U->>F: Fill organization registration form
    F->>D: POST /organizations
    D->>D: Create org (status: pending)
    D->>F: Return organization with ID
    F->>U: Show "Awaiting Verification" message

    Note over U,A: Admin verifies organization separately

    A->>D: POST /admin/organizations/:id/verify
    D->>D: Set status to 'verified'

    U->>F: Login & check org status
    F->>D: GET /organizations/:id
    D->>F: Return org (status: verified)
    F->>U: Show "Verified - Can manage fleet"

    U->>F: Click "Add Vehicle"
    F->>F: Show vehicle form with type dropdown
    U->>F: Select type & fill details
    F->>F: Validate capacity against type rules
    F->>D: POST /organizations/:id/vehicles (with JWT)
    D->>D: Validate capacity for vehicle type
    D->>F: Return created vehicle
    F->>U: Add vehicle to fleet list
```

---

## 7. Unified Dashboard Design

### 7.1 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Header: SirAPI Logo | Profile Menu | Logout         │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │         Main Content Area                │
│          │                                          │
│ - Dashboard                                         │
│ - Trips* │  [Content based on selected menu item]  │
│ - Fleet**│                                          │
│ - Profile│                                          │
│ - Analytics                                         │
│          │                                          │
└──────────┴──────────────────────────────────────────┘

* Trips menu: "My Trips" for individual drivers, "Organization Trips" for organizations
** Fleet menu: Visible for organizations only
```

### 7.2 Role-Based Feature Visibility

**Frontend Logic:**
```javascript
function getMenuItems(userRole, organizationId) {
  const baseItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'home' },
    { label: 'Profile', route: '/profile', icon: 'user' }
  ];

  // Individual drivers see trip management
  if (userRole === 'Driver' && !organizationId) {
    baseItems.splice(1, 0, {
      label: 'My Trips',
      route: '/trips',
      icon: 'map',
      badge: 'active' // Show active trip count
    });
  }

  // Organizations see fleet management
  if (organizationId) {
    baseItems.splice(1, 0, {
      label: 'Fleet Management',
      route: '/fleet',
      icon: 'truck',
      children: [
        { label: 'Vehicles', route: '/fleet/vehicles' },
        { label: 'Drivers', route: '/fleet/drivers' }
      ]
    });

    // Organization trip management (backend implemented)
    baseItems.splice(2, 0, {
      label: 'Organization Trips',
      route: '/org-trips',
      icon: 'calendar',
      badge: 'active' // Show active trip count for organization
    });
  }

  return baseItems;
}
```

### 7.3 Dashboard Views

#### Individual Driver Dashboard

**Components:**
- **Trip Statistics Card**
  - Active trips count
  - Upcoming trips (next 7 days)
  - Total completed trips
  - Cancellation rate

- **Quick Actions**
  - Button: "Create New Trip"
  - Button: "View My Trips"
  - Button: "Update Profile"

- **Recent Trips Table**
  - Show last 5 trips
  - Columns: Departure, Destination, Date, Status, Capacity
  - Quick actions: Edit, Cancel, View Details

- **Capacity Chart**
  - Line/bar chart showing capacity utilization over time

#### Organization Dashboard

**Components:**
- **Organization Overview Card**
  - Verification status badge
  - Total vehicles count
  - Total employees count
  - Registration date

- **Fleet Status Grid**
  - Cards for each vehicle type (VAN, TRUCK, BUS)
  - Count per type
  - Total capacity sum
  - Click to view details

- **Quick Actions**
  - Button: "Add Vehicle" (enabled only if verified)
  - Button: "Assign Driver"
  - Button: "View Fleet"

- **Verification Status Banner** (if pending)
  - "Your organization is pending admin verification"
  - "You can manage your fleet once verified"

---

## 8. Form Validation Rules

### 8.1 Trip Creation Form

**Field Validations:**

| Field | Required | Validation Rule | Error Message |
|-------|----------|----------------|---------------|
| departure_address | Yes | Min 5 chars | "Departure address is required" |
| destination_address | Yes | Min 5 chars | "Destination address is required" |
| departure_city | Yes | Min 2 chars | "Departure city is required" |
| destination_city | Yes | Min 2 chars | "Destination city is required" |
| departure_time | Yes | Future datetime | "Departure time must be in the future" |
| total_capacity | Yes | > 0 | "Capacity must be greater than 0" |
| latitude | Yes | -90 to 90 | "Invalid latitude" |
| longitude | Yes | -180 to 180 | "Invalid longitude" |
| base_price | Yes | ≥ 0 | "Price cannot be negative" |

**Dependent Validations:**
- `destination_city` must be different from `departure_city`
- `arrival_time` (if provided) must be after `departure_time`

### 8.2 Vehicle Addition Form

**Field Validations:**

| Field | Required | Validation Rule | Error Message |
|-------|----------|----------------|---------------|
| name | Yes | Min 3 chars | "Vehicle name is required" |
| type | Yes | One of: VAN, TRUCK, BUS | "Select a vehicle type" |
| plate_number | Yes | Unique, alphanumeric | "Plate number is required and must be unique" |
| max_weight | Yes | Type-specific range | See capacity table |
| max_packages | Yes | Type-specific range | See capacity table |

**Type-Specific Validation Logic:**
```javascript
function validateVehicleCapacity(type, weight, packages) {
  const rules = {
    VAN: { minWeight: 50, maxWeight: 3000, minPkg: 1, maxPkg: 15 },
    TRUCK: { minWeight: 500, maxWeight: 15000, minPkg: 10, maxPkg: 100 },
    BUS: { minWeight: 100, maxWeight: 500, minPkg: 5, maxPkg: 50 }
  };

  const rule = rules[type];

  if (weight < rule.minWeight || weight > rule.maxWeight) {
    return `Weight for ${type} must be between ${rule.minWeight}-${rule.maxWeight} kg`;
  }

  if (packages < rule.minPkg || packages > rule.maxPkg) {
    return `Packages for ${type} must be between ${rule.minPkg}-${rule.maxPkg}`;
  }

  return null; // Valid
}
```

---

## 9. Error Handling

### 9.1 Common Error Responses

**401 Unauthorized**
```json
{
  "error": "missing authorization header"
}
```
**Frontend Action:** Redirect to login page, clear stored JWT

**403 Forbidden**
```json
{
  "error": "insufficient permissions"
}
```
**Frontend Action:** Show error message, disable the attempted action

**400 Bad Request**
```json
{
  "error": "invalid weight capacity for TRUCK: 20000.00 kg. Must be between 500.00 and 15000.00 kg"
}
```
**Frontend Action:** Show inline validation error on the form field

**500 Internal Server Error**
```json
{
  "error": "internal server error"
}
```
**Frontend Action:** Show generic error message, log to monitoring service

### 9.2 Error Handling Pattern

```javascript
async function handleApiCall(apiFunction) {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error) {
    if (error.status === 401) {
      // Token expired or invalid
      localStorage.clear();
      window.location.href = '/login';
      return { success: false, error: 'Session expired. Please login again.' };
    }

    if (error.status === 403) {
      return { success: false, error: 'You do not have permission for this action.' };
    }

    if (error.status === 400) {
      // Validation error - show specific message
      return { success: false, error: error.message };
    }

    // Generic error
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
```

---

## 10. Known Limitations & Future Enhancements

### 10.1 Current Limitations

⚠️ **No Fleet-Wide Analytics**
- **Impact:** Organizations cannot see aggregated trip statistics and utilization metrics
- **Workaround:** Manual consolidation of trip data
- **Timeline:** Future enhancement (Phase 4)

⚠️ **No Hard Delete for Trips**
- **Impact:** Cancelled trips remain in database and count towards pagination
- **Workaround:** Filter out cancelled trips in UI
- **Timeline:** Low priority (soft delete is standard practice)

⚠️ **Manual Driver Reassignment**
- **Impact:** Changing driver assignment requires separate API call
- **Workaround:** Use the dedicated assign-driver endpoint
- **Timeline:** Future enhancement for inline reassignment in UI

### 10.2 Planned Enhancements

**Phase 3: Advanced Features**
- Trip templates for recurring routes
- Automated trip scheduling
- Real-time vehicle tracking integration
- Fleet utilization analytics dashboard

---

## 11. Implementation Phases

### Phase 1: Individual Driver Support (Ready Now) ✅
**Timeline:** Immediate implementation

**Features:**
- Login/authentication
- Trip CRUD operations
- Trip listing with filters
- Stop management
- Individual driver profile

**Deliverables:**
- Login page
- Driver dashboard
- Trip creation form
- Trip list view
- Trip details page

### Phase 2: Organization Profile Management (Ready Now) ✅
**Timeline:** Immediate implementation

**Features:**
- Organization registration
- Fleet management (add/view vehicles)
- Vehicle type selection with validation
- Organization profile view

**Deliverables:**
- Organization registration form
- Fleet management dashboard
- Vehicle addition form with type-based validation
- Organization profile page

### Phase 3: Organization Trip Management (Ready Now) ✅
**Timeline:** Immediate implementation

**Features:**
- Organization trip creation with vehicle assignment
- Fleet-wide trip listing with filtering
- Trip updates and cancellation
- Driver assignment to trips
- Vehicle-specific trip history
- Organization member verification

**Deliverables:**
- Organization trip creation form
- Organization trip dashboard
- Vehicle assignment interface
- Driver assignment workflow
- Trip details page (organization view)

**Backend Support:**
- ✅ Organization trip endpoints implemented
- ✅ Vehicle ownership verification
- ✅ Member authorization checks
- ✅ Vehicle availability conflict detection
- ✅ Capacity validation

---

## 12. Testing Scenarios

### 12.1 Individual Driver Tests

**Test Case 1: Successful Trip Creation**
1. Login as driver
2. Navigate to "Create Trip"
3. Fill all required fields with valid data
4. Submit form
5. **Expected:** Trip created, redirected to trip details page
6. **Verify:** Trip appears in "My Trips" list

**Test Case 2: Trip Validation**
1. Login as driver
2. Navigate to "Create Trip"
3. Enter `departure_time` in the past
4. Submit form
5. **Expected:** Error message: "Departure time must be in the future"
6. **Fix:** Set future date
7. **Expected:** Trip created successfully

**Test Case 3: Trip Cancellation**
1. Login as driver
2. Navigate to "My Trips"
3. Click "Cancel" on a planned trip
4. Confirm in dialog
5. **Expected:** Trip status changes to "cancelled"
6. **Verify:** Trip still visible with cancelled status

**Test Case 4: Unauthorized Access**
1. Logout (clear JWT)
2. Try to access `/driver/trips` directly
3. **Expected:** Redirected to login page

### 12.2 Organization Tests

**Test Case 5: Organization Registration**
1. Navigate to organization registration page
2. Fill all required fields
3. Submit form
4. **Expected:** Organization created with status "pending_verification"
5. **Verify:** Cannot add vehicles yet (blocked by status check)

**Test Case 6: Vehicle Type Validation**
1. Login as verified organization
2. Navigate to "Add Vehicle"
3. Select type "TRUCK"
4. Enter `max_weight: 20000` (exceeds limit)
5. **Expected:** Error: "Weight must be between 500-15000 kg"
6. **Fix:** Enter `max_weight: 12000`
7. **Expected:** Vehicle added successfully

**Test Case 7: Vehicle List Display**
1. Login as organization
2. Navigate to "Fleet Management"
3. **Expected:** See list of all vehicles
4. **Verify:** Shows vehicle types as badges (VAN, TRUCK, BUS)
5. **Verify:** Shows capacity for each vehicle

**Test Case 8: Organization Trip Creation**
1. Login as verified organization member
2. Navigate to "Organization Trips"
3. Click "Create Trip"
4. Fill all required fields
5. Select vehicle from organization fleet
6. Submit form
7. **Expected:** Trip created with organization ownership
8. **Verify:** Trip appears in organization trip list

**Test Case 9: Vehicle Availability Validation**
1. Login as organization
2. Create a trip for Vehicle A from 10:00-12:00
3. Try to create another trip for Vehicle A from 11:00-13:00
4. **Expected:** Error: "Vehicle is already assigned to another trip during this time"
5. **Fix:** Select different vehicle or different time
6. **Expected:** Trip created successfully

**Test Case 10: Capacity Validation**
1. Login as organization
2. Create trip with capacity: 8000 kg
3. Select vehicle (VAN) with max_weight: 5000 kg
4. **Expected:** Error: "Requested capacity exceeds vehicle capacity"
5. **Fix:** Reduce capacity to 4000 kg or select larger vehicle
6. **Expected:** Trip created successfully

**Test Case 11: Driver Assignment**
1. Login as organization
2. Navigate to organization trip details
3. Click "Assign Driver"
4. Select driver from organization members
5. Submit
6. **Expected:** Driver assigned, appears in trip details
7. **Verify:** Driver can now see trip in their dashboard

**Test Case 12: Unauthorized Organization Access**
1. Login as user NOT member of organization
2. Try to access `/organizations/{other-org-id}/trips`
3. **Expected:** 403 Forbidden error
4. **Verify:** Error message: "User is not authorized to create trips for this organization"

### 12.3 Cross-Profile Tests

**Test Case 13: Role-Based Menu Visibility**
1. Login as individual driver
2. **Verify:** "My Trips" visible in sidebar
3. **Verify:** "Fleet Management" NOT visible
4. Logout
5. Login as organization user
6. **Verify:** "Fleet Management" visible
7. **Verify:** "Organization Trips" visible
8. **Verify:** Individual "My Trips" NOT visible (or disabled with tooltip)

---

## 13. API Endpoint Quick Reference

### Parcel Service (Port 8085)

#### Individual Driver Trips

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/driver/trips` | JWT + Driver | Create trip |
| GET | `/api/v1/driver/trips` | JWT + Driver | List driver's trips |
| GET | `/api/v1/driver/trips/:id/details` | JWT + Driver | Get trip details |
| PUT | `/api/v1/driver/trips/:id` | JWT + Driver | Update trip |
| POST | `/api/v1/driver/trips/:id/stops` | JWT + Driver | Add stop |
| PUT | `/api/v1/driver/trips/:id/stops/:stopId` | JWT + Driver | Update stop |
| DELETE | `/api/v1/driver/trips/:id/stops/:stopId` | JWT + Driver | Remove stop |
| GET | `/api/v1/trips/search` | None | Search trips (public) |

#### Organization Trips (NEW)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/organizations/:orgId/trips` | JWT + Member | Create organization trip |
| GET | `/api/v1/organizations/:orgId/trips` | JWT + Member | List organization trips |
| GET | `/api/v1/organizations/:orgId/trips/:tripId` | JWT + Member | Get organization trip |
| PUT | `/api/v1/organizations/:orgId/trips/:tripId` | JWT + Member | Update organization trip |
| POST | `/api/v1/organizations/:orgId/trips/:tripId/cancel` | JWT + Member | Cancel organization trip |
| POST | `/api/v1/organizations/:orgId/trips/:tripId/assign-driver` | JWT + Member | Assign driver to trip |
| GET | `/api/v1/vehicles/:vehicleId/trips` | JWT + Member | Get vehicle trip history |

### Driver Service (Port 8084)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/organizations` | None | Register organization |
| GET | `/api/v1/organizations` | None | List organizations |
| GET | `/api/v1/organizations/:id` | None | Get organization details |
| PUT | `/api/v1/organizations/:id` | JWT | Update organization |
| POST | `/api/v1/organizations/:id/vehicles` | JWT | Add vehicle to fleet |
| GET | `/api/v1/organizations/:id/vehicles` | None | Get organization fleet |
| POST | `/api/v1/organizations/:id/drivers` | JWT | Assign driver to org |
| GET | `/api/v1/organizations/:id/drivers` | None | Get org employees |

### Auth Service (Port 8082)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | None | User login |
| POST | `/api/v1/auth/register` | None | User registration |
| POST | `/api/v1/auth/refresh` | JWT | Refresh token |

---

## 14. Frontend Technology Recommendations

### 14.1 Suggested Stack

- **Framework:** React/Next.js or Vue/Nuxt
- **State Management:** Redux/Zustand or Vuex/Pinia
- **HTTP Client:** Axios with interceptors for JWT
- **Form Validation:** React Hook Form + Zod or VeeValidate
- **UI Components:** Material-UI, Ant Design, or Tailwind CSS
- **Maps:** Leaflet.js or Google Maps API
- **Date/Time:** date-fns or Day.js

### 14.2 Key Libraries

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "react-query": "^3.39.0",
    "leaflet": "^1.9.0",
    "date-fns": "^2.30.0",
    "react-router-dom": "^6.20.0"
  }
}
```

### 14.3 API Client Setup

```javascript
// api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 15. Contact & Support

**Backend Team Contact:**
- Email: backend-team@sirapi.com
- Slack: #backend-support

**For Questions About:**
- API endpoints: Check this PRD first, then contact backend team
- Missing features: Refer to Section 10 (Known Limitations)
- Authentication issues: Check JWT token format and expiration
- Validation errors: Refer to Section 8 (Form Validation Rules)

**Documentation Updates:**
This PRD will be updated as backend features are added. Subscribe to the #prd-updates channel for notifications.

---

## Appendix A: Complete cURL Examples

### A.1 Driver Trip Creation

```bash
# Login
curl -X POST http://localhost:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@example.com",
    "password": "password123"
  }'

# Response: Save the token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Create Trip
curl -X POST http://localhost:8085/api/v1/driver/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "departure_address": "123 Main St, New York, NY",
    "destination_address": "456 Market St, Los Angeles, CA",
    "departure_city": "New York",
    "departure_country": "USA",
    "destination_city": "Los Angeles",
    "destination_country": "USA",
    "departure_point": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "destination_point": {
      "latitude": 34.0522,
      "longitude": -118.2437
    },
    "departure_time": "2025-11-01T10:00:00Z",
    "total_capacity": 500.0,
    "pricing_model": {
      "base_price": 50.0,
      "per_kg_price": 0.5,
      "currency": "USD"
    }
  }'
```

### A.2 Organization Registration & Vehicle Addition

```bash
# Register Organization
curl -X POST http://localhost:8084/api/v1/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "legal_name": "Fast Truck Transport Inc",
    "trade_name": "FastTruck",
    "registration_number": "TRUCK-2025-001",
    "tax_id": "TAX987654321",
    "organization_type": "TRANSPORT_COMPANY",
    "contact_email": "contact@fasttruck.com",
    "contact_phone": "+1-555-9876",
    "address": "456 Logistics Blvd",
    "city": "Los Angeles",
    "country": "USA",
    "postal_code": "90001",
    "latitude": 34.0522,
    "longitude": -118.2437
  }'

# Response: Save organization ID
ORG_ID="972f75a8-e7e0-47cb-a34e-adc9b9058224"

# Get Organization Details
curl -X GET http://localhost:8084/api/v1/organizations/$ORG_ID

# Add Vehicle (requires organization user JWT)
curl -X POST http://localhost:8084/api/v1/organizations/$ORG_ID/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Heavy Duty Truck #1",
    "type": "TRUCK",
    "plate_number": "TRUCK-001-CA",
    "manufacture_year": 2023,
    "model": "Freightliner Cascadia",
    "color": "White",
    "max_weight": 12000,
    "max_volume": 80,
    "max_packages": 50
  }'
```

---

## Appendix B: Environment Variables

```env
# API Base URLs
REACT_APP_AUTH_SERVICE_URL=http://localhost:8082
REACT_APP_DRIVER_SERVICE_URL=http://localhost:8084
REACT_APP_PARCEL_SERVICE_URL=http://localhost:8085

# Maps API Key (if using Google Maps)
REACT_APP_GOOGLE_MAPS_API_KEY=your-api-key-here

# Feature Flags
REACT_APP_ENABLE_ORG_TRIPS=false  # Set to true when backend ready

# Debug Mode
REACT_APP_DEBUG=true
```

---

**End of PRD**

**Version History:**
- v1.0 (2025-10-28) - Initial release covering individual driver trip management and organization profile management
