# Testing Guide: Trip Stops Display

## Quick Test Instructions

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Booking Page
Open: `http://localhost:3000/fr/booking?from=france&to=morocco`

### 3. Search for Trips
- Select departure country: **Belgium** or **France**
- Select destination country: **Morocco**
- Click "Find Trips"

### 4. Visual Checks

#### ✅ Trip Card - Inline Stops Preview
Look for the timeline between "Departs/Arrives" and "Capacity":

**Expected:**
```
┌─────────────────────────────────┐
│ Brussels to Tangier             │
│ Friday, Dec 4 • 20h             │
│                                 │
│ [Driver Avatar] Driver Name     │
│ ⭐ 4.8 (123) • 45 trips         │
│                                 │
│ ⏰ Departs: 6:59 PM             │
│ ⏰ Arrives: 3:40 PM             │
│                                 │
│ ● Brussels       18:59          │ ← NEW TIMELINE
│ ┊                               │
│ ◉ 1 Paris [Both] 10:30          │ ← STOP 1
│ ⊕ +1 more stops                 │ ← IF MORE
│ ┊                               │
│ ● Tangier        15:40          │
│                                 │
│ Capacity: 100kg available       │
│ ▓▓▓░░░░░ 30% full              │
│                                 │
│ [1 stop] [SCHEDULED]            │
│ [Details] [Select €45]          │
└─────────────────────────────────┘
```

**Check:**
- [ ] Timeline appears with gradient line
- [ ] Stop markers are circular with numbers
- [ ] Stop type badge shows (green/blue/purple)
- [ ] If user searched "Paris", that stop is highlighted in amber

#### ✅ Details Modal - Full Stops
Click **"Details"** button on any trip with stops.

**Expected:**
- Stops section replaces old simple route display
- Each stop has:
  - [ ] Full card with white background
  - [ ] Stop number badge (amber circle)
  - [ ] Location name and address
  - [ ] Stop type badge (Pickup/Dropoff/Both)
  - [ ] Arrival time (HH:mm format)
  - [ ] Travel info from previous stop

### 5. Test Cases

#### Test Case 1: Current Backend Data
**Input:** Trip with basic stop data
```json
{
  "stops": [{
    "location": "Paris",
    "locationPoint": {"lat": 0, "lng": 0},
    "arrivalTime": "2025-12-05T19:00:19Z",
    "stopType": "both",
    "order": 1
  }]
}
```

**Expected Output:**
- ✅ Shows "Paris" as stop
- ✅ Shows "Both" badge (purple)
- ✅ Shows "19:00" time
- ⚠️ No address shown (field missing)
- ⚠️ No travel duration shown (field missing)

#### Test Case 2: Enhanced Backend Data (Future)
**Input:** Trip with all P0 fields
```json
{
  "stops": [{
    "location": "Paris",
    "fullAddress": "Gare Routière Paris Bercy, 48 Blvd de Bercy",
    "locationPoint": {"lat": 48.8406, "lng": 2.3828},
    "arrivalTime": "2025-12-05T10:30:00Z",
    "departureTime": "2025-12-05T11:00:00Z",
    "stopType": "both",
    "order": 1,
    "durationFromPreviousMins": 931
  }]
}
```

**Expected Output:**
- ✅ Shows "Paris"
- ✅ Shows full address below
- ✅ Shows "15h 31m from Brussels"
- ✅ Valid coordinates (can plot on map)

#### Test Case 3: Multiple Stops
**Input:** Trip with 3 stops

**Expected:**
- Card shows first 2 stops inline
- "+1 more stop" button appears
- Clicking button or "+1 more" opens modal
- Modal shows all 3 stops

#### Test Case 4: Search Matching
**Input:**
- User searches with `from=paris`
- Trip has stop in Paris

**Expected:**
- Paris stop has amber background highlight
- "Match" badge appears next to location
- Makes stop visually stand out

### 6. Browser Console Checks

Open DevTools Console (F12) and check:

**Should NOT see:**
- ❌ `TypeError: Cannot read property 'stops' of undefined`
- ❌ `Warning: Each child in a list should have a unique "key"`
- ❌ Any React errors

**Safe to ignore:**
- ⚪ Warnings about other pages (dashboard, auth pages)
- ⚪ Browserslist outdated notice

### 7. Responsive Test

#### Mobile (375px width)
```bash
# Open DevTools > Toggle device toolbar > iPhone SE
```

**Check:**
- [ ] Timeline fits width
- [ ] Stop info doesn't overflow
- [ ] Addresses truncate properly
- [ ] Badges wrap to new line if needed
- [ ] Modal is scrollable

#### Tablet (768px width)
**Check:**
- [ ] More spacing around stops
- [ ] Timeline more spacious

#### Desktop (1440px width)
**Check:**
- [ ] Modal max-width enforced (sm:max-w-md = 448px)
- [ ] Content centered

### 8. Interaction Tests

#### Click Tests
- [ ] Clicking trip card opens booking (not broken by timeline)
- [ ] Clicking "+X more stops" opens details modal
- [ ] Clicking "Details" button opens modal
- [ ] Modal close button works

#### Scroll Tests
- [ ] Long stop lists scroll in modal
- [ ] Page scroll not blocked when modal open

### 9. Edge Cases

#### No Stops
**Input:** Trip with `stops: []` or `stops: null`

**Expected:**
- ✅ No timeline shown (graceful degradation)
- ✅ Old departure/arrival display works
- ✅ No errors in console

#### Invalid Data
**Input:** Stop with missing required fields

**Expected:**
- ✅ Component doesn't crash
- ✅ Shows available info only
- ✅ Console warning (optional)

#### Very Long Address
**Input:** `fullAddress` = 200+ characters

**Expected:**
- ✅ Text truncates with ellipsis
- ✅ Doesn't break layout
- ✅ Full text visible in modal

### 10. Performance Tests

#### Load Test
```bash
# In DevTools > Network tab > Throttling: Slow 3G
```

**Check:**
- [ ] Timeline doesn't cause layout shift
- [ ] Stops load with trip data (not separate request)
- [ ] No janky animations

#### Re-render Test
```bash
# Open React DevTools > Profiler
# Click "Record" > Search trips > Stop recording
```

**Check:**
- [ ] TripStopsPreview renders in <16ms
- [ ] No unnecessary re-renders
- [ ] No performance warnings

---

## Common Issues & Fixes

### Issue 1: Timeline doesn't appear
**Symptoms:** No stops visible in trip card

**Check:**
- Is `trip.stops` array populated?
- Console log: `console.log(trip.stops)`
- Backend might not be returning stops

**Fix:** Verify API response includes stops array

### Issue 2: Times look wrong
**Symptoms:** Stop arrival after destination arrival

**Known Issue:** Backend data has logic error
- Trip arrives: 15:40
- Stop arrives: 19:00 (3+ hours later!)

**Fix:** Backend needs to fix data validation

### Issue 3: Coordinates show (0,0)
**Symptoms:** Map shows Gulf of Guinea

**Known Issue:** Backend returning invalid default coordinates

**Fix:** Backend needs to geocode stop locations

### Issue 4: TypeScript errors
**Symptoms:** Red squiggles in VSCode

**Check:**
- Did you save all files?
- Run: `npm run build` to check

**Fix:** Should already be fixed, but verify types imported

### Issue 5: French text not showing
**Symptoms:** English text in French locale

**Known Issue:** Components not using i18n yet

**Fix:** Phase 2 enhancement (already noted in summary)

---

## Success Criteria

### ✅ MVP Success (Phase 1 - Current)
- [x] Components render without errors
- [x] TypeScript compiles successfully
- [x] Timeline displays in trip cards
- [x] Modal shows stop details
- [x] Works with current backend payload
- [x] Mobile responsive

### 🎯 Full Success (Phase 2 - After Backend Updates)
- [ ] All stops have valid GPS coordinates
- [ ] Full addresses display
- [ ] Travel times shown between stops
- [ ] Distance calculations visible
- [ ] Conditional stop warnings work
- [ ] Map integration shows stop markers

---

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Check TypeScript
npx tsc --noEmit

# Format code
npx prettier --write "components/Booking/TripStops*"

# Check for unused imports
npx eslint components/Booking/TripStops*.tsx
```

---

## Screenshot Checklist

For documentation/handoff, capture:

1. **Trip card with inline stops** (mobile 375px)
2. **Trip card with "+X more stops"** (multiple stops)
3. **Details modal full timeline** (tablet 768px)
4. **Highlighted stop matching search** (amber background)
5. **Conditional stop warning** (when backend supports)

Save to: `/docs/screenshots/trip-stops-feature/`

---

## Handoff to Backend Team

Share this checklist with backend:

**Required for Production:**
- [ ] Fix GPS coordinates (currently 0,0)
- [ ] Add `fullAddress` field to all stops
- [ ] Add `departureTime` field
- [ ] Calculate `durationFromPreviousMins`
- [ ] Fix time logic (stop after destination bug)

**See Full Spec:** `BACKEND_API_SPEC_STOPS.md`

**Priority:** P0 (Blocks optimal UX)
**Effort:** Low-Medium (1-2 days)
**Impact:** High (user clarity)

---

## Done! 🎉

If all checks pass, the feature is ready for:
1. ✅ Staging deployment
2. ✅ QA testing
3. ✅ Product review
4. ⏳ Backend coordination
5. ⏳ Production release

**Estimated completion:** Ready now for frontend, 1-2 weeks for backend enhancements.
