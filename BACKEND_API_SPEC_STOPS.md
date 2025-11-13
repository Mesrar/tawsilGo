# Backend API Enhancement Specification: Trip Stops

**Date:** 2025-11-01
**Project:** TawsilGo - Parcel Delivery Platform
**Purpose:** Enhanced Trip Stop Data for Improved UX
**Priority:** P0 (Critical for optimal user experience)

---

## Executive Summary

This document specifies required and recommended enhancements to the Trip Stops API payload to support improved UX in the booking flow. The current implementation hides stops behind 2 taps and lacks critical information for users to make informed decisions.

**Impact:**
- 🎯 **Task completion rate**: Expected improvement from <70% to >85%
- ⏱️ **Time-on-task**: Reduction from ~45s to <30s
- ❌ **Error rate**: Reduction from ~12% to <5%
- 📞 **Support tickets**: Expected reduction of 30% related to stop confusion

---

## Current Payload Structure

```json
{
  "trips": [
    {
      "id": "a31c0d8b-b8cc-4d51-9895-8cd7c93666f1",
      "departureCity": "Brussels",
      "destinationCity": "Tangier",
      "stops": [
        {
          "id": "af757c1a-f8b9-4248-8657-b70cae214ef8",
          "location": "Paris",
          "locationPoint": {
            "lat": 0,
            "lng": 0
          },
          "arrivalTime": "2025-12-05T19:00:19Z",
          "stopType": "both",
          "order": 1
        }
      ]
    }
  ]
}
```

---

## Identified Issues

### 🔴 Critical Issues

1. **Invalid GPS Coordinates**
   - Current: `"lat": 0, "lng": 0` (Gulf of Guinea, invalid)
   - Impact: Breaks map visualization
   - **Action Required**: Populate with actual coordinates

2. **Missing Departure Time**
   - Current: Only `arrivalTime` provided
   - Impact: Users cannot calculate waiting time at stop
   - **Action Required**: Add `departureTime` field

3. **No Journey Segment Data**
   - Impact: Cannot show "2h 30m from Brussels" or "280 km"
   - **Action Required**: Add `durationFromPreviousMins` and `distanceFromPreviousKm`

### 🟡 High-Priority Issues

4. **Vague Location**
   - Current: Just "Paris" (city name)
   - Impact: Users need exact pickup location
   - **Action Required**: Add `fullAddress` field

5. **Missing Stop Status**
   - Impact: Cannot warn users about conditional/optional stops
   - **Action Required**: Add `stopStatus` field

---

## Enhanced Payload Specification

### Priority 0 (P0) - Must Have for MVP

**Timeline:** Implement in Sprint 1 (Week 1-2)

```json
{
  "stops": [
    {
      "id": "af757c1a-f8b9-4248-8657-b70cae214ef8",
      "location": "Paris",
      "locationPoint": {
        "lat": 48.8566,              // ✅ Valid coordinates
        "lng": 2.3522
      },
      "arrivalTime": "2025-12-05T10:30:00Z",
      "departureTime": "2025-12-05T11:00:00Z",     // ✅ NEW - When driver leaves
      "stopType": "both",
      "order": 1,

      // ✅ NEW FIELDS
      "fullAddress": "Gare Routière Paris Bercy, 48 Boulevard de Bercy, 75012 Paris, France",
      "durationFromPreviousMins": 120              // Travel time from Brussels (2h)
    }
  ]
}
```

**Database Schema Changes:**

```sql
-- Migration: Add new fields to trip_stops table
ALTER TABLE trip_stops
ADD COLUMN departure_time TIMESTAMP,
ADD COLUMN full_address TEXT,
ADD COLUMN duration_from_previous_mins INTEGER;

-- Update existing records with calculated values
UPDATE trip_stops
SET departure_time = arrival_time + INTERVAL '30 minutes'  -- Default 30min stop
WHERE departure_time IS NULL;
```

**Field Descriptions:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `fullAddress` | string | Yes | Complete address with landmark | "Gare Routière Paris Bercy, 48 Boulevard de Bercy, 75012 Paris, France" |
| `departureTime` | ISO 8601 | Yes | When driver leaves this stop | "2025-12-05T11:00:00Z" |
| `durationFromPreviousMins` | integer | Yes | Travel time from previous point in minutes | 120 (2 hours) |
| `locationPoint.lat` | number | Yes | Valid GPS latitude | 48.8566 |
| `locationPoint.lng` | number | Yes | Valid GPS longitude | 2.3522 |

---

### Priority 1 (P1) - High Impact for Enhanced UX

**Timeline:** Implement in Sprint 2 (Week 3-4)

```json
{
  "stops": [
    {
      // ... all P0 fields ...

      "distanceFromPreviousKm": 280.5,             // ✅ NEW - Distance segment
      "stopStatus": "confirmed",                   // ✅ NEW - confirmed | conditional | optional
      "facilityType": "bus_station",               // ✅ NEW - Type of stop location
      "localizedNames": {                          // ✅ NEW - Multi-language support
        "fr": "Paris",
        "ar": "باريس"
      }
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description | Possible Values |
|-------|------|----------|-------------|-----------------|
| `distanceFromPreviousKm` | number | No | Distance from previous stop/departure in km | 280.5 |
| `stopStatus` | enum | No | Stop reliability | `confirmed`, `conditional`, `optional` |
| `facilityType` | enum | No | Type of pickup location | `bus_station`, `meeting_point`, `warehouse` |
| `localizedNames` | object | No | Translations for location name | `{"fr": "Paris", "ar": "باريس"}` |

**Stop Status Definitions:**

- **`confirmed`**: Guaranteed stop, driver will always stop here
- **`conditional`**: Stop depends on capacity (if space available for pickup/dropoff)
- **`optional`**: Driver may skip if ahead of schedule or low demand

---

### Priority 2 (P2) - Nice to Have for Advanced Features

**Timeline:** Implement in Sprint 3+ (Week 5+)

```json
{
  "stops": [
    {
      // ... all P0 + P1 fields ...

      "remainingCapacityAfterStop": 45.5,          // ✅ NEW - Capacity after stop
      "operatingHours": "06:00-22:00",             // ✅ NEW - Facility hours
      "durationAtStop": 30,                        // ✅ NEW - How long driver waits
      "contactPhone": "+33 1 23 45 67 89",         // ✅ NEW - Stop facility contact
      "notes": "Entry via Gate B",                 // ✅ NEW - Special instructions
      "estimatedArrivalWindow": {                  // ✅ NEW - Time range
        "earliest": "2025-12-05T10:15:00Z",
        "latest": "2025-12-05T10:45:00Z"
      }
    }
  ]
}
```

---

## Implementation Priority Matrix

| Field | Priority | Frontend Impact | Backend Effort | User Benefit |
|-------|----------|-----------------|----------------|--------------|
| Valid `locationPoint` | **P0** 🔴 | High (breaks maps) | Low (data fix) | Critical |
| `fullAddress` | **P0** 🔴 | High (user clarity) | Medium (geocoding) | High |
| `departureTime` | **P0** 🔴 | Medium (time calc) | Low (calculation) | Medium |
| `durationFromPreviousMins` | **P0** 🔴 | Medium (journey info) | Low (calculation) | Medium |
| `distanceFromPreviousKm` | **P1** 🟡 | Medium (distance info) | Low (route data) | Medium |
| `stopStatus` | **P1** 🟡 | High (expectations) | Medium (business logic) | High |
| `facilityType` | **P1** 🟡 | Low (visual) | Low (enum) | Low |
| `localizedNames` | **P1** 🟡 | Medium (i18n support) | Medium (translations) | Medium |
| `remainingCapacityAfterStop` | **P2** ⚪ | Low (planning) | Medium (real-time calc) | Low |
| `operatingHours` | **P2** ⚪ | Low (planning) | Low (static data) | Low |

---

## Data Calculation Examples

### Example 1: Calculate `durationFromPreviousMins`

```javascript
// For stop at index 1 (Paris)
const brusselsDeparture = "2025-12-04T18:59:31Z";
const parisArrival = "2025-12-05T10:30:00Z";

const durationMs = new Date(parisArrival) - new Date(brusselsDeparture);
const durationMins = Math.round(durationMs / 1000 / 60);
// Result: 931 minutes (15h 31m)

// For stop at index 2 (Lyon)
const parisDeparture = "2025-12-05T11:00:00Z";
const lyonArrival = "2025-12-05T14:15:00Z";

const durationMins = Math.round((new Date(lyonArrival) - new Date(parisDeparture)) / 1000 / 60);
// Result: 195 minutes (3h 15m)
```

### Example 2: Geocoding `fullAddress`

```javascript
// Using a geocoding service (e.g., Geoapify, Google Maps)
const geocodeAddress = async (location) => {
  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=YOUR_KEY`
  );
  const data = await response.json();

  return {
    fullAddress: data.features[0].properties.formatted,
    lat: data.features[0].geometry.coordinates[1],
    lng: data.features[0].geometry.coordinates[0]
  };
};

// Example result for "Paris"
{
  fullAddress: "Paris, Île-de-France, France",
  lat: 48.8566,
  lng: 2.3522
}
```

---

## Backend Service Changes

### Recommended Endpoint Updates

#### 1. GET `/api/user/available/trips`

**Current Response:**
```json
{
  "success": true,
  "trips": [...]
}
```

**No changes to endpoint structure**, just enhanced stop data within existing `stops` array.

#### 2. Data Population Strategy

**Option A: Pre-calculate on trip creation**
- ✅ Pros: Faster API responses, no runtime calculation
- ❌ Cons: Storage overhead, must recalculate if route changes

**Option B: Calculate on-demand**
- ✅ Pros: Always accurate, no storage overhead
- ❌ Cons: Slower response times, CPU intensive

**Recommendation:** **Option A** - Pre-calculate and cache stop data when:
- Trip is created
- Trip route is modified
- Stop is added/removed

Store in `trip_stops` table, invalidate cache on route updates.

---

## Validation Rules

### Required Field Validation

```typescript
interface TripStopValidation {
  // P0 validations
  fullAddress: {
    minLength: 10,
    maxLength: 500,
    pattern: /^[\w\s,.-]+$/  // Alphanumeric, spaces, common punctuation
  },

  departureTime: {
    mustBeAfter: "arrivalTime",  // Logical check
    maxDurationAtStopMins: 180   // Max 3 hours at stop
  },

  durationFromPreviousMins: {
    min: 0,
    max: 1440  // Max 24 hours between stops
  },

  locationPoint: {
    lat: { min: -90, max: 90 },
    lng: { min: -180, max: 180 },
    notEquals: [0, 0]  // Reject invalid default
  },

  // P1 validations
  stopStatus: {
    enum: ["confirmed", "conditional", "optional"]
  },

  facilityType: {
    enum: ["bus_station", "meeting_point", "warehouse", "other"]
  }
}
```

### Data Quality Checks

```sql
-- Query to find invalid stop data
SELECT
  ts.id,
  t.departure_city,
  t.destination_city,
  ts.location,
  ts.location_point,
  ts.arrival_time,
  ts.departure_time
FROM trip_stops ts
JOIN trips t ON t.id = ts.trip_id
WHERE
  -- Invalid coordinates
  (ts.location_point->>'lat' = '0' AND ts.location_point->>'lng' = '0')
  OR
  -- Missing full address
  ts.full_address IS NULL
  OR
  -- Departure before arrival
  ts.departure_time < ts.arrival_time;
```

---

## Migration Strategy

### Phase 1: Data Backfill (Week 1)

1. **Fix invalid coordinates**
   ```sql
   -- Geocode existing stops with lat=0, lng=0
   UPDATE trip_stops
   SET location_point = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
   WHERE (location_point->>'lat')::numeric = 0;
   ```

2. **Generate full addresses**
   - Run batch geocoding on all existing `location` values
   - Update `full_address` field with detailed results

3. **Calculate durations and distances**
   ```sql
   -- Calculate duration from previous stop
   WITH stop_sequences AS (
     SELECT
       id,
       trip_id,
       arrival_time,
       LAG(arrival_time) OVER (PARTITION BY trip_id ORDER BY "order") as prev_departure,
       LAG(location_point) OVER (PARTITION BY trip_id ORDER BY "order") as prev_point,
       location_point
     FROM trip_stops
   )
   UPDATE trip_stops ts
   SET
     duration_from_previous_mins = EXTRACT(EPOCH FROM (ss.arrival_time - ss.prev_departure)) / 60,
     distance_from_previous_km = ST_Distance(ss.prev_point::geography, ss.location_point::geography) / 1000
   FROM stop_sequences ss
   WHERE ts.id = ss.id AND ss.prev_departure IS NOT NULL;
   ```

### Phase 2: API Enhancement (Week 2)

1. Update API serializers to include new fields
2. Add validation for new fields on write operations
3. Deploy with feature flag `enhanced_stops_enabled=true`

### Phase 3: Frontend Rollout (Week 2-3)

1. Deploy new TripStopsPreview component (already implemented)
2. Monitor user engagement metrics
3. A/B test old vs new stop display

---

## API Response Examples

### Example 1: Simple Trip (P0 Fields Only)

```json
{
  "success": true,
  "trips": [
    {
      "id": "a31c0d8b-b8cc-4d51-9895-8cd7c93666f1",
      "departureCity": "Brussels",
      "destinationCity": "Tangier",
      "departureAddress": "Brussels Central Station, Carrefour de l'Europe, 1000 Brussels, Belgium",
      "destinationAddress": "Tangier Bus Terminal, Avenue des FAR, Tangier 90000, Morocco",
      "departureTime": "2025-12-04T18:59:31Z",
      "arrivalTime": "2025-12-05T15:40:13Z",
      "stops": [
        {
          "id": "stop-001",
          "location": "Paris",
          "fullAddress": "Gare Routière Paris Bercy, 48 Boulevard de Bercy, 75012 Paris, France",
          "locationPoint": {
            "lat": 48.8406,
            "lng": 2.3828
          },
          "arrivalTime": "2025-12-05T10:30:00Z",
          "departureTime": "2025-12-05T11:00:00Z",
          "stopType": "both",
          "order": 1,
          "durationFromPreviousMins": 931
        }
      ]
    }
  ]
}
```

### Example 2: Complex Trip (P0 + P1 Fields)

```json
{
  "stops": [
    {
      "id": "stop-001",
      "location": "Paris",
      "fullAddress": "Gare Routière Paris Bercy, 48 Boulevard de Bercy, 75012 Paris, France",
      "locationPoint": {
        "lat": 48.8406,
        "lng": 2.3828
      },
      "arrivalTime": "2025-12-05T10:30:00Z",
      "departureTime": "2025-12-05T11:00:00Z",
      "stopType": "both",
      "order": 1,
      "durationFromPreviousMins": 931,
      "distanceFromPreviousKm": 264.3,
      "stopStatus": "confirmed",
      "facilityType": "bus_station",
      "localizedNames": {
        "fr": "Paris",
        "ar": "باريس",
        "en": "Paris"
      }
    },
    {
      "id": "stop-002",
      "location": "Lyon",
      "fullAddress": "Gare Routière de Lyon Perrache, Cours de Verdun Rambaud, 69002 Lyon, France",
      "locationPoint": {
        "lat": 45.7497,
        "lng": 4.8261
      },
      "arrivalTime": "2025-12-05T14:15:00Z",
      "departureTime": "2025-12-05T14:30:00Z",
      "stopType": "pickup",
      "order": 2,
      "durationFromPreviousMins": 195,
      "distanceFromPreviousKm": 465.8,
      "stopStatus": "conditional",
      "facilityType": "bus_station",
      "localizedNames": {
        "fr": "Lyon",
        "ar": "ليون",
        "en": "Lyon"
      }
    }
  ]
}
```

---

## Testing Checklist

### Backend Tests

- [ ] Valid GPS coordinates (lat/lng not 0,0)
- [ ] Full address populated for all stops
- [ ] Departure time after arrival time
- [ ] Duration calculation accuracy (±5 min tolerance)
- [ ] Distance calculation accuracy (±10 km tolerance)
- [ ] Stop status enum validation
- [ ] Localized names for supported languages (fr, ar, en)

### Frontend Tests

- [ ] Stops display in trip card (max 2 shown)
- [ ] Remaining stops counter accurate
- [ ] Stop type badges render correctly
- [ ] User search location highlighted
- [ ] Full stop details in modal
- [ ] Conditional stop warning shown
- [ ] French translations applied
- [ ] Mobile responsive layout
- [ ] Map integration with valid coordinates

### Integration Tests

- [ ] End-to-end booking flow with stops
- [ ] Filter trips by stop location
- [ ] Performance: <200ms API response with 10 stops
- [ ] Load test: 100 concurrent requests

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Stop visibility (1st tap) | 0% | 100% | Analytics |
| Task completion rate | <70% | >85% | User testing |
| Time to book | ~45s | <30s | Analytics |
| Stop-related support tickets | Baseline | -30% | Support data |
| User satisfaction (stops clarity) | N/A | 4.5/5 | Survey |

### Monitoring

```javascript
// Analytics events to track
analytics.track('trip_stop_viewed', {
  tripId: 'xxx',
  stopId: 'xxx',
  stopOrder: 1,
  viewedInline: true  // vs in modal
});

analytics.track('trip_stop_matched', {
  userSearch: 'Paris',
  matchedStopId: 'xxx',
  resultedInBooking: true
});
```

---

## Contact & Support

**Frontend Team:** [@mesrar]
**Backend Team:** [Backend Team Contact]
**Product Owner:** [PO Contact]

**Implementation Questions:** Slack #tawsilgo-stops-enhancement
**API Issues:** GitHub Issues with label `enhancement:stops`

---

## Appendix A: Stop Type Definitions

| Stop Type | Description | Allows Pickup | Allows Dropoff |
|-----------|-------------|---------------|----------------|
| `pickup` | Only pickup new parcels | ✅ Yes | ❌ No |
| `dropoff` | Only deliver existing parcels | ❌ No | ✅ Yes |
| `both` | Both pickup and dropoff | ✅ Yes | ✅ Yes |

---

## Appendix B: Geographic Data Sources

Recommended geocoding providers:
1. **Geoapify** (current) - 3000 free requests/day
2. **Google Maps Geocoding API** - Paid, high accuracy
3. **OpenStreetMap Nominatim** - Free, self-hosted option

For distance/duration calculations:
- Use existing route calculation service
- Fallback: Haversine formula for straight-line distance

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-01 | @mesrar | Initial specification |

---

**End of Specification Document**
