# Backend Issue: Implement Enhanced Tracking Endpoint

## 📋 Issue Summary

Implement a new tracking endpoint `GET /api/v1/tracking/{id}` that supports tracking by both booking ID and tracking number, with optional authentication for enhanced data.

**Priority:** P1 (High)
**Estimated Effort:** 1-2 days
**Component:** parcel-service
**Related Frontend PR:** Tracking page implementation (pages updated)

---

## 🎯 Context & Background

### Current State
- ✅ Existing endpoint: `GET /api/v1/track/{trackingNumber}` (public, basic tracking)
- ✅ Frontend tracking pages are implemented and ready
- ❌ Cannot track by booking ID (only tracking number)
- ❌ Missing enhanced data fields (driver info, customs, progress)
- ❌ No support for authenticated users to get additional details

### Frontend Requirements
The frontend tracking page at `/fr/tracking/{id}` expects:
- Ability to track using booking ID (UUID format) from booking confirmations
- Optional enhanced data when user is authenticated
- Progress percentage calculation
- Driver contact information (if authenticated)
- Customs information (if applicable)

### Why This Is Needed
Users receive booking confirmation emails with **booking IDs**, not tracking numbers. The current endpoint only accepts tracking numbers, breaking the direct-link tracking experience.

---

## 🔧 Technical Specification

### New Endpoint

```
GET /api/v1/tracking/{id}
```

**Route Registration** (in `parcel-service/main.go`):
```go
api.GET("/tracking/:id", bookingController.GetEnhancedTracking)
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | path | Yes | Booking ID (UUID) or Tracking Number (alphanumeric) |

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | No | Bearer token for enhanced data (optional) |

### Authentication Strategy

- **Public Access:** Basic tracking information
- **Authenticated Access:** Enhanced data (driver contact, customs details, delivery preferences)
- **Implementation:** Check for `Authorization` header presence
  - If present and valid: Include enhanced fields
  - If absent: Return public fields only
  - If present but invalid: Return 401 error

---

## 📦 Response Structure

### Go DTO Definition

**File:** `parcel-service/dto/booking_dto.go`

```go
// EnhancedTrackingResponse provides comprehensive tracking information
type EnhancedTrackingResponse struct {
    // Basic Information (public access)
    BookingID        string                `json:"bookingId"`
    TrackingNumber   string                `json:"trackingNumber"`
    CurrentStatus    string                `json:"currentStatus"`
    StatusText       string                `json:"statusText"`
    Progress         int                   `json:"progress"` // 0-100 percentage
    EstimatedDelivery *time.Time           `json:"estimatedDelivery,omitempty"`
    Origin           string                `json:"origin"`
    Destination      string                `json:"destination"`
    CurrentLocation  string                `json:"currentLocation"`
    LastUpdated      time.Time             `json:"lastUpdated"`
    Timeline         []TrackingEventDTO    `json:"timeline"`

    // Parcel Information (public access)
    ParcelInfo       ParcelInfoDTO         `json:"parcelInfo"`

    // Enhanced Information (authenticated users only)
    DriverInfo       *DriverInfoDTO        `json:"driver,omitempty"`
    CustomsInfo      *CustomsInfoDTO       `json:"customsInfo,omitempty"`
    ContactEnabled   bool                  `json:"contactEnabled"`
    DeliveryPreferences *DeliveryPrefsDTO  `json:"deliveryPreferences,omitempty"`
}

type TrackingEventDTO struct {
    ID        string    `json:"id"`
    Status    string    `json:"status"`
    Title     string    `json:"title"`
    Location  string    `json:"location"`
    Date      string    `json:"date"`
    Time      string    `json:"time"`
    Completed bool      `json:"completed"`
    Active    bool      `json:"active,omitempty"`
    Details   string    `json:"details,omitempty"`
}

type ParcelInfoDTO struct {
    Weight              string  `json:"weight"`
    PackagingType       string  `json:"packagingType"`
    Carrier             string  `json:"carrier"`
    InsuranceAmount     *float64 `json:"insuranceAmount,omitempty"`
    HasExpress          bool    `json:"hasExpress"`
    HasCustomsBrokerage bool    `json:"hasCustomsBrokerage"`
}

type DriverInfoDTO struct {
    ID                  string        `json:"id"`
    Name                string        `json:"name"`
    Photo               *string       `json:"photo,omitempty"`
    Rating              float64       `json:"rating"`
    CompletedDeliveries int           `json:"completedDeliveries"`
    IsVerified          bool          `json:"isVerified"`
    VehicleInfo         VehicleInfoDTO `json:"vehicleInfo"`
}

type VehicleInfoDTO struct {
    Type        string  `json:"type"`
    PlateNumber string  `json:"plateNumber"`
    Company     string  `json:"company"`
    BusNumber   *string `json:"busNumber,omitempty"`
}

type CustomsInfoDTO struct {
    Stage                 string     `json:"stage"` // EU_EXIT, IN_TRANSIT, MA_ENTRY, etc.
    Status                string     `json:"status"`
    SubmittedAt           *time.Time `json:"submittedAt,omitempty"`
    ClearedAt             *time.Time `json:"clearedAt,omitempty"`
    EstimatedClearanceTime string    `json:"estimatedClearanceTime,omitempty"`
    DutyInfo              *DutyInfoDTO `json:"dutyInfo,omitempty"`
}

type DutyInfoDTO struct {
    Amount        float64       `json:"amount"`
    Currency      string        `json:"currency"`
    Breakdown     DutyBreakdown `json:"breakdown"`
    PaymentStatus string        `json:"paymentStatus"` // PAID, PENDING, NOT_REQUIRED
}

type DutyBreakdown struct {
    ItemValue     float64 `json:"itemValue"`
    DutyRate      float64 `json:"dutyRate"`
    DutyAmount    float64 `json:"dutyAmount"`
    VAT           float64 `json:"vat"`
    ProcessingFee float64 `json:"processingFee"`
}

type DeliveryPrefsDTO struct {
    CanChangeAddress bool `json:"canChangeAddress"`
    CanHoldForPickup bool `json:"canHoldForPickup"`
    CanScheduleTime  bool `json:"canScheduleTime"`
}
```

---

## 📝 Implementation Tasks

### 1. Controller Layer
**File:** `parcel-service/controllers/booking_controller.go`

```go
// GetEnhancedTracking retrieves comprehensive tracking information
// @Summary Get enhanced tracking information
// @Description Track a parcel by booking ID or tracking number with optional authentication for enhanced data
// @Tags Tracking
// @Accept json
// @Produce json
// @Param id path string true "Booking ID (UUID) or Tracking Number"
// @Param Authorization header string false "Bearer token for enhanced data"
// @Success 200 {object} dto.EnhancedTrackingResponse
// @Failure 400 {object} dto.ErrorResponse "Invalid ID format"
// @Failure 404 {object} dto.ErrorResponse "Tracking information not found"
// @Failure 500 {object} dto.ErrorResponse "Internal server error"
// @Router /tracking/{id} [get]
func (bc *BookingController) GetEnhancedTracking(c *gin.Context) {
    identifier := c.Param("id")

    // Check if authenticated (optional)
    var userID *uuid.UUID
    authHeader := c.GetHeader("Authorization")
    if authHeader != "" {
        // Extract and validate JWT
        claims, err := infraAuth.GetClaims(c)
        if err == nil && claims != nil {
            uid, _ := uuid.Parse(claims.UserID)
            userID = &uid
        }
        // Note: Don't fail if auth is invalid, just treat as unauthenticated
    }

    // Determine if identifier is UUID (booking ID) or tracking number
    var trackingData *dto.EnhancedTrackingResponse
    var err error

    if _, uuidErr := uuid.Parse(identifier); uuidErr == nil {
        // It's a booking ID
        trackingData, err = bc.Facade.GetTrackingByBookingID(identifier, userID)
    } else {
        // It's a tracking number
        trackingData, err = bc.Facade.GetTrackingByTrackingNumber(identifier, userID)
    }

    if err != nil {
        if err.Error() == "booking not found" || err.Error() == "tracking not found" {
            c.JSON(http.StatusNotFound, dto.ErrorResponse{
                Code:    http.StatusNotFound,
                Message: "Tracking information not found for this ID",
            })
            return
        }

        c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
            Code:    http.StatusInternalServerError,
            Message: "Failed to fetch tracking information",
        })
        return
    }

    c.JSON(http.StatusOK, trackingData)
}
```

### 2. Facade Layer
**File:** `parcel-service/facades/booking_facade.go`

Add methods:
```go
func (f *BookingFacade) GetTrackingByBookingID(
    bookingID string,
    userID *uuid.UUID,
) (*dto.EnhancedTrackingResponse, error)

func (f *BookingFacade) GetTrackingByTrackingNumber(
    trackingNumber string,
    userID *uuid.UUID,
) (*dto.EnhancedTrackingResponse, error)
```

**Business Logic:**
1. Fetch booking/parcel data
2. Calculate progress percentage based on current status
3. Format timeline from ParcelEvent history
4. If `userID != nil` (authenticated):
   - Include driver information from Trip
   - Include customs information if applicable
   - Set `contactEnabled = true`
   - Include delivery preferences
5. Map to `EnhancedTrackingResponse`

### 3. Repository Layer
**File:** `parcel-service/repositories/booking_repository.go`

Add query methods:
```go
func (r *BookingRepository) FindBookingWithTrackingDetails(bookingID uuid.UUID) (*models.Booking, error)
func (r *BookingRepository) FindBookingByTrackingNumber(trackingNumber string) (*models.Booking, error)
```

**Database Queries:**
```go
// Fetch booking with all related data
db.Preload("ParcelOrder").
   Preload("ParcelOrder.ParcelEvents").
   Preload("Trip").
   Preload("Trip.Driver").
   Preload("Trip.Stops").
   Where("id = ?", bookingID).
   First(&booking)
```

### 4. Progress Calculation Logic

Map parcel status to progress percentage:

| Status | Progress % | Stage |
|--------|-----------|-------|
| PENDING | 0-10% | Order Placed |
| PICKED_UP | 15% | Picked Up |
| IN_TRANSIT_BUS | 25-40% | In Transit |
| CUSTOMS_SUBMITTED_EU | 45% | EU Customs |
| CUSTOMS_CLEARED_EU | 50% | Cleared EU |
| IN_TRANSIT_FERRY | 55% | Ferry Crossing |
| CUSTOMS_SUBMITTED_MA | 65% | MA Customs Submitted |
| CUSTOMS_CLEARED_MA | 75% | Cleared Morocco |
| OUT_FOR_DELIVERY | 85% | Out for Delivery |
| DELIVERED | 100% | Delivered |

### 5. Route Registration
**File:** `parcel-service/main.go`

```go
// Public tracking endpoint
api.GET("/tracking/:id", bookingController.GetEnhancedTracking)
```

---

## 🧪 Testing Requirements

### Unit Tests
**File:** `parcel-service/controllers/booking_controller_test.go`

Test cases:
- ✅ Track by valid booking ID (UUID)
- ✅ Track by valid tracking number
- ✅ Track with authentication (should include driver info)
- ✅ Track without authentication (should exclude enhanced fields)
- ✅ Track with invalid ID format
- ✅ Track non-existent booking (404)
- ✅ Invalid JWT token (treat as unauthenticated)

### Integration Tests
- ✅ End-to-end tracking flow
- ✅ Database queries return correct data
- ✅ Progress calculation accuracy
- ✅ Timeline ordering (chronological)

---

## 📡 API Contract

### Request Example 1: Track by Booking ID (Unauthenticated)

```bash
GET /api/v1/tracking/3e1349c7-154a-4f6f-a224-6d59c97ba941
```

**Response (200 OK):**
```json
{
  "bookingId": "3e1349c7-154a-4f6f-a224-6d59c97ba941",
  "trackingNumber": "TR-12345678",
  "currentStatus": "IN_TRANSIT_BUS",
  "statusText": "In Transit",
  "progress": 35,
  "estimatedDelivery": "2025-03-25T18:00:00Z",
  "origin": "Paris, France",
  "destination": "Casablanca, Morocco",
  "currentLocation": "Madrid, Spain",
  "lastUpdated": "2025-03-24T10:23:00Z",
  "timeline": [
    {
      "id": "1",
      "status": "PICKED_UP",
      "title": "Picked up",
      "location": "Paris Distribution Center",
      "date": "2025-03-23",
      "time": "08:15:00",
      "completed": true,
      "details": "Package picked up by carrier"
    },
    {
      "id": "2",
      "status": "IN_TRANSIT_BUS",
      "title": "In Transit",
      "location": "Madrid Transit Hub",
      "date": "2025-03-24",
      "time": "10:23:00",
      "completed": true,
      "active": true
    }
  ],
  "parcelInfo": {
    "weight": "2.5kg",
    "packagingType": "Standard Box",
    "carrier": "TawsilGo Express",
    "insuranceAmount": 100,
    "hasExpress": false,
    "hasCustomsBrokerage": false
  },
  "contactEnabled": false
}
```

### Request Example 2: Track with Authentication

```bash
GET /api/v1/tracking/3e1349c7-154a-4f6f-a224-6d59c97ba941
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "bookingId": "3e1349c7-154a-4f6f-a224-6d59c97ba941",
  "trackingNumber": "TR-12345678",
  "currentStatus": "IN_TRANSIT_BUS",
  "statusText": "In Transit",
  "progress": 35,
  "estimatedDelivery": "2025-03-25T18:00:00Z",
  "origin": "Paris, France",
  "destination": "Casablanca, Morocco",
  "currentLocation": "Madrid, Spain",
  "lastUpdated": "2025-03-24T10:23:00Z",
  "timeline": [...],
  "parcelInfo": {...},
  "contactEnabled": true,
  "driver": {
    "id": "DRV-001",
    "name": "Ahmed K.",
    "rating": 4.9,
    "completedDeliveries": 234,
    "isVerified": true,
    "vehicleInfo": {
      "type": "Coach Bus",
      "plateNumber": "**** M427",
      "company": "TawsilGo Express",
      "busNumber": "M-427"
    }
  },
  "customsInfo": {
    "stage": "EU_EXIT",
    "status": "CUSTOMS_CLEARED_EU",
    "submittedAt": "2025-03-23T14:00:00Z",
    "clearedAt": "2025-03-23T16:30:00Z",
    "estimatedClearanceTime": "6-24 hours",
    "dutyInfo": {
      "amount": 0,
      "currency": "EUR",
      "breakdown": {
        "itemValue": 120,
        "dutyRate": 0,
        "dutyAmount": 0,
        "vat": 0,
        "processingFee": 0
      },
      "paymentStatus": "NOT_REQUIRED"
    }
  },
  "deliveryPreferences": {
    "canChangeAddress": false,
    "canHoldForPickup": true,
    "canScheduleTime": true
  }
}
```

### Error Responses

**404 Not Found:**
```json
{
  "code": 404,
  "message": "Tracking information not found for this ID"
}
```

**400 Bad Request:**
```json
{
  "code": 400,
  "message": "Invalid tracking ID format"
}
```

**500 Internal Server Error:**
```json
{
  "code": 500,
  "message": "Failed to fetch tracking information"
}
```

---

## 🔗 Frontend Integration

### Frontend Endpoint
The Next.js API route proxies to this endpoint:

**Frontend URL:** `GET /api/tracking/{id}`
**Backend URL:** `GET http://localhost:8085/api/v1/tracking/{id}`

**Frontend File:** `/pages/api/tracking/[id].ts`

The frontend expects the response structure to match the DTOs defined above. The apiClient will automatically:
- Include JWT token from cookies if user is authenticated
- Handle 401/403 errors by showing login modal
- Parse and display tracking information

---

## ✅ Acceptance Criteria

- [ ] Endpoint accepts both booking ID (UUID) and tracking number
- [ ] Public access returns basic tracking information (no auth required)
- [ ] Authenticated access returns enhanced data (driver, customs)
- [ ] Progress percentage calculated correctly based on status
- [ ] Timeline events ordered chronologically
- [ ] Returns 404 for non-existent bookings
- [ ] Returns 400 for invalid ID formats
- [ ] Swagger documentation updated
- [ ] Unit tests pass with >80% coverage
- [ ] Integration tests verify end-to-end flow
- [ ] Frontend tracking page displays data correctly
- [ ] Tested with both authenticated and unauthenticated requests
- [ ] Performance: Response time < 200ms for typical queries

---

## 📚 Additional Notes

### Existing Code References

**Similar Endpoint:**
- `GET /track/{trackingNumber}` in `parcel_controller.go` (can use as reference)
- `GetBookingDetails` in `booking_controller.go` (for auth pattern)

**Database Models:**
- `models.Booking` - Main booking entity
- `models.ParcelOrder` - Parcel details
- `models.ParcelEvent` - Status history
- `models.Trip` - Trip with driver info

### Environment Configuration

No new environment variables needed. Uses existing:
- `PARCEL_SERVICE_PORT=8085`
- Database connection from existing config

### Backward Compatibility

✅ This is a new endpoint, does not affect existing `/track/{trackingNumber}`
✅ No breaking changes to existing APIs

---

## 🚀 Deployment Checklist

- [ ] Code review completed
- [ ] All tests passing
- [ ] Swagger docs generated and reviewed
- [ ] Database migrations (if any) applied
- [ ] Staging deployment tested
- [ ] Frontend integration verified
- [ ] Production deployment approved

---

**Estimated Timeline:**
- DTO creation: 2 hours
- Controller implementation: 3 hours
- Facade logic: 4 hours
- Repository queries: 2 hours
- Testing: 3 hours
- Documentation: 1 hour

**Total:** 15 hours (~2 days)

---

**Questions?** Contact the frontend team for clarification on response format or authentication flow.
